---
title: 5.2a Agent 快速入门
subtitle: 理解并创建你的第一个 Agent
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.2a"
duration: 15 分钟
practice: 15 分钟
level: 进阶
description: 理解 Agent 的本质，创建你的第一个自定义 Agent，扩展 OpenCode 的能力。
tags:
  - Agent
  - 自定义
prerequisite:
  - 3.2 认识 Agent
---

# 5.2a Agent 快速入门

> 理解 Agent 的本质，创建你的第一个自定义 Agent。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/02a-agent-quickstart-notes.mini.jpeg" alt="Agent快速入门学霸笔记" data-zoom-src="/images/5-advanced/02a-agent-quickstart-notes.jpeg" />

---

## 学完你能做什么

- 理解 Agent 是什么、为什么需要它
- 区分 Primary Agent 和 Subagent
- 用 Markdown 创建自定义 Agent
- 用 JSON 创建自定义 Agent
- 切换和使用 Agent

---

## Agent 是什么

### Anthropic 的定义

根据 Anthropic 在《Building Effective Agents》中的定义：

| 类型 | 说明 | 特点 |
|------|------|------|
| **Workflow** | LLM 和工具通过预定义代码路径编排 | 步骤固定、可预测 |
| **Agent** | LLM 动态指导自己的流程和工具使用 | 自主决策、灵活应对 |

### OpenCode 中的 Agent

OpenCode 的 Agent 是**可配置的 AI 人格**，你可以定义：

- **身份**：它是谁、擅长什么
- **能力**：可以使用哪些工具
- **行为**：如何处理任务、有什么限制

### 为什么需要自定义 Agent

| 场景 | 不用 Agent | 用 Agent |
|------|-----------|---------|
| 代码审查 | 每次说"你是代码审查专家..." | 直接 `@reviewer` |
| 文档写作 | 每次说"用技术文档风格..." | 直接 `@docs-writer` |
| 安全审计 | 每次说"检查安全漏洞..." | 直接 `@security-auditor` |

---

## Agent 类型

OpenCode 有两类 Agent：

| 类型 | 说明 | 调用方式 |
|------|------|----------|
| **Primary** | 主 Agent，你直接交互的对象 | Tab 键切换 |
| **Subagent** | 子 Agent，被主 Agent 调用执行专项任务 | `@agent名` 或自动调用 |
| **All** | 混合模式，既可以作为主 Agent，也可以被调用 | Tab 切换或 @ 调用 |

### 它们如何协作

```
用户 ←→ Primary Agent (build/plan)
              ↓
         Task Tool (创建独立 Session)
              ↓
         Subagent (explore/general/你的自定义 Agent)
              ↓
         返回结果给 Primary
```

### 子代理的运行机制（重要）

理解子代理的运行机制对于设计高效 Agent 至关重要：

1. **Session 隔离（无历史记忆）**
   子代理运行在一个**全新的、独立的 Session** 中。这意味着：
   - **看不到主 Agent 的对话历史**：它不知道你之前和主 Agent 聊了什么。
   - **上下文仅包含 Prompt**：它的世界里只有你传给它的任务描述（Prompt）。
   - **必须提供完整上下文**：调用时必须把任务所需的所有信息都写在 prompt 里。

2. **All 模式的双重身份**
   当 `mode: "all"` 的 Agent：
   - **被 Tab 切换时**：它是主 Agent，拥有完整历史记忆。
   - **被 @ 调用时**：它是子 Agent，受到 Session 隔离限制，看不到调用者的历史。

---

## 内置 Agent 详解

<AdInArticle />

### 用户可见的 Agent

| 名称 | 模式 | 默认权限 | 说明 |
|------|------|---------|------|
| `build` | primary | 全部允许 | 默认开发 Agent，所有工具可用 |
| `plan` | primary | edit: deny（仅 `.opencode/plans/*.md` 和全局 plans 目录允许） | 只读规划，不修改代码 |
| `general` | subagent | todowrite: deny | 通用研究，多步任务 |
| `explore` | subagent | 仅允许 grep/glob/list/bash/read/webfetch/websearch | 快速代码探索 |

