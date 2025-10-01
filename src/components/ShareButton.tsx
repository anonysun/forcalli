import React from 'react';
import { useTranslation } from 'react-i18next';

interface ShareButtonProps {
  imageUrl?: string;
  title?: string;
  description?: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  imageUrl,
  title = 'Calli로 만든 이미지',
  description = 'Calli로 글씨와 배경을 합성하여 만든 이미지입니다!',
  className = ''
}) => {
  const { t } = useTranslation();

  const shareUrl = 'https://calli.app/';
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToKakao = () => {
    if (typeof window !== 'undefined' && (window as any).Kakao && (window as any).Kakao.isInitialized()) {
      (window as any).Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: title,
          description: description,
          imageUrl: imageUrl || 'https://forcalli.web.app/og-image.jpg',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      });
    } else {
      // Kakao SDK가 없거나 초기화되지 않았으면 일반 링크 공유
      navigator.clipboard.writeText(shareUrl);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  const shareToInstagram = () => {
    // Instagram은 직접 링크 공유가 제한적이므로 앱 다운로드 페이지로 안내
    const url = 'https://www.instagram.com/';
    window.open(url, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('링크가 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('링크 복사 실패:', err);
    }
  };

  const shareViaWebAPI = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        console.error('공유 실패:', err);
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className={`share-buttons ${className}`}>
      <div className="flex flex-wrap gap-2 justify-center">
        {/* 네이티브 공유 (모바일) */}
        <button
          onClick={shareViaWebAPI}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>📱</span>
          <span>{t('share')}</span>
        </button>

        {/* Facebook */}
        <button
          onClick={shareToFacebook}
          className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
        >
          <span>📘</span>
          <span>Facebook</span>
        </button>

        {/* Twitter */}
        <button
          onClick={shareToTwitter}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          <span>🐦</span>
          <span>Twitter</span>
        </button>

        {/* Kakao */}
        <button
          onClick={shareToKakao}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
        >
          <span>💬</span>
          <span>Kakao</span>
        </button>

        {/* Instagram */}
        <button
          onClick={shareToInstagram}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
        >
          <span>📷</span>
          <span>Instagram</span>
        </button>

        {/* 링크 복사 */}
        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <span>🔗</span>
          <span>링크 복사</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButton;
