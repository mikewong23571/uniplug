export interface UrlEncoderInputs {
  inputText: string;
  operation: 'encode' | 'decode';
}

export interface UrlEncoderOutputs {
  result: string;
  details: {
    operation: string;
    inputLength: number;
    outputLength: number;
    hasSpecialChars: boolean;
    hasChinese: boolean;
    processingTime: number;
    errors?: string[];
  };
}

export async function run(inputs: UrlEncoderInputs): Promise<UrlEncoderOutputs> {
  const { inputText, operation } = inputs;
  const startTime = performance.now();
  const errors: string[] = [];
  
  if (!inputText) {
    return {
      result: '',
      details: {
        operation,
        inputLength: 0,
        outputLength: 0,
        hasSpecialChars: false,
        hasChinese: false,
        processingTime: 0,
        errors: ['输入文本为空']
      }
    };
  }
  
  let result = '';
  
  try {
    if (operation === 'encode') {
      result = encodeURIComponent(inputText);
    } else {
      // 解码操作
      result = decodeURIComponent(inputText);
    }
  } catch (error) {
    errors.push(`${operation === 'encode' ? '编码' : '解码'}失败: ${error instanceof Error ? error.message : '未知错误'}`);
    result = inputText; // 如果失败，返回原始文本
  }
  
  // 分析文本特征
  const hasSpecialChars = /[^a-zA-Z0-9\-_.~]/.test(inputText);
  const hasChinese = /[\u4e00-\u9fff]/.test(inputText);
  
  const endTime = performance.now();
  const processingTime = Math.round((endTime - startTime) * 100) / 100;
  
  return {
    result,
    details: {
      operation: operation === 'encode' ? '编码' : '解码',
      inputLength: inputText.length,
      outputLength: result.length,
      hasSpecialChars,
      hasChinese,
      processingTime,
      ...(errors.length > 0 && { errors })
    }
  };
}