> **关于 Explore Agent 的探索深度**：调用 Explore 时可以指定探索深度级别。AI 会根据任务描述自动判断，你也可以在提示词中明确指定：
> - **quick**：基本搜索，快速定位目标文件
> - **medium**：中等探索，平衡速度和覆盖面
> - **very thorough**：全面分析，跨多个位置和命名约定进行搜索
>
> 来源：`agent.ts:213`

> **关于 Plan Agent**：它不是"需要确认才能编辑"，而是**默认禁止编辑**（`edit: deny`），只有 `.opencode/plans/*.md`（项目级）和全局数据目录下的 `plans/*.md` 允许写入。bash 命令默认允许（继承全局 `*: allow`）。这是为了让你在规划阶段专注思考，不被代码修改分心。
> 
> 来源：`agent.ts:171-175`

### 隐藏的内置 Agent

这些 Agent 你不会直接使用，但了解它们有助于理解系统：

| 名称 | 用途 | 说明 |
|------|------|------|
| `title` | 生成会话标题 | temperature: 0.5（模型由其他模块选择） |
| `summary` | 生成会话摘要 | 用于压缩 |
| `compaction` | 压缩上下文 | 当上下文过长时自动触发 |

> 来源：`agent.ts:219-264`

---

## 配置位置

| 位置 | 作用范围 | 优先级 |
|-----|---------|-------|
| `.opencode/agent/*.md` | 当前项目 | 高 |
| `~/.config/opencode/agent/*.md` | 全局所有项目 | 中 |
| `opencode.json` 的 `agent` 字段 | 取决于文件位置 | 与 Markdown 合并 |

> **文件名即 Agent 名称**：`docs-writer.md` 创建名为 `docs-writer` 的 Agent。

---

## 创建第一个 Agent（Markdown 方式）

### 基本结构

```markdown
---
description: 简短描述这个 Agent 做什么
mode: subagent
---

这里是系统提示词（System Prompt）。

告诉 Agent 它是谁、擅长什么、如何工作。
```

### 完整示例：文档写作 Agent

创建文件 `.opencode/agent/docs-writer.md`：

```markdown
---
description: |
  技术文档写作专家，擅长 API 文档、README、用户手册。
  适用场景：写新项目文档、更新现有文档、解释代码功能。
  不适用：代码审查、Bug 修复、功能实现。
mode: subagent
temperature: 0.3
---

# 角色

你是技术文档专家，擅长将复杂概念解释得通俗易懂。你的文档被评价为"看完就会用"。

# 文档规范

- 使用 Markdown 格式
- 代码示例必须可运行
- 包含输入/输出说明
- 中文优先，专业术语保留英文

# 文档结构

1. 概述（一句话说明是什么）
2. 快速开始（30 秒能跑起来）
3. 详细 API（完整参数说明）
4. 示例代码（覆盖常见场景）
5. 常见问题（预判用户疑惑）

# 工作原则

- 先理解代码，再写文档
- 不确定的地方要验证
- 保持风格一致

# 约束条件

- ✅ 快速开始的代码必须可直接复制运行
- ✅ 参数说明要包含类型和默认值
- ❌ 避免假设用户已有背景知识

# 错误处理

- 如果代码功能不明确，先询问或查阅相关源码
- 如果缺少上下文，列出需要补充的信息
- 如果遇到不熟悉的框架，声明并建议其他 Agent
```

### Markdown 中的权限配置

你可以在 Frontmatter 中直接配置权限（使用 YAML 语法）：

```markdown
---
description: 只读代码审计 Agent
mode: subagent
permission:
  edit: deny            # 禁止编辑
  bash:
    "*": deny           # 禁止所有命令
    "git log*": allow   # 只允许查看日志
  task:
    "*": deny           # 禁止调用其他 Agent
---
```

