---
title: "LSP 代码智能：让 AI 真正读懂你的代码 | OpenCode 教程"
subtitle: LSP 代码智能
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.19"
duration: 20 分钟
practice: 10 分钟
level: 进阶
description: 学习 OpenCode LSP 集成。本教程讲解 30+ 内置语言服务器、9 种代码智能操作（定义跳转、引用查找、悬停信息等）、自定义 LSP 配置，以及常见问题排查。
tags:
  - LSP
  - 语言服务器
  - 代码智能
  - 符号跳转
prerequisite:
  - 5.1a 配置基础
---

# LSP 代码智能

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/lsp-notes.mini.jpeg" 
     alt="5.19 LSP 服务器学霸笔记" 
     data-zoom-src="/images/5-advanced/lsp-notes.jpeg" />

---

AI 帮你改代码时，不知道函数在哪定义、变量被谁引用、接口有哪些实现？

**LSP（Language Server Protocol）** 就是解决这个问题的。它给 AI 装上了"IDE 的大脑"，让 AI 从"看文本"升级到"理解代码结构"。

::: info 🤔 什么是 LSP？
LSP 是微软提出的一套标准协议，让编辑器和语言服务器之间通信。你在 VS Code 里用的"跳转到定义"、"查找引用"，背后就是 LSP 在工作。

OpenCode 把同样的能力带到了终端 AI 助手里。
:::

## 学完你能做什么

::: info 🎯 本课目标
- 理解 LSP 如何让 AI 获得代码智能
- 使用 9 种 LSP 操作：定义跳转、引用查找、悬停信息等
- 了解 OpenCode 内置的 30+ 语言服务器
- 自定义或禁用 LSP 服务器
- 排查 LSP 连接问题
:::

---

## 你现在的困境

- "AI 不知道这个函数在哪定义，只能靠猜"
- "想知道某个变量在哪些地方被使用，但 AI 找不全"
- "AI 改代码时不了解依赖关系，容易改错"
- "希望能像 IDE 一样快速跳转和查看定义"

---

## 什么时候用这一招

- 需要理解大型代码库的结构
- 需要查找函数/变量的定义和引用
- 重构前想了解影响范围
- 需要获得类型信息和文档注释

---

## 🎒 开始前的准备

- [ ] 完成了 [5.1a 配置基础](./01a-config-basics)
- [ ] 已能正常启动 OpenCode
- [ ] 项目中有代码文件（OpenCode 会自动检测语言类型）

---

## 核心思路

LSP 的工作流程很简单：

1. OpenCode 检测到你打开的文件类型（比如 `.ts`、`.py`、`.go`）
2. 自动启动对应的语言服务器
3. AI 在需要理解代码时，向语言服务器发请求
4. 语言服务器返回精确的代码智能数据

大部分情况下你不需要做任何配置，开箱即用。

### LSP vs 纯文本搜索

| 对比项 | 纯文本搜索（grep） | LSP 代码智能 |
|-------|-------------------|-------------|
| 搜索方式 | 字符串匹配 | 语义符号匹配 |
| 准确度 | 可能有误报（同名变量） | 精确定位 |
| 作用域 | 不理解作用域 | 理解作用域和导入关系 |
| 类型信息 | 无 | 提供完整类型签名 |
| 重载区分 | 无法区分 | 能区分函数重载 |

---

## 内置语言服务器

OpenCode 内置了 **30+ 语言服务器**，开箱即用。

### 主流语言

| LSP 服务器 | 扩展名 | 要求 |
|-----------|--------|------|
| typescript | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts | 项目中有 `typescript` 依赖 |
| pyright | .py, .pyi | 自动安装 pyright |
| gopls | .go | `go` 命令可用 |
| rust (rust-analyzer) | .rs | `rust-analyzer` 命令可用 |
| jdtls | .java | 已安装 Java SDK（21+） |
| kotlin-ls | .kt, .kts | 自动下载安装 |
| clangd | .c, .cpp, .cc, .cxx, .c++, .h, .hpp, .hh, .hxx, .h++ | 自动下载安装 |
| csharp (csharp-ls) | .cs | 已安装 .NET SDK |
| fsharp (fsautocomplete) | .fs, .fsi, .fsx, .fsscript | 已安装 .NET SDK |
| sourcekit-lsp | .swift, .objc, .objcpp | 已安装 Swift（macOS 上为 Xcode） |
| dart | .dart | `dart` 命令可用 |

### 其他语言

