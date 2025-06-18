# UniPlug 工具站

一个基于 Astro 的现代化在线工具平台，所有工具都在浏览器本地运行，保护用户隐私。

## 🚀 特性

- **🔒 隐私保护**: 所有工具在浏览器本地运行，数据不上传服务器
- **🧩 插件化架构**: 通过 Markdown 文件定义工具，自动生成 UI
- **🎨 现代化 UI**: 基于 Tailwind CSS 4.x 和组件化设计
- **⚡ 高性能**: 基于 Astro 5.x，静态生成，加载速度极快
- **📱 响应式设计**: 完美支持桌面和移动设备
- **🔍 SEO 友好**: 静态生成，优秀的搜索引擎优化

## 🛠️ 技术栈

- **框架**: Astro 5.9.4
- **前端**: React 19.1.0
- **样式**: Tailwind CSS 4.1.3
- **图标**: Lucide React
- **内容管理**: Astro Content Collections
- **包管理**: pnpm
- **部署**: Cloudflare Pages

## 📁 项目结构

```
src/
├── components/             # 组件目录
│   ├── Button.astro        # 按钮组件
│   ├── ResultRenderer.tsx  # 结果渲染组件
│   ├── ToolRunner.astro    # 工具运行器组件
│   └── ToolRunner.tsx      # 工具运行器 React 组件
├── content/                # 内容集合
│   ├── config.ts           # Content Collections 配置
│   └── tools/              # 工具定义文件
│       ├── compress-image.md
│       ├── text-counter.md
│       └── url-encoder.md
├── layouts/                # 布局组件
│   ├── main.astro          # 主布局
│   └── ToolPage.astro      # 工具页面布局
├── lib/                    # 工具库
│   ├── logicLoader.ts      # 逻辑加载器
│   └── utils.ts            # 工具函数
├── logic/                  # 工具逻辑函数
│   ├── index.ts            # 逻辑入口
│   ├── compressImage.ts    # 图片压缩逻辑
│   ├── textCounter.ts      # 文本统计逻辑
│   └── urlEncoder.ts       # URL 编码逻辑
├── pages/                  # 页面
│   ├── index.astro         # 首页
│   ├── markdown-page.md    # Markdown 页面示例
│   └── tools/
│       ├── index.astro     # 工具列表页
│       └── [slug].astro    # 动态工具页面
└── styles/
    └── global.css          # 全局样式
```

## 🎯 已有工具

### 图片处理
- **图片压缩工具** (`compress-image`): 在浏览器本地压缩 JPG/PNG/WebP 图片，支持质量调节和尺寸限制

### 文本处理
- **文本统计工具** (`text-counter`): 统计文本的字符数、单词数、行数等信息
- **URL 编码工具** (`url-encoder`): URL 编码和解码工具

## 🔧 开发指南

### 环境准备

确保您的系统已安装：
- Node.js 18 或更高版本
- pnpm 包管理器

### 快速开始

```bash
# 克隆项目
git clone <repository-url>
cd uniplug

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 可用脚本

```bash
# 开发模式（热重载）
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview

# 运行 Astro CLI
pnpm astro
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
  - id: option1
    type: checkbox
    label: 选项1
    defaultValue: true
outputs:
  - id: output1
    type: text
    label: 输出标签
  - id: result
    type: json
    label: 结果数据
logic: myTool
---

## 工具说明

这里是工具的详细说明和使用方法...

### 功能特性

- 特性1：描述
- 特性2：描述

### 使用方法

1. 步骤1
2. 步骤2
3. 步骤3
```

### 2. 创建逻辑函数

在 `src/logic/` 目录下创建对应的 TypeScript 文件：

```typescript
// src/logic/myTool.ts
export interface MyToolInputs {
  input1: string;
  option1: boolean;
}

export interface MyToolOutputs {
  output1: string;
  result: {
    processed: boolean;
    timestamp: string;
    data: any;
  };
}

export async function run(inputs: MyToolInputs): Promise<MyToolOutputs> {
  // 实现工具逻辑
  const processed = inputs.option1 ? inputs.input1.toUpperCase() : inputs.input1;
  
  return {
    output1: `处理结果: ${processed}`,
    result: {
      processed: inputs.option1,
      timestamp: new Date().toISOString(),
      data: { original: inputs.input1, processed }
    }
  };
}
```

### 3. 注册逻辑函数

在 `src/logic/index.ts` 中注册新的逻辑函数：

```typescript
import * as myTool from './myTool';

export const logicMap = {
  // ... 其他工具
  myTool,
};
```

### 3. 支持的输入类型

| 类型 | 描述 | 支持属性 |
|------|------|----------|
| `text` | 文本输入框 | `placeholder`, `defaultValue` |
| `textarea` | 多行文本框 | `placeholder`, `defaultValue`, `rows` |
| `number` | 数字输入框 | `min`, `max`, `step`, `defaultValue` |
| `file` | 文件上传 | `accept`, `multiple` |
| `select` | 下拉选择 | `options`, `defaultValue` |
| `checkbox` | 复选框 | `defaultValue` |

### 4. 支持的输出类型

| 类型 | 描述 | 渲染方式 |
|------|------|----------|
| `text` | 纯文本 | 文本显示 |
| `image` | 图片 | 图片预览（支持 base64 和 URL） |
| `json` | JSON 数据 | 格式化 JSON 显示 |
| `table` | 表格数据 | 表格组件 |
| `chart` | 图表数据 | 图表组件 |
| `file` | 文件下载 | 下载链接 |

## 🚀 部署

### Cloudflare Pages（推荐）

1. 连接 GitHub 仓库到 Cloudflare Pages
2. 设置构建配置：
   - **构建命令**: `pnpm build`
   - **输出目录**: `dist`
   - **Node.js 版本**: `18` 或更高
   - **包管理器**: `pnpm`

### 其他平台

项目支持部署到任何支持静态网站的平台：

- **Vercel**: 自动检测 Astro 项目
- **Netlify**: 支持 Astro 构建
- **GitHub Pages**: 需要配置 GitHub Actions
- **自托管服务器**: 构建后部署 `dist` 目录

### 环境要求

- Node.js 18+
- pnpm 8+
- 现代浏览器支持

## 🔍 开发技巧

### 调试工具

1. **开发者工具**: 使用浏览器开发者工具查看组件状态
2. **Astro Dev Toolbar**: 开发模式下可用的调试工具栏
3. **热重载**: 修改代码后自动刷新页面

### 性能优化

1. **图片优化**: 使用 WebP 格式和适当的压缩
2. **代码分割**: Astro 自动进行代码分割
3. **静态生成**: 所有页面都是静态生成的

### 最佳实践

1. **类型安全**: 为所有逻辑函数定义 TypeScript 接口
2. **错误处理**: 在逻辑函数中添加适当的错误处理
3. **用户体验**: 为长时间运行的操作添加加载状态
4. **无障碍性**: 确保所有组件都有适当的 ARIA 标签

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-tool`)
3. 提交更改 (`git commit -m 'Add amazing tool'`)
4. 推送到分支 (`git push origin feature/amazing-tool`)
5. 创建 Pull Request

### 贡献类型

- 🐛 Bug 修复
- ✨ 新功能/工具
- 📚 文档改进
- 🎨 UI/UX 改进
- ⚡ 性能优化

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有贡献者和以下开源项目：

- [Astro](https://astro.build/) - 现代化的静态站点生成器
- [React](https://react.dev/) - 用户界面库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Lucide](https://lucide.dev/) - 美观的图标库
