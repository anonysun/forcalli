// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Google Analytics 설정
export const initAnalytics = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Google Analytics 4 설정
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: 'Calli - 이미지 합성 앱',
      page_location: window.location.href,
    });
  }
};

// 이벤트 추적 함수들
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// 페이지 뷰 추적
export const trackPageView = (pageName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
    });
  }
};

// 사용자 액션 추적
export const trackUserAction = (action: string, category: string, label?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};

// 이미지 업로드 추적
export const trackImageUpload = (type: 'background' | 'text') => {
  trackUserAction('image_upload', 'engagement', type);
};

// 이미지 합성 완료 추적
export const trackImageComposite = () => {
  trackUserAction('image_composite', 'conversion', 'composite_complete');
};

// 다운로드 추적
export const trackDownload = (format: 'png' | 'jpg') => {
  trackUserAction('download', 'conversion', format);
};

// 언어 변경 추적
export const trackLanguageChange = (language: string) => {
  trackUserAction('language_change', 'engagement', language);
};

// 에러 추적
export const trackError = (error: string, fatal: boolean = false) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error,
      fatal: fatal,
    });
  }
};
