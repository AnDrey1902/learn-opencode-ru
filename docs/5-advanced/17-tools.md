# 内置工具

## 课程笔记

工具允许 LLM 在你的代码库中执行操作。OpenCode 内置了一组工具，你也可以通过 [自定义工具](13-custom-tools.md) 或 [MCP 服务器](07a-mcp-basics.md) 扩展。

默认情况下，所有工具都启用且无需权限即可运行。但你可以通过配置控制 [权限](05-permissions.md)。

---

## 条件激活

某些工具需要特定条件才会启用：

| 工具 | 激活条件 |
|------|---------|
| `websearch` | 使用 OpenCode Zen 托管模型 或 设置 `OPENCODE_ENABLE_EXA=true` |
| `codesearch` | 使用 OpenCode Zen 托管模型 或 设置 `OPENCODE_ENABLE_EXA=true` |
| `batch` | 配置 `experimental.batch_tool: true` |
| `lsp` | 启用 `OPENCODE_EXPERIMENTAL_LSP_TOOL` 标志 |
| `plan_enter` / `plan_exit` | CLI 模式 + 实验性计划模式标志 |

::: tip 如何启用
在 `opencode.json` 中配置：

```json
{
  "experimental": {
    "batch_tool": true
  }
}
```

或设置环境变量：

```bash
export OPENCODE_ENABLE_EXA=true
export OPENCODE_EXPERIMENTAL_LSP_TOOL=1
```
:::

---

## 配置

你可以全局或按代理配置工具。代理配置会覆盖全局设置。

默认所有工具设为 true。要禁用工具，设为 false。

### 全局配置

使用 tools 选项全局禁用或启用工具：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "tools": {
    "write": false,
    "bash": false,
    "webfetch": true
  }
}
```

### 按代理配置

在代理定义中使用 tools 覆盖全局设置：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "tools": {
    "write": true,
    "bash": true
  },
  "agent": {
    "plan": {
      "tools": {
        "write": false,
        "bash": false
      }
    }
  }
}
```

## 内置工具列表

### bash

在项目环境中执行 shell 命令。

```json
{
  "tools": {
    "bash": true
  }
}
```

允许 LLM 运行 npm install、git status 等终端命令。

::: details AI 调用参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `command` | string | ✅ | 要执行的命令 |
| `description` | string | ✅ | 命令描述（5-10 个词） |
| `workdir` | string | ❌ | 工作目录，默认项目根目录 |
| `timeout` | number | ❌ | 超时时间（毫秒），默认 120000（2 分钟） |

**安全机制**：
- 使用 tree-sitter-bash 解析命令语法
- 检测 `cd`、`rm`、`cp`、`mv`、`mkdir`、`touch`、`chmod`、`chown`、`cat` 等命令
- 涉及项目外目录时请求 `external_directory` 权限确认
- 输出超过 2000 行或 50KB 自动截断，完整输出保存到文件

:::

### edit

使用精确字符串替换修改现有文件。

```json
{
  "tools": {
    "edit": true
  }
}
```

::: details AI 调用参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `filePath` | string | ✅ | 文件绝对路径 |
| `oldString` | string | ✅ | 要替换的原始文本 |
| `newString` | string | ✅ | 替换后的文本（必须与 oldString 不同） |
| `replaceAll` | boolean | ❌ | 是否替换所有匹配（默认 false） |

**智能匹配**：edit 有 9 层匹配策略（SimpleReplacer → LineTrimmedReplacer → BlockAnchorReplacer → WhitespaceNormalizedReplacer → IndentationFlexibleReplacer → EscapeNormalizedReplacer → TrimmedBoundaryReplacer → ContextAwareReplacer → MultiOccurrenceReplacer），从严格到宽松逐层尝试。

**前置条件**：必须先用 read 读取文件，否则会报错。

**写入后检查**：自动触发 LSP 诊断，报告语法和类型错误。

:::

### write

创建新文件或覆盖现有文件。

```json
{
  "tools": {
    "write": true
  }
}
```

::: details AI 调用参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `filePath` | string | ✅ | 文件绝对路径（必须是绝对路径） |
| `content` | string | ✅ | 要写入的内容 |

**前置条件**：如果文件已存在，必须先用 read 读取，否则会报错。

**写入后检查**：自动触发 LSP 诊断，报告当前文件和其他受影响文件的错误（最多 5 个文件）。

**Diff 预览**：写入前会生成 diff 并请求权限确认。

:::

### read

从代码库读取文件或目录内容。

```json
{
  "tools": {
    "read": true
  }
}
```

::: details AI 调用参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `filePath` | string | ✅ | 文件或目录的绝对路径 |
| `offset` | number | ❌ | 从第几行/条开始读（**1-indexed**，从 1 开始计数） |
| `limit` | number | ❌ | 最多读多少行/条（默认 2000） |

**文件读取限制**：
- 默认读取 2000 行（`DEFAULT_READ_LIMIT`）
- 单行超过 2000 字符截断（`MAX_LINE_LENGTH`）
- 总输出限制 50KB（`MAX_BYTES`）

