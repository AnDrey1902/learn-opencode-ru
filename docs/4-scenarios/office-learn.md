---
title: C3 AI 学编程
subtitle: 让 AI 成为你的编程导师
course: OpenCode 中文实战课
stage: 第四阶段
lesson: "C3"
duration: 20 分钟
practice: 25 分钟
level: 新手
description: 让 AI 当你的编程导师，从零开始学编程，边学边练，快速掌握编程技能。
tags:
  - 学习
  - 编程
  - 教程
prerequisite:
  - 2.1 界面与基础操作
---

# C3 AI 学编程

> 💡 **一句话总结**：用 AI 当私教，从零开始学编程，边学边练。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/4-scenarios/office-learn-notes.mini.jpeg"
     alt="C3 AI 学编程学霸笔记"
     data-zoom-src="/images/4-scenarios/office-learn-notes.jpeg" />

---

## 学完你能做什么

- 用 AI 学习新的编程语言
- 让 AI 解释代码原理
- 完成练习项目
- 建立编程学习的正确方法

---

## 你现在的困境

- 想学编程，但不知道从哪开始
- 看教程容易，动手写就卡住
- 遇到问题不知道问谁

---

## 什么时候用这一招

- 当你需要：零基础学编程，有个耐心的私教
- 而且不想：自己看教程看到睡着

---

## 🎒 开始前的准备

> 确保你已经完成以下事项：

- [ ] 完成了 [2.1 界面与基础操作](../2-daily/01-interface)
- [ ] 准备好学习的心态

---

## 核心思路

### AI 学编程的优势

| 传统学习 | AI 辅助学习 |
|---------|-----------|
| 看教程、记笔记 | 边问边学、即时答疑 |
| 卡住就搜索 | 直接问 AI 解释 |
| 练习题无反馈 | AI 批改和建议 |
| 进度固定 | 按自己节奏 |

### 学习方法

```
概念学习 → 动手实践 → 问题解答 → 项目练习
```

### 可用工具/命令（OpenCode）

| 工具/命令 | 用途 | 关键说明（可验证） |
|-----------|------|------------------|
| `@explore` 子代理 | 快速探索代码库、找文件、查实现 | Explore 是内置 subagent，可通过 `@` 手动调用（官方：`opencode/packages/web/src/content/docs/agents.mdx:35`～`opencode/packages/web/src/content/docs/agents.mdx:40`；`opencode/packages/web/src/content/docs/agents.mdx:91`～`opencode/packages/web/src/content/docs/agents.mdx:97`） |
| `skill` 工具 | 加载可复用的学习模板（`SKILL.md`） | 支持 `.opencode/skill/*/SKILL.md` 和 `.claude/skills/*/SKILL.md` 等路径（官方：`opencode/packages/web/src/content/docs/skills.mdx:16`～`opencode/packages/web/src/content/docs/skills.mdx:20`；源码：`opencode/packages/opencode/src/skill/skill.ts:69`～`opencode/packages/opencode/src/skill/skill.ts:113`） |
| `/editor` | 用外部编辑器写长内容/代码 | 使用 `EDITOR` 环境变量（官方：`opencode/packages/web/src/content/docs/tui.mdx:74`～`opencode/packages/web/src/content/docs/tui.mdx:115`） |
| `/details` | 切换工具执行详情显示 | 内置 TUI 命令（官方：`opencode/packages/web/src/content/docs/tui.mdx:94`～`opencode/packages/web/src/content/docs/tui.mdx:103`） |
| `codesearch` | 搜索 API/库的“用法上下文” | 返回 tokens 可配置（1000-2000+，默认 2000+）（源码：`opencode/packages/opencode/src/tool/codesearch.ts:43`～`opencode/packages/opencode/src/tool/codesearch.ts:50`）；是否可用受 provider/环境变量影响（源码：`opencode/packages/opencode/src/tool/registry.ts:122`～`opencode/packages/opencode/src/tool/registry.ts:127`） |
| `lsp` | 基于 LSP 的定义/引用/悬停等 | 工具仅在启用 `OPENCODE_EXPERIMENTAL_LSP_TOOL` 时注册（源码：`opencode/packages/opencode/src/tool/registry.ts:107`～`opencode/packages/opencode/src/tool/registry.ts:109`），操作列表固定 9 项（源码：`opencode/packages/opencode/src/tool/lsp.ts:9`～`opencode/packages/opencode/src/tool/lsp.ts:19`） |

