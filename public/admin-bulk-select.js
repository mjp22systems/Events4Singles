(function () {
  function syncRows(controller) {
    document.querySelectorAll(".bulk-check").forEach(function (check) {
      check.checked = controller.checked;
    });
  }

  document.addEventListener("change", function (event) {
    if (event.target && event.target.id === "bulk-select-all") {
      syncRows(event.target);
    }
  });

  document.addEventListener("input", function (event) {
    if (event.target && event.target.id === "bulk-select-all") {
      syncRows(event.target);
    }
  });

  document.addEventListener("click", function (event) {
    if (event.target && event.target.id === "bulk-select-all") {
      window.setTimeout(function () {
        syncRows(event.target);
      }, 0);
    }
  }, true);
})();
