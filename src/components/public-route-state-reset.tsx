"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PublicRouteStateReset() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.remove("drawer-open");
  }, [pathname]);

  return null;
}
