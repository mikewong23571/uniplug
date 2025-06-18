// Logic loader for dynamic imports
// 为动态导入提供逻辑加载器

export const logicMap: Record<string, () => Promise<{ run: (inputs: any) => Promise<any> }>> = {
  "compressImage": () => import("../logic/compressImage"),
  "textCounter": () => import("../logic/textCounter"),
  "urlEncoder": () => import("../logic/urlEncoder"),
};