### 完整配置字段速查表

| 字段 | 类型 | 说明 |
|-----|------|------|
| `description` | string | **建议填**。Agent 简介，影响主 Agent 的自动选择决策 |
| `mode` | enum | `subagent` \| `primary` \| `all`。默认 `all` |
| `model` | string | 格式 `provider/model`。不填则继承主 Agent 当前模型 |
| `variant` | string | 默认模型变体（如 thinking）。仅当 agent 配置了自己的 `model` 时生效；不配 model 则无意义 |
| `prompt` | string | 系统提示词（JSON 配置专用，Markdown 中使用正文） |
| `temperature` | number | 0-1，控制回答的随机性 |
| `top_p` | number | 0-1，核采样参数 |
| `steps` | number | 最大迭代步数，防止死循环 |
| `hidden` | boolean | `true` 则从 @ 自动补全菜单中隐藏 |
| `color` | string | 十六进制 `#RRGGBB` 或主题色名（`primary`/`secondary`/`accent`/`success`/`warning`/`error`/`info`），用于界面区分 |
| `permission` | object | 权限配置对象 |
| `disable` | boolean | 是否禁用此 Agent |
| `options` | object | 透传参数容器，用于存放不常用的 Provider 参数 |
| *其他字段* | any | 未知字段会自动作为参数**透传**给 Provider（如 `reasoningEffort`） |

> `maxSteps` 已废弃，请使用 `steps`。

### Temperature 默认值（重要）

不同模型有不同的默认温度：

| 模型 | 默认 Temperature | 说明 |
|------|-----------------|------|
| Claude | undefined | 使用 API 默认 |
| GPT | undefined | 使用 API 默认 |
| Gemini | 1.0 | 固定值 |
| Qwen | 0.55 | 固定值 |
| GLM-4.6/4.7 | 1.0 | 固定值 |
| MiniMax-M2 | 1.0 | 固定值 |
| Kimi-K2 | 0.6 或 1.0 | thinking/k2./k2p 版本为 1.0，其他为 0.6 |

**优先级**：
```
agent.temperature（用户设置） > 模型默认值 > undefined
```

**注意事项**：
- 只有 `capabilities.temperature = true` 的模型才会生效
- 某些推理模型（如 Codex）不支持 temperature
- 设置无效时检查模型文档确认是否支持

---

## 系统提示词的工作原理（重要）

当你定义 Agent 的 prompt 时，它会如何与 OpenCode 的默认行为结合？

### 提示词组装顺序

每次发送请求时，系统提示词按以下顺序组装：

```
┌─────────────────────────────────────────────────────────────┐
│  1. Agent prompt  或  Provider 默认提示词（二选一）          │
│     ├─ 有 prompt → 使用你定义的                              │
│     └─ 无 prompt → 使用模型默认（如 anthropic.txt）          │
├─────────────────────────────────────────────────────────────┤
│  2. 环境信息 + 指令文件（始终添加）                          │
│     工作目录、git 状态、平台、日期                           │
│     AGENTS.md、CLAUDE.md 等全局规则文件                      │
└─────────────────────────────────────────────────────────────┘
```

**关键点**：
1. Agent prompt 和 Provider 默认提示词是**二选一**，不是叠加
2. 环境信息和指令文件**始终添加**，无论是否有 Agent prompt

### 内置 Agent 的提示词情况

| Agent | 有自定义 prompt？ | 实际使用的提示词 |
|-------|------------------|-----------------|
| `build` | ❌ 无 | Provider 默认 |
| `plan` | ❌ 无 | Provider 默认 |
| `general` | ❌ 无 | Provider 默认 |
| `explore` | ✅ 有 | 专用 prompt（文件搜索专家） |
| `title` | ✅ 有 | 专用 prompt（生成会话标题） |
| `summary` | ✅ 有 | 专用 prompt（生成会话摘要） |
| `compaction` | ✅ 有 | 专用 prompt（压缩上下文） |

