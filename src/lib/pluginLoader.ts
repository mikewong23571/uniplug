// Dynamic plugin loader
// 动态加载外部插件

export interface PluginTool {
  data: {
    id: string;
    title: string;
    description: string;
    category?: string;
    tags?: string[];
    inputs: Array<{
      id: string;
      type: string;
      label: string;
      placeholder?: string;
      required?: boolean;
      accept?: string[];
      options?: Array<{ value: string; label: string }>;
      min?: number;
      max?: number;
      step?: number;
      defaultValue?: any;
    }>;
    outputs: Array<{
      id: string;
      type: string;
      label: string;
      reversible?: boolean;
    }>;
    logic?: string;
    reversible?: boolean;
    reverseMapping?: Array<{
      from: string;
      to: string;
      type?: 'direct' | 'transform';
    }>;
  };
  run: (inputs: any) => Promise<any>;
}

/**
 * Dynamically load a JavaScript plugin.
 *
 * @param url Plugin file URL
 */
export async function loadPlugin(url: string): Promise<PluginTool> {
  const mod = await import(/* @vite-ignore */ url);
  const plugin = (mod.default ?? mod) as any;
  if (!plugin || typeof plugin.run !== 'function') {
    throw new Error('Invalid plugin: missing run function');
  }

  const { run, ...data } = plugin;
  return {
    data,
    run,
  } as PluginTool;
}
