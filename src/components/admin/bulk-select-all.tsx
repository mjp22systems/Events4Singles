"use client";

export default function AdminBulkSelectAll() {
  function syncChecks(controller: HTMLInputElement) {
    const root = controller.form ?? document;
    root.querySelectorAll<HTMLInputElement>(".bulk-check").forEach((check) => {
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
        aria-label="Select all rows"
        onChange={handleChange}
      />
      <span data-admin-bulk-select-ready="true" hidden />
    </>
  );
}
