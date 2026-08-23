"use client";

export default function AdminBulkSelectAll() {
  function syncChecks(checked: boolean) {
    document.querySelectorAll<HTMLInputElement>(".bulk-check").forEach((check) => {
      check.checked = checked;
    });
  }

  return (
    <>
      <input
        type="checkbox"
        id="bulk-select-all"
        aria-label="Select all rows"
        onChange={(event) => syncChecks(event.currentTarget.checked)}
      />
      <span data-admin-bulk-select-ready="true" hidden />
    </>
  );
}