### Provider 默认提示词长什么样？

不同模型使用不同的默认提示词模板：

| 模型 | 提示词文件 | 风格特点 |
|------|-----------|---------|
| Claude | `anthropic.txt` | 强调 TodoWrite、使用专用工具、简洁输出 |
| GPT-5 | `codex_header.txt` | OpenAI Codex 专用 |
| GPT / O1 / O3 | `beast.txt` | 强调持续迭代、联网研究、自主解决 |
| Gemini | `gemini.txt` | 适配 Gemini 特性 |
| Trinity | `trinity.txt` | Trinity 模型专用 |
| 其他（Qwen 等）| `qwen.txt` | 类似 Anthropic 但不含 TodoWrite |

> **说明**：未匹配到上述模型的会使用 `qwen.txt`（`PROMPT_ANTHROPIC_WITHOUT_TODO`）。

::: details 查看示例：anthropic.txt 开头
```text
You are OpenCode, the best coding agent on the planet.

You are an interactive CLI tool that helps users with software engineering tasks.
Use the instructions below and the tools available to you to assist the user.

# Tone and style
- Only use emojis if the user explicitly requests it
- Your responses should be short and concise
- Output text to communicate with the user

# Task Management
You have access to the TodoWrite tools to help you manage and plan tasks.
Use these tools VERY frequently...
```
:::

::: details 查看示例：beast.txt 开头
```text
You are opencode, an agent - please keep going until the user's query
is completely resolved, before ending your turn and yielding back to the user.

You MUST iterate and keep going until the problem is solved.

THE PROBLEM CAN NOT BE SOLVED WITHOUT EXTENSIVE INTERNET RESEARCH.
You must use the webfetch tool to recursively gather all information...
```
:::

### 这对自定义 Agent 意味着什么？

**一句话总结**：Agent md 文件的正文就是你写的系统提示词，OpenCode 不会在它前面注入其他提示词。它**替代**默认的 `anthropic.txt` 或 `beast.txt`，然后在其**后面**追加环境信息和指令文件。

**场景 1：你的 Agent 有 prompt**

```markdown
---
description: 代码审查专家
mode: subagent
---

你是代码审查专家，专注于安全和性能...
```

实际发送给模型的是：
```
你是代码审查专家，专注于安全和性能...    ← 你的 prompt（替代默认）
You are powered by the model named...     ← 环境信息
Working directory: /path/to/project       ← 环境信息
...                                       ← AGENTS.md 内容（如有）
```

**场景 2：你的 Agent 无 prompt**

```markdown
---
description: 通用助手
mode: subagent
---
（正文为空）
```

实际发送给模型的是：
```
You are OpenCode, the best coding agent... ← Provider 默认
You are powered by the model named...       ← 环境信息
Working directory: /path/to/project         ← 环境信息
...                                         ← AGENTS.md 内容（如有）
```

> **来源**：`session/llm.ts:67-80`、`session/system.ts:19-27`

---

## 创建第一个 Agent（JSON 方式）

在 `opencode.json` 中配置。这与 Markdown 方式等效，适合配置简单的 Agent 或进行覆盖配置。

### 配置合并规则

你可以混合使用 Markdown 和 JSON。如果同名 Agent 存在于两处，规则如下：

1. **JSON 配置优先级更高**：`opencode.json` 中的字段会覆盖 `.md` 中的同名字段。
2. **场景**：通常用 `.md` 定义 Prompt（因为长文本好写），用 `opencode.json` 微调参数（如临时禁用、修改模型）。

