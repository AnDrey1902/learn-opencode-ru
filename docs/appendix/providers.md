---
title: 模型提供商列表
description: OpenCode 支持的 75+ 模型提供商完整列表
---

# 模型提供商列表

> OpenCode 基于 AI SDK 和 Models.dev 支持 75+ 模型提供商

---

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/appendix/providers-notes.mini.jpeg"
     alt="模型提供商列表学霸笔记"
     data-zoom-src="/images/appendix/providers-notes.jpeg" />

---

## 配置方式

添加提供商需要两步：

1. 使用 `/connect` 命令添加 API Key（存储在 `~/.local/share/opencode/auth.json`）
2. 在 `opencode.json` 中配置提供商（可选，用于自定义选项）

---

## OpenCode Zen（推荐新手）

OpenCode 官方提供的测试验证模型列表，开箱即用。

```bash
# 1. 在 TUI 中运行
/connect

# 2. 选择 opencode，访问 opencode.ai/auth 获取 API Key

# 3. 查看可用模型
/models
```

**获取 API Key**：[opencode.ai/auth](https://opencode.ai/auth)

---

## 国产模型

<AdInArticle />

### DeepSeek（深度求索）

国内直连，性价比高。

| 模型 | 说明 |
|------|------|
| `deepseek-chat` | 通用对话 |
| `deepseek-reasoner` | 推理模型（R1） |

**配置步骤**：
```bash
# 1. 运行 /connect，搜索 DeepSeek
/connect

# 2. 输入 API Key

# 3. 选择模型
/models
```

**获取 API Key**：[platform.deepseek.com](https://platform.deepseek.com)

---

### Moonshot AI（月之暗面）

Kimi K2 模型。

| 模型 | 说明 |
|------|------|
| `kimi-k2` | 最新模型 |

**配置步骤**：
```bash
/connect  # 搜索 Moonshot AI
```

**获取 API Key**：[platform.moonshot.ai](https://platform.moonshot.ai)

---

### MiniMax

| 模型 | 说明 |
|------|------|
| `M2.7` | 最新模型 |

**配置步骤**：
```bash
/connect  # 搜索 MiniMax
```

**获取 API Key**：[platform.minimax.io](https://platform.minimax.io)

---

### Z.AI（智谱）

提供 GLM 系列模型。

| 模型 | 说明 |
|------|------|
| `GLM-5` | 最新模型 |

**配置步骤**：
```bash
/connect  # 搜索 Z.AI
# 如果订阅了 GLM Coding Plan，选择 Z.AI Coding Plan
```

**获取 API Key**：[z.ai](https://z.ai/manage-apikey/apikey-list)

---

## 国际模型

### Anthropic Claude

| 模型 | 说明 |
|------|------|
| `claude-sonnet-4-20250514` | 最新平衡版（推荐） |
| `claude-opus-4-20250514` | 最强模型 |
| `claude-3-5-haiku-20241022` | 快速模型 |

**配置方式**：
```bash
/connect  # 选择 Anthropic

# 可选：
# - Claude Pro/Max（浏览器授权）
# - Create an API Key（创建新 Key）
# - Manually enter API Key（手动输入）
```

**获取 API Key**：[console.anthropic.com](https://console.anthropic.com)

---

### OpenAI

| 模型 | 说明 |
|------|------|
| `gpt-4o` | 旗舰多模态 |
| `gpt-4o-mini` | 经济版 |
| `o1` | 推理模型 |
| `o3-mini` | 最新推理 |

**配置方式**：
```bash
/connect  # 搜索 OpenAI
```

**获取 API Key**：[platform.openai.com](https://platform.openai.com)

---

### Google Gemini

通过 Vertex AI 使用。

| 模型 | 说明 |
|------|------|
| `gemini-2.0-flash` | 最新快速版 |
| `gemini-2.0-pro` | 专业版 |
| `gemini-1.5-pro` | 长上下文 |

**配置方式**：
```bash
# 设置 Google Cloud 项目 ID（必需）
export GOOGLE_CLOUD_PROJECT=your-project-id
# 或使用 GCP_PROJECT / GCLOUD_PROJECT 也可

# 设置区域（可选，默认 us-east5）
export VERTEX_LOCATION=us-east5
# 或使用 GOOGLE_CLOUD_LOCATION 也可
```

> Google Vertex AI 需要通过 `gcloud auth application-default login` 或服务账号配置认证，OpenCode 会自动使用 Application Default Credentials。

---

### xAI Grok

| 模型 | 说明 |
|------|------|
| `grok-2` | 最新版本 |
| `grok-2-mini` | 经济版 |

**配置方式**：
```bash
/connect  # 搜索 xAI
```

**获取 API Key**：[console.x.ai](https://console.x.ai)

---

### Mistral

开源模型领导者，支持 Mistral Large、Codestral 等。

| 模型 | 说明 |
|------|------|
| `mistral-large-latest` | 最强能力 |
| `mistral-small-latest` | 快速响应 |
| `codestral-latest` | 代码优化 |

```bash
/connect  # 搜索 Mistral
```

**获取 API Key**：[console.mistral.ai](https://console.mistral.ai)

---

### Cohere

企业级 NLP 能力，支持 Rerank、Embed。

```bash
/connect  # 搜索 Cohere
```

**获取 API Key**：[dashboard.cohere.com](https://dashboard.cohere.com)

---

### Perplexity

集成搜索能力，实时信息获取。

```bash
/connect  # 搜索 Perplexity
```

**获取 API Key**：[perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)

> API Key 格式：`pplx-...`

---

### GitHub Copilot

使用 Copilot 订阅。

```bash
/connect  # 搜索 GitHub Copilot
# 访问 github.com/login/device 输入代码授权
```

> 部分模型需要 Pro+ 订阅，某些模型需在 GitHub Copilot 设置中手动启用。

---

## 云平台

### Amazon Bedrock

```bash
# 环境变量方式
AWS_PROFILE=my-profile opencode

# 或配置文件
```

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "amazon-bedrock": {
      "options": {
        "region": "us-east-1",
        "profile": "my-aws-profile"
      }
    }
  }
}
```

---

### Azure OpenAI

```bash
/connect  # 搜索 Azure OpenAI
```

> - 如遇 "I'm sorry, but I cannot assist" 错误，将内容过滤器从 DefaultV2 改为 Default。
> - Azure OpenAI 通过 `/connect` 配置，认证信息会自动存储。

---

### Azure Cognitive Services

```bash
/connect  # 搜索 Azure Cognitive Services

# 设置资源名
export AZURE_COGNITIVE_SERVICES_RESOURCE_NAME=your-resource-name
```

---

### Cloudflare Workers AI

Cloudflare 边缘网络，全球低延迟。

```bash
/connect  # 搜索 Cloudflare Workers AI

# 或设置环境变量
export CLOUDFLARE_API_KEY=your-api-token
export CLOUDFLARE_ACCOUNT_ID=your-account-id
```

**获取 API Token**：[dash.cloudflare.com](https://dash.cloudflare.com) → My Profile → API Tokens

---

### GitLab

GitLab Duo Chat，与 GitLab 深度集成。

```bash
/connect  # 搜索 GitLab

# 企业版实例需设置
export GITLAB_INSTANCE_URL=https://gitlab.company.com
```

**获取 Token**：[gitlab.com](https://gitlab.com) → Settings → Access Tokens

> Token 格式：`glpat-...`

---

## 聚合平台

### OpenRouter

一个 API Key 访问 100+ 模型。

```bash
/connect  # 搜索 OpenRouter
```

**自定义模型**：
```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openrouter": {
      "models": {
        "moonshotai/kimi-k2": {
          "options": {
            "provider": {
              "order": ["baseten"],
              "allow_fallbacks": false
            }
          }
        }
      }
    }
  }
}
```

**获取 API Key**：[openrouter.ai](https://openrouter.ai)

---

### Groq

超快推理速度。

```bash
/connect  # 搜索 Groq
```

**获取 API Key**：[console.groq.com](https://console.groq.com)

---

### Cerebras

超快推理，支持 Qwen3 Coder 480B。

```bash
/connect  # 搜索 Cerebras
```

**获取 API Key**：[inference.cerebras.ai](https://inference.cerebras.ai)

---

### Fireworks AI

```bash
/connect  # 搜索 Fireworks AI
```

**获取 API Key**：[app.fireworks.ai](https://app.fireworks.ai)

---

### Deep Infra

```bash
/connect  # 搜索 Deep Infra
```

**获取 API Key**：[deepinfra.com/dash](https://deepinfra.com/dash)

---

### Together AI

```bash
/connect  # 搜索 Together AI
```

**获取 API Key**：[api.together.ai](https://api.together.ai)

---

### Hugging Face

访问 17+ 提供商的开源模型。

```bash
/connect  # 搜索 Hugging Face
```

**获取 Token**：[huggingface.co/settings/tokens](https://huggingface.co/settings/tokens/new?ownUserPermissions=inference.serverless.write&tokenType=fineGrained)

---

### Baseten

```bash
/connect  # 搜索 Baseten
```

**获取 API Key**：[app.baseten.co](https://app.baseten.co)

---

### Cortecs

支持 Kimi K2 Instruct。

```bash
/connect  # 搜索 Cortecs
```

**获取 API Key**：[cortecs.ai](https://cortecs.ai)

---

### Nebius Token Factory

```bash
/connect  # 搜索 Nebius Token Factory
```

**获取 API Key**：[tokenfactory.nebius.com](https://tokenfactory.nebius.com)

---

### IO.NET

提供 17+ 模型。

```bash
/connect  # 搜索 IO.NET
```

**获取 API Key**：[ai.io.net](https://ai.io.net)

---

### Venice AI

```bash
/connect  # 搜索 Venice AI
```

**获取 API Key**：[venice.ai](https://venice.ai)

---

### OVHcloud AI Endpoints

```bash
/connect  # 搜索 OVHcloud AI Endpoints
```

**获取 API Key**：[ovh.com/manager](https://ovh.com/manager) → Public Cloud → AI & Machine Learning → AI Endpoints

---

### SAP AI Core

访问 40+ 模型（OpenAI、Anthropic、Google、Amazon、Meta 等）。

```bash
/connect  # 搜索 SAP AI Core
```

需要输入 Service Key JSON（包含 `clientid`、`clientsecret`、`url`、`serviceurls.AI_API_URL`）。

---

### Cloudflare AI Gateway

通过 Cloudflare 统一访问多个提供商，支持统一计费。

```bash
# 设置环境变量
export CLOUDFLARE_ACCOUNT_ID=your-account-id
export CLOUDFLARE_GATEWAY_ID=your-gateway-id

/connect  # 搜索 Cloudflare AI Gateway
```

---

### Vercel AI Gateway

通过 Vercel 统一访问多个提供商，按成本定价无加价。

```bash
/connect  # 搜索 Vercel AI Gateway
```

**配置路由顺序**：
```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "vercel": {
      "models": {
        "anthropic/claude-sonnet-4": {
          "options": {
            "order": ["anthropic", "vertex"]
          }
        }
      }
    }
  }
}
```

---

### Helicone

LLM 可观测平台，提供日志、监控和分析。

```bash
/connect  # 搜索 Helicone
```

**获取 API Key**：[helicone.ai](https://helicone.ai)

**自定义请求头**：
```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "helicone": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Helicone",
      "options": {
        "baseURL": "https://ai-gateway.helicone.ai",
        "headers": {
          "Helicone-Cache-Enabled": "true",
          "Helicone-User-Id": "opencode"
        }
      }
    }
  }
}
```

---

### ZenMux

```bash
/connect  # 搜索 ZenMux
```

**获取 API Key**：[zenmux.ai/settings/keys](https://zenmux.ai/settings/keys)

---

### Ollama Cloud

云端 Ollama 服务。

```bash
/connect  # 搜索 Ollama Cloud
```

> 使用前需先本地拉取模型信息：`ollama pull gpt-oss:20b-cloud`

**获取 API Key**：[ollama.com](https://ollama.com) → Settings → Keys

---

## 本地模型

### Ollama

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://localhost:11434/v1"
      },
      "models": {
        "llama3.1": {
          "name": "Llama 3.1"
        }
      }
    }
  }
}
```

