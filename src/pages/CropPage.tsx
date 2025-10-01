import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useImageContext } from '../context/ImageContext';
import LanguageSelector from '../components/LanguageSelector';

// 타입 정의
interface Crop {
  unit: 'px' | '%';
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CropPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { processedTextImage, setCroppedTextImage } = useImageContext();
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Context에서 처리된 글씨 이미지 사용
  const imageSrc = processedTextImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdyZXkgVGV4dDwvdGV4dD48L3N2Zz4=';
  
  console.log('CropPage imageSrc:', imageSrc.substring(0, 50) + '...'); // 디버깅

  const onCropChange = useCallback((crop: Crop) => {
    setCrop(crop);
  }, []);

  const onCropComplete = useCallback((_: Crop, pixelCrop: PixelCrop) => {
    setCompletedCrop(pixelCrop);
  }, []);

  // 이미지 로드 시 적절한 크롭 영역 설정
  const handleImageLoad = useCallback((img: HTMLImageElement) => {
    console.log('Image loaded:', img.width, img.height); // 디버깅
    
    // 이미지 크기에 맞춰서 적절한 크롭 영역 설정 (이미지의 80% 크기)
    const cropWidth = Math.min(img.width * 0.8, 600);
    const cropHeight = Math.min(img.height * 0.8, 600);
    const cropX = (img.width - cropWidth) / 2;
    const cropY = (img.height - cropHeight) / 2;
    
    setCrop({
      unit: 'px',
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight,
    });
    
    setImageLoaded(true);
  }, []);

  const getCroppedImg = (imageSrc: string, cropData: Crop, imgElement?: HTMLImageElement): Promise<string> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        // 실제 이미지 요소의 표시 크기 가져오기
        let displayWidth, displayHeight;
        if (imgElement) {
          displayWidth = imgElement.offsetWidth;
          displayHeight = imgElement.offsetHeight;
        } else {
          // fallback: CSS에서 설정한 크기
          displayWidth = 400;
          displayHeight = 300;
        }
        
        const scaleX = image.width / displayWidth;
        const scaleY = image.height / displayHeight;
        
        // crop 상태에서 직접 계산 (pixelCrop 대신)
        const actualCropX = cropData.x * scaleX;
        const actualCropY = cropData.y * scaleY;
        const actualCropWidth = cropData.width * scaleX;
        const actualCropHeight = cropData.height * scaleY;

        console.log('크롭 스케일 계산:', {
          imageSize: image.width + 'x' + image.height,
          displaySize: displayWidth + 'x' + displayHeight,
          scaleX: scaleX,
          scaleY: scaleY,
          cropData: cropData.width + 'x' + cropData.height + ' 위치:' + cropData.x + ',' + cropData.y,
          actualCrop: actualCropWidth + 'x' + actualCropHeight,
          actualPosition: actualCropX + ',' + actualCropY
        });

        canvas.width = actualCropWidth;
        canvas.height = actualCropHeight;