**目录读取**（v1.1.60+）：
- 读取目录时返回条目列表，子目录以 `/` 结尾
- 条目按字母排序
- 支持 `offset` 和 `limit` 分页（与文件读取一致，1-indexed）

**目录读取输出示例**：

```xml
<path>/Users/xxx/project/src</path>
<type>directory</type>
<entries>
components/
utils/
index.ts
(3 entries)
</entries>
```

**特殊文件**：支持读取图片（PNG、JPG、GIF，不含 SVG）和 PDF，转为 base64 附件。二进制文件（.zip、.exe 等）会报错。

**智能纠错**：文件不存在时，会在同目录下搜索相似文件名并建议。

:::

### grep

使用正则表达式搜索文件内容。

```json
{
  "tools": {
    "grep": true
  }
}
```

::: details AI 调用参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `pattern` | string | ✅ | 正则表达式模式 |
| `path` | string | ❌ | 搜索路径，默认当前目录 |
| `include` | string | ❌ | 文件过滤模式，如 `"*.ts"` |

**结果限制**：
- 最多返回 100 个匹配，超出会截断
- 单行超过 2000 字符会被截断

:::

### glob

通过模式匹配查找文件。

```json
{
  "tools": {
    "glob": true
  }
}
```

::: details glob 模式语法

| 模式 | 说明 | 示例 |
|------|------|------|
| `*` | 匹配任意字符（不含 `/`） | `*.ts` |
| `**` | 匹配任意目录层级 | `src/**/*.ts` |
| `?` | 匹配单个字符 | `file?.ts` |
| `[abc]` | 匹配指定字符 | `file[123].ts` |
| `{a,b}` | 匹配多个模式 | `*.{ts,tsx}` |

**结果限制**：最多返回 100 个文件，超出会截断。

:::

### list

列出的文件和目录在给定路径下。

```json
{
  "tools": {
    "list": true
  }
}
```

### lsp（实验性）

与配置的 LSP 服务器交互，获取代码智能功能如定义、引用、悬停信息和调用层次。

### patch

对文件应用补丁。

```json
{
  "tools": {
    "patch": true
  }
}
```

### multiedit

批量修改同一个文件的多个位置。

```json
{
  "tools": {
    "multiedit": true
  }
}
```

### skill

加载 SKILL.md 文件并在对话中返回其内容。

```json
{
  "tools": {
    "skill": true
  }
}
```

### todowrite

在编码会话期间管理待办列表。

```json
{
  "tools": {
    "todowrite": true
  }
}
```

### todoread

读取现有待办列表。

```json
{
  "tools": {
    "todoread": true
  }
}
```

### question

允许 AI 在执行任务时向你提问。

```json
{
  "tools": {
    "question": true
  }
}
```

这个工具让 AI 能够：

- 收集你的偏好或需求
- 澄清模糊的指令
- 获取实现选择的决策
- 提供多个方向让你选择

每个问题包含标题、问题文本和选项列表。你可以从选项中选择，或输入自定义答案。当有多个问题时，可以在提交前在问题间导航。

**使用场景**：

```
你：帮我重构这个模块

AI：我注意到有几种重构方式，请问你更倾向哪种？
    ○ 提取为独立函数
    ○ 拆分成多个类
    ○ 保持结构，只优化命名
    [输入自定义答案]
```

**注意**：`todowrite` 和 `todoread` 工具在 subagent 中默认禁用，但 `question` 工具默认启用。

### webfetch

获取网页内容，支持 HTML、Markdown、纯文本和图片。

```json
{
  "tools": {
    "webfetch": true
  }
}
```

::: details AI 调用参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `url` | string | ✅ | 要获取的 URL（必须以 http:// 或 https:// 开头） |
| `format` | string | ❌ | 返回格式：`markdown`（默认）、`text`、`html` |
| `timeout` | number | ❌ | 超时秒数（最大 120 秒，默认 30 秒） |

