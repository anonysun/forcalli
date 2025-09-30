import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/background-upload');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-dongle">
      {/* 메인 콘텐츠 */}
      <div className="text-center max-w-lg mx-auto">
        {/* 앱 로고/제목 */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-3xl mb-6 shadow-lg">
            <span className="text-4xl">🎨</span>
          </div>
          <h1 className="text-8xl md:text-9xl font-bold text-gray-800 mb-4 font-dongle">
            Calli
          </h1>
          <p className="text-4xl text-gray-600 mb-3 font-medium font-dongle">
            이미지 합성 앱
          </p>
          <p className="text-2xl text-gray-500 leading-relaxed font-dongle">
            배경과 글씨를 합쳐서<br />
            멋진 이미지를 만들어보세요
          </p>
        </div>

        {/* 시작 버튼 */}
        <button
          onClick={handleStart}
          className="w-full bg-blue-600 text-white py-5 px-8 rounded-2xl text-4xl font-bold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl font-dongle"
        >
          시작하기
        </button>

      </div>
    </div>
  );
};

export default HomePage;
