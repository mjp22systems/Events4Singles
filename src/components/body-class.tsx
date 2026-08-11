"use client";
import { useEffect } from "react";

export default function BodyClass({ add }: { add: string }) {
  useEffect(() => {
    document.body.classList.add(add);
    return () => { document.body.classList.remove(add); };
  }, [add]);
  return null;
}
