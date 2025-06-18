---
id: compress-image
title: 图片压缩工具
description: 在浏览器本地压缩JPG/PNG图片，无需上传服务器，保护隐私
category: 图片处理
tags: ["图片", "压缩", "优化"]
inputs:
  - id: imageFile
    type: file
    label: 上传图片
    accept: ["image/jpeg", "image/png", "image/webp"]
  - id: quality
    type: number
    label: 压缩质量（1-100）
    min: 1
    max: 100
    step: 1
    defaultValue: 80
  - id: maxWidth
    type: number
    label: 最大宽度（像素）
    min: 100
    max: 4000
    step: 10
    defaultValue: 1920
outputs:
  - id: compressedImage
    type: image
    label: 压缩后图片
  - id: compressionInfo
    type: json
    label: 压缩信息
logic: compressImage
---

## 图片压缩工具

这是一个完全在浏览器本地运行的图片压缩工具，具有以下特点：

### 功能特性

- **本地处理**：所有操作在浏览器中完成，图片不会上传到服务器
- **隐私保护**：您的图片数据完全保留在本地设备上
- **多格式支持**：支持 JPEG、PNG、WebP 格式
- **质量控制**：可自定义压缩质量（1-100）
- **尺寸限制**：可设置最大宽度，自动等比缩放

### 使用说明

1. 点击"上传图片"选择要压缩的图片文件
2. 调整压缩质量滑块（数值越小压缩越厉害）
3. 可选设置最大宽度限制
4. 点击"开始压缩"按钮
5. 查看压缩结果和详细信息
6. 下载压缩后的图片

### 技术原理

使用 HTML5 Canvas API 和 File API 实现图片的读取、处理和压缩，通过调整 `toBlob()` 方法的质量参数来控制压缩程度。