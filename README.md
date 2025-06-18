# UniPlug 工具站

一个基于 Astro 的现代化在线工具平台，所有工具都在浏览器本地运行，保护用户隐私。

## 🚀 特性

- **隐私保护**: 所有工具在浏览器本地运行，数据不上传服务器
- **插件化架构**: 通过 Markdown 文件定义工具，自动生成 UI
- **现代化 UI**: 基于 Tailwind CSS 和 ShadCN UI 组件
- **SEO 友好**: 静态生成，优秀的搜索引擎优化
- **响应式设计**: 完美支持桌面和移动设备

## 🛠️ 技术栈

- **框架**: Astro 5.x
- **UI 库**: Tailwind CSS + ShadCN UI
- **前端**: React 19
- **内容管理**: Astro Content Collections
- **部署**: Cloudflare Pages

## 📁 项目结构

```
src/
├── content/
│   ├── config.ts          # Content Collections 配置
│   └── tools/              # 工具定义文件
│       ├── compress-image.md
│       ├── text-counter.md
│       └── url-encoder.md
├── logic/                  # 工具逻辑函数
│   ├── compressImage.ts
│   ├── textCounter.ts
│   └── urlEncoder.ts
├── components/
│   ├── ToolRunner.astro    # 工具运行器组件
│   └── ResultRenderer.tsx  # 结果渲染组件
├── layouts/
│   └── ToolPage.astro      # 工具页面布局
└── pages/
    ├── index.astro         # 首页
    ├── tools/
    │   ├── index.astro     # 工具列表页
    │   └── [slug].astro    # 动态工具页面
```

## 🔧 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 📝 添加新工具

### 1. 创建工具定义文件

在 `src/content/tools/` 目录下创建新的 Markdown 文件：

```markdown
---
id: my-tool
title: 我的工具
description: 工具描述
category: 分类名称
tags: ["标签1", "标签2"]
inputs:
  - id: input1
    type: text
    label: 输入标签
    placeholder: 占位符文本
outputs:
  - id: output1
    type: text
    label: 输出标签
logic: myTool
---

## 工具说明

这里是工具的详细说明...
```

### 2. 创建逻辑函数

在 `src/logic/` 目录下创建对应的 TypeScript 文件：

```typescript
export interface MyToolInputs {
  input1: string;
}

export interface MyToolOutputs {
  output1: string;
}

export async function run(inputs: MyToolInputs): Promise<MyToolOutputs> {
  // 实现工具逻辑
  return {
    output1: `处理结果: ${inputs.input1}`
  };
}
```

### 3. 支持的输入类型

- `text`: 文本输入框
- `number`: 数字输入框（支持滑块）
- `textarea`: 多行文本框
- `file`: 文件上传
- `select`: 下拉选择
- `checkbox`: 复选框

### 4. 支持的输出类型

- `text`: 纯文本
- `image`: 图片（base64 或 URL）
- `json`: JSON 数据
- `table`: 表格数据
- `chart`: 图表数据
- `file`: 文件下载

## 🚀 部署

### Cloudflare Pages

1. 连接 GitHub 仓库到 Cloudflare Pages
2. 设置构建配置：
   - 构建命令: `pnpm build`
   - 输出目录: `dist`
   - Node.js 版本: `18` 或更高

### 其他平台

项目支持部署到任何支持静态网站的平台：

- Vercel
- Netlify
- GitHub Pages
- 自托管服务器

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
