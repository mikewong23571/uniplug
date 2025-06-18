import React, { useState } from 'react';
import { logicMap } from "../lib/logicLoader";
import ResultRenderer from './ResultRenderer';

interface ToolInput {
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
}

interface ToolOutput {
  id: string;
  type: string;
  label: string;
}

interface ReverseMapping {
  from: string;
  to: string;
  type?: 'direct' | 'transform';
}

interface Tool {
  data: {
    id: string;
    title: string;
    description: string;
    inputs: ToolInput[];
    outputs: ToolOutput[];
    logic: string;
    reversible?: boolean;
    reverseMapping?: ReverseMapping[];
  };
}

interface Props {
  tool: Tool;
}

export default function ToolRunner({ tool }: Props) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  
  // 处理反转功能：将输出结果用作输入
  const handleUseAsInput = (outputId: string, value: any) => {
    if (!tool.data.reversible || !tool.data.reverseMapping) return;
    
    const mapping = tool.data.reverseMapping.find(m => m.from === outputId);
    if (!mapping) return;
    
    // 根据输出类型处理值
    let processedValue = value;
    if (typeof value === 'object' && value !== null) {
      // 对于复杂对象，尝试提取有用的文本内容
      if (value.result !== undefined) {
        processedValue = value.result;
      } else {
        processedValue = JSON.stringify(value);
      }
    }
    
    setInputValues(prev => ({
      ...prev,
      [mapping.to]: processedValue
    }));
    
    // 更新表单中的对应输入框
    const inputElement = document.querySelector(`[name="${mapping.to}"]`) as HTMLInputElement | HTMLTextAreaElement;
    if (inputElement) {
      inputElement.value = String(processedValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const inputs: Record<string, any> = {};

      // 收集表单数据
      for (const [key, value] of formData.entries()) {
        const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
        if (input.type === 'file') {
          inputs[key] = input.files?.[0];
        } else if (input.type === 'number') {
          inputs[key] = parseFloat(value as string) || 0;
        } else if (input.type === 'checkbox') {
          inputs[key] = input.checked;
        } else {
          inputs[key] = value;
        }
      }

      // 处理未选中的 checkbox
      const allCheckboxes = form.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      allCheckboxes.forEach(checkbox => {
        if (!formData.has(checkbox.name)) {
          inputs[checkbox.name] = false;
        }
      });

      console.log('DEBUG9 - toolLogic:', tool.data.logic);
      console.log('DEBUG9 - inputs:', inputs);

      const logicModule = await logicMap[tool.data.logic]?.();
      if (!logicModule) {
        throw new Error(`Unknown logic module: ${tool.data.logic}`);
      }

      const output = await logicModule.run(inputs);
      console.log('DEBUG9 - output:', output);
      setResult(output);
    } catch (err) {
      console.error('处理失败:', err);
      setError(err instanceof Error ? err.message : '处理失败');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (input: ToolInput) => {
    const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const currentValue = inputValues[input.id] !== undefined ? inputValues[input.id] : input.defaultValue;

    switch (input.type) {
      case 'text':
        return (
          <input
            type="text"
            name={input.id}
            placeholder={input.placeholder}
            required={input.required}
            className={baseClasses}
            defaultValue={currentValue || ''}
            key={inputValues[input.id] || 'default'} // 强制重新渲染
          />
        );

      case 'number':
        return (
          <div className="flex items-center space-x-4">
            <input
              type="number"
              name={input.id}
              min={input.min}
              max={input.max}
              step={input.step}
              required={input.required}
              className={`flex-1 ${baseClasses}`}
              defaultValue={currentValue || ''}
              key={inputValues[input.id] || 'default'}
            />
            {input.min !== undefined && input.max !== undefined && (
              <input
                type="range"
                min={input.min}
                max={input.max}
                step={input.step}
                defaultValue={currentValue || input.min}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                onChange={(e) => {
                  const numberInput = document.querySelector(`input[name="${input.id}"]`) as HTMLInputElement;
                  if (numberInput) numberInput.value = e.target.value;
                }}
              />
            )}
          </div>
        );

      case 'file':
        return (
          <input
            type="file"
            name={input.id}
            accept={input.accept?.join(',')}
            required={input.required}
            className={`${baseClasses} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
          />
        );

      case 'select':
        return (
          <select
            name={input.id}
            required={input.required}
            className={baseClasses}
            defaultValue={currentValue}
            key={inputValues[input.id] || 'default'}
          >
            {input.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            name={input.id}
            placeholder={input.placeholder}
            required={input.required}
            rows={4}
            className={baseClasses}
            defaultValue={currentValue || ''}
            key={inputValues[input.id] || 'default'}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={input.id}
              defaultChecked={input.defaultValue}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              {input.label}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResult = (value: any, output: ToolOutput) => {
    if (value === undefined) return null;

    switch (output.type) {
      case 'image':
        return (
          <div>
            <img
              src={value}
              alt={output.label}
              className="max-w-full h-auto rounded-lg shadow-md"
            />
            <a
              href={value}
              download="compressed-image.jpg"
              className="inline-block mt-3 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              下载图片
            </a>
          </div>
        );

      case 'json':
        return (
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(value, null, 2)}
          </pre>
        );

      case 'text':
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            {String(value)}
          </div>
        );

      default:
        return (
          <div>
            {String(value)}
          </div>
        );
    }
  };

  return (
    <div className="tool-runner max-w-4xl mx-auto p-6">
      {/* 工具标题和描述 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.data.title}</h1>
        <p className="text-lg text-gray-600">{tool.data.description}</p>
      </div>

      {/* 输入表单 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">输入参数</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {tool.data.inputs.map((input) => (
            <div key={input.id} className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {input.label}
                {input.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderInput(input)}
            </div>
          ))}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            {loading ? '正在处理中...' : '开始处理'}
          </button>
        </form>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">正在处理中...</p>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">处理失败</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 结果展示区域 */}
      {result && (
        <ResultRenderer
          outputs={result}
          schema={tool.data.outputs}
          onUseAsInput={tool.data.reversible ? handleUseAsInput : undefined}
        />
      )}
    </div>
  );
}