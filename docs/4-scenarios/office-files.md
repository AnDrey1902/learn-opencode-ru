---
title: C1 文件整理
subtitle: 批量重命名、分类归档
course: OpenCode 中文实战课
stage: 第四阶段
lesson: "C1"
duration: 15 分钟
practice: 20 分钟
level: 新手
description: 用 AI 批量重命名文件、分类归档、检索文件内容，提升文件管理效率。
tags:
  - 文件
  - 整理
  - 批量处理
prerequisite:
  - 2.1 界面与基础操作
---

# C1 文件整理

> 💡 **一句话总结**：用 AI 批量重命名、分类归档、检索文件内容。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/4-scenarios/office-files-notes.mini.jpeg"
     alt="C1 文件整理学霸笔记"
     data-zoom-src="/images/4-scenarios/office-files-notes.jpeg" />

---

## 学完你能做什么

- 批量重命名文件
- 按规则分类归档
- 检索文件内容
- 整理混乱的文件夹

---

## 你现在的困境

- 下载文件夹乱七八糟，找东西找不到
- 想批量重命名，但一个个改太累
- 记得有个文件包含某内容，但忘了叫什么名

---

## 什么时候用这一招

- 当你需要：整理混乱的文件夹
- 而且不想：手动一个个操作文件

---

## 🎒 开始前的准备

> 确保你已经完成以下事项：

- [ ] 完成了 [2.1 界面与基础操作](../2-daily/01-interface)
- [ ] 有一个需要整理的文件夹

---

## 核心思路

### 文件整理三步法

```
分析现状 → 制定规则 → 批量执行
```

### 可用工具（本课只讲 OpenCode 相关能力）

| 工具 | 用途 | 关键参数/行为（可验证） |
|-----|------|----------------------|
| `list` | 列出目录（树形结构） | `path`（绝对路径，可省略表示当前目录）、`ignore`（额外忽略 glob 列表）；最多返回 100 个文件（源码：`opencode/packages/opencode/src/tool/ls.ts:35`～`opencode/packages/opencode/src/tool/ls.ts:60`） |
| `glob` | 按模式查找文件（如 `**/*.jpg`） | `pattern`、`path`（可选）；最多返回 100 条并按修改时间排序（源码：`opencode/packages/opencode/src/tool/glob.ts:33`～`opencode/packages/opencode/src/tool/glob.ts:63`） |
| `grep` | 搜索文件内容（正则） | `pattern`、`include`；最多返回 100 条匹配并按修改时间排序（源码：`opencode/packages/opencode/src/tool/grep.ts:88`～`opencode/packages/opencode/src/tool/grep.ts:92`） |
| `bash` | 执行命令 | `workdir`（可选，避免 `cd && ...`）、`timeout`（毫秒，默认 2 分钟：`opencode/packages/opencode/src/tool/bash.ts:20`～`opencode/packages/opencode/src/tool/bash.ts:80`）；输出默认最多 30000 字符（源码：`opencode/packages/opencode/src/tool/bash.ts:19`～`opencode/packages/opencode/src/tool/bash.ts:36`） |

::: tip 技巧
- 在 TUI 里，你也可以用 `!` 开头直接跑命令（官方：`opencode/packages/web/src/content/docs/tui.mdx:46`～`opencode/packages/web/src/content/docs/tui.mdx:55`）。
- `@文件` 引用会把文件内容注入上下文（官方：`opencode/packages/web/src/content/docs/tui.mdx:30`～`opencode/packages/web/src/content/docs/tui.mdx:43`）。
:::

### 常见整理需求

| 需求 | 示例 |
|-----|------|
| 批量重命名 | 照片按日期命名 |
| 分类归档 | 按类型分到不同文件夹 |
| 内容检索 | 找包含某关键词的文件 |
| 去重清理 | 删除重复文件（建议先 dry-run/列清单） |

---

## 跟我做

### 第 1 步：分析当前文件夹

<AdInArticle />

**为什么**
先了解有什么文件，才能制定整理规则。

进入目标文件夹启动 OpenCode：

```bash
cd ~/Downloads  # 换成你要整理的目录
opencode
```

> 也可以直接：`opencode /path/to/project`（官方：`opencode/packages/web/src/content/docs/tui.mdx:16`～`opencode/packages/web/src/content/docs/tui.mdx:20`）。

#### 方法一：使用 list 工具查看目录结构

```
列出当前目录的文件和子目录（树形结构），并告诉我：
1. 大致有哪些子目录
2. 文件类型分布（图片/文档/压缩包等）
3. 哪些命名看起来像一类
```

