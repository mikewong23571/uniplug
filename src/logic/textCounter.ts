export interface TextCounterInputs {
  text: string;
  includeSpaces?: boolean;
}

export interface TextCounterOutputs {
  statistics: {
    characters: number;
    charactersNoSpaces: number;
    words: number;
    lines: number;
    paragraphs: number;
    chineseCharacters: number;
    englishWords: number;
    numbers: number;
    punctuation: number;
  };
}

export async function run(inputs: TextCounterInputs): Promise<TextCounterOutputs> {
  const { text, includeSpaces = true } = inputs;
  
  if (!text) {
    return {
      statistics: {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        lines: 0,
        paragraphs: 0,
        chineseCharacters: 0,
        englishWords: 0,
        numbers: 0,
        punctuation: 0
      }
    };
  }
  
  // 基本统计
  const characters = includeSpaces ? text.length : text.replace(/\s/g, '').length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  
  // 行数统计
  const lines = text.split('\n').length;
  
  // 段落统计（以空行分隔）
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  
  // 单词统计（英文单词）
  const englishWords = (text.match(/\b[a-zA-Z]+\b/g) || []).length;
  
  // 总单词数（包括中文字符，每个中文字符算一个词）
  const chineseCharacters = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const words = englishWords + chineseCharacters;
  
  // 数字统计
  const numbers = (text.match(/\d/g) || []).length;
  
  // 标点符号统计
  const punctuation = (text.match(/[^\w\s\u4e00-\u9fff]/g) || []).length;
  
  return {
    statistics: {
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      chineseCharacters,
      englishWords,
      numbers,
      punctuation
    }
  };
}