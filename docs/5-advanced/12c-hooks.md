---
title: 5.12c Hook 教程
subtitle: 插件钩子与配置钩子全解
course: OpenCode 中文实战课
stage: 第五阶段
lesson: "5.12c"
duration: 25 分钟
practice: 30 分钟
level: 进阶
description: 系统学习 OpenCode Hook（插件钩子/配置钩子），掌握事件订阅、工具拦截、LLM 参数改写、权限控制等关键能力。
tags:
  - 钩子
  - Hook
  - 插件
  - 扩展
prerequisite:
  - 5.12a 插件基础
  - 5.12b 插件进阶（推荐先学）
---

# Hook 教程

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/5-advanced/hooks-notes.mini.jpeg" 
     alt="Hook 教程学霸笔记" 
     data-zoom-src="/images/5-advanced/hooks-notes.jpeg" />

---

> 💡 **一句话总结**：Hook 是 OpenCode 的"扩展接口"，你可以在事件发生时执行逻辑，或在关键流程中拦截并修改数据。

---

## 学完你能做什么

> 不吹牛，只写「立刻能干」的事

- 知道 OpenCode 支持哪些 Hook（插件 Hook / 配置 Hook）
- 选择正确的 Hook：事件监听 vs 功能拦截
- 写出常见 Hook：通知、审计、安全拦截、参数调优、上下文压缩增强

---

## 你现在的困境

> 如果你正在经历这些，这课就是给你的

- 想在会话完成后自动运行脚本，但不知道该在哪里配置
- 想禁止 AI 读取某些敏感文件，找不到合适的地方拦截
- 看到别人提到"Hook"，不知道和插件是什么关系
- 想根据不同 Agent 自动调整 LLM 参数，不知道从哪里入手

---

## 什么时候用这一招

> 不是每天都用，但用到就很爽

- 当你需要：
  - 在特定事件发生时执行自定义逻辑（通知、日志、审计）
  - 拦截工具调用并修改参数或阻止执行
  - 修改 LLM 调用参数（温度、top_p 等）
  - 自定义权限决策逻辑
  - 增强会话压缩的上下文
- 而且不想：
  - 修改 OpenCode 源码
  - 每次都手动执行这些操作

---

## 🎒 开始前的准备

> 确保你已经完成以下事项，否则请先停下

- [ ] 完成了 [5.12a 插件基础](./12a-plugins-basics)
- [ ] 完成了 [5.12b 插件进阶](./12b-plugins-advanced)（推荐）
- [ ] 有一个运行中的 OpenCode 项目
- [ ] 可以访问 `~/.config/opencode/` 或项目目录的 `.opencode/` 文件夹

---

## 核心思路

> 先讲「怎么想」，不讲命令

- Hook 本质是一组"可插拔的回调函数"
- OpenCode 在特定时机触发 Hook，把控制权交给你
- 有两种 Hook 途径：
  - **插件 Hook**：写代码，返回 hooks 对象（更强大、更灵活）
  - **配置 Hook**：在 `opencode.json` 里配置命令（更简单，但功能有限）
- 事件 Hook 被动监听，不做修改（日志、通知）
- 功能 Hook 主动拦截，可以修改数据（参数改写、权限控制）

---

### 🆕 v1.1.65 新增 Hook

| Hook | 说明 | 用途 |
|-----|------|------|
| `tool.definition` | 修改工具定义 | 自定义工具描述、调整参数 Schema |
| `command.execute.before` | 命令执行前拦截 | 修改命令参数、添加日志 |
| `shell.env` | Shell 执行前 | 注入环境变量 |

---

## 跟我做

> 一步一步来，假设你会犯错

### 第 1 步：创建你的第一个插件 Hook

**为什么**  
先做一个最简单的会话完成通知，验证整个流程能跑通。

```bash
# 在项目目录创建插件文件
mkdir -p .opencode/plugin
```

```ts
// .opencode/plugin/notify.ts
import type { Plugin } from "@opencode-ai/plugin"

export const NotifyPlugin: Plugin = async ({ $ }) => {
  return {
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        await $`osascript -e 'display notification "会话已完成" with title "OpenCode"'`
      }
    },
  }
}
```

**你应该看到**：  
OpenCode 启动时会加载这个插件，会话完成后会弹出通知。

---

### 第 2 步：实现敏感文件拦截

<AdInArticle />

**为什么**  
用 `tool.execute.before` Hook 拦截工具调用，阻止 AI 读取敏感文件。

```ts
// .opencode/plugin/guard.ts
import type { Plugin } from "@opencode-ai/plugin"

export const GuardPlugin: Plugin = async () => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool !== "read") return

      const filePath = String(output.args.filePath)
      const sensitivePatterns = [".env", ".pem", ".key", "credentials"]

      for (const pattern of sensitivePatterns) {
        if (filePath.includes(pattern)) {
          throw new Error(`安全策略：禁止读取敏感文件：${filePath}`)
        }
      }
    },
  }
}
```

