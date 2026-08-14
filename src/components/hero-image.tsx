"use client";
import { useState } from "react";

interface Props {
  src: string;
  fallbacks?: string[];
  alt: string;
  title?: string;
}

export default function HeroImage({ src, fallbacks = [], alt, title }: Props) {
  const srcs = [src, ...fallbacks];
  const [idx, setIdx] = useState(0);

  if (idx >= srcs.length) return null;

  return (
    <img
      alt={alt}
      loading="eager"
      src={srcs[idx]}
      title={title || alt}
      onError={() => setIdx((i) => i + 1)}
    />
  );
}
