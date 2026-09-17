---
title: C4 自动化脚本
subtitle: 解放重复劳动
course: OpenCode 中文实战课
stage: 第四阶段
lesson: "C4"
duration: 20 分钟
practice: 25 分钟
level: 进阶
description: 用 AI 帮你写自动化脚本和定时任务，解放重复劳动，提升办公效率。
tags:
  - 自动化
  - 脚本
  - 定时任务
prerequisite:
  - C1 文件整理
---

# C4 自动化脚本

> 💡 **一句话总结**：把重复流程写成"命令 + 脚本"，一键复用。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/4-scenarios/office-automation-notes.mini.jpeg"
     alt="C4 自动化脚本学霸笔记"
     data-zoom-src="/images/4-scenarios/office-automation-notes.jpeg" />

---

## 学完你能做什么

- 识别可自动化的重复任务
- 把任务固化为可复用的"自定义命令"
- 让 AI 帮你生成并迭代脚本
- 用 CLI 方式把自动化串起来

---

## 你现在的困境

- 每天都在做重复的工作，浪费时间
- 想写脚本自动化，但不会编程
- 想“一键执行”，但每次都要重新描述需求

---

## 什么时候用这一招

- 当你需要：让电脑自动完成重复任务
- 而且不想：每天手动做同样的事情

---

## 🎒 开始前的准备

> 确保你已经完成以下事项：

- [ ] 完成了 [C1 文件整理](./office-files)
- [ ] 有一个想自动化的重复任务

---

## 核心思路

### 识别自动化机会

| 特征 | 示例 |
|-----|------|
| 重复执行 | 每天整理发票文件 |
| 规则明确 | 按月份归档 |
| 耗时但简单 | 批量重命名 |
| 容易出错 | 手工复制/粘贴、漏步骤 |

### 自动化层次

```
手动操作 → 一键命令 → 脚本化 →（可选）外部调度
```

### 可用工具/功能（OpenCode）

| 工具/功能 | 用途 | 关键说明（可验证） |
|-----------|------|------------------|
| 自定义命令（Custom Commands） | 把“提示词模板”固化为 `/命令名` | 命令模板来自：Markdown 文件内容（官方：`opencode/packages/web/src/content/docs/commands.mdx:33`～`opencode/packages/web/src/content/docs/commands.mdx:34`；源码：`opencode/packages/opencode/src/config/config.ts:214`～`opencode/packages/opencode/src/config/config.ts:218`） |
| 命令参数 | 给命令传参 | `$ARGUMENTS` / `$1` / `$2`…（官方：`opencode/packages/web/src/content/docs/commands.mdx:111`～`opencode/packages/web/src/content/docs/commands.mdx:161`） |
| 命令嵌入 shell 输出 | 把 ``!`cmd` `` 输出注入到 prompt | 语法 ``!`command` ``（官方：`opencode/packages/web/src/content/docs/commands.mdx:164`～`opencode/packages/web/src/content/docs/commands.mdx:179`；源码：`opencode/packages/opencode/src/config/markdown.ts:7`～`opencode/packages/opencode/src/config/markdown.ts:15`） |
| 命令引用文件 | 用 `@path/to/file` 把文件内容注入 | 语法 `@...`（官方：`opencode/packages/web/src/content/docs/commands.mdx:198`～`opencode/packages/web/src/content/docs/commands.mdx:212`；源码：`opencode/packages/opencode/src/config/markdown.ts:6`～`opencode/packages/opencode/src/config/markdown.ts:12`） |
| `opencode run` | 非交互运行（便于脚本化/流水线） | CLI 支持 `opencode run [message..]`（官方：`opencode/packages/web/src/content/docs/cli.mdx:311`～`opencode/packages/web/src/content/docs/cli.mdx:350`） |
| MCP 服务器 | 引入外部工具（数据库/API/搜索） | MCP 工具会自动可用，但会占用上下文（官方：`opencode/packages/web/src/content/docs/mcp-servers.mdx:8`～`opencode/packages/web/src/content/docs/mcp-servers.mdx:21`） |
| `/compact` | 压缩会话，减少冗余工具输出 | 别名 `/summarize`；快捷键 `ctrl+x c`（官方：`opencode/packages/web/src/content/docs/tui.mdx:82`～`opencode/packages/web/src/content/docs/tui.mdx:90`） |

---

## 跟我做

<AdInArticle />

### 第 1 步：描述你的重复任务（先要"规则"，再要"执行"）

**为什么**
自动化最怕“规则不清”。你要先把流程说成机器能执行的规则。