        // 고화질 렌더링 설정
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
          image,
          actualCropX,
          actualCropY,
          actualCropWidth,
          actualCropHeight,
          0,
          0,
          actualCropWidth,
          actualCropHeight
        );

        // 최고 품질로 저장
        resolve(canvas.toDataURL('image/png', 1.0));
      };
      image.src = imageSrc;
    });
  };

  const handleCrop = async () => {
    if (!crop.width || !crop.height) return;
    
    setIsProcessing(true);
    try {
      // 실제 이미지 크기 가져오기
      const img = new Image();
      img.src = imageSrc;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      console.log('=== 크롭 정보 ===');
      console.log('원본 이미지 크기:', img.width + 'x' + img.height);
      console.log('화면 크롭 영역:', crop.width + 'x' + crop.height, '위치:', crop.x + ',' + crop.y);
      
      const croppedImageDataUrl = await getCroppedImg(imageSrc, crop, imgRef.current || undefined);
      
      // 자른 이미지 크기 확인
      const croppedImg = new Image();
      croppedImg.src = croppedImageDataUrl;
      await new Promise((resolve) => {
        croppedImg.onload = resolve;
      });
      
      console.log('자른 이미지 크기:', croppedImg.width + 'x' + croppedImg.height);
      console.log('================');
      
      // Context에 저장하고 바로 다음 페이지로 이동
      setCroppedTextImage(croppedImageDataUrl);
      navigate('/composite');
    } catch (error) {
      console.error('이미지 자르기 중 오류:', error);
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigate('/text-upload');
  };

  // 애드센스 초기화
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-dongle">
      {/* 언어 선택기 */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSelector />
      </div>

      <div className="text-center max-w-4xl mx-auto w-full">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4 relative">
            <button
              onClick={handleBack}
              className="absolute left-0 text-4xl text-gray-600 hover:text-gray-800 transition-colors"
            >
              ←
            </button>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-800 text-center">
              {t('cropTitle')}
            </h1>
          </div>
          <p className="text-2xl text-gray-600 text-center">
            {t('cropSubtitle')}
          </p>
        </div>

        {/* 크롭 영역 */}
        <div className="relative bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-xl flex items-center justify-center">
            <ReactCrop
              crop={crop}
              onChange={onCropChange}
              onComplete={onCropComplete}
              aspect={undefined} // 자유 비율
              className="max-w-full max-h-full"
            >
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="크롭할 이미지"
                    className="max-w-full max-h-full object-contain"
                    style={{ maxHeight: '400px' }}
                    onLoad={(e) => handleImageLoad(e.target as HTMLImageElement)}
                  />
            </ReactCrop>
          </div>
        </div>

            {/* 컨트롤 */}
            <div className="space-y-4 mb-6">
              {/* 자르기 버튼 */}
              <button
                onClick={handleCrop}
                disabled={isProcessing || !imageLoaded || !crop.width || !crop.height}
                className="w-full bg-orange-600 text-white py-4 px-8 rounded-2xl text-2xl font-bold hover:bg-orange-700 transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? t('processing') : !imageLoaded ? t('imageLoading') : !crop.width || !crop.height ? t('selectCropArea') : t('cropComplete')}
              </button>
            </div>

        {/* 안내 메시지 */}
        <div className="mt-8 p-4 bg-orange-50 rounded-xl">
          <p className="text-lg text-orange-800">
            💡 <strong>{t('tip')}:</strong> {t('cropTip')}
          </p>
        </div>

        {/* 광고 영역 - 하단 */}
        <div className="mt-8">
          <div className="w-full max-w-4xl mx-auto px-4">
            {/* 모바일 광고 */}
            <div className="md:hidden">
              <div 
                className="ad-container text-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-2" 
                style={{ 
                  minWidth: '320px', 
                  minHeight: '50px',
                  width: '100%',
                  maxWidth: '320px',
                  height: '50px'
                }}
              >
                <ins 
                  className="adsbygoogle"
                  style={{ 
                    display: 'block',
                    width: '100%',
                    height: '50px',
                    minWidth: '320px',
                    minHeight: '50px'
                  }}
                  data-ad-client="ca-pub-6828888022370871"
                  data-ad-slot="6095639323"
                  data-ad-format="horizontal"
                  data-full-width-responsive="false"
                />
              </div>
            </div>

            {/* 데스크톱 광고 */}
            <div className="hidden md:block">
              <div 
                className="ad-container text-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-2" 
                style={{ 
                  minWidth: '728px', 
                  minHeight: '90px',
                  width: '100%',
                  maxWidth: '728px',
                  height: '90px'
                }}
              >
                <ins 
                  className="adsbygoogle"
                  style={{ 
                    display: 'block',
                    width: '100%',
                    height: '90px',
                    minWidth: '728px',
                    minHeight: '90px'
                  }}
                  data-ad-client="ca-pub-6828888022370871"
                  data-ad-slot="6095639323"
                  data-ad-format="horizontal"
                  data-full-width-responsive="false"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropPage;
