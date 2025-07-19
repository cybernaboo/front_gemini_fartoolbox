document.addEventListener("DOMContentLoaded", () => {
  const tabsContainer = document.querySelector(".tabs");
  const serviceTable = document.querySelector("table");

  // Gérer le changement d'onglet !
  tabsContainer.addEventListener("click", (event) => {
    const clickedTab = event.target;
    if (!clickedTab.matches(".tab-link")) return;

    document
      .querySelectorAll(".tab-link")
      .forEach((tab) => tab.classList.remove("active"));
    clickedTab.classList.add("active");

    const tabId = clickedTab.dataset.tab;
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
      if (content.id === tabId) {
        content.classList.add("active");
      }
    });
  });

  function AddListeners() {
    // Gérer les actions de masse
    document
      .querySelector(".btn-start")
      .addEventListener("click", () => handleColumnAction("start"));
    document
      .querySelector(".btn-stop")
      .addEventListener("click", () => handleColumnAction("stop"));
    document
      .querySelector(".btn-restart")
      .addEventListener("click", () => handleColumnAction("restart"));

    // Gérer les actions globales
    document
      .querySelector(".btn-get-status")
      .addEventListener("click", () => handleGlobalAction("get-status"));
    document
      .querySelector(".btn-start-all")
      .addEventListener("click", () => handleGlobalAction("start"));
    document
      .querySelector(".btn-stop-all")
      .addEventListener("click", () => handleGlobalAction("stop"));
    document
      .querySelector(".btn-restart-all")
      .addEventListener("click", () => handleGlobalAction("restart"));

    const generateButton = document.querySelector(
      ".btn-generate-dataflowextract"
    );
    if (generateButton) {
      console.log("DataFlowExtractPushButton initialized");
      generateButton.addEventListener("click", async () => {
        generateButton.style.backgroundColor = "var(--await-bg-color)"; // Change to orange
        await DataFlowExtractPushButton();
        generateButton.style.backgroundColor = ""; // Reset to initial color
      });
    }
  }

  AddListeners();

  function handleColumnAction(action) {
    const checkboxes = document.querySelectorAll(
      `.action-checkbox[data-action="${action}"]:checked`
    );
    checkboxes.forEach((checkbox) => {
      const row = checkbox.closest("tr");
      if (action === "start" || action === "restart") {
        simulateStarting(row, action);
      } else {
        updateServiceStatus(row, getActionStatus(action));
      }
      checkbox.checked = false; // Décocher après l'action
    });
  }

  function handleGlobalAction(action) {
    const allRows = serviceTable.querySelectorAll("tbody tr");
    allRows.forEach((row) => {
      if (action === "get-status") {
        // Simuler un statut aléatoire pour Get Status
        const randomStatus = Math.random() < 0.5 ? "Running" : "Stopped";
        updateServiceStatus(row, randomStatus);
      } else if (action === "start" || action === "restart") {
        simulateStarting(row, action);
      } else {
        updateServiceStatus(row, getActionStatus(action));
      }
    });
  }

  function simulateStarting(row, action) {
    const statusDiv = row.querySelector(".status");
    statusDiv.dataset.status = "Starting";
    statusDiv.innerHTML = `<span class="status-indicator"></span>Starting...`;

    setTimeout(() => {
      updateServiceStatus(row, getActionStatus(action));
    }, 2000); // Simule un délai de 2 secondes
  }

  function getActionStatus(action) {
    switch (action) {
      case "start":
      case "restart":
        return "Running";
      case "stop":
        return "Stopped";
      default:
        return "Unknown";
    }
  }

  function updateServiceStatus(row, newStatus) {
    const statusDiv = row.querySelector(".status");
    statusDiv.dataset.status = newStatus;
    statusDiv.innerHTML = `<span class="status-indicator"></span>${newStatus}`;
  }
});
