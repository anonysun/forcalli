import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useImageContext } from '../context/ImageContext';

const BackgroundUpload: React.FC = () => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-dongle">
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
              배경 이미지
            </h1>
          </div>
          <p className="text-2xl text-gray-600 text-center">
            배경으로 사용할 이미지를 업로드하세요
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
                <p className="text-2xl text-gray-600">업로드 중...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">📷</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 mb-2">
                    {isDragActive ? '여기에 놓으세요!' : '이미지 업로드'}
                  </p>
                  <p className="text-lg text-gray-600">
                    JPG, PNG 파일을 드래그하거나 클릭하세요
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
                  ✓ 업로드 완료!
                </div>
              </div>
            </div>
            
            <p className="text-xl text-gray-600">
              다음 단계로 이동합니다...
            </p>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <p className="text-lg text-blue-800">
            💡 <strong>팁:</strong> 고해상도 이미지를 사용하면 더 좋은 결과를 얻을 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackgroundUpload;
