import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface ImageContextType {
  backgroundImage: string | null;
  textImage: string | null;
  processedTextImage: string | null;
  croppedTextImage: string | null;
  setBackgroundImage: (image: string | null) => void;
  setTextImage: (image: string | null) => void;
  setProcessedTextImage: (image: string | null) => void;
  setCroppedTextImage: (image: string | null) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [textImage, setTextImage] = useState<string | null>(null);
  const [processedTextImage, setProcessedTextImage] = useState<string | null>(null);
  const [croppedTextImage, setCroppedTextImage] = useState<string | null>(null);

  return (
    <ImageContext.Provider
      value={{
        backgroundImage,
        textImage,
        processedTextImage,
        croppedTextImage,
        setBackgroundImage,
        setTextImage,
        setProcessedTextImage,
        setCroppedTextImage,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};