::: tip 技巧
- `list.path` 要求是绝对路径（参数描述：`opencode/packages/opencode/src/tool/ls.ts:39`～`opencode/packages/opencode/src/tool/ls.ts:42`）。
- `list` 最多返回 100 个文件；若目录很大，建议先用 `glob` 缩小范围（源码：`opencode/packages/opencode/src/tool/ls.ts:35`～`opencode/packages/opencode/src/tool/ls.ts:60`）。
:::

#### 方法二：使用 glob 工具按模式查找

```
查找所有图片文件（例如 jpg/png/gif），并按修改时间从新到旧列出
```

```
查找所有 PDF 文件（**/*.pdf）
```

::: tip 技巧
- `glob` 结果按修改时间排序（源码：`opencode/packages/opencode/src/tool/glob.ts:54`～`opencode/packages/opencode/src/tool/glob.ts:55`）。
- `glob` 最多返回 100 条；如果你只看到一部分结果，说明被截断了（源码：`opencode/packages/opencode/src/tool/glob.ts:40`～`opencode/packages/opencode/src/tool/glob.ts:63`）。
:::

#### 方法三：综合分析（Plan 模式）

切换到 Plan 模式：

```
分析这个目录的文件情况：
1. 有多少个文件和子目录（如果你拿不到精确数量，请说明原因）
2. 文件类型分布（图片、文档、视频等）
3. 命名规律分析
4. 建议的整理方案（先给“规则”，再给“执行步骤”）
```

### 第 2 步：批量重命名

**为什么**
统一命名便于管理。

#### 推荐：先列“改名清单”，再执行

```
把这个目录下所有的图片文件按以下规则重命名：
- 格式：照片_YYYYMMDD_序号.扩展名
- 日期从文件修改时间获取
- 序号从 001 开始

要求：
1. 先只输出“将要修改的文件清单（旧名→新名）”，不要执行
2. 我确认后再执行
```

::: warning ⚠️ 安全提醒
OpenCode 的“是否会提示确认”由 `permission` 决定。

- `permission` 支持 `allow/ask/deny`（官方：`opencode/packages/web/src/content/docs/permissions.mdx:14`～`opencode/packages/web/src/content/docs/permissions.mdx:18`）。
- `edit` 权限覆盖写入/修改/patch 等文件变更类操作（官方：`opencode/packages/web/src/content/docs/permissions.mdx:86`～`opencode/packages/web/src/content/docs/permissions.mdx:88`）。

如果你想强制每次改文件都确认，可在配置里设为 `ask`：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "ask"
  }
}
```
:::

#### 可选：用 bash + workdir（更可控）

如果你希望“脚本化 + 可回滚”，可以让 AI 先生成脚本，并用 `bash` 在指定目录运行。

::: tip 技巧
- `bash.workdir` 用来指定运行目录，避免 `cd && ...`（参数：`opencode/packages/opencode/src/tool/bash.ts:62`～`opencode/packages/opencode/src/tool/bash.ts:67`）。
- `bash.timeout` 单位是毫秒，默认 2 分钟（源码：`opencode/packages/opencode/src/tool/bash.ts:20`～`opencode/packages/opencode/src/tool/bash.ts:80`）。
:::

### 第 3 步：分类归档

**为什么**  
按类型分类更易查找。

```
把这个目录下的文件按类型分类到子目录：
- 图片（jpg, png, gif）→ 图片/
- 文档（pdf, doc, docx, txt）→ 文档/
- 视频（mp4, mov, avi）→ 视频/
- 其他 → 其他/

