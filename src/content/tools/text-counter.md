---
id: text-counter
title: 文本统计工具
description: 统计文本的字符数、单词数、行数等信息
category: 文本处理
tags: ["文本", "统计", "计数"]
inputs:
  - id: text
    type: textarea
    label: 输入文本
    placeholder: 请输入要统计的文本内容...
  - id: includeSpaces
    type: checkbox
    label: 包含空格
    defaultValue: true
outputs:
  - id: statistics
    type: json
    label: 统计结果
logic: textCounter
---

## 文本统计工具

这是一个简单而实用的文本统计工具，可以帮助您快速分析文本内容。

### 功能特性

- **字符统计**：统计总字符数（可选择是否包含空格）
- **单词统计**：统计英文单词数量
- **行数统计**：统计文本行数
- **段落统计**：统计段落数量
- **中文字符**：单独统计中文字符数量

### 使用场景

- 写作时统计字数
- 检查文档长度
- 分析文本结构
- 社交媒体内容长度控制

### 使用方法

1. 在文本框中输入或粘贴要统计的文本
2. 选择是否在字符统计中包含空格
3. 查看详细的统计结果