| LSP 服务器 | 扩展名 | 要求 |
|-----------|--------|------|
| ruby-lsp (rubocop) | .rb, .rake, .gemspec, .ru | `ruby` 和 `gem` 命令可用 |
| elixir-ls | .ex, .exs | `elixir` 命令可用 |
| zls | .zig, .zon | `zig` 命令可用 |
| lua-ls | .lua | 自动下载安装 |
| php intelephense | .php | 自动安装 intelephense |
| ocaml-lsp | .ml, .mli | `ocamllsp` 命令可用 |
| gleam | .gleam | `gleam` 命令可用 |
| clojure-lsp | .clj, .cljs, .cljc, .edn | `clojure-lsp` 命令可用 |
| nixd | .nix | `nixd` 命令可用 |
| haskell-language-server | .hs, .lhs | `haskell-language-server-wrapper` 命令可用 |
| deno | .ts, .tsx, .js, .jsx, .mjs | `deno` 命令可用（自动检测 deno.json） |

### 前端框架

| LSP 服务器 | 扩展名 | 要求 |
|-----------|--------|------|
| vue | .vue | 自动安装 vue-language-server |
| svelte | .svelte | 自动安装 svelte-language-server |
| astro | .astro | 自动安装 astro-language-server |

### 工具和配置

| LSP 服务器 | 扩展名 | 用途 |
|-----------|--------|------|
| eslint | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts, .vue | 代码规范检查 |
| oxlint | .ts, .tsx, .js, .jsx 等 + .vue, .astro, .svelte | 快速 linter |
| biome | .ts, .tsx, .js, .jsx, .json, .css, .vue, .astro, .svelte 等 | 格式化 + linter |
| yaml-ls | .yaml, .yml | YAML 支持 |
| bash | .sh, .bash, .zsh, .ksh | Shell 脚本 |
| terraform | .tf, .tfvars | IaC 配置 |
| prisma | .prisma | 数据库 schema |
| texlab | .tex, .bib | LaTeX 文档 |
| tinymist | .typ, .typc | Typst 排版 |
| dockerfile | .dockerfile, Dockerfile | Docker 配置 |

::: tip 自动安装说明
大部分服务器会在首次使用时自动下载安装，安装目录是 `~/.local/share/opencode/bin/`。

少数服务器（如 rust-analyzer、dart、sourcekit-lsp）需要你提前安装好对应的工具链。

设置环境变量 `OPENCODE_DISABLE_LSP_DOWNLOAD=true` 可禁用自动下载。
:::

---

## 9 种 LSP 操作

<AdInArticle />

OpenCode 提供了 9 种 LSP 操作，AI 会根据需要自动调用。你也可以在对话中明确要求。

### 1. goToDefinition：跳转到定义

找到函数、类、变量的定义位置。

```
你: 找到 src/utils/format.ts 第 15 行的 formatDate 函数的定义
```

AI 会调用 LSP 的 `goToDefinition`，返回定义所在的文件和行号。

### 2. findReferences：查找引用

找到某个符号在整个项目中的所有使用位置。重构前特别有用。

```
你: 查找 src/api/user.ts 第 20 行的 User 类型在哪些地方被使用
```

### 3. hover：悬停信息

获取符号的类型签名、文档注释等信息。

```
你: 查看 src/services/auth.ts 第 45 行的 login 函数的类型签名
```

### 4. documentSymbol：文档符号

列出文件中的所有符号（函数、类、变量等），快速浏览文件结构。

```
你: 列出 src/controllers/user.ts 中所有的函数和类
```

### 5. workspaceSymbol：工作区符号搜索

在整个项目中搜索符号。返回结果会过滤为类、函数、方法、接口、变量、常量、结构体、枚举这几种类型，最多返回 10 个。

```
你: 在整个项目中搜索所有包含 "UserService" 的类
```

### 6. goToImplementation：跳转到实现

找到接口或抽象类的具体实现。

```
你: 找到 src/interfaces/Repository.ts 第 10 行的 Repository 接口的所有实现
```

### 7. prepareCallHierarchy：准备调用层级

获取某个位置的调用层级信息，为后续的入调用/出调用分析做准备。

### 8. incomingCalls：入调用

找到所有调用当前函数的地方。修改函数前用这个评估影响范围。

```
你: 找到 src/utils/validator.ts 第 20 行的 validateEmail 函数被哪些地方调用
```

### 9. outgoingCalls：出调用

找到当前函数调用的所有其他函数，分析依赖关系。

```
你: 查看 src/services/payment.ts 第 50 行的 processPayment 函数调用了哪些其他函数
```

::: details LSP 工具的参数说明
所有 LSP 操作都需要三个参数：
- `filePath`：文件路径（绝对或相对路径）
- `line`：行号（从 1 开始，和编辑器里看到的一样）
- `character`：字符偏移（从 1 开始）

