// import all from services.js
import {
  dataFlowLogExtract,
  ProtobufExtract,
  getServiceList,
  serviceGlobalAction,
  serviceAction
} from './services.js';

let apiPort;
fetchParameters(); // Fetch API port from parameters.json
export { apiPort }; // Export apiPort for use in other modules

let platformList = [];
let defaultPlatform = "";

async function fetchParameters() {
  try {
    const response = await fetch('parameters.json');
    const data = await response.json();
    apiPort = data.Port;
    platformList = data.Platforms.Platform || [];
    defaultPlatform = data.Platforms["Default platform"] || "";
    populateDropdown(); // Populate dropdowns with fetched parameters
    console.log("Parameters fetched:", { apiPort, platformList, defaultPlatform });
  } catch (error) {
    console.error("Error fetching API port:", error);
  }
}


function populateDropdown() {
  // feed dataflowLogExtractPlatform & servicePlatform dropdowns
  const servicePlatformDropdown = document.querySelector("#servicePlatform");
  const dataflowLogExtractPlatformDropdown = document.querySelector("#dataflowLogExtractPlatform");
  dataflowLogExtractPlatformDropdown.innerHTML = ""; // Clear existing options
  servicePlatformDropdown.innerHTML = ""; // Clear existing options
  //    if (!servicePlatformDropdown || !dataflowLogExtractPlatformDropdown) {
  platformList.forEach((platform) => {
    const option = document.createElement("option");
    option.value = platform;
    option.textContent = platform;
    if (platform === defaultPlatform) {
      option.selected = true; // Set default platform as selected
    }
    servicePlatformDropdown.appendChild(option);
    const option2 = option.cloneNode(true);
    if (option.selected)
      option2.selected = true;
    dataflowLogExtractPlatformDropdown.appendChild(option2);
  });
}

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

  function initialize() {
    populateDropdown();
  };

  function AddListeners() {
    // Gérer les actions de masse
    document
      .querySelector(".btn-start")
      .addEventListener("click", () => serviceHandleColumnAction("start", "btn-start"));
    document
      .querySelector(".btn-stop")
      .addEventListener("click", () => serviceHandleColumnAction("stop", "btn-stop"));
    document
      .querySelector(".btn-restart")
      .addEventListener("click", () => serviceHandleColumnAction("restart", "btn-restart"));

    // Gérer les actions globales
    document
      .querySelector(".btn-get-status")
      .addEventListener("click", () => serviceHandleGlobalAction("get-status", "btn-get-status"));
    document
      .querySelector(".btn-start-all")
      .addEventListener("click", () => serviceHandleGlobalAction("All_Service_Start", "btn-start-all"));
    document
      .querySelector(".btn-stop-all")
      .addEventListener("click", () => serviceHandleGlobalAction("All_Service_Stop", "btn-stop-all"));
    document
      .querySelector(".btn-restart-all")
      .addEventListener("click", () => serviceHandleGlobalAction("All_Service_Restart", "btn-restart-all"
      ));

    const generateDataflowExtractButton = document.querySelector(
      "#generateDataflowExtractButton"
    );
    if (generateDataflowExtractButton) {
      console.log("dataFlowLogExtract initialized");
      generateDataflowExtractButton.addEventListener("click", async () => {
        handleDataFlowLogExtract();
      });
    }

    const generateProtobufExtractButton = document.querySelector(
      "#generateProtobufButton"
    );
    if (generateProtobufExtractButton) {
      console.log("ProtobufExtractButton initialized");
      generateProtobufExtractButton.addEventListener("click", async () => {
        handleProtobufExtract();
      });
    }
  }

  initialize();
  AddListeners();

  function handleDataFlowLogExtract() {
    const dataflowLogExtractPlatform = document.querySelector("#dataflowLogExtractPlatform").value;
    const dateId = document.querySelector("#dateId").value;
    const inputId = document.querySelector("#inputId").value;
    const dataflow = document.querySelector("#dataflow").value;
    const nbLignes = document.querySelector("#nbLignes").value;
    const generateDataflowExtractButton = document.querySelector(
      "#generateDataflowExtractButton"
    );
    if (!generateDataflowExtractButton)
      alert("Generate DataFlow Extract button not found.");
    /*
        if (!dateId || !inputId || !dataflow || !nbLignes) {
          alert("Please fill in all fields for DataFlow extraction.");
          return;
        }
        */
    generateDataflowExtractButton.style.backgroundColor = "var(--await-bg-color)"; // Change to orange
    dataFlowLogExtract(dataflowLogExtractPlatform, dateId, inputId, dataflow, nbLignes)
      .then((result) => {
        if (result.status === 'ok') {
          console.log("DataFlow extraction successful:", result.message);
        } else {
          alert(`Error during DataFlow extraction: ${result.message}`);
          console.error("Error during DataFlow extraction:", result.message);
        }
      })
      .catch((error) => {
        console.error("Error during DataFlow extraction:", error);
        alert(`Error during DataFlow extraction: ${error.message}`);
      })
      .finally(() => {
        generateDataflowExtractButton.style.backgroundColor = ""; // Reset to initial color
      });
  }

  function handleProtobufExtract() {
    //queryselector using field ids
    const filename = document.querySelector("#protobufFilename").value;
    const filterType = document.querySelector("#filterType").value;
    const filterValue = document.querySelector("#filterValue").value;
    const generateProtobufExtractButton = document.querySelector("#generateProtobufButton")
    if (!filename || !filterType || !filterValue) {
      alert("Please fill in all fields for Protobuf extraction.");
      return;
    }
    generateProtobufExtractButton.style.backgroundColor = "var(--await-bg-color)"; // Change to orange
    ProtobufExtract(filename, filterType, filterValue).then((result) => {
      generateProtobufExtractButton.style.backgroundColor = ""; // Reset to initial color
    });
  }

  function serviceHandleColumnAction(action, button) {
    const serviceList = getServiceDataFromTable(action);
    const platform = document.querySelector(".platform").value;
    const globalActionButton = document.querySelector(`.${button}`);
    if (!globalActionButton) {
      alert(`Global action button '${button}' not found.`);
      return;
    }
    globalActionButton.style.backgroundColor = "var(--await-bg-color)"; // Change to orange 
    serviceAction(serviceList, action, platform).then((result) => {
      if (result[0] == 'ok') {
        console.log(`Action '${action}' executed successfully on selected services.`);
      } else {
        alert(`Error executing action '${action}': ${result[1]}`);
        console.error(`Error executing action '${action}':`, result[1]);
      }
    }).finally(() => {
      globalActionButton.style.backgroundColor = ""; // Reset to initial color
      serviceHandleGetStatus(platform);
    });
  }

  function serviceHandleGlobalAction(action, button) {
    const platform = document.querySelector("#servicePlatform").value;
    if (action == "get-status") { serviceHandleGetStatus(platform); }
    else {
      // put global action button background color to orange
      const globalActionButton = document.querySelector(`.${button}`);
      if (!globalActionButton) {
        alert(`Global action button '${button}' not found.`);
        return;
      }
      globalActionButton.style.backgroundColor = "var(--await-bg-color)"; // Change to orange
      serviceGlobalAction(action, platform).then((result) => {
        if (result[0] == 'ok') {
          console.log(`Global action '${action}' executed successfully.`);
        }
        else {
          alert(`Error executing global action '${action}' : ${result[1]}`);
          console.error(`Error executing global action '${action}': ${result[1]}`);
        }
      }).catch((error) => {
        console.error(`Error during global action '${action}':`, error);
      }
      ).finally(() => {
        globalActionButton.style.backgroundColor = ""; // Reset to initial color
        serviceHandleGetStatus(platform);
      });
    }
  }

  function getServiceDataFromTable(action) {
    const serviceList = [];
    const checkboxes = document.querySelectorAll(`.action-checkbox[data-action="${action}"]`);
    console.log(`Checkboxes for action '${action}':`, checkboxes);
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const row = checkbox.closest("tr");
        const serviceName = row.querySelector("td:first-child").textContent.trim();
        serviceList.push(serviceName);
      }
    });
    if (serviceList.length === 0) {
      console.warn(`No services selected for action '${action}'.`);
      alert(`No services selected for action '${action}'. Please select at least one service.`);
    }
    return serviceList;
  }

  function serviceHandleGetStatus() {
    const platform = document.querySelector(".platform").value;
    console.log(`Fetching service status for platform: ${platform}`);
    // put getstatus button background color to orange
    const getStatusButton = document.querySelector(".btn-get-status");
    getStatusButton.style.backgroundColor = "var(--await-bg-color)"; // Change to orange
    // Fetch service status and populate the table
    getServiceList(platform).then((serviceList) => {
      populateServiceTable(serviceList);
      console.log("Service status fetched and table populated.");
    }).catch((error) => {
      console.error("Error fetching service status:", error);
    }).finally(() => {
      getStatusButton.style.backgroundColor = ""; // Reset to initial color
    });
  }

  function populateServiceTable(serviceList) {
    const tbody = serviceTable.querySelector("tbody");
    tbody.innerHTML = ""; // Clear existing rows
    serviceList.forEach((service) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${service.name}</td>
        <td class="status" data-status="${service.status}">
          <span class="status-indicator"></span>${service.status}
        </td>
        <td>          <input type="checkbox" class="action-checkbox checkbox-start" data-action="start" />
        </td>
        <td>
          <input type="checkbox" class="action-checkbox checkbox-stop" data-action="stop" />
        </td>
        <td>
          <input type="checkbox" class="action-checkbox checkbox-restart" data-action="restart" />
        </td>
      `;
      tbody.appendChild(row);
    });
  }
});
