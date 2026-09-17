---
title: C2 数据处理
subtitle: CSV/JSON 分析与报表生成
course: OpenCode 中文实战课
stage: 第四阶段
lesson: "C2"
duration: 20 分钟
practice: 25 分钟
level: 新手
description: 用 AI 分析 CSV、JSON 数据，自动生成报表和可视化图表，提升数据处理效率。
tags:
  - 数据
  - CSV
  - JSON
  - 报表
prerequisite:
  - C1 文件整理
---

# C2 数据处理

> 💡 **一句话总结**：用 AI 分析 CSV/JSON 数据，自动生成报表和可视化。

## 📝 课程笔记

本课核心知识点整理：

<img src="/images/4-scenarios/office-data-notes.mini.jpeg"
     alt="C2 数据处理学霸笔记"
     data-zoom-src="/images/4-scenarios/office-data-notes.jpeg" />

---

## 学完你能做什么

- 分析 CSV 和 JSON 文件
- 提取关键数据统计
- 生成数据报表
- 数据格式转换

---

## 你现在的困境

- Excel 公式写不好，分析数据靠手算
- 想从数据里找规律，但不会用数据分析工具
- 需要生成报表，但排版太费时间

---

## 什么时候用这一招

- 当你需要：快速分析数据并生成报表
- 而且不想：学复杂的 Excel 公式或 Python

---

## 🎒 开始前的准备

> 确保你已经完成以下事项：

- [ ] 完成了 [C1 文件整理](./office-files)
- [ ] 有一个 CSV 或 JSON 数据文件

---

## 核心思路

### 数据处理流程

```
理解数据结构 → 确定分析目标 → 执行分析 → 输出结果
```

### 可用工具（本课只讲 OpenCode 相关能力）

| 工具 | 用途 | 关键参数/行为（可验证） |
|-----|------|----------------------|
| `read` | 读取文件内容（支持分页） | `offset`（0-based 起始行）、`limit`（默认 2000 行）（源码：`opencode/packages/opencode/src/tool/read.ts:12`～`opencode/packages/opencode/src/tool/read.ts:21`） |
| `webfetch` | 抓取网页内容 | `url` 仅支持 `http/https`（源码：`opencode/packages/opencode/src/tool/webfetch.ts:21`～`opencode/packages/opencode/src/tool/webfetch.ts:24`）；默认超时 30 秒、最大 120 秒（源码：`opencode/packages/opencode/src/tool/webfetch.ts:7`～`opencode/packages/opencode/src/tool/webfetch.ts:9`）；响应大小上限 5MB（源码：`opencode/packages/opencode/src/tool/webfetch.ts:6`～`opencode/packages/opencode/src/tool/webfetch.ts:84`） |
| `bash` | 运行脚本/命令 | `timeout`（毫秒，默认 2 分钟：`opencode/packages/opencode/src/tool/bash.ts:20`～`opencode/packages/opencode/src/tool/bash.ts:80`）、`workdir`（指定运行目录：`opencode/packages/opencode/src/tool/bash.ts:62`～`opencode/packages/opencode/src/tool/bash.ts:67`） |

::: tip 技巧
- 在 TUI 里，用 `@sales.csv` 这样的写法可以把文件内容注入上下文（官方：`opencode/packages/web/src/content/docs/tui.mdx:30`～`opencode/packages/web/src/content/docs/tui.mdx:43`）。
- `webfetch.timeout` 的单位是“秒”（参数描述：`opencode/packages/opencode/src/tool/webfetch.ts:18`～`opencode/packages/opencode/src/tool/webfetch.ts:19`）。
:::

### 常见数据任务

| 任务 | 示例 |
|-----|------|
| 数据分析 | 统计销售额、计算平均值 |
| 数据筛选 | 找出符合条件的记录 |
| 数据转换 | CSV 转 JSON、合并文件 |
| 报表生成 | 生成 Markdown 表格或图表 |

---

## 跟我做
<AdInArticle />

### 第 1 步：理解数据结构

**为什么**  
先了解数据长什么样。

```bash
cd ~/data  # 换成你的数据目录
opencode
```

```
@sales.csv 分析这个 CSV 文件：
1. 有多少行数据（如果你无法精确统计，请说明原因并给出可行替代）
2. 有哪些列（字段）
3. 每列的数据类型（你推断的依据是什么）
4. 是否有空值或异常值
```

### 第 2 步：基础统计分析

**为什么**  
快速了解数据概况。

```
@sales.csv 对销售数据进行统计分析：
1. 总销售额
2. 平均客单价
3. 销量最高的产品 TOP 5
4. 按月份的销售趋势
```

### 第 3 步：数据筛选

**为什么**  
找出符合条件的记录。

```
@sales.csv 筛选出以下数据：
1. 销售额超过 1000 元的订单
2. 今年 1 月份的所有订单
3. 来自北京的客户订单

将结果保存为 filtered_sales.csv
```

### 第 4 步：生成报表

**为什么**  
把分析结果整理成可读的报告。

```
@sales.csv 生成一份月度销售报表，包含：

## 销售概览
- 本月总销售额
- 环比增长率
- 订单数量

## 产品分析
- 销量 TOP 10 产品表格
- 各品类占比

## 区域分析
- 各地区销售额排名

保存为 月度报表.md
```

### 第 5 步：格式转换

**为什么**
不同场景需要不同格式。

```
@sales.csv 完成以下转换：
1. 转换为 JSON 格式，保存为 sales.json
2. 提取客户信息，生成 customers.csv
3. 生成可以导入 Excel 的格式
```

---

## 进阶：获取在线数据

### 使用 webfetch 工具

除了本地文件，还可以从网页获取数据进行分析：

```
用 webfetch 抓取一个网页（请输出你拿到的原始内容摘要），并说明：
1. 你拿到的是 text / markdown / html 哪一种
2. 你会如何把它转成可分析的数据（CSV/JSON/表格）
```

::: tip 技巧
- `webfetch` 支持 `text` / `markdown`（默认）/ `html`（源码：`opencode/packages/opencode/src/tool/webfetch.ts:14`～`opencode/packages/opencode/src/tool/webfetch.ts:18`）。
- 默认超时 30 秒，最大 120 秒（源码：`opencode/packages/opencode/src/tool/webfetch.ts:7`～`opencode/packages/opencode/src/tool/webfetch.ts:9`）。
- 响应大小限制 5MB，超过会报错（源码：`opencode/packages/opencode/src/tool/webfetch.ts:6`～`opencode/packages/opencode/src/tool/webfetch.ts:84`）。
:::

### bash：运行数据处理脚本（可选）

如果你希望把“筛选/清洗/转换”固化成脚本（方便复用），可以让 AI 先生成脚本，然后用 `bash` 运行。

::: tip 技巧
- `bash.timeout` 单位毫秒，默认 2 分钟（源码：`opencode/packages/opencode/src/tool/bash.ts:20`～`opencode/packages/opencode/src/tool/bash.ts:80`）。
- 输出默认最多 30000 字符（源码：`opencode/packages/opencode/src/tool/bash.ts:19`～`opencode/packages/opencode/src/tool/bash.ts:36`）。
:::

---

## 检查点 ✅

> 全部通过才能继续

- [ ] 分析了 CSV/JSON 文件结构
- [ ] 完成了基础统计
- [ ] 筛选出了目标数据
- [ ] 生成了可读的报表

---

## 踩坑提醒

| 现象 | 原因 | 解决 |
|-----|-----|-----|
| 数据分析不准 | 文件太大或只看了片段 | 先让 AI 总结结构 + 采样，再做全量分析（必要时用 `read.offset/limit` 分页） |
| 计算结果错误 | 列名/单位理解错了 | 先让 AI 复述列含义与单位，再让它计算 |
| `webfetch` 报 URL 错误 | URL 不是 http/https | 确认链接协议（源码：`opencode/packages/opencode/src/tool/webfetch.ts:21`～`opencode/packages/opencode/src/tool/webfetch.ts:24`） |
| `webfetch` 报内容过大 | 超过 5MB 上限 | 换更小的页面/接口，或分段获取（源码：`opencode/packages/opencode/src/tool/webfetch.ts:6`～`opencode/packages/opencode/src/tool/webfetch.ts:84`） |

---

## 证据索引（本课涉及的 OpenCode 行为）

| 主题 | 结论 | 证据 |
|---|---|---|
| `read.offset/limit` | offset 从 0 开始；默认读 2000 行 | `opencode/packages/opencode/src/tool/read.ts:12`～`opencode/packages/opencode/src/tool/read.ts:21` |
| `webfetch` 限制 | 仅 http/https；默认 30s，最大 120s；5MB | `opencode/packages/opencode/src/tool/webfetch.ts:6`～`opencode/packages/opencode/src/tool/webfetch.ts:24` |
| 文件引用 `@...` | TUI 支持 `@文件` 注入内容 | `opencode/packages/web/src/content/docs/tui.mdx:30`～`opencode/packages/web/src/content/docs/tui.mdx:43` |
| `bash` 默认 timeout/截断 | 默认 2 分钟；输出默认 30000 字符 | `opencode/packages/opencode/src/tool/bash.ts:19`～`opencode/packages/opencode/src/tool/bash.ts:36`; `opencode/packages/opencode/src/tool/bash.ts:20`～`opencode/packages/opencode/src/tool/bash.ts:80` |

---

## 本课小结

你学会了：

1. 分析 CSV/JSON 数据结构
2. 进行基础统计分析
3. 按条件筛选数据
4. 生成 Markdown 报表

---

## 下一课预告

> 下一课我们将学习用 AI 学编程，让 AI 成为你的编程导师。
