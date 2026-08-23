"use client";

import { useEffect } from "react";

export default function AdminBulkSelectAll() {
  useEffect(() => {
    function syncChecks(controller: HTMLInputElement) {
      document.querySelectorAll<HTMLInputElement>(".bulk-check").forEach((check) => {
        check.checked = controller.checked;
      });
    }

    function handleChange(event: Event) {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.id !== "bulk-select-all") return;
      syncChecks(target);
    }

    document.addEventListener("change", handleChange);
    return () => document.removeEventListener("change", handleChange);
  }, []);

  return <span data-admin-bulk-select-ready="true" hidden />;
}
