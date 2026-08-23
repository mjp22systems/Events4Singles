(function () {
  function syncRows(controller) {
    var root = controller.form || document;
    root.querySelectorAll(".bulk-check").forEach(function (check) {
      check.checked = controller.checked;
    });
  }

  function resetControllers() {
    document.querySelectorAll("#bulk-select-all").forEach(function (controller) {
      controller.checked = false;
      syncRows(controller);
    });
  }

  document.addEventListener("DOMContentLoaded", resetControllers);
  window.addEventListener("pageshow", resetControllers);

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
