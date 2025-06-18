// Logic modules registry
// 这个文件确保所有logic模块都能被正确打包和动态导入

export { run as compressImage } from './compressImage';
export { run as textCounter } from './textCounter';
export { run as urlEncoder } from './urlEncoder';

// 动态获取logic函数的辅助函数
export async function getLogicFunction(toolLogic: string) {
  switch (toolLogic) {
    case 'compressImage':
      return (await import('./compressImage')).run;
    case 'textCounter':
      return (await import('./textCounter')).run;
    case 'urlEncoder':
      return (await import('./urlEncoder')).run;
    default:
      throw new Error(`Unknown logic module: ${toolLogic}`);
  }
}