```
我每天都要做这些重复工作：
1. 把下载目录里的发票 PDF 移动到 财务/发票/ 目录
2. 按月份创建子目录（如 2025-01/）
3. 重命名为「发票_日期_金额.pdf」格式

请先做两件事：
A) 把规则写清楚（日期来源、金额来源、冲突如何处理）
B) 给一个“先预览、后执行”的方案
```

### 第 2 步：把流程固化成“自定义命令”

**为什么**
你不想每次都重写一大段提示词。

#### 方法一：用 Markdown 命令文件（推荐）

> 命令文件位置（官方）：

- 项目级：`.opencode/command/`
- 全局：`~/.config/opencode/command/`

（官方：`opencode/packages/web/src/content/docs/commands.mdx:80`～`opencode/packages/web/src/content/docs/commands.mdx:84`）

创建 `.opencode/command/organize-invoices.md`：

```markdown
---
description: 整理发票（归档 + 重命名）
agent: build
model: anthropic/claude-opus-4-5-thinking
---

请把 $1 目录中的发票 PDF 整理到 $2：

要求：
1. 先输出“将要执行的操作清单”（移动/重命名），不要直接执行
2. 我确认后再执行

提示：今天日期是 !`date +%Y-%m-%d`
```

运行命令：

```text
/organize-invoices ~/Downloads ~/Documents/财务/发票
```

> 解释：
> - 命令文件的“正文内容”就是模板（官方：`opencode/packages/web/src/content/docs/commands.mdx:33`～`opencode/packages/web/src/content/docs/commands.mdx:34`）。
> - ``!`date ...` `` 会把命令输出注入 prompt（官方：`opencode/packages/web/src/content/docs/commands.mdx:164`～`opencode/packages/web/src/content/docs/commands.mdx:179`）。

#### 方法二：在 `opencode.json` 里用 JSONC 配置命令

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "command": {
    "organize-invoices": {
      "template": "请把 $1 目录中的发票 PDF 整理到 $2：\n\n要求：\n1. 先输出操作清单（移动/重命名），不要直接执行\n2. 我确认后再执行\n",
      "description": "整理发票（归档 + 重命名）",
      "agent": "build",
      "model": "anthropic/claude-opus-4-5-thinking",
      "subtask": true
    }
  }
}
```

> 说明：
> - `command.<name>.template` 是必填（官方：`opencode/packages/web/src/content/docs/commands.mdx:221`～`opencode/packages/web/src/content/docs/commands.mdx:236`）。
> - `description/agent/model/subtask` 都是可选项（源码：`opencode/packages/opencode/src/config/config.ts:49`～`opencode/packages/opencode/src/config/config.ts:55`；官方：`opencode/packages/web/src/content/docs/commands.mdx:57`～`opencode/packages/web/src/content/docs/commands.mdx:66`）。
> - `subtask: true` 可强制走 subagent（官方：`opencode/packages/web/src/content/docs/commands.mdx:77`～`opencode/packages/web/src/content/docs/commands.mdx:93`）。

### 第 3 步：把“脚本”交给 AI 生成，但要求可测试

**为什么**  
自动化脚本最怕“一次写完就直接跑”。你要能测试、能复用、能迭代。

```
根据刚才的规则，帮我创建一个脚本 scripts/organize_invoices.py：
1. 扫描源目录找 PDF
2. 解析日期/金额（如果解析不到也要给策略）
3. 生成目标目录结构
4. 输出详细日志（每个文件怎么处理）

要求：
- 把“预览模式（dry-run）”和“执行模式”都做出来
- 给我一条最小可运行命令
```

### 第 4 步：用 CLI 把自动化接到“脚本化调用”

**为什么**  
你可能希望在终端脚本或流水线里触发同一套提示词。

OpenCode CLI 支持非交互运行：

```bash
opencode run "请帮我检查 scripts/organize_invoices.py 的参数设计，并给出改进建议"
```

（官方：`opencode/packages/web/src/content/docs/cli.mdx:311`～`opencode/packages/web/src/content/docs/cli.mdx:350`）

---

## 进阶：扩展功能

### 使用 MCP 服务器（可选）

MCP 让 OpenCode 引入外部工具。配置完成后，MCP 工具会自动出现在可用工具列表中（官方：`opencode/packages/web/src/content/docs/mcp-servers.mdx:8`～`opencode/packages/web/src/content/docs/mcp-servers.mdx:9`）。

**示例：添加一个本地测试 MCP**（官方示例：`@modelcontextprotocol/server-everything`）：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "mcp_everything": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-everything"]
    }
  }
}
```

（官方：`opencode/packages/web/src/content/docs/mcp-servers.mdx:70`～`opencode/packages/web/src/content/docs/mcp-servers.mdx:82`）