**图片支持**（v1.1.62+）：
- 当 URL 指向图片时（image/*），自动转为 base64 附件返回
- 不支持 SVG（image/svg+xml）和 FastBidSheet（image/vnd.fastbidsheet）

**HTML 转换**：
- `format: "markdown"` - HTML 自动转为 Markdown
- `format: "text"` - 提取纯文本，去除 script/style 标签
- `format: "html"` - 返回原始 HTML

**限制**：响应大小限制 5MB。

:::

### websearch（实验性）

搜索网页内容，使用 OpenCode Exa AI 服务。

```json
{
  "tools": {
    "websearch": true
  }
}
```

> 需要设置环境变量 OPENCODE_ENABLE_EXA=true 或使用 OpenCode Zen 托管模型。

### codesearch（实验性）

搜索代码库和在线资源，查找相关 API、库和文档。

```json
{
  "tools": {
    "codesearch": true
  }
}
```

> 需要设置环境变量 OPENCODE_ENABLE_EXA=true 或使用 OpenCode Zen 托管模型。

::: details AI 调用参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `query` | string | 必填 | 搜索查询，如 `"React useState hook examples"` |
| `tokensNum` | number | 2000+ | 返回的 token 数量（1000-2000+） |

**tokensNum 选择建议**：

| 值 | 使用场景 |
|-----|---------|
| 1000-2000 | 精确查询，只需简短示例 |
| 2000+ | 常规查询（默认） |
| 10000-20000 | 需要完整文档 |
| 30000-2000+ | 需要全面参考资料 |

**其他限制**：请求超时 30 秒。

:::

### batch（实验性）

并行执行多个工具调用，减少等待时间。当 AI 需要同时读取多个文件、执行多条搜索命令等互不依赖的操作时，batch 可以一次性并行完成，比逐个执行快 2-5 倍。

**启用方式**：

```json
{
  "experimental": {
    "batch_tool": true
  }
}
```

::: details AI 调用参数

**参数结构**：

```typescript
{
  tool_calls: [
    { tool: "工具名", parameters: { /* 参数 */ } },
    { tool: "工具名", parameters: { /* 参数 */ } },
    // ... 最多 25 个
  ]
}
```

**实际调用示例**：

```json
[
  {"tool": "read", "parameters": {"filePath": "src/index.ts", "limit": 350}},
  {"tool": "grep", "parameters": {"pattern": "Session\\.updatePart", "include": "src/**/*.ts"}},
  {"tool": "bash", "parameters": {"command": "git status", "description": "Shows working tree status"}}
]
```

**返回格式**：

```json
{
  "title": "Batch execution (3/3 successful)",
  "output": "All 3 tools executed successfully.\n\nKeep using the batch tool for optimal performance in your next response!",
  "metadata": {
    "totalCalls": 3,
    "successful": 3,
    "failed": 0,
    "tools": ["read", "grep", "bash"],
    "details": [
      {"tool": "read", "success": true},
      {"tool": "grep", "success": true},
      {"tool": "bash", "success": true}
    ]
  }
}
```

:::

**适合 batch 的场景**：

| 场景 | 说明 |
|------|------|
| 同时读取多个文件 | 一次读 package.json、tsconfig.json、.eslintrc.json |
| grep + glob + read 组合 | 先搜索再读取，互不依赖的部分并行 |
| 多条 bash 命令 | 同时执行 git status、npm test 等 |
| 多处编辑 | 同时修改多个文件的不同位置 |

**不适合 batch 的场景**：

| 场景 | 原因 |
|------|------|
| 前后有依赖的操作 | 比如先创建文件再读取，顺序不能保证 |
| 有状态的顺序操作 | 比如先 git add 再 git commit |

**限制**：

| 限制项 | 值 | 说明 |
|--------|-----|------|
| 最大调用数 | 25 | 超出的调用会被丢弃并报错 |
| 禁止嵌套 | batch | 不能在 batch 里再调 batch |
| 外部工具 | 不支持 | MCP 工具不能通过 batch 执行，需要单独调用 |
| 部分失败 | 不影响其他 | 某个调用失败不会中断其他并行调用 |

## 内部实现

grep、glob 和 list 等工具底层使用 ripgrep。默认情况下 ripgrep 遵守 .gitignore 模式，因此 .gitignore 中列出的文件和目录会从搜索和列表中排除。

### 忽略模式

要包含通常会被忽略的文件，在项目根目录创建 .ignore 文件：

```text
!node_modules/
!dist/
!build/
```

## 搜索工具使用技巧

这些技巧可以帮助你写出更精准的提示词，让 AI 更高效地找到目标代码。

### 三种搜索工具的区别

| 场景 | AI 会用什么工具 |
|------|---------------|
| 找某个 API 的使用示例 | codesearch（在线搜索文档和示例） |
| 在本地代码中搜索特定字符串 | grep（正则匹配文件内容） |
| 按文件名找文件 | glob（模式匹配文件路径） |

### 组合使用

AI 常见的组合策略：

1. **先 glob 找文件，再 grep 搜内容**
   ```
   你：帮我找所有 TypeScript 文件中定义了 interface User 的地方
   AI：先用 glob 找 *.ts 文件，再用 grep 搜索 "interface User"
   ```

2. **codesearch 找示例，grep 找本地实现**
   ```
   你：我想知道 React useEffect 怎么正确清理，然后检查我们项目里用得对不对
   AI：先用 codesearch 查文档，再用 grep 在本地搜索 useEffect
   ```

### 结果限制要注意

**grep** 和 **glob** 工具有 100 条结果限制。如果你发现 AI 说"结果被截断"，可以：

- 让 AI 用更具体的搜索条件
- 指定更小的目录范围
- 用更精确的正则表达式

**codesearch** 没有条数限制，但有 30 秒超时限制。

## 相关资源

- [自定义工具](13-custom-tools.md) - 创建自定义工具
- [MCP 服务器](07a-mcp-basics.md) - 集成外部工具
- [权限配置](05-permissions.md) - 控制工具权限
