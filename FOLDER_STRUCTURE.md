# Calli 앱 폴더 구조

```
forCalli/
├── 📁 public/
│   └── vite.svg
├── 📁 src/
│   ├── 📄 main.tsx                    # 🚀 앱 진입점
│   ├── 📄 App.tsx                     # 🏠 메인 앱 (라우팅)
│   ├── 📄 index.css                   # 🎨 글로벌 스타일
│   ├── 📁 assets/
│   │   └── react.svg
│   ├── 📁 components/                 # 🔧 재사용 컴포넌트
│   │   ├── 📄 Layout.tsx              # 📐 공통 레이아웃
│   │   ├── 📄 Header.tsx              # 📋 헤더
│   │   ├── 📄 UploadButton.tsx        # ⬆️ 업로드 버튼
│   │   ├── 📄 ImagePreview.tsx        # 🖼️ 이미지 미리보기
│   │   ├── 📄 GestureControls.tsx     # 👆 제스처 컨트롤
│   │   └── 📄 BlendModeSelector.tsx   # 🎭 블렌드 모드 선택
│   ├── 📁 pages/                      # 📄 페이지 컴포넌트
│   │   ├── 📄 HomePage.tsx            # 🏠 홈 (시작)
│   │   ├── 📄 BackgroundUpload.tsx    # 🖼️ 배경 업로드
│   │   ├── 📄 TextUpload.tsx          # ✍️ 글씨 업로드
│   │   ├── 📄 CropPage.tsx            # ✂️ 글씨 자르기
│   │   └── 📄 CompositePage.tsx      # 🎨 이미지 합성
│   ├── 📁 hooks/                      # 🪝 커스텀 훅
│   │   ├── 📄 useImageUpload.ts       # 📤 이미지 업로드
│   │   ├── 📄 useImageProcessing.ts   # 🔄 이미지 처리
│   │   ├── 📄 useKonva.ts             # 🎨 Konva 캔버스
│   │   └── 📄 useCrop.ts              # ✂️ 크롭 기능
│   ├── 📁 utils/                      # 🛠️ 유틸리티
│   │   ├── 📄 imageUtils.ts           # 🖼️ 이미지 처리
│   │   ├── 📄 canvasUtils.ts          # 🎨 캔버스 함수
│   │   ├── 📄 downloadUtils.ts        # 💾 다운로드
│   │   └── 📄 fileUtils.ts            # 📁 파일 처리
│   └── 📁 types/                      # 📝 타입 정의
│       ├── 📄 image.ts                # 🖼️ 이미지 타입
│       ├── 📄 composite.ts            # 🎨 합성 타입
│       └── 📄 upload.ts               # 📤 업로드 타입
├── 📄 package.json                    # 📦 의존성
├── 📄 tailwind.config.js              # 🎨 Tailwind 설정
├── 📄 vite.config.ts                  # ⚡ Vite 설정
└── 📄 tsconfig.json                   # 📝 TypeScript 설정
```

## 🔄 페이지 흐름도

```
🏠 HomePage
    ↓ [시작하기]
🖼️ BackgroundUpload
    ↓ [업로드 완료]
✍️ TextUpload
    ↓ [흑백 변환 완료]
✂️ CropPage
    ↓ [자르기 완료]
🎨 CompositePage
    ↓ [저장하기]
💾 Download Complete
```

## 📱 컴포넌트 계층도

```
App.tsx (라우터)
├── Layout.tsx
│   ├── Header.tsx
│   └── 페이지들
│       ├── HomePage.tsx
│       ├── BackgroundUpload.tsx
│       │   ├── UploadButton.tsx
│       │   └── ImagePreview.tsx
│       ├── TextUpload.tsx
│       │   ├── UploadButton.tsx
│       │   └── ImagePreview.tsx
│       ├── CropPage.tsx
│       │   └── ImagePreview.tsx
│       └── CompositePage.tsx
│           ├── GestureControls.tsx
│           └── BlendModeSelector.tsx
```

## 🎯 주요 기능별 파일

### 📤 업로드 관련
- `BackgroundUpload.tsx` - 배경 이미지 업로드
- `TextUpload.tsx` - 글씨 이미지 업로드
- `useImageUpload.ts` - 업로드 로직
- `imageUtils.ts` - 이미지 처리

### ✂️ 크롭 관련
- `CropPage.tsx` - 글씨 자르기 페이지
- `useCrop.ts` - 크롭 로직
- `react-easy-crop` 라이브러리 사용

### 🎨 합성 관련
- `CompositePage.tsx` - 이미지 합성 페이지
- `useKonva.ts` - Konva 캔버스 조작
- `GestureControls.tsx` - 드래그/회전/크기조절
- `BlendModeSelector.tsx` - 블렌드 모드 선택

### 💾 저장 관련
- `downloadUtils.ts` - 다운로드 기능
- `fileUtils.ts` - 파일 처리