AI 会自动填充这些参数，你只需要用自然语言描述需求。
:::

---

## 在对话中使用 LSP

### AI 自动使用

大多数时候你不需要特别提 LSP，AI 会自动判断什么时候该用：

```
你: 这个 formatDate 函数在哪里定义的？

AI: [自动调用 lsp goToDefinition]
    formatDate 定义在 src/utils/date.ts 第 42 行...
```

### 手动请求

你也可以明确要求 AI 使用 LSP：

```
你: 使用 LSP 查找 UserService 类的所有引用
你: 用 LSP 查看 config.ts 文件的符号列表
你: 通过 LSP 分析 processOrder 函数的调用关系
```

---

## 跟我做：配置 LSP

### 第 1 步：确认 LSP 是否正常工作

**为什么**
大部分情况下 LSP 开箱即用，先确认一下。

在 OpenCode 对话中输入：

```
帮我查看 src/index.ts 第 1 行的符号信息
```

**你应该看到**：AI 返回了类型信息或文档注释，说明 LSP 已经在工作。

如果看到 `No LSP server available for this file type`，说明对应语言的服务器没有启动，检查是否满足"要求"列的条件。

---

### 第 2 步：禁用不需要的服务器

**为什么**
有些项目可能同时触发多个服务器（比如 TypeScript 和 Deno），造成冲突。

在 `opencode.json` 中禁用特定服务器：

```json
{
  "lsp": {
    "deno": {
      "disabled": true
    }
  }
}
```

如果想全局禁用所有 LSP（比如调试性能问题时）：

```json
{
  "lsp": false
}
```

**你应该看到**：被禁用的服务器不再启动，日志中会显示 `LSP server xxx is disabled`。

---

### 第 3 步：添加自定义 LSP 服务器

**为什么**
如果你用的语言没有内置支持，可以自己配置。

```json
{
  "lsp": {
    "my-lang": {
      "command": ["my-lsp-server", "--stdio"],
      "extensions": [".myl"],
      "env": {
        "MY_ENV": "value"
      }
    }
  }
}
```

配置字段说明：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `command` | string[] | ✅（启用时必填） | 启动命令和参数。仅禁用时可省略，只需 `{ "disabled": true }` |
| `extensions` | string[] | ✅（自定义服务器） | 文件扩展名列表 |
| `disabled` | boolean | ❌ | 是否禁用（默认 `false`） |
| `env` | object | ❌ | 环境变量 |
| `initialization` | object | ❌ | LSP 初始化参数 |

::: warning 注意
自定义 LSP 服务器必须提供 `extensions` 字段，否则配置校验会报错：`For custom LSP servers, 'extensions' array is required.`

内置服务器可以省略 `extensions`，因为已经有默认值。
:::

**你应该看到**：打开 `.myl` 文件时，AI 能使用 LSP 操作。

---

## 检查点 ✅

- [ ] 理解 LSP 的作用：让 AI 从"看文本"升级到"理解代码结构"
- [ ] 知道 OpenCode 内置了 30+ 语言服务器，大部分开箱即用
- [ ] 能说出至少 3 种 LSP 操作（定义跳转、引用查找、悬停信息...）
- [ ] 知道如何禁用特定 LSP 服务器
- [ ] 知道如何添加自定义 LSP 服务器

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|------|------|------|
| `No LSP server available for this file type` | 对应语言的服务器没安装或不满足条件 | 检查"要求"列，安装对应工具链 |
| LSP 服务器在错误的目录启动 | 项目根目录检测不对 | 确保项目根目录有标志文件（如 `package.json`、`go.mod`） |
| `File not found: /path/to/file.ts` | 文件路径错误 | 使用相对于项目根目录的路径 |
| 首次使用等待时间长 | 服务器首次启动需要初始化和建索引 | 正常现象，后续使用会快很多 |
| TypeScript 和 Deno 服务器冲突 | 两个服务器同时处理 `.ts` 文件 | 在 `opencode.json` 中禁用不需要的那个 |
| LSP 内存占用高 | 大型项目索引消耗内存 | 禁用不需要的服务器，或设置 `"lsp": false` |
| 自定义服务器启动失败 | 环境变量缺失或命令路径不对 | 在配置中添加 `env` 字段，使用绝对路径 |

---

## 附加信息

### PHP Intelephense 许可证

PHP Intelephense 通过许可证密钥提供高级功能。可以将许可证密钥放在文本文件中：

- macOS/Linux: `$HOME/intelephense/licence.txt`
- Windows: `%USERPROFILE%/intelephense/licence.txt`

文件应只包含许可证密钥，无其他内容。

