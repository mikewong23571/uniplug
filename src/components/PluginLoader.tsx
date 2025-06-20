import React from 'react';
import ToolRunner from './ToolRunner';

export default function PluginLoader() {
  const [pluginUrl, setPluginUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const src = params.get('src');
    if (src) setPluginUrl(src);
  }, []);

  if (!pluginUrl) {
    return <p className="text-center py-8">缺少 <code>src</code> 参数</p>;
  }

  return <ToolRunner pluginUrl={pluginUrl} />;
}
