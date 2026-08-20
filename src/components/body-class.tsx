"use client";
import { useEffect } from "react";

const PAGE_BG: Record<string, string> = {
  "e4s-page-category": "#539592",
  "e4s-page-location": "#539592",
  "e4s-page-child":    "#539592",
};

export default function BodyClass({ add }: { add: string }) {
  useEffect(() => {
    document.body.classList.add(add);
    return () => { document.body.classList.remove(add); };
  }, [add]);

  const bg = PAGE_BG[add];
  if (!bg) return null;
  // Rendered on server — sets --e4s-page-bg before first paint, eliminating flash.
  return <style>{`body{--e4s-page-bg:${bg}}`}</style>;
}