::: tip 技巧
- 在 TUI 里引用文件：`@path/to/file`（官方：`opencode/packages/web/src/content/docs/tui.mdx:30`～`opencode/packages/web/src/content/docs/tui.mdx:43`）。
- `OPENCODE_ENABLE_EXA` 这类布尔环境变量，源码按 `"true"` 或 `"1"` 识别为真（源码：`opencode/packages/opencode/src/flag/flag.ts:35`～`opencode/packages/opencode/src/flag/flag.ts:38`）。
:::

---

## 跟我做

### 第 1 步：选择要学的语言

**为什么**
让 AI 帮你评估从哪开始。

#### 用 @explore 快速评估一个项目

```
@explore 用“quick”强度快速分析这个项目：
1. 主要语言/框架
2. 目录结构（入口/核心模块）
3. 新手最值得先读的 3 个文件
```

> 说明：Explore 是专门用来“快速找东西/看结构”的 subagent（官方：`opencode/packages/web/src/content/docs/agents.mdx:79`～`opencode/packages/web/src/content/docs/agents.mdx:84`）。

#### 询问 AI 推荐（零基础）

```
我是编程零基础，想学编程来提高工作效率。请帮我分析：
1. Python、JavaScript、Go 哪个适合我入门
2. 每个语言的特点和应用场景
3. 推荐的学习路径
```

### 第 2 步：学习第一个概念

<AdInArticle />

**为什么**  
从最基础的开始，循序渐进。

假设选择 Python：

```
我要开始学 Python，请从最基础的开始教我：
1. 什么是变量
2. 给我一个简单的例子
3. 让我做一个小练习
```

### 第 3 步：动手写代码

**为什么**
编程必须动手练。

#### 使用 /editor 命令写长代码

```
/editor
```

> `/editor` 会打开你 `EDITOR` 环境变量指定的编辑器（官方：`opencode/packages/web/src/content/docs/tui.mdx:104`～`opencode/packages/web/src/content/docs/tui.mdx:115`）。

#### 切换到 Build 模式，让 AI 帮你创建练习文件

```
帮我创建一个练习文件 learn/01_hello.py：
- 打印 "Hello, World!"
- 创建一个变量存储我的名字
- 打印欢迎信息

创建后教我怎么运行它
```

#### 用 /details 管理“工具输出噪音”

```
/details
```

### 第 4 步：解决遇到的问题

**为什么**  
卡住了就问 AI。

```
我运行代码报错了：
SyntaxError: invalid syntax

这是什么意思？怎么修复？
```

### 第 5 步：完成练习项目

**为什么**  
做项目才能真正学会。

```
我已经学了变量、条件、循环。请给我一个适合的练习项目：
- 难度适中
- 能用上学过的知识
- 有实际用途

然后一步步指导我完成
```

---

## 学习技巧

### 有效提问

```
# ❌ 不好的问法
这个代码为什么不行

# ✅ 好的问法
这段代码报 IndexError，我期望的结果是打印列表第一个元素，
实际报错了。代码如下：
print(my_list[1])
```

### 让 AI 检查代码（用 @ 引用文件）

```
@learn/my_code.py 请检查这段代码：
1. 有没有 Bug
2. 有没有可以优化的地方
3. 写法是否符合 Python 最佳实践
```

---

## 检查点 ✅

> 全部通过才能继续

- [ ] 用 AI 了解了要学什么语言
- [ ] 学习了至少一个基础概念
- [ ] 自己写并运行了代码
- [ ] 完成了一个小练习

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 概念听不懂 | 解释太专业 | 明确要求“用小白能懂的话解释 + 给例子 + 给练习” |
| 练习太难 | 跳步骤了 | 从最简单的开始，循序渐进 |
| `codesearch` 找不到/不可用 | provider/环境变量未满足启用条件 | 见下方“codesearch 启用条件” |

---

## 进阶：探索更多功能

### 1) codesearch：查 API/库的用法上下文

```
用 codesearch 搜索：React useState hook examples
```

::: tip 技巧
- `codesearch.tokensNum` 范围 1000-2000+，默认 2000+（源码：`opencode/packages/opencode/src/tool/codesearch.ts:43`～`opencode/packages/opencode/src/tool/codesearch.ts:50`）。
- 启用条件：当 providerID 为 `opencode`，或环境变量 `OPENCODE_ENABLE_EXA` 为真时，`codesearch/websearch` 才会出现在工具列表里（源码：`opencode/packages/opencode/src/tool/registry.ts:122`～`opencode/packages/opencode/src/tool/registry.ts:127`；`opencode/packages/opencode/src/flag/flag.ts:26`～`opencode/packages/opencode/src/flag/flag.ts:28`）。
- 官方文档中把 OpenCode Zen 的模型写成 `opencode/...` 形式（官方：`opencode/packages/web/src/content/docs/agents.mdx:334`～`opencode/packages/web/src/content/docs/agents.mdx:335`）。
:::

