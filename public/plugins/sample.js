export default {
  id: 'sample',
  title: '示例插件',
  description: '这是一个外部加载的示例插件',
  inputs: [
    { id: 'text', type: 'text', label: '输入文本' }
  ],
  outputs: [
    { id: 'result', type: 'text', label: '处理结果' }
  ],
  async run({ text }) {
    return { result: text.split('').reverse().join('') };
  }
};
