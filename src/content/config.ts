import { defineCollection, z } from 'astro:content';

const toolsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    inputs: z.array(z.object({
      id: z.string(),
      type: z.enum(['text', 'number', 'file', 'select', 'textarea', 'checkbox']),
      label: z.string(),
      placeholder: z.string().optional(),
      required: z.boolean().optional().default(true),
      accept: z.array(z.string()).optional(), // for file inputs
      options: z.array(z.object({
        value: z.string(),
        label: z.string()
      })).optional(), // for select inputs
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().optional(),
      defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional()
    })),
    outputs: z.array(z.object({
      id: z.string(),
      type: z.enum(['text', 'image', 'json', 'chart', 'table', 'file']),
      label: z.string(),
      reversible: z.boolean().optional() // 标记该输出是否可以反转为输入
    })),
    logic: z.string(), // 对应的逻辑函数文件名
    reversible: z.boolean().optional(), // 标记工具是否支持反转
    reverseMapping: z.array(z.object({
      from: z.string(), // 输出字段ID
      to: z.string(),   // 对应的输入字段ID
      type: z.enum(['direct', 'transform']).optional().default('direct') // 映射类型
    })).optional() // 反转映射配置
  })
});

export const collections = {
  tools: toolsCollection
};