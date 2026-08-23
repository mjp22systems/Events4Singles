"use client";

import { useEffect, useRef } from "react";

type AdminBulkSelectAllProps = {
  form?: string;
};

export default function AdminBulkSelectAll({ form }: AdminBulkSelectAllProps) {
  const readyRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    readyRef.current?.setAttribute("data-admin-bulk-select-ready", "true");
  }, []);

  function syncChecks(controller: HTMLInputElement) {
    const checks = controller.form
      ? Array.from(document.querySelectorAll<HTMLInputElement>(".bulk-check")).filter((check) => check.form === controller.form)
      : Array.from(document.querySelectorAll<HTMLInputElement>(".bulk-check"));

    checks.forEach((check) => {
      check.checked = controller.checked;
    });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    syncChecks(event.currentTarget);
  }

  return (
    <>
      <input
        autoComplete="off"
        type="checkbox"
        id="bulk-select-all"
        form={form}
        aria-label="Select all rows"
        onChange={handleChange}
      />
      <span ref={readyRef} hidden />
    </>
  );
}