要求：
1. 先展示分类结果让我确认
2. 再执行移动
```

### 第 4 步：检索文件内容

**为什么**
找到包含特定内容的文件。

#### 使用 grep 工具搜索内容

```
搜索包含“发票”的所有 txt 和 md 文件
```

::: tip 技巧
- `grep` 使用正则表达式（参数：`opencode/packages/opencode/src/tool/grep.ts:12`～`opencode/packages/opencode/src/tool/grep.ts:16`）。
- 结果最多 100 条，且会按文件修改时间排序（源码：`opencode/packages/opencode/src/tool/grep.ts:88`～`opencode/packages/opencode/src/tool/grep.ts:92`）。
:::

### 第 5 步：整理完成确认

**为什么**  
确认整理结果符合预期。

```
总结一下刚才的整理工作：
1. 重命名了多少文件
2. 移动了多少文件
3. 最终的目录结构
```

---

## 检查点 ✅

> 全部通过才能继续

- [ ] 分析了文件夹现状
- [ ] 完成了批量重命名
- [ ] 完成了分类归档
- [ ] 能检索文件内容

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 文件被误删/误改 | 没先做清单/确认 | 先让 AI 输出“操作清单”，再执行 |
| 重命名规则不对 | 规则缺少可执行细节 | 补齐“格式/来源/序号/覆盖策略”等细节 |
| 只看到部分 `list/glob/grep` 结果 | 工具有返回上限（100 条） | 缩小范围：更具体的 `path/pattern/include` |
| `glob/grep` 没搜到你以为存在的文件 | ripgrep 默认遵守 `.gitignore` | 参考官方的 `.ignore` 机制（官方：`opencode/packages/web/src/content/docs/tools.mdx:348`～`opencode/packages/web/src/content/docs/tools.mdx:364`） |
| `list` 看不到某些目录 | `list` 额外内置了一批常见忽略目录 | 换用 `glob/grep` 直接定位；或查看 `list` 内置忽略列表（源码：`opencode/packages/opencode/src/tool/ls.ts:8`～`opencode/packages/opencode/src/tool/ls.ts:33`） |
| bash 命令在错误目录执行 | 没设置 `workdir` | 用 `workdir` 指定目录（源码：`opencode/packages/opencode/src/tool/bash.ts:62`～`opencode/packages/opencode/src/tool/bash.ts:67`） |

---

## 进阶技巧

### 1) 认识“忽略规则”来源

OpenCode 的 `glob/grep/list` 内部使用 ripgrep（官方：`opencode/packages/web/src/content/docs/tools.mdx:348`～`opencode/packages/web/src/content/docs/tools.mdx:352`），因此会遵守 `.gitignore`。

此外：`list` 工具还会额外忽略一批常见目录（源码：`opencode/packages/opencode/src/tool/ls.ts:8`～`opencode/packages/opencode/src/tool/ls.ts:33`），包括（去重后）：

- `node_modules/`
- `__pycache__/`
- `.git/`
- `dist/`, `build/`, `target/`
- `vendor/`
- `bin/`, `obj/`
- `.idea/`, `.vscode/`
- `.zig-cache/`, `zig-out`
- `.coverage`, `coverage/`
- `tmp/`, `temp/`
- `.cache/`, `cache/`, `logs/`
- `.venv/`, `venv/`, `env/`

### 2) 必要时让 ripgrep 搜“被忽略的目录”

官方文档给出一种做法：在项目根创建 `.ignore` 文件，显式允许某些路径被搜索（官方：`opencode/packages/web/src/content/docs/tools.mdx:354`～`opencode/packages/web/src/content/docs/tools.mdx:364`）。

```text
!node_modules/
!dist/
!build/
```

---

## 证据索引（本课涉及的 OpenCode 行为）

| 主题 | 结论 | 证据 |
|---|---|---|
| `list` 返回上限 | 最多 100 个文件 | `opencode/packages/opencode/src/tool/ls.ts:35`～`opencode/packages/opencode/src/tool/ls.ts:60` |
| `list` 内置忽略目录 | 有硬编码 ignore 列表 | `opencode/packages/opencode/src/tool/ls.ts:8`～`opencode/packages/opencode/src/tool/ls.ts:33` |
| `glob` 返回上限/排序 | 最多 100、按 mtime 排序 | `opencode/packages/opencode/src/tool/glob.ts:33`～`opencode/packages/opencode/src/tool/glob.ts:63` |
| `grep` 返回上限/排序 | 最多 100、按文件 mtime 排序 | `opencode/packages/opencode/src/tool/grep.ts:88`～`opencode/packages/opencode/src/tool/grep.ts:92` |
| `bash` 默认 timeout | 默认 2 分钟 | `opencode/packages/opencode/src/tool/bash.ts:20`～`opencode/packages/opencode/src/tool/bash.ts:80` |
| `bash` 输出截断 | 默认最多 30000 字符 | `opencode/packages/opencode/src/tool/bash.ts:19`～`opencode/packages/opencode/src/tool/bash.ts:36` |
| `.gitignore/.ignore` | ripgrep 默认遵守 `.gitignore`；`.ignore` 可显式 include | `opencode/packages/web/src/content/docs/tools.mdx:348`～`opencode/packages/web/src/content/docs/tools.mdx:364` |
| `permission` 行为 | `allow/ask/deny`；`edit` 覆盖写/改/patch | `opencode/packages/web/src/content/docs/permissions.mdx:14`～`opencode/packages/web/src/content/docs/permissions.mdx:18`; `opencode/packages/web/src/content/docs/permissions.mdx:86`～`opencode/packages/web/src/content/docs/permissions.mdx:88` |

---

## 本课小结

你学会了：

1. 分析文件夹现状
2. 批量重命名文件
3. 按规则分类归档
4. 检索文件内容

---

## 下一课预告

> 下一课我们将学习数据处理，用 AI 分析 CSV、JSON 并生成报表。