::: tip 技巧
- MCP 会占用上下文；工具多了会更容易顶到上下文上限（官方：`opencode/packages/web/src/content/docs/mcp-servers.mdx:14`～`opencode/packages/web/src/content/docs/mcp-servers.mdx:21`）。
- 可以用 `enabled: false` 暂时禁用某个 server（官方：`opencode/packages/web/src/content/docs/mcp-servers.mdx:43`～`opencode/packages/web/src/content/docs/mcp-servers.mdx:44`）。
:::

### 用 /compact 保持会话“轻量”

```
/compact
```

- 别名：`/summarize`
- 快捷键：`ctrl+x c`

（官方：`opencode/packages/web/src/content/docs/tui.mdx:82`～`opencode/packages/web/src/content/docs/tui.mdx:90`）

### 配置里的 env/file 变量替换（顺带纠正 provider.apiKey 写法）

OpenCode 支持 `{env:VAR}` 与 `{file:path}`（官方：`opencode/packages/web/src/content/docs/config.mdx:75`～`opencode/packages/web/src/content/docs/config.mdx:95`）。

以 `anthropic` 为例，`apiKey` 在 `provider.<id>.options.apiKey`：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  },
  "model": "anthropic/claude-opus-4-5-thinking",
  "small_model": "anthropic/claude-haiku-4-5"
}
```

（官方：`opencode/packages/web/src/content/docs/config.mdx:170`～`opencode/packages/web/src/content/docs/config.mdx:181`；源码：`opencode/packages/opencode/src/config/config.ts:740`～`opencode/packages/opencode/src/config/config.ts:763`）

---

## 检查点 ✅

> 全部通过才能继续

- [ ] 识别了一个可自动化的任务
- [ ] 把流程固化成了一个自定义命令（Markdown 或 JSON）
- [ ] 生成了可测试（支持 dry-run）的脚本
- [ ] 知道如何用 `opencode run` 进行脚本化触发

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 自定义命令执行后“像没生效” | 把模板写在 frontmatter 而不是正文 | 命令文件“正文内容”才是模板（官方：`opencode/packages/web/src/content/docs/commands.mdx:33`～`opencode/packages/web/src/content/docs/commands.mdx:34`） |
| 自定义命令与内置命令同名 | 会覆盖内置命令 | 避免与 `/init`、`/share` 等重名（官方：`opencode/packages/web/src/content/docs/commands.mdx:319`～`opencode/packages/web/src/content/docs/commands.mdx:323`） |
| 命令里 ``!`cmd` `` 输出不符合预期 | 命令在项目根目录执行 | 把路径写成相对项目根，或在模板里明确目录（官方：`opencode/packages/web/src/content/docs/commands.mdx:194`～`opencode/packages/web/src/content/docs/commands.mdx:195`） |
| provider 的 `apiKey` 不生效 | 写成了 `provider.<id>.apiKey` | 按 Schema 放到 `provider.<id>.options.apiKey`（源码：`opencode/packages/opencode/src/config/config.ts:740`～`opencode/packages/opencode/src/config/config.ts:763`） |

---

## 证据索引（本课涉及的 OpenCode 行为）

| 主题 | 结论 | 证据 |
|---|---|---|
| 命令模板来源 | Markdown 正文为 template | `opencode/packages/web/src/content/docs/commands.mdx:33`～`opencode/packages/web/src/content/docs/commands.mdx:34` |
| 命令参数占位符 | 支持 `$ARGUMENTS` 与 `$1...` | `opencode/packages/web/src/content/docs/commands.mdx:111`～`opencode/packages/web/src/content/docs/commands.mdx:161` |
| 命令嵌入 shell | 支持 ``!`command` `` | `opencode/packages/web/src/content/docs/commands.mdx:164`～`opencode/packages/web/src/content/docs/commands.mdx:179` |
| CLI 自动化 | 支持 `opencode run` | `opencode/packages/web/src/content/docs/cli.mdx:311`～`opencode/packages/web/src/content/docs/cli.mdx:350` |
| MCP 能力 | MCP 工具会自动可用，但会增加上下文 | `opencode/packages/web/src/content/docs/mcp-servers.mdx:8`～`opencode/packages/web/src/content/docs/mcp-servers.mdx:21` |

---

## 本课小结

你学会了：

1. 识别可自动化的重复任务
2. 用自定义命令把流程固化
3. 让 AI 生成可测试的脚本
4. 用 CLI 把自动化串起来

🎉 **恭喜你完成了效率提升线全部课程！**

---

## 下一步建议

- 想学更多定制技巧？→ [第五阶段：深度定制](/5-advanced/)
- 想试试其他场景？→ [内容创作线](/4-scenarios/writer-workflow) 或 [程序员线](/4-scenarios/coder-daily)
