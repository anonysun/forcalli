import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 언어 리소스
const resources = {
  ko: {
    translation: {
      // 공통
      appName: 'Calli - 이미지 합성',
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      retry: '다시 시도',
      back: '뒤로',
      next: '다음',
      save: '저장',
      download: '다운로드',
      share: '공유',
      tip: '팁',
      imageSave: '이미지 저장',
      longPressToSave: '이미지를 길게 눌러 저장하세요',
      saved: '저장되었습니다',
      dropHere: '여기에 놓으세요!',
      dragOrClick: 'JPG, PNG 파일을 드래그하거나 클릭하세요',
      imageUpload: '이미지 업로드',
      uploadComplete: '업로드 완료!',
      nextStep: '다음 단계로 이동합니다...',
      processing: '처리 중...',
      imageLoading: '이미지 로딩 중...',
      selectCropArea: '크롭 영역을 선택하세요',
      cropComplete: '자르기 완료',
      
      // 홈페이지
      homeTitle: '🎨 Calli',
      homeSubtitle: '글씨와 배경을 합성하여 아름다운 이미지를 만들어보세요',
      startButton: '시작하기',
      
      // 배경 업로드
      backgroundUploadTitle: '배경 이미지',
      backgroundUploadSubtitle: '합성할 배경 이미지를 업로드하세요',
      backgroundUploadTip: '고화질 이미지를 사용하면 더 좋은 결과를 얻을 수 있습니다',
      
      // 텍스트 업로드
      textUploadTitle: '글씨 이미지',
      textUploadSubtitle: '합성할 글씨 이미지를 업로드하세요',
      textUploadTip: '글씨가 선명한 이미지를 사용하면 더 좋은 결과를 얻을 수 있습니다',
      processingText: '이미지 처리 중...',
      processingSubtext: '흑백 변환 및 대비 조정',
      
      // 크롭 페이지
      cropTitle: '글씨 자르기',
      cropSubtitle: '원하는 부분만 선택하세요',
      cropTip: '글씨 부분만 정확히 선택하면 더 자연스러운 합성이 됩니다',
      
      // 합성 페이지
      compositeTitle: '이미지 합성',
      compositeSubtitle: '글씨 위치와 크기를 조정하세요',
      compositeTip: '글씨를 터치해서 드래그하면 이동하고, 모서리 핸들을 드래그하면 크기 조절, 위쪽 회전 핸들을 드래그하면 회전합니다',
      blendMode: '블렌드 모드',
      multiply: '어두운 글씨',
      screen: '밝은 글씨',
      colorChange: '색상 변경',
      resetPosition: '위치 초기화',
      resetSize: '크기 초기화',
      resetRotation: '회전 초기화',
      preview: '미리보기',
      finalSave: '최종 저장',
      
      // 저장 완료
      saveComplete: '저장 완료!',
      saveTip: '💡 팁: iOS에서는 다운로드 후 "사진에 저장"을 선택하세요',
      
      // 광고 관련
      adSupported: '광고 지원 서비스',
      thankYou: '감사합니다!',
    }
  },
  en: {
    translation: {
      // Common
      appName: 'Calli - Image Compositor',
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      back: 'Back',
      next: 'Next',
      save: 'Save',
      download: 'Download',
      share: 'Share',
      tip: 'Tip',
      imageSave: 'Image Save',
      longPressToSave: 'Long press the image to save',
      saved: 'Saved',
      dropHere: 'Drop here!',
      dragOrClick: 'Drag or click JPG, PNG files',
      imageUpload: 'Image Upload',
      uploadComplete: 'Upload Complete!',
      nextStep: 'Moving to next step...',
      processing: 'Processing...',
      imageLoading: 'Loading image...',
      selectCropArea: 'Please select crop area',
      cropComplete: 'Crop Complete',
      
      // Homepage
      homeTitle: '🎨 Calli',
      homeSubtitle: 'Create beautiful images by compositing text and background',
      startButton: 'Get Started',
      
      // Background Upload
      backgroundUploadTitle: 'Background Image',
      backgroundUploadSubtitle: 'Upload the background image to composite',
      backgroundUploadTip: 'Using high-quality images will give you better results',
      
      // Text Upload
      textUploadTitle: 'Text Image',
      textUploadSubtitle: 'Upload the text image to composite',
      textUploadTip: 'Using clear text images will give you better results',
      processingText: 'Processing image...',
      processingSubtext: 'Converting to black and white and adjusting contrast',
      
      // Crop Page
      cropTitle: 'Crop Text',
      cropSubtitle: 'Select only the desired part',
      cropTip: 'Accurately selecting only the text part will result in more natural compositing',
      
      // Composite Page
      compositeTitle: 'Image Composite',
      compositeSubtitle: 'Adjust text position and size',
      compositeTip: 'Touch and drag text to move, drag corner handles to resize, drag rotation handle to rotate',
      blendMode: 'Blend Mode',
      multiply: 'Dark Text',
      screen: 'Light Text',
      colorChange: 'Change Color',
      resetPosition: 'Reset Position',
      resetSize: 'Reset Size',
      resetRotation: 'Reset Rotation',
      preview: 'Preview',
      finalSave: 'Final Save',
      
      // Save Complete
      saveComplete: 'Save Complete!',
      saveTip: 'On iOS, select "Save to Photos" after downloading',
      
      // Ad Related
      adSupported: 'Ad-supported Service',
      thankYou: 'Thank you!',
    }
  },
  ja: {
    translation: {
      // Common
      appName: 'Calli - 画像合成',
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      retry: '再試行',
      back: '戻る',
      next: '次へ',
      save: '保存',
      download: 'ダウンロード',
      share: '共有',
      tip: 'ヒント',
      imageSave: '画像保存',
      longPressToSave: '画像を長押しして保存してください',
      saved: '保存されました',
      dropHere: 'ここにドロップ！',
      dragOrClick: 'JPG、PNGファイルをドラッグまたはクリック',
      imageUpload: '画像アップロード',
      uploadComplete: 'アップロード完了！',
      nextStep: '次のステップに移動します...',
      processing: '処理中...',
      imageLoading: '画像読み込み中...',
      selectCropArea: 'クロップ領域を選択してください',
      cropComplete: 'クロップ完了',
      
      // Homepage
      homeTitle: '🎨 Calli',
      homeSubtitle: 'テキストと背景を合成して美しい画像を作成しましょう',
      startButton: '始める',
      
      // Background Upload
      backgroundUploadTitle: '背景画像',
      backgroundUploadSubtitle: '合成する背景画像をアップロードしてください',
      backgroundUploadTip: '高画質の画像を使用するとより良い結果が得られます',
      
      // Text Upload
      textUploadTitle: 'テキスト画像',
      textUploadSubtitle: '合成するテキスト画像をアップロードしてください',
      textUploadTip: 'テキストが鮮明な画像を使用するとより良い結果が得られます',
      processingText: '画像処理中...',
      processingSubtext: '白黒変換とコントラスト調整',
      
      // Crop Page
      cropTitle: 'テキスト切り抜き',
      cropSubtitle: '必要な部分のみを選択してください',
      cropTip: 'テキスト部分のみを正確に選択するとより自然な合成ができます',
      
      // Composite Page
      compositeTitle: '画像合成',
      compositeSubtitle: 'テキストの位置とサイズを調整してください',
      compositeTip: 'テキストをタッチしてドラッグすると移動し、角のハンドルをドラッグするとサイズ調整、回転ハンドルをドラッグすると回転します',
      blendMode: 'ブレンドモード',
      multiply: '暗いテキスト',
      screen: '明るいテキスト',
      colorChange: '色変更',
      resetPosition: '位置リセット',
      resetSize: 'サイズリセット',
      resetRotation: '回転リセット',
      preview: 'プレビュー',
      finalSave: '最終保存',
      
      // Save Complete
      saveComplete: '保存完了！',
      saveTip: 'iOSではダウンロード後に「写真に保存」を選択してください',
      
      // Ad Related
      adSupported: '広告サポートサービス',
      thankYou: 'ありがとうございます！',
    }
  },
  zh: {
    translation: {
      // Common
      appName: 'Calli - 图像合成',
      loading: '加载中...',
      error: '发生错误',
      retry: '重试',
      back: '返回',
      next: '下一步',
      save: '保存',
      download: '下载',
      share: '分享',
      tip: '提示',
      imageSave: '图像保存',
      longPressToSave: '长按图像进行保存',
      saved: '已保存',
      dropHere: '拖放到这里！',
      dragOrClick: '拖拽或点击JPG、PNG文件',
      imageUpload: '图片上传',
      uploadComplete: '上传完成！',
      nextStep: '正在进入下一步...',
      processing: '处理中...',
      imageLoading: '图片加载中...',
      selectCropArea: '请选择裁剪区域',
      cropComplete: '裁剪完成',
      
      // Homepage
      homeTitle: '🎨 Calli',
      homeSubtitle: '通过合成文字和背景创建美丽的图像',
      startButton: '开始',
      
      // Background Upload
      backgroundUploadTitle: '背景图像',
      backgroundUploadSubtitle: '上传要合成的背景图像',
      backgroundUploadTip: '使用高质量图像将获得更好的结果',
      
      // Text Upload
      textUploadTitle: '文字图像',
      textUploadSubtitle: '上传要合成的文字图像',
      textUploadTip: '使用清晰的文字图像将获得更好的结果',
      processingText: '图像处理中...',
      processingSubtext: '转换为黑白并调整对比度',
      
      // Crop Page
      cropTitle: '文字裁剪',
      cropSubtitle: '只选择需要的部分',
      cropTip: '准确选择文字部分将产生更自然的合成效果',
      
      // Composite Page
      compositeTitle: '图像合成',
      compositeSubtitle: '调整文字位置和大小',
      compositeTip: '触摸并拖拽文字可移动，拖拽角落手柄可调整大小，拖拽旋转手柄可旋转',
      blendMode: '混合模式',
      multiply: '深色文字',
      screen: '浅色文字',
      colorChange: '更改颜色',
      resetPosition: '重置位置',
      resetSize: '重置大小',
      resetRotation: '重置旋转',
      preview: '预览',
      finalSave: '最终保存',
      
      // Save Complete
      saveComplete: '保存完成！',
      saveTip: '在iOS上，下载后选择"保存到照片"',
      
      // Ad Related
      adSupported: '广告支持服务',
      thankYou: '谢谢！',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