### JSON 配置示例

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "code-reviewer": {
      "description": "代码审查专家，专注安全、性能、可维护性。适用于 PR 审查、代码健康检查。",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "temperature": 0.2,
      "steps": 30,
      "color": "#4CAF50",
      "prompt": "你是代码审查专家。\n\n## 检查要点\n- 安全漏洞（SQL注入、XSS、硬编码密钥）\n- 性能问题（时间复杂度、资源泄漏）\n- 代码风格（命名、结构、可读性）\n- 可维护性（耦合度、测试覆盖）\n\n## 输出格式\n- 🔴 严重问题（必须修复，说明风险和修复方案）\n- 🟡 建议改进（推荐修复，说明原因）\n- 🟢 优点（值得保持）\n\n## 约束条件\n- ✅ 问题要具体到行号\n- ✅ 每个问题都要有修复建议\n- ❌ 避免只批评不给方案"
    }
  }
}
```

### 使用外部 Prompt 文件

当 prompt 很长时，可以引用外部文件：

```jsonc
{
  "agent": {
    "code-reviewer": {
      "description": "代码审查专家",
      "mode": "subagent",
      "prompt": "{file:./prompts/code-reviewer.txt}"
    }
  }
}
```

> 路径相对于配置文件所在目录。

---

## 使用 Agent

### 切换 Primary Agent

按 **Tab** 键在 primary agent 之间切换（如 build ↔ plan）。

也可以使用快捷键 `<Leader>+a` 打开 Agent 列表选择。

### 调用 Subagent

**方式 1：手动 @ 提及**

```
@docs-writer 帮我写一个 README
```

**方式 2：自动调用**

主 Agent 会根据任务描述和 subagent 的 `description` 自动选择合适的 subagent。

> 这就是为什么 `description` 很重要——它决定了 Agent 何时被自动选中。

### 会话导航

当 subagent 创建子会话时：

| 快捷键 | 作用 |
|--------|------|
| `<Leader>+→` | 向前切换（父 → 子1 → 子2 → 父） |
| `<Leader>+←` | 向后切换 |
| `<Leader>+↑` | 返回父会话 |

---

## 禁用 Agent

在 `opencode.json` 中禁用不需要的内置 Agent：

```jsonc
{
  "agent": {
    "explore": {
      "disable": true
    },
    "general": {
      "disable": true
    }
  }
}
```

---

## 设置默认 Agent

启动 OpenCode 时默认使用哪个 primary agent：

```jsonc
{
  "default_agent": "plan"  // 默认使用 plan agent
}
```

> 如果不设置，默认是 `build`。
> 
> 来源：`config.ts:817-821`

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| Agent 没出现 | 文件位置不对 | 确认在 `agent/` 目录下，不是 `agents/` |
| Agent 不遵守指令 | prompt 太长或太模糊 | 精简核心规则，结构化 |
| mode 不对 | 用了 `plan` 或 `build` | 应为 `primary` / `subagent` / `all` |
| description 报必填错误 | 版本问题 | 实际是可选的，建议还是填写 |
| maxSteps 不生效 | 已废弃 | 使用 `steps` 替代 |
| color 格式错误 | 不是有效值 | 使用 `#RRGGBB` 或主题色名（`primary`/`accent` 等） |
| 嵌套目录 Agent 名称 | 不知道怎么调用 | 不设置 `name` 时名称包含路径：`folder/agent-name`；设置 `name` 后会覆盖默认名称 |

---

## 本课小结

你学会了：

1. **Agent 本质**：可配置的 AI 人格
2. **两种类型**：Primary（主）和 Subagent（子）
3. **七个内置 Agent**：build、plan、general、explore + 3 个隐藏
4. **两种配置方式**：Markdown 和 JSON
5. **使用方式**：Tab 切换、@ 提及、自动调用

---

## 下一课预告

> 学会了创建 Agent，但如何设计一个**好用**的 Agent？下一课我们将学习 Agent 设计模式，包括业界最佳实践和实战案例。

**下一课**：[5.2b Agent 设计模式](./02b-agent-patterns)

::: tip 遇到问题？
Agent 配置卡住了？[加入社群](/community)，和 2000+ 同路人一起交流，实时答疑。
:::
