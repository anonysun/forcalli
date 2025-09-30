// 이미지를 흑백으로 변환하고 대비를 100%로 조정하는 함수
export const convertToBlackAndWhite = (imageDataUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      // 캔버스 크기 설정
      canvas.width = img.width;
      canvas.height = img.height;

      // 고화질 렌더링 설정
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 이미지 그리기
      ctx.drawImage(img, 0, 0);

      // 이미지 데이터 가져오기
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 각 픽셀을 흑백으로 변환하고 대비 100% 적용
      for (let i = 0; i < data.length; i += 4) {
        // RGB 값을 그레이스케일로 변환
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        
        // 대비 100% 적용 (0 또는 255로 변환)
        const contrastGray = gray > 127 ? 255 : 0;
        
        data[i] = contrastGray;     // Red
        data[i + 1] = contrastGray; // Green
        data[i + 2] = contrastGray; // Blue
        // data[i + 3]는 Alpha 채널이므로 그대로 유지
      }

      // 변환된 데이터를 캔버스에 다시 그리기
      ctx.putImageData(imageData, 0, 0);

      // 결과를 Data URL로 변환 (최고 품질)
      const resultDataUrl = canvas.toDataURL('image/png', 1.0);
      resolve(resultDataUrl);
    };
    
    img.src = imageDataUrl;
  });
};

// 이미지 크기 조정 함수 (너무 큰 이미지 처리용)
export const resizeImage = (imageDataUrl: string, maxWidth: number = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      // 비율 유지하면서 크기 조정
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // 고화질 렌더링 설정
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, width, height);

      // 결과를 Data URL로 변환 (최고 품질)
      const resultDataUrl = canvas.toDataURL('image/png', 1.0);
      resolve(resultDataUrl);
    };
    
    img.src = imageDataUrl;
  });
};