### 2) LSP 工具（实验性）

> 说明：`lsp` 工具只有在启用 `OPENCODE_EXPERIMENTAL_LSP_TOOL=true`（或 `OPENCODE_EXPERIMENTAL=true`）时可用（官方：`opencode/packages/web/src/content/docs/tools.mdx:216`～`opencode/packages/web/src/content/docs/tools.mdx:235`；源码：`opencode/packages/opencode/src/tool/registry.ts:107`～`opencode/packages/opencode/src/tool/registry.ts:109`）。

你可以让 AI 做这些操作（9 选 1）：

- `goToDefinition`
- `findReferences`
- `hover`
- `documentSymbol`
- `workspaceSymbol`
- `goToImplementation`
- `prepareCallHierarchy`
- `incomingCalls`
- `outgoingCalls`

（源码：`opencode/packages/opencode/src/tool/lsp.ts:9`～`opencode/packages/opencode/src/tool/lsp.ts:19`）

详细 LSP 服务器配置见：[5.19 LSP 服务器](../5-advanced/19-lsp)。

### 3) skill：把“学习流程”做成可复用模板

创建一个技能文件（示例）：

**创建 `.opencode/skill/python-basics/SKILL.md`**：

```markdown
---
name: python-basics
description: Python 基础知识教学
---

## What I do

- 解释 Python 基础概念
- 提供练习和示例代码
- 帮助调试常见错误

## When to use me

当学习 Python 基础语法、数据类型、控制流时使用。
```

技能的可发现路径包括：

- `.opencode/skill/<name>/SKILL.md`
- `~/.config/opencode/skill/<name>/SKILL.md`
- `.claude/skills/<name>/SKILL.md`
- `~/.claude/skills/<name>/SKILL.md`

（官方：`opencode/packages/web/src/content/docs/skills.mdx:16`～`opencode/packages/web/src/content/docs/skills.mdx:20`）

### 4) 配置变量替换（env/file）

OpenCode 支持 `{env:VAR}` 与 `{file:path}` 变量替换（官方：`opencode/packages/web/src/content/docs/config.mdx:75`～`opencode/packages/web/src/content/docs/config.mdx:95`；源码：`opencode/packages/opencode/src/config/config.ts:1023`～`opencode/packages/opencode/src/config/config.ts:1026`）。

示例（以 `provider.openai.options.apiKey` 为例，注意 `apiKey` 在 `options` 下）：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openai": {
      "options": {
        "apiKey": "{env:OPENAI_API_KEY}"
      }
    }
  }
}
```

---

## 证据索引（本课涉及的 OpenCode 行为）

| 主题 | 结论 | 证据 |
|---|---|---|
| 内置 subagent | Explore 可通过 `@` 调用 | `opencode/packages/web/src/content/docs/agents.mdx:35`～`opencode/packages/web/src/content/docs/agents.mdx:40` |
| `codesearch` tokens 范围 | 1000-2000+，默认 2000+ | `opencode/packages/opencode/src/tool/codesearch.ts:43`～`opencode/packages/opencode/src/tool/codesearch.ts:50` |
| `codesearch` 启用条件 | providerID=opencode 或 `OPENCODE_ENABLE_EXA` | `opencode/packages/opencode/src/tool/registry.ts:122`～`opencode/packages/opencode/src/tool/registry.ts:127` |
| `OPENCODE_ENABLE_EXA` 真值 | 识别 `true`/`1` | `opencode/packages/opencode/src/flag/flag.ts:35`～`opencode/packages/opencode/src/flag/flag.ts:38` |
| `lsp` 工具操作 | 固定 9 个 operation | `opencode/packages/opencode/src/tool/lsp.ts:9`～`opencode/packages/opencode/src/tool/lsp.ts:19` |
| Skills 路径 | `.opencode` 与 `.claude` 兼容目录 | `opencode/packages/web/src/content/docs/skills.mdx:16`～`opencode/packages/web/src/content/docs/skills.mdx:20` |
| `{env:...}` 替换 | 未设置时替换为空字符串 | `opencode/packages/web/src/content/docs/config.mdx:94`～`opencode/packages/web/src/content/docs/config.mdx:95` |

---

## 本课小结

你学会了：

1. 用 AI 规划编程学习路径
2. 边学边问，循序渐进
3. 让 AI 帮你检查和解释代码
4. 通过做项目巩固知识

---

## 下一课预告

> 下一课我们将学习自动化脚本，用 AI 帮你写脚本解放重复劳动。
