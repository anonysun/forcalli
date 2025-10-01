import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useImageContext } from '../context/ImageContext';
import LanguageSelector from '../components/LanguageSelector';

const BackgroundUpload: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setBackgroundImage } = useImageContext();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        setUploadedImage(imageDataUrl);
        setBackgroundImage(imageDataUrl); // Context에 저장
        setIsUploading(false);
        
        // 2초 후 다음 페이지로 자동 이동
        setTimeout(() => {
          navigate('/text-upload');
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  }, [navigate, setBackgroundImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: false
  });

  const handleBack = () => {
    navigate('/');
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

      <div className="text-center max-w-lg mx-auto">
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
              {t('backgroundUploadTitle')}
            </h1>
          </div>
          <p className="text-2xl text-gray-600 text-center">
            {t('backgroundUploadSubtitle')}
          </p>
        </div>

        {/* 업로드 영역 */}
        {!uploadedImage ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            
            {isUploading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-2xl text-gray-600">{t('loading')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">📷</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 mb-2">
                    {isDragActive ? t('dropHere') : t('imageUpload')}
                  </p>
                  <p className="text-lg text-gray-600">
                    {t('dragOrClick')}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* 업로드된 이미지 미리보기 */}
            <div className="relative">
              <img
                src={uploadedImage}
                alt="업로드된 배경 이미지"
                className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-2xl flex items-center justify-center">
                <div className="bg-green-500 text-white px-6 py-3 rounded-xl text-xl font-bold">
                  ✓ {t('uploadComplete')}
                </div>
              </div>
            </div>
            
            <p className="text-xl text-gray-600">
              {t('nextStep')}
            </p>
          </div>
        )}

        {/* 안내 메시지 - 업로드 전에만 표시 */}
        {!uploadedImage && (
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <p className="text-lg text-blue-800">
              💡 <strong>{t('tip')}:</strong> {t('backgroundUploadTip')}
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

export default BackgroundUpload;
