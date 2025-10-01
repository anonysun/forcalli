import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useImageContext } from '../context/ImageContext';
import LanguageSelector from '../components/LanguageSelector';

const CompositePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { backgroundImage, croppedTextImage, processedTextImage } = useImageContext();
  const [backgroundImg, setBackgroundImg] = useState<HTMLImageElement | null>(null);
  const [textImg, setTextImg] = useState<HTMLImageElement | null>(null);
  const [textPosition, setTextPosition] = useState({ x: 200, y: 200 });
  const [textScale, setTextScale] = useState(1);
  const [textRotation, setTextRotation] = useState(0);
  const [blendMode, setBlendMode] = useState<'multiply' | 'screen'>('multiply');
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationStartAngle, setRotationStartAngle] = useState(0);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [backgroundBounds, setBackgroundBounds] = useState({ x: 0, y: 0, width: 400, height: 400 });
  const [showPreview, setShowPreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertAnimation, setAlertAnimation] = useState<'slideDown' | 'slideUp' | 'hidden'>('hidden');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 이미지가 없을 때 즉시 리다이렉트
  useEffect(() => {
    console.log('Checking images:', { backgroundImage: !!backgroundImage, croppedTextImage: !!croppedTextImage });
    if (!backgroundImage || !croppedTextImage) {
      console.log('Images missing, redirecting to home');
      // 즉시 첫 페이지로 리다이렉트
      navigate('/', { replace: true });
    }
  }, [backgroundImage, croppedTextImage, navigate]);

  // 이미지 로드
  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        console.log('Background image loaded:', img.width, img.height); // 디버깅
        setBackgroundImg(img);
      };
      img.src = backgroundImage;
    }
  }, [backgroundImage]);

  useEffect(() => {
    console.log('All images from context:', {
      backgroundImage: backgroundImage ? 'exists' : 'null',
      croppedTextImage: croppedTextImage ? 'exists' : 'null',
      processedTextImage: processedTextImage ? 'exists' : 'null'
    }); // 디버깅
    
    // 자른 이미지 사용
    if (croppedTextImage) {
      const img = new Image();
      img.onload = () => {
        console.log('Text image loaded:', img.width, img.height); // 디버깅
        setTextImg(img);
      };
      img.src = croppedTextImage;
    }
  }, [processedTextImage, backgroundImage, croppedTextImage]);

  // 캔버스 표시 크기 기준으로 스케일 계산
  useEffect(() => {
    if (backgroundImg && textImg) {
      console.log('Calculating scale:', {
        backgroundSize: backgroundImg.width + 'x' + backgroundImg.height,
        textSize: textImg.width + 'x' + textImg.height,
        canvasSize: '400x400'
      });
      
      // 캔버스 크기 (400x400)의 반 정도로 글씨 이미지 크기 조정
      const canvasSize = 400; // 캔버스 크기
      const targetTextSize = canvasSize * 0.5; // 캔버스 크기의 반
      
      // 글씨 이미지의 더 긴 변을 기준으로 스케일 계산
      const textMaxDimension = Math.max(textImg.width, textImg.height);
      const scale = targetTextSize / textMaxDimension;
      
      console.log('Scale calculation:', {
        canvasSize,
        targetTextSize,
        textMaxDimension,
        calculatedScale: scale
      });
      
      setTextScale(Math.max(0.1, Math.min(1, scale))); // 최소 0.1, 최대 1로 제한
    }
  }, [backgroundImg, textImg]);

  // 배경 이미지 영역이 설정되면 글씨 위치를 중앙으로 설정 (한 번만)
  useEffect(() => {
    if (backgroundBounds.width > 0 && backgroundBounds.height > 0 && 
        textPosition.x === 200 && textPosition.y === 200) { // 초기 위치일 때만
      setTextPosition({
        x: backgroundBounds.x + backgroundBounds.width / 2,
        y: backgroundBounds.y + backgroundBounds.height / 2
      });
    }
  }, [backgroundBounds.width, backgroundBounds.height]); // width, height만 의존성으로

  // 캔버스에 이미지 그리기
  useEffect(() => {
    if (backgroundImg && textImg && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 캔버스 크기 설정 (고정 크기로 내부 좌표 일정하게 유지)
      canvas.width = 400;
      canvas.height = 400;

      // 배경 이미지 비율 유지하면서 전체 이미지가 보이도록 그리기
      const canvasAspect = 400 / 400; // 1:1 정사각형
      const imageAspect = backgroundImg.width / backgroundImg.height;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (imageAspect > canvasAspect) {
        // 이미지가 더 넓은 경우 (가로가 긴 이미지)
        drawWidth = 400;
        drawHeight = 400 / imageAspect;
        offsetX = 0;
        offsetY = (400 - drawHeight) / 2;
      } else {
        // 이미지가 더 높은 경우 (세로가 긴 이미지)
        drawWidth = 400 * imageAspect;
        drawHeight = 400;
        offsetX = (400 - drawWidth) / 2;
        offsetY = 0;
      }
      
      // 배경 이미지 영역 정보 저장
      setBackgroundBounds({ x: offsetX, y: offsetY, width: drawWidth, height: drawHeight });
      
      // 배경 이미지 그리기 (비율 유지)
      ctx.drawImage(backgroundImg, offsetX, offsetY, drawWidth, drawHeight);

      // 글씨 이미지 그리기
      ctx.save();
      ctx.translate(textPosition.x, textPosition.y);
      ctx.rotate((textRotation * Math.PI) / 180);
      ctx.scale(textScale, textScale);
      
      // 텍스트 이미지 그리기
      if (!textImg) return;
      
      // 블렌드 모드 적용 (브라우저 호환성 개선)
      if (blendMode === 'multiply') {
        // 검은 글씨: multiply 모드 (어두운 부분만 남김)
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(textImg, -textImg.width / 2, -textImg.height / 2);
      } else {
        // 흰 글씨: 별도 캔버스에서 반전 처리 후 합성
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;
        
        tempCanvas.width = textImg.width;
        tempCanvas.height = textImg.height;
        
        // 임시 캔버스에 원본 이미지 그리기
        tempCtx.drawImage(textImg, 0, 0);
        
        // 이미지 데이터 가져와서 반전 처리
        const imageData = tempCtx.getImageData(0, 0, textImg.width, textImg.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];     // Red 반전
          data[i + 1] = 255 - data[i + 1]; // Green 반전
          data[i + 2] = 255 - data[i + 2]; // Blue 반전
          // Alpha는 그대로 유지
        }
        
        // 반전된 데이터를 임시 캔버스에 다시 그리기
        tempCtx.putImageData(imageData, 0, 0);
        
        // 반전된 이미지를 원래 캔버스에 그리기 (screen 모드로 밝은 부분만 남김)
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(tempCanvas, -textImg.width / 2, -textImg.height / 2);
      }
      
      ctx.restore();

      // 핸들 그리기 (회전된 좌표계에서)
      const textWidth = textImg.width * textScale;
      const textHeight = textImg.height * textScale;
      const handleSize = 12; // 편집점 크기 증가

      ctx.save();
      ctx.translate(textPosition.x, textPosition.y);
      ctx.rotate((textRotation * Math.PI) / 180);
      
      ctx.fillStyle = '#3B82F6';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;

      // 모서리 핸들들 (회전된 좌표계에서)
      const handles = [
        { x: -textWidth/2, y: -textHeight/2 }, // 북서
        { x: textWidth/2, y: -textHeight/2 }, // 북동
        { x: -textWidth/2, y: textHeight/2 }, // 남서
        { x: textWidth/2, y: textHeight/2 }, // 남동
      ];

      handles.forEach(handle => {
        ctx.beginPath();
        ctx.arc(handle.x, handle.y, handleSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      });

      // 회전 핸들 (회전된 좌표계에서)
      const rotateHandle = {
        x: 0,
        y: -textHeight/2 - 30
      };
      
      ctx.beginPath();
      ctx.arc(rotateHandle.x, rotateHandle.y, handleSize, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // 회전 핸들 연결선
      ctx.beginPath();
      ctx.moveTo(0, -textHeight/2);
      ctx.lineTo(rotateHandle.x, rotateHandle.y);
      ctx.stroke();

      ctx.restore();
    }
  }, [backgroundImg, textImg, textPosition, textScale, textRotation, blendMode]);

  // 마우스/터치 이벤트 핸들러
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 캔버스 스케일 계산 (실제 캔버스 크기 vs 화면 표시 크기)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    // 글씨 이미지 영역과 핸들 확인 (회전된 좌표계 고려)
    const textX = textPosition.x;
    const textY = textPosition.y;
    const textWidth = textImg ? textImg.width * textScale : 50;
    const textHeight = textImg ? textImg.height * textScale : 50;
    const handleSize = 20; // 핸들 크기
    const rotationRad = (textRotation * Math.PI) / 180;

    // 회전된 좌표계에서 핸들 위치 계산
    const handles = {
      'nw': { x: textX - textWidth/2, y: textY - textHeight/2 }, // 북서
      'ne': { x: textX + textWidth/2, y: textY - textHeight/2 }, // 북동
      'sw': { x: textX - textWidth/2, y: textY + textHeight/2 }, // 남서
      'se': { x: textX + textWidth/2, y: textY + textHeight/2 }, // 남동
      'rotate': { x: textX, y: textY - textHeight/2 - 30 } // 회전 핸들
    };

    // 회전 변환 적용
    const rotatedHandles: { [key: string]: { x: number, y: number } } = {};
    for (const [handleName, handlePos] of Object.entries(handles)) {
      const dx = handlePos.x - textX;
      const dy = handlePos.y - textY;
      const rotatedX = textX + dx * Math.cos(rotationRad) - dy * Math.sin(rotationRad);
      const rotatedY = textY + dx * Math.sin(rotationRad) + dy * Math.cos(rotationRad);
      rotatedHandles[handleName] = { x: rotatedX, y: rotatedY };
    }

    // 핸들 클릭 확인
    for (const [handleName, handlePos] of Object.entries(rotatedHandles)) {
      if (Math.abs(scaledX - handlePos.x) < handleSize && Math.abs(scaledY - handlePos.y) < handleSize) {
        if (handleName === 'rotate') {
          setIsRotating(true);
          const angle = Math.atan2(scaledY - textY, scaledX - textX);
          setRotationStartAngle(angle - (textRotation * Math.PI) / 180);
        } else {
          setIsResizing(true);
          setResizeHandle(handleName);
        }
        setLastMousePos({ x: scaledX, y: scaledY });
        return;
      }
    }

    // 글씨 이미지 영역 내부인지 확인 (회전된 좌표계에서)
    const dx = scaledX - textX;
    const dy = scaledY - textY;
    const rotatedX = dx * Math.cos(-rotationRad) - dy * Math.sin(-rotationRad);
    const rotatedY = dx * Math.sin(-rotationRad) + dy * Math.cos(-rotationRad);
    
    if (rotatedX >= -textWidth / 2 && rotatedX <= textWidth / 2 &&
        rotatedY >= -textHeight / 2 && rotatedY <= textHeight / 2) {
      
      setIsDragging(true);
      setLastMousePos({ x: scaledX, y: scaledY });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 캔버스 스케일 계산
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    if (isDragging) {
      // 드래그로 위치 이동
      const deltaX = scaledX - lastMousePos.x;
      const deltaY = scaledY - lastMousePos.y;
      
      setTextPosition(prev => ({
        x: Math.max(backgroundBounds.x, Math.min(backgroundBounds.x + backgroundBounds.width, prev.x + deltaX)),
        y: Math.max(backgroundBounds.y, Math.min(backgroundBounds.y + backgroundBounds.height, prev.y + deltaY))
      }));
      
      setLastMousePos({ x: scaledX, y: scaledY });
    } else if (isResizing && resizeHandle) {
      // 크기 조절
      const deltaX = scaledX - lastMousePos.x;
      const deltaY = scaledY - lastMousePos.y;
      
      let scaleDelta = 0;
      if (resizeHandle.includes('e')) scaleDelta += deltaX * 0.01; // 동쪽 핸들
      if (resizeHandle.includes('w')) scaleDelta -= deltaX * 0.01; // 서쪽 핸들
      if (resizeHandle.includes('s')) scaleDelta += deltaY * 0.01; // 남쪽 핸들
      if (resizeHandle.includes('n')) scaleDelta -= deltaY * 0.01; // 북쪽 핸들
      
      setTextScale(prev => Math.max(0.1, Math.min(2, prev + scaleDelta)));
      setLastMousePos({ x: scaledX, y: scaledY });
    } else if (isRotating) {
      // 회전
      const textX = textPosition.x;
      const textY = textPosition.y;
      const angle = Math.atan2(scaledY - textY, scaledX - textX);
      const newRotation = ((angle - rotationStartAngle) * 180) / Math.PI;
      setTextRotation(newRotation);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setIsRotating(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  // 터치 이벤트 핸들러 (passive 이벤트 문제 해결)
  const handleCanvasTouchStart = (e: React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 페이지 스크롤 방지
    e.preventDefault();

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // 캔버스 스케일 계산
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    // 글씨 이미지 영역과 핸들 확인 (회전된 좌표계 고려)
    const textX = textPosition.x;
    const textY = textPosition.y;
    const textWidth = textImg ? textImg.width * textScale : 50;
    const textHeight = textImg ? textImg.height * textScale : 50;
    const handleSize = 25; // 터치 영역 크기 증가
    const rotationRad = (textRotation * Math.PI) / 180;

    // 회전된 좌표계에서 핸들 위치 계산
    const handles = {
      'nw': { x: textX - textWidth/2, y: textY - textHeight/2 }, // 북서
      'ne': { x: textX + textWidth/2, y: textY - textHeight/2 }, // 북동
      'sw': { x: textX - textWidth/2, y: textY + textHeight/2 }, // 남서
      'se': { x: textX + textWidth/2, y: textY + textHeight/2 }, // 남동
      'rotate': { x: textX, y: textY - textHeight/2 - 30 } // 회전 핸들
    };

    // 회전 변환 적용
    const rotatedHandles: { [key: string]: { x: number, y: number } } = {};
    for (const [handleName, handlePos] of Object.entries(handles)) {
      const dx = handlePos.x - textX;
      const dy = handlePos.y - textY;
      const rotatedX = textX + dx * Math.cos(rotationRad) - dy * Math.sin(rotationRad);
      const rotatedY = textY + dx * Math.sin(rotationRad) + dy * Math.cos(rotationRad);
      rotatedHandles[handleName] = { x: rotatedX, y: rotatedY };
    }

    // 핸들 클릭 확인
    for (const [handleName, handlePos] of Object.entries(rotatedHandles)) {
      if (Math.abs(scaledX - handlePos.x) < handleSize && Math.abs(scaledY - handlePos.y) < handleSize) {
        if (handleName === 'rotate') {
          setIsRotating(true);
          const angle = Math.atan2(scaledY - textY, scaledX - textX);
          setRotationStartAngle(angle - (textRotation * Math.PI) / 180);
        } else {
          setIsResizing(true);
          setResizeHandle(handleName);
        }
        setLastMousePos({ x: scaledX, y: scaledY });
        return;
      }
    }

    // 글씨 이미지 영역 내부인지 확인 (회전된 좌표계에서)
    const dx = scaledX - textX;
    const dy = scaledY - textY;
    const rotatedX = dx * Math.cos(-rotationRad) - dy * Math.sin(-rotationRad);
    const rotatedY = dx * Math.sin(-rotationRad) + dy * Math.cos(-rotationRad);
    
    if (rotatedX >= -textWidth / 2 && rotatedX <= textWidth / 2 &&
        rotatedY >= -textHeight / 2 && rotatedY <= textHeight / 2) {
      setIsDragging(true);
      setLastMousePos({ x: scaledX, y: scaledY });
    }
  };

  const handleCanvasTouchMove = (e: React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 페이지 스크롤 방지
    e.preventDefault();

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // 캔버스 스케일 계산
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    if (isDragging) {
      // 드래그로 위치 이동
      const deltaX = scaledX - lastMousePos.x;
      const deltaY = scaledY - lastMousePos.y;
      
      setTextPosition(prev => ({
        x: Math.max(backgroundBounds.x, Math.min(backgroundBounds.x + backgroundBounds.width, prev.x + deltaX)),
        y: Math.max(backgroundBounds.y, Math.min(backgroundBounds.y + backgroundBounds.height, prev.y + deltaY))
      }));
      
      setLastMousePos({ x: scaledX, y: scaledY });
    } else if (isResizing && resizeHandle) {
      // 크기 조절
      const deltaX = scaledX - lastMousePos.x;
      const deltaY = scaledY - lastMousePos.y;
      
      let scaleDelta = 0;
      if (resizeHandle.includes('e')) scaleDelta += deltaX * 0.01; // 동쪽 핸들
      if (resizeHandle.includes('w')) scaleDelta -= deltaX * 0.01; // 서쪽 핸들
      if (resizeHandle.includes('s')) scaleDelta += deltaY * 0.01; // 남쪽 핸들
      if (resizeHandle.includes('n')) scaleDelta -= deltaY * 0.01; // 북쪽 핸들
      
      setTextScale(prev => Math.max(0.1, Math.min(2, prev + scaleDelta)));
      setLastMousePos({ x: scaledX, y: scaledY });
    } else if (isRotating) {
      // 회전
      const textX = textPosition.x;
      const textY = textPosition.y;
      const angle = Math.atan2(scaledY - textY, scaledX - textX);
      const newRotation = ((angle - rotationStartAngle) * 180) / Math.PI;
      setTextRotation(newRotation);
    }
  };

  const handleCanvasTouchEnd = () => {
    setIsDragging(false);
    setIsRotating(false);
    setIsResizing(false);
    setResizeHandle(null);
  };


  // 이미지 다운로드 (고해상도, 편집점 제외)
  const handleDownload = () => {
    if (!backgroundImg || !textImg) return;

    // 고해상도 캔버스 생성 (원본 이미지 크기 기준)
    const outputCanvas = document.createElement('canvas');
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) return;

    // 출력 크기 설정 (배경 이미지 크기 기준, 최대 2048px)
    const maxSize = 2048;
    let outputWidth = backgroundImg.width;
    let outputHeight = backgroundImg.height;

    // 비율 유지하면서 최대 크기로 조정
    if (outputWidth > maxSize || outputHeight > maxSize) {
      const ratio = Math.min(maxSize / outputWidth, maxSize / outputHeight);
      outputWidth = Math.floor(outputWidth * ratio);
      outputHeight = Math.floor(outputHeight * ratio);
    }

    outputCanvas.width = outputWidth;
    outputCanvas.height = outputHeight;

    // 고화질 렌더링 설정
    outputCtx.imageSmoothingEnabled = true;
    outputCtx.imageSmoothingQuality = 'high';

    // 배경 이미지 그리기 (고화질)
    outputCtx.drawImage(backgroundImg, 0, 0, outputWidth, outputHeight);

    // 글씨 이미지 위치와 크기 계산 (배경 이미지 기준으로 정확한 스케일링)
    const backgroundScaleX = outputWidth / backgroundBounds.width;
    const backgroundScaleY = outputHeight / backgroundBounds.height;
    
    // 배경 이미지 중심점을 기준으로 한 상대적 위치 계산
    const relativeX = textPosition.x - backgroundBounds.x - backgroundBounds.width / 2;
    const relativeY = textPosition.y - backgroundBounds.y - backgroundBounds.height / 2;
    
    // 출력 캔버스에서의 절대 위치 계산
    const outputTextX = outputWidth / 2 + relativeX * backgroundScaleX;
    const outputTextY = outputHeight / 2 + relativeY * backgroundScaleY;
    
    // 글씨 크기는 배경 이미지 크기 변화에 비례하여 조정
    const outputTextScale = textScale * Math.min(backgroundScaleX, backgroundScaleY);

    // 고화질 글씨 이미지 그리기
    outputCtx.save();
    
    // 이미지 스무딩 활성화 (고화질 렌더링)
    outputCtx.imageSmoothingEnabled = true;
    outputCtx.imageSmoothingQuality = 'high';
    
    outputCtx.translate(outputTextX, outputTextY);
    outputCtx.rotate((textRotation * Math.PI) / 180);
    outputCtx.scale(outputTextScale, outputTextScale);
    
    // 텍스트 이미지 그리기
    if (!textImg) return;
    
    // 블렌드 모드 적용
    if (blendMode === 'multiply') {
      // 검은 글씨: multiply 모드
      outputCtx.globalCompositeOperation = 'multiply';
      outputCtx.drawImage(textImg, -textImg.width / 2, -textImg.height / 2);
    } else {
      // 흰 글씨: 별도 캔버스에서 반전 처리 후 screen 모드 (미리보기와 동일)
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
      
      tempCanvas.width = textImg.width;
      tempCanvas.height = textImg.height;
      
      // 임시 캔버스에 원본 이미지 그리기
      tempCtx.drawImage(textImg, 0, 0);
      
      // 이미지 데이터 가져와서 반전 처리
      const imageData = tempCtx.getImageData(0, 0, textImg.width, textImg.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];     // Red 반전
        data[i + 1] = 255 - data[i + 1]; // Green 반전
        data[i + 2] = 255 - data[i + 2]; // Blue 반전
        // Alpha는 그대로 유지
      }
      
      // 반전된 데이터를 임시 캔버스에 다시 그리기
      tempCtx.putImageData(imageData, 0, 0);
      
      // 반전된 이미지를 출력 캔버스에 그리기 (screen 모드로 밝은 부분만 남김)
      outputCtx.globalCompositeOperation = 'screen';
      outputCtx.drawImage(tempCanvas, -textImg.width / 2, -textImg.height / 2);
    }
    
    outputCtx.restore();

    // 최종 이미지 생성
    const dataURL = outputCanvas.toDataURL('image/png', 1.0); // 최고 품질

    // 모바일에서는 이미지 미리보기, 데스크톱에서는 직접 다운로드
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // 모바일: 이미지 미리보기 모달 표시
      showImagePreview(dataURL);
    } else {
      // 데스크톱: 직접 다운로드
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'calli-composite.png';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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

  // 이미지 미리보기 모달 표시
  const showImagePreview = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
    setShowPreview(true);
  };

  // 미리보기 모달 닫기
  const closePreview = () => {
    setShowPreview(false);
    setPreviewImageUrl(null);
  };

  // 커스텀 알림 표시
  const showCustomAlertMessage = () => {
    setShowCustomAlert(true);
    setAlertAnimation('slideDown');
    
    // 2초 후 올라가면서 사라지기
    setTimeout(() => {
      setAlertAnimation('slideUp');
      // 애니메이션 완료 후 완전히 숨기기
      setTimeout(() => {
        setShowCustomAlert(false);
        setAlertAnimation('hidden');
      }, 300);
    }, 2000);
  };

  if (!backgroundImg || !textImg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-dongle">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-2xl text-gray-600">이미지 로딩 중...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-dongle">
      {/* 언어 선택기 */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSelector />
      </div>

      <div className="text-center max-w-4xl mx-auto w-full">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4 relative">
            <button
              onClick={handleBack}
              className="absolute left-0 text-4xl text-gray-600 hover:text-gray-800 transition-colors"
            >
              ←
            </button>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-800 text-center">
              {t('compositeTitle')}
            </h1>
          </div>
        </div>

        {/* 컨트롤 */}
        <div className="space-y-4 mb-6">
          {/* 블렌드 모드 버튼 */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setBlendMode('multiply')}
              className={`px-6 py-3 rounded-xl text-xl font-bold transition-colors ${
                blendMode === 'multiply'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {t('multiply')}
            </button>
            <button
              onClick={() => setBlendMode('screen')}
              className={`px-6 py-3 rounded-xl text-xl font-bold transition-colors ${
                blendMode === 'screen'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {t('screen')}
            </button>
          </div>

        {/* 합성 캔버스 */}
        <div className="relative bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="relative w-full h-96 md:h-[500px] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="border border-gray-200 rounded-xl cursor-pointer"
              style={{ 
                width: '100%', 
                height: '100%', 
                maxWidth: '400px', 
                maxHeight: '400px',
                aspectRatio: '1 / 1',
                objectFit: 'contain',
                touchAction: 'none' // 터치 스크롤 방지
              }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              onTouchStart={handleCanvasTouchStart}
              onTouchMove={handleCanvasTouchMove}
              onTouchEnd={handleCanvasTouchEnd}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>

 

          {/* 액션 버튼들 */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleBack}
              className="bg-gray-500 text-white py-3 px-6 rounded-xl text-lg font-bold hover:bg-gray-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              {t('back')}
            </button>
            <button
              onClick={handleDownload}
              className="bg-purple-600 text-white py-3 px-6 rounded-xl text-lg font-bold hover:bg-purple-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              {t('save')}
            </button>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-8 p-4 bg-purple-50 rounded-xl">
          <p className="text-lg text-purple-800">
            💡 <strong>{t('tip')}:</strong> {t('compositeTip')}
          </p>
        </div>

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

      {/* 이미지 미리보기 모달 */}
      {showPreview && previewImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            {/* 닫기 버튼 (우상단 X) */}
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-4">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{t('imageSave')}</h3>
              <p className="text-lg text-gray-600">{t('longPressToSave')}</p>
            </div>
            
            <div className="mb-6">
              <img
                src={previewImageUrl}
                alt="완성된 이미지"
                className="w-full h-auto rounded-xl border border-gray-200"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  // 이미지 저장
                  const link = document.createElement('a');
                  link.href = previewImageUrl;
                  link.download = 'calli-composite.png';
                  link.click();
                  
                  // 커스텀 알림 표시
                  setTimeout(() => {
                    showCustomAlertMessage();
                  }, 500);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 커스텀 알림 */}
      {showCustomAlert && (
        <div 
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
            alertAnimation === 'slideDown' 
              ? 'translate-y-0 opacity-100' 
              : alertAnimation === 'slideUp' 
                ? '-translate-y-20 opacity-0' 
                : 'translate-y-0 opacity-100'
          }`}
        >
          <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center space-x-3">
            <div className="text-2xl">📸</div>
            <div>
              <div className="font-bold text-lg">{t('saveComplete')}</div>
              <div className="text-sm opacity-90">{t('saved')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompositePage;
    