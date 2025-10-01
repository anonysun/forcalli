import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { convertToBlackAndWhite, resizeImage } from '../utils/imageUtils';
import { useImageContext } from '../context/ImageContext';
import LanguageSelector from '../components/LanguageSelector';

const TextUpload: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setTextImage, setProcessedTextImage } = useImageContext();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [, setProcessedImage] = useState<string | null>(null);
  const [, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsProcessing(true);
      
      // 원본 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = async () => {
        const originalDataUrl = reader.result as string;
        setOriginalImage(originalDataUrl);
        
        try {
          // 이미지 크기 조정 (고화질 유지를 위해 더 큰 크기로 제한)
          const resizedImage = await resizeImage(originalDataUrl, 2000);
          
          // 흑백 변환 및 대비 100% 적용
          const processedDataUrl = await convertToBlackAndWhite(resizedImage);
          setProcessedImage(processedDataUrl);
          
          // Context에 이미지 저장
          setTextImage(originalDataUrl);
          setProcessedTextImage(processedDataUrl);
          
          // 바로 다음 페이지로 이동
          navigate('/crop');
        } catch (error) {
          console.error('이미지 처리 중 오류:', error);
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: false
  });

  const handleBack = () => {
    navigate('/background-upload');
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
      <div className="absolute top-6 right-6">
        <LanguageSelector />
      </div>

      <div className="text-center max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4 relative">
            <button
              onClick={handleBack}
              className="absolute left-0 text-4xl text-gray-600 hover:text-gray-800 transition-colors"
            >
              ←
            </button>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-800 text-center">
              {t('textUploadTitle')}
            </h1>
          </div>
          <p className="text-2xl text-gray-600 text-center">
            {t('textUploadSubtitle')}
          </p>
        </div>

        {/* 업로드 영역 */}
        {!originalImage ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">✍️</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  {isDragActive ? t('dropHere') : t('textUploadTitle')}
                </p>
                <p className="text-lg text-gray-600">
                  {t('dragOrClick')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 처리 중 상태 */}
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-2xl text-gray-600">{t('processingText')}</p>
              <p className="text-lg text-gray-500">{t('processingSubtext')}</p>
            </div>
          </div>
        )}

        {/* 안내 메시지 - 업로드 전에만 표시 */}
        {!originalImage && (
          <div className="mt-8 p-4 bg-green-50 rounded-xl">
            <p className="text-lg text-green-800">
              💡 <strong>{t('tip')}:</strong> {t('textUploadTip')}
            </p>
          </div>
        )}

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

export default TextUpload;
