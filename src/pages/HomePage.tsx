import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleStart = () => {
    navigate('/background-upload');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-dongle">
      {/* 언어 선택기 */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      {/* 메인 콘텐츠 - 화면 중앙 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center max-w-sm mx-auto">
          {/* 앱 로고/제목 */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-3 shadow-lg">
              <span className="text-2xl">🎨</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-3 font-dongle">
              Calli
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 font-medium font-dongle leading-relaxed">
              {t('homeSubtitle')}
            </p>
          </div>

          {/* 시작 버튼 */}
          <button
            onClick={handleStart}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg text-2xl font-bold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl font-dongle"
          >
            {t('startButton')}
          </button>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
