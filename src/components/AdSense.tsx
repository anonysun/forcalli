import React from 'react';

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

const AdSense: React.FC<AdSenseProps> = ({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '' 
}) => {
  // 가짜 슬롯 ID나 개발 환경에서는 플레이스홀더 표시
  const isPlaceholder = process.env.NODE_ENV === 'development' || 
                       !slot || 
                       slot.startsWith('1234567890') || 
                       slot.startsWith('0987654321') ||
                       slot.startsWith('2345678901') ||
                       slot.startsWith('1876543210') ||
                       slot.startsWith('3456789012') ||
                       slot.startsWith('2765432109') ||
                       slot.startsWith('4567890123') ||
                       slot.startsWith('3654321098');

  if (isPlaceholder) {
    return (
      <div className={`ad-placeholder ${className}`} style={{ 
        minWidth: '320px', 
        minHeight: '100px', 
        backgroundColor: '#f3f4f6', 
        border: '2px dashed #d1d5db',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b7280',
        fontSize: '14px',
        borderRadius: '8px'
      }}>
        광고 영역
      </div>
    );
  }

  React.useEffect(() => {
    try {
      // Google AdSense 스크립트 로드
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} style={{ minWidth: '320px', minHeight: '100px' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minWidth: '320px', minHeight: '100px' }}
        data-ad-client="ca-pub-6828888022370871"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdSense;