### 实验性功能：ty Python 服务器

设置环境变量 `OPENCODE_EXPERIMENTAL_LSP_TY=1` 可以启用实验性的 ty Python 服务器，替代默认的 pyright。启用后 pyright 会自动禁用。

::: warning 实验性功能
ty 服务器还在实验阶段，可能随版本变化。生产环境建议继续使用 pyright。
:::

---

## 本课小结

| 核心概念 | 说明 |
|---------|------|
| LSP 作用 | 给 AI 提供 IDE 级代码智能，理解代码语义 |
| 自动检测 | 根据文件扩展名自动启动对应服务器 |
| 内置支持 | 30+ 语言服务器，大部分开箱即用 |
| 9 种操作 | 定义跳转、引用查找、悬停信息、符号搜索、实现跳转、调用层级等 |
| 配置方式 | `opencode.json` 的 `lsp` 字段，支持禁用和自定义 |

记住：大部分情况下你不需要配置任何东西，LSP 会自动工作。只有遇到问题或需要自定义时才需要改配置。

---

## 下一课预告

> 下一课我们学习 **[上下文压缩](./20-compaction)**。
>
> 你会学到：
> - 上下文压缩的触发机制
> - Context 百分比的含义
> - 如何手动触发压缩
> - 压缩对对话质量的影响

---

## 相关课程

- [代码格式化器](18-formatters) - 自动代码格式化
- [内置工具](17-tools) - 所有内置工具一览
- [调试指南](22-debugging) - `debug lsp` 命令排查问题
- [配置参考](../appendix/config-ref) - 完整配置选项

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|---------|------|
| LSP 命名空间和核心逻辑 | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L14-L485) | 14-485 |
| LSP 客户端获取和服务器启动 | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L177-L262) | 177-262 |
| goToDefinition 实现 | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L386-L395) | 386-395 |
| findReferences 实现 | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L397-L407) | 397-407 |
| hover 实现 | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L303-L317) | 303-317 |
| workspaceSymbol（过滤和��制 10 个） | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L359-L369) | 359-369 |
| documentSymbol 实现 | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L371-L384) | 371-384 |
| goToImplementation 实现 | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L409-L418) | 409-418 |
| prepareCallHierarchy 实现 | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L420-L429) | 420-429 |
| incomingCalls 实现 | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L431-L442) | 431-442 |
| outgoingCalls 实现 | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L444-L455) | 444-455 |
| diagnostics 诊断信息 | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L291-L301) | 291-301 |
| LSP 工具定义（9 种操作） | [`src/tool/lsp.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/lsp.ts#L10-L96) | 10-96 |
| LSP 工具描述文本 | [`src/tool/lsp.txt`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/lsp.txt#L1-L20) | 1-20 |
| LSP 配置 Schema | [`src/config/config.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts#L1115-L1150) | 1115-1150 |
| LSPServer 接口定义 | [`src/lsp/server.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/server.ts#L53-L59) | 53-59 |
| TypeScript 服务器 | [`src/lsp/server.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/server.ts#L89-L116) | 89-116 |
| Python 服务器 (pyright) | [`src/lsp/server.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/server.ts#L505-L557) | 505-557 |
| Go 服务器 (gopls) | [`src/lsp/server.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/server.ts#L358-L398) | 358-398 |
| Rust 服务器 (rust-analyzer) | [`src/lsp/server.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/server.ts#L847-L891) | 847-891 |
| 实验性 ty Python 服务器 | [`src/lsp/server.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/server.ts#L441-L503) | 441-503 |
| 实验性服务器过滤逻辑 | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L64-L77) | 64-77 |
| SymbolKind 过滤（workspaceSymbol） | [`src/lsp/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/lsp/index.ts#L319-L357) | 319-357 |

**关键类型**：
- `LSP.Range`：代码范围（开始/结束位置）
- `LSP.Symbol`：符号信息（名称、类型、位置）
- `LSP.DocumentSymbol`：文档符号（包含子符号）
- `LSP.Status`：LSP 服务器状态（id、name、root、status）
- `LSPServer.Info`：服务器定义（id、extensions、root、spawn）

**关键常量**：
- `operations`：9 种 LSP 操作的枚举列表（`src/tool/lsp.ts` 第 10-20 行）
- `kinds`：workspaceSymbol 过滤的符号类型（Class、Function、Method、Interface、Variable、Constant、Struct、Enum）

**环境变量**：
- `OPENCODE_DISABLE_LSP_DOWNLOAD`：禁用自动下载 LSP 服务器
- `OPENCODE_EXPERIMENTAL_LSP_TY`：启用实验性 ty Python 服务器

</details>