**你应该看到**：  
尝试让 AI 读取 `.env` 文件时，会抛出错误并阻止执行。

---

### 第 3 步：根据 Agent 调整 LLM 参数

**为什么**  
不同场景需要不同的参数配置，用 `chat.params` Hook 自动调整。

```ts
// .opencode/plugin/params.ts
import type { Plugin } from "@opencode-ai/plugin"

export const ParamsPlugin: Plugin = async () => {
  return {
    "chat.params": async (input, output) => {
      // 代码生成需要更确定性的输出
      if (input.agent === "code") {
        output.temperature = 0.2
      }

      // 规划任务需要更多创造性
      if (input.agent === "plan") {
        output.temperature = 0.7
      }

      // 添加自定义追踪头
      output.options["X-Trace-Session"] = input.sessionID
    },
  }
}
```

**你应该看到**：  
不同 Agent 会话的 LLM 参数自动变化。

---

### 第 4 步：自动决策权限请求

**为什么**  
减少手动确认次数，对安全的操作自动批准。

```ts
// .opencode/plugin/auto-permit.ts
import type { Plugin } from "@opencode-ai/plugin"

export const AutoPermitPlugin: Plugin = async () => {
  return {
    "permission.ask": async (input, output) => {
      // 读取操作自动允许
      if (input.tool === "read") {
        output.status = "allow"
        return
      }

      // 危险命令自动拒绝
      if (input.tool === "bash" && String(input.metadata?.command).includes("rm -rf")) {
        output.status = "deny"
        return
      }

      // 其他操作保持询问
      output.status = "ask"
    },
  }
}
```

**你应该看到**：  
读取文件不再弹出权限提示，但删除命令会被阻止。

---

### 第 5 步：增强会话压缩上下文

**为什么**  
当对话过长需要压缩时，注入项目特定的关键信息。

```ts
// .opencode/plugin/compaction.ts
import type { Plugin } from "@opencode-ai/plugin"

export const CompactionPlugin: Plugin = async () => {
  return {
    "experimental.session.compacting": async (input, output) => {
      output.context.push(`
## 项目关键信息
- 正在修改的文件：src/**
- 关键约束：禁止读取 .env、密钥文件
- 当前任务：实现 Hook 教程并加入侧边栏
- 重要决策：使用 TypeScript 严格模式
`)
    },
  }
}
```

**你应该看到**：  
当对话被压缩时，压缩后的上下文会包含你的自定义信息。

---

### 第 6 步：修改工具定义（v1.1.65+）

**为什么**  
在某些场景下，你可能需要修改工具的描述或参数 Schema，让 AI 更好地理解工具用途，或添加额外约束。

```ts
// .opencode/plugin/tool-definition.ts
import type { Plugin } from "@opencode-ai/plugin"

export const ToolDefinitionPlugin: Plugin = async () => {
  return {
    "tool.definition": async (input, output) => {
      // 为 read 工具添加中文描述
      if (input.toolID === "read") {
        output.description = "读取文件内容。支持文本文件和图片。路径必须是绝对路径。"
      }

      // 为 bash 工具添加安全提示
      if (input.toolID === "bash") {
        output.description += "\n\n⚠️ 注意：危险命令（如 rm -rf）需要用户确认。"
      }

      // 修改参数 Schema（例如添加默认值或约束）
      if (input.toolID === "write" && output.parameters?.properties?.filePath) {
        output.parameters.properties.filePath.description = "文件绝对路径，必须以 / 开头"
      }
    },
  }
}
```

**你应该看到**：  
AI 调用工具时会使用修改后的描述和参数定义。

---

## 检查点 ✅

> 全部通过才能继续；任一项失败，回到第 X 步重来

- [ ] 插件文件放在 `.opencode/plugin/` 目录
- [ ] OpenCode 启动时加载了插件（查看启动日志）
- [ ] 会话完成后收到了通知
- [ ] 尝试读取 `.env` 时抛出了错误
- [ ] 不同 Agent 会话的参数有变化
- [ ] 权限请求的行为符合预期
- [ ] （v1.1.65+）工具定义被成功修改

---

## 踩坑提醒

> 80% 的人会卡在这里

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 插件未加载 | 文件扩展名错误 | 确保是 `.ts` 或 `.js` 文件 |
| `output` 修改无效 | 返回了新对象而非修改原对象 | 直接修改 `output.xxx = ...` |
| 事件没触发 | `event.type` 拼写错误 | 用 TypeScript 获得类型提示 |
| 实验性 Hook 失效 | 版本更新后 API 变化 | 查看更新日志，调整代码 |
| 配置 Hook 不生效 | 可能未实现执行逻辑 | 优先使用插件 Hook |
| 多个插件冲突 | Hook 重复定义 | 检查是否有重复的 Hook 实现 |

---

## 本课小结

你学会了：

1. 理解 Hook 的两种类型（插件 Hook / 配置 Hook）
2. 选择合适的 Hook 类型解决问题
3. 实现常见的 Hook 场景（通知、拦截、调参、权限、压缩）
4. 遵循 Hook 编写的最佳实践

---

## 下一课预告

> 下一课我们将学习自定义工具，需要用到本课的 Hook 和插件知识。

---

## 快速查阅：常用 Hook

> 开发时最常用的 10 个 Hook，快速参考

| Hook | 触发时机 | 用途 | 是否可修改数据 |
|-----|---------|------|---------------|
| `event` | 所有事件 | 统一订阅，日志/通知/统计 | ❌ |
| `config` | 配置加载后 | 初始化插件，修改配置 | ✅ |
| `tool.execute.before` | 工具执行前 | 拦截/修改参数，阻止执行 | ✅ |
| `tool.execute.after` | 工具执行后 | 记录结果，修改输出 | ✅ |
| `chat.message` | 新消息接收时 | 记录/修改消息内容 | ✅ |
| `chat.params` | LLM 调用前 | 修改温度/Top-P/Top-K | ✅ |
| `permission.ask` | 权限请求时 | 自动允许/拒绝 | ✅ |
| `tool` | 注册工具 | 添加自定义工具 | - |
| `experimental.session.compacting` | 会话压缩前 | 注入项目关键信息 | ✅ |
| `tool.definition` | 工具注册时 | 修改工具描述/参数 | ✅ |
| `command.execute.before` | 命令执行前 | 拦截/修改命令参数 | ✅ |
| `shell.env` | Shell 执行前 | 注入环境变量 | ✅ |
| `auth` | 认证流程 | 自定义认证方式 | - |

---

## 快速查阅：常用事件

> 开发时最常用的 10 个事件，快速参考

| 事件 | 说明 | Hook 用途 |
|-----|------|-----------|
| `session.idle` | 会话完成（空闲） | 发送通知、清理资源、记录耗时 |
| `session.created` | 新会话创建 | 初始化会话级状态 |
| `file.edited` | 文件被编辑 | 触发格式化、触发构建 |
| `message.updated` | 消息更新 | 记录对话历史、统计 |
| `tool.execute.after` | 工具执行后 | 记录日志、审计追踪 |
| `tool.execute.before` | 工具执行前 | 参数验证、权限检查 |
| `permission.replied` | 用户响应权限 | 记录权限决策 |
| `command.executed` | 命令执行后 | 命令审计 |
| `session.error` | 会话错误 | 错误上报、通知 |
| `server.connected` | 服务器连接 | 连接状态通知 |

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

| 功能 | 文件路径 | 行号 |
|-----|---------|------|
| Hook 类型定义 | [`packages/plugin/src/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/plugin/src/index.ts) | 148-231 |
| `tool.definition` Hook 定义 | [`packages/plugin/src/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/plugin/src/index.ts) | 227-230 |
| `tool.definition` Hook 触发 | [`packages/opencode/src/tool/registry.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/tool/registry.ts) | 157 |
| 插件加载逻辑 | [`packages/opencode/src/plugin/index.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/plugin/index.ts) | 20-82 |
| 插件目录扫描 | [`packages/opencode/src/config/config.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts) | 322-335 |
| 插件去重逻辑 | [`packages/opencode/src/config/config.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts) | 369-387 |
| 配置 Hook Schema | [`packages/opencode/src/config/config.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/opencode/src/config/config.ts) | 1009-1030 |

**关键代码片段**：

```typescript
// Hook 类型定义
export interface Hooks {
  event?: (input: { event: Event }) => Promise<void>
  config?: (input: Config) => Promise<void>
  tool?: { [key: string]: ToolDefinition }
  auth?: AuthHook
  "chat.message"?: (input: {...}, output: {...}) => Promise<void>
  "chat.params"?: (input: {...}, output: {...}) => Promise<void>
  "permission.ask"?: (input: Permission, output: {...}) => Promise<void>
  "tool.execute.before"?: (input: {...}, output: {...}) => Promise<void>
  "tool.execute.after"?: (input: {...}, output: {...}) => Promise<void>
  "command.execute.before"?: (input: { command: string; sessionID: string; arguments: string }, output: {...}) => Promise<void>
  "shell.env"?: (input: { cwd: string }, output: { env: Record<string, string> }) => Promise<void>
  "tool.definition"?: (input: { toolID: string }, output: { description: string; parameters: any }) => Promise<void>
  "experimental.chat.messages.transform"?: (input: {}, output: {...}) => Promise<void>
  "experimental.chat.system.transform"?: (input: {}, output: {...}) => Promise<void>
  "experimental.session.compacting"?: (input: {...}, output: {...}) => Promise<void>
  "experimental.text.complete"?: (input: {...}, output: {...}) => Promise<void>
}

// 插件加载
export async function trigger<Name extends keyof Required<Hooks>>(name: Name, input: Input, output: Output): Promise<Output> {
  if (!name) return output
  for (const hook of await state().then((x) => x.hooks)) {
    const fn = hook[name]
    if (!fn) continue
    await fn(input, output)
  }
  return output
}
```

</details>
