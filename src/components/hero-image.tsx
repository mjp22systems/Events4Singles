"use client";
import { useState } from "react";

interface Props {
  src: string;
  fallbackSrc?: string;
  alt: string;
}

export default function HeroImage({ src, fallbackSrc, alt }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <img
      alt={alt}
      loading="eager"
      src={currentSrc}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        } else {
          setHidden(true);
        }
      }}
    />
  );
}
