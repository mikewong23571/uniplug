export interface CompressImageInputs {
  imageFile: File;
  quality: number;
  maxWidth?: number;
}

export interface CompressImageOutputs {
  compressedImage: string; // base64 data URL
  compressionInfo: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    originalDimensions: { width: number; height: number };
    compressedDimensions: { width: number; height: number };
    format: string;
  };
}

export async function run(inputs: CompressImageInputs): Promise<CompressImageOutputs> {
  const { imageFile, quality, maxWidth } = inputs;
  
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    if (!ctx) {
      reject(new Error('无法创建 Canvas 上下文'));
      return;
    }
    
    img.onload = () => {
      const originalWidth = img.width;
      const originalHeight = img.height;
      
      // 计算新的尺寸
      let newWidth = originalWidth;
      let newHeight = originalHeight;
      
      if (maxWidth && originalWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = (originalHeight * maxWidth) / originalWidth;
      }
      
      // 设置 canvas 尺寸
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // 绘制图片
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // 转换为 blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('图片压缩失败'));
            return;
          }
          
          const reader = new FileReader();
          reader.onload = () => {
            const compressedDataUrl = reader.result as string;
            const originalSize = imageFile.size;
            const compressedSize = blob.size;
            const compressionRatio = Math.round((1 - compressedSize / originalSize) * 100);
            
            resolve({
              compressedImage: compressedDataUrl,
              compressionInfo: {
                originalSize,
                compressedSize,
                compressionRatio,
                originalDimensions: { width: originalWidth, height: originalHeight },
                compressedDimensions: { width: newWidth, height: newHeight },
                format: blob.type
              }
            });
          };
          
          reader.onerror = () => {
            reject(new Error('读取压缩后图片失败'));
          };
          
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        quality / 100
      );
    };
    
    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };
    
    // 读取文件
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  });
}