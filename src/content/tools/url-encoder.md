---
id: url-encoder
title: URL 编码解码工具
description: 对 URL 进行编码和解码处理，支持中文和特殊字符
category: 编码转换
tags: ["URL", "编码", "解码", "转换"]
inputs:
  - id: inputText
    type: textarea
    label: 输入文本
    placeholder: 请输入要编码或解码的文本...
  - id: operation
    type: select
    label: 操作类型
    options:
      - value: encode
        label: 编码（Encode）
      - value: decode
        label: 解码（Decode）
    defaultValue: encode
outputs:
  - id: result
    type: text
    label: 处理结果
    reversible: true
  - id: details
    type: json
    label: 详细信息
logic: urlEncoder
reversible: true
reverseMapping:
  - from: result
    to: inputText
    type: direct
---

## URL 编码解码工具

这是一个专业的 URL 编码解码工具，帮助您处理 URL 中的特殊字符和中文字符。

### 功能特性

- **URL 编码**：将特殊字符转换为 %XX 格式
- **URL 解码**：将 %XX 格式还原为原始字符
- **中文支持**：完美支持中文字符的编码解码
- **批量处理**：支持处理多行文本
- **错误检测**：自动检测无效的编码格式

### 使用场景

- **Web 开发**：处理 URL 参数中的特殊字符
- **API 调用**：准备 URL 查询参数
- **数据传输**：确保 URL 的正确传输
- **调试工具**：分析和修复 URL 编码问题

### 编码规则

- 字母数字字符（A-Z, a-z, 0-9）保持不变
- 某些特殊字符（如 `-`, `_`, `.`, `~`）保持不变
- 其他字符转换为 `%XX` 格式，其中 XX 是字符的十六进制 ASCII 码
- 中文字符使用 UTF-8 编码后转换

### 使用方法

1. 在文本框中输入要处理的文本
2. 选择操作类型（编码或解码）
3. 点击"开始处理"查看结果
4. 查看详细信息了解处理过程