> 如果工具调用不工作，尝试增加 Ollama 的 `num_ctx`，建议 16k-32k。

**安装**：[ollama.ai](https://ollama.ai)

---

### LM Studio

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "lmstudio": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LM Studio (local)",
      "options": {
        "baseURL": "http://127.0.0.1:1234/v1"
      },
      "models": {
        "google/gemma-3n-e4b": {
          "name": "Gemma 3n-e4b (local)"
        }
      }
    }
  }
}
```

**安装**：[lmstudio.ai](https://lmstudio.ai)

---

### llama.cpp

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "llama.cpp": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "llama-server (local)",
      "options": {
        "baseURL": "http://127.0.0.1:8080/v1"
      },
      "models": {
        "qwen3-coder:a3b": {
          "name": "Qwen3-Coder: a3b-30b (local)",
          "limit": {
            "context": 128000,
            "output": 65536
          }
        }
      }
    }
  }
}
```

---

## 自定义提供商

添加任何 OpenAI 兼容的提供商：

```bash
# 1. 运行 /connect，选择 Other
/connect

# 2. 输入提供商 ID（如 myprovider）

# 3. 输入 API Key
```

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "myprovider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My Provider",
      "options": {
        "baseURL": "https://api.myprovider.com/v1"
      },
      "models": {
        "my-model": {
          "name": "My Model",
          "limit": {
            "context": 200000,
            "output": 65536
          }
        }
      }
    }
  }
}
```

**配置选项**：
- `npm` - AI SDK 包名，OpenAI 兼容用 `@ai-sdk/openai-compatible`
- `name` - UI 显示名称
- `options.baseURL` - API 端点
- `options.apiKey` - API Key（可选，不用 auth 时设置）
- `options.headers` - 自定义请求头
- `models` - 可用模型列表
- `limit.context` - 最大输入 token
- `limit.output` - 最大输出 token

---

## 自定义 Base URL

为任何提供商设置自定义端点（如代理服务）：

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "baseURL": "https://my-proxy.com/v1"
      }
    }
  }
}
```

---

## 模型选择指南

| 需求 | 推荐 | 理由 |
|------|------|------|
| 国内使用最简单 | DeepSeek | 国内直连，中文好 |
| 最强推理能力 | Claude Opus 4 | 业界最强 |
| 性价比最高 | DeepSeek | 便宜好用 |
| 代码能力最强 | Claude Sonnet 4 | 专业编程 |
| 长文档处理 | Gemini 1.5 Pro | 超长上下文 |
| 完全离线 | Ollama + Llama3.1 | 本地运行 |
| 多模型切换 | OpenRouter | 一个 Key 用所有 |

---

## 故障排查

1. **检查认证**：运行 `opencode auth list` 查看已配置的凭证

2. **自定义提供商问题**：
   - 确保 `/connect` 中的提供商 ID 与配置文件一致
   - 使用正确的 npm 包（如 `@ai-sdk/openai-compatible`）
   - 检查 `options.baseURL` 是否正确

---

## 相关资源

- [连接模型](../1-start/04-connect) - 配置教程
- [配置选项参考](./config-ref) - 配置文件详解
