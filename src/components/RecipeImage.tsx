'use client';

import Image from 'next/image';
import { useState } from 'react';

interface RecipeImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
}

const RecipeImage: React.FC<RecipeImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  fill = false,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc('/images/recipe-placeholder.svg');
    }
  };

  const imageProps = {
    src: imgSrc,
    alt,
    className,
    onError: handleError,
    priority,
    ...props,
  };

  if (fill) {
    return <Image {...imageProps} fill alt={alt} />;
  }

  return <Image {...imageProps} width={width || 400} height={height || 300} alt={alt} />;
};

export default RecipeImage;
