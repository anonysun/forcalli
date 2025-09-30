# Calli - 이미지 합성 앱 프로젝트 개요

## 📁 파일 구조

```
src/
├── main.tsx                 # 앱 진입점
├── App.tsx                  # 메인 앱 컴포넌트 (라우팅)
├── index.css                # 글로벌 스타일
├── components/              # 재사용 가능한 컴포넌트
│   ├── Layout.tsx           # 공통 레이아웃
│   ├── Header.tsx           # 헤더 컴포넌트
│   ├── UploadButton.tsx     # 업로드 버튼 컴포넌트
│   ├── ImagePreview.tsx     # 이미지 미리보기 컴포넌트
│   └── GestureControls.tsx  # 제스처 컨트롤 컴포넌트
├── pages/                   # 페이지 컴포넌트
│   ├── HomePage.tsx         # 홈페이지 (시작)
│   ├── BackgroundUpload.tsx # 배경 이미지 업로드
│   ├── TextUpload.tsx       # 글씨 이미지 업로드
│   ├── CropPage.tsx         # 글씨 자르기
│   └── CompositePage.tsx    # 이미지 합성
├── hooks/                   # 커스텀 훅
│   ├── useImageUpload.ts    # 이미지 업로드 로직
│   ├── useImageProcessing.ts # 이미지 처리 (흑백 변환)
│   └── useKonva.ts          # Konva 캔버스 조작
├── utils/                   # 유틸리티 함수
│   ├── imageUtils.ts        # 이미지 처리 함수
│   ├── canvasUtils.ts       # 캔버스 관련 함수
│   └── downloadUtils.ts     # 다운로드 함수
└── types/                   # TypeScript 타입 정의
    ├── image.ts             # 이미지 관련 타입
    └── composite.ts         # 합성 관련 타입
```

## 🔄 페이지 흐름

```
HomePage (시작)
    ↓
BackgroundUpload (배경 업로드)
    ↓
TextUpload (글씨 업로드 + 흑백 변환)
    ↓
CropPage (글씨 자르기)
    ↓
CompositePage (합성 + 저장)
```

## 🛠️ 주요 기능별 구현

### 1. 배경 업로드 (BackgroundUpload.tsx)
- JPG/PNG 파일 업로드
- 드래그 앤 드롭 지원
- 이미지 미리보기
- 업로드 완료 후 자동 이동

### 2. 글씨 업로드 (TextUpload.tsx)
- JPG/PNG 파일 업로드
- 자동 흑백 변환 (Canvas API)
- 대비 100% 처리
- 결과 미리보기

### 3. 글씨 자르기 (CropPage.tsx)
- react-easy-crop 사용
- 수동 사각형 크롭
- 실시간 미리보기
- 흑백 PNG 출력 (투명 배경)

### 4. 이미지 합성 (CompositePage.tsx)
- react-konva 사용
- 배경 고정, 글씨 드래그 가능
- 회전, 크기 조절 (비율 고정)
- 블렌드 모드: multiply/screen
- 실시간 미리보기

### 5. 저장 기능
- PNG/JPG 다운로드
- 모바일 갤러리 저장
- iOS "사진에 저장" 안내

## 📱 UI/UX 특징

- **모바일 우선**: Tailwind CSS 반응형 디자인
- **제스처 기반**: 드래그, 핀치, 회전 조작
- **버튼 최소화**: 전체 배경이 한눈에 보이도록
- **직관적 흐름**: 단계별 가이드

## 🔧 기술 스택

- **React + Vite**: 빠른 개발 환경
- **Tailwind CSS**: 모바일 우선 스타일링
- **react-konva**: 이미지 합성 및 조작
- **react-easy-crop**: 이미지 크롭
- **Canvas API**: 이미지 처리 (흑백 변환)
- **TypeScript**: 타입 안전성

## 📋 구현 순서

1. **기본 구조 설정** (라우팅, 레이아웃)
2. **배경 업로드 페이지**
3. **글씨 업로드 페이지** (흑백 변환)
4. **글씨 자르기 페이지**
5. **이미지 합성 페이지**
6. **저장 기능**
7. **모바일 최적화**

## 🎯 핵심 제약사항

- 결과물만 저장 (중간 데이터 저장 없음)
- 이미지는 사용자 로컬에 임시저장
- 모바일 갤러리 저장 지원
- iOS 다운로드 후 "사진에 저장" 안내

