import React from 'react';
import { cn } from '@/lib/utils';

export interface OutputSchema {
  id: string;
  type: 'text' | 'image' | 'json' | 'chart' | 'table' | 'file';
  label: string;
  reversible?: boolean;
}

export interface ResultRendererProps {
  outputs: Record<string, any>;
  schema: OutputSchema[];
  className?: string;
  onUseAsInput?: (outputId: string, value: any) => void;
}

const ResultRenderer: React.FC<ResultRendererProps> = ({ outputs, schema, className, onUseAsInput }) => {
  const renderOutput = (output: OutputSchema, value: any) => {
    if (value === undefined || value === null) {
      return (
        <div className="text-gray-500 italic">
          暂无数据
        </div>
      );
    }

    switch (output.type) {
      case 'image':
        return (
          <div className="space-y-3">
            <img 
              src={value} 
              alt={output.label}
              className="max-w-full h-auto rounded-lg shadow-md border"
            />
            <a
              href={value}
              download={`${output.id}.jpg`}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              下载图片
            </a>
          </div>
        );

      case 'json':
        const renderJsonContent = () => {
          // 如果是对象且有明确的键值对，尝试以表格形式显示
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            const entries = Object.entries(value).filter(([key, val]) => val !== undefined && val !== null);
            if (entries.length > 0 && entries.length <= 20) { // 限制条目数量，避免过大的对象
              return (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                         <tr>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                             属性
                           </th>
                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                             {output.label || '值'}
                           </th>
                         </tr>
                       </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {entries.map(([key, val], index) => (
                          <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {key}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                      查看原始JSON
                    </summary>
                    <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-3 rounded overflow-auto">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  </details>
                </div>
              );
            }
          }
          
          // 默认JSON显示
          return (
            <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-xs text-gray-500">{output.label || 'JSON 数据'}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(value, null, 2));
                    // 可以添加复制成功提示
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  title="复制JSON"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </button>
              </div>
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          );
        };
        
        return renderJsonContent();

      case 'text':
        const textValue = String(value);
        return (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
               <span className="text-xs text-gray-500">{output.label || '文本内容'}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(textValue);
                  // 可以添加复制成功提示
                }}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center flex-shrink-0 ml-2"
                title="复制文本"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制
              </button>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap">{textValue}</p>
          </div>
        );

      case 'table':
        if (!Array.isArray(value) || value.length === 0) {
          return <div className="text-gray-500 italic">表格数据为空</div>;
        }
        
        const headers = Object.keys(value[0]);
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {value.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {headers.map((header) => (
                      <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {String(row[header] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'chart':
        // 简单的图表渲染，可以后续集成 recharts 或其他图表库
        return (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-center text-gray-600">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>图表功能开发中...</p>
              <pre className="text-xs mt-2 text-left">{JSON.stringify(value, null, 2)}</pre>
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 mb-2">文件已生成</p>
            {typeof value === 'string' && value.startsWith('data:') ? (
              <a
                href={value}
                download={`${output.id}.txt`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                下载文件
              </a>
            ) : (
              <div className="text-sm text-gray-500">
                {String(value)}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800">{String(value)}</p>
          </div>
        );
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {schema.map((output) => {
        const value = outputs[output.id];
        return (
          <div key={output.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {output.label}
              </h3>
              {output.reversible && onUseAsInput && value !== undefined && value !== null && (
                <button
                  onClick={() => onUseAsInput(output.id, value)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
                  title="将此结果用作输入"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  使用此结果
                </button>
              )}
            </div>
            {renderOutput(output, value)}
          </div>
        );
      })}
    </div>
  );
};

export default ResultRenderer;