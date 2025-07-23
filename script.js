// import all from services.js
import {
  dataFlowLogExtract,
  ProtobufExtract,
  getServiceList,
  serviceGlobalAction,
  serviceAction,
  PushTestSetup,
  PushTestReset
} from './services.js';

let apiPort;
fetchParameters(); // Fetch API port from parameters.json
export { apiPort }; // Export apiPort for use in other modules

let platformList = [];
let defaultPlatform = "";
let pushTestDefaultFolder = "";
let pushTestDefaultFilename = "";
let pushTestDefaultProtobufFolder = "";
let backendList = [];

async function fetchParameters() {
  try {
    const response = await fetch('parameters.json');
    const data = await response.json();
    apiPort = data.Port;
    platformList = data.Platforms || [];
    defaultPlatform = data["Default platform"] || "";
    pushTestDefaultFolder = data.PushTestDefaultFolder || "";
    pushTestDefaultFilename = data.PushTestDefaultFilename || "";
    pushTestDefaultProtobufFolder = data.PushTestDefaultProtobufFolder || "";
    backendList = data.Backend || [];
    populateDefaultValues(); // Populate default values for Push Test fields
    populateDropdown(); // Populate dropdowns with fetched parameters
  } catch (error) {
    console.error("Error fetching API port:", error);
  }
}

function populateDefaultValues() {
  const configFolderElement = document.querySelector("#configFolder");
  const configFilenameElement = document.querySelector("#configFilename");
  const protobufFolderElement = document.querySelector("#protobufFolder");
  const pricingDateElement = document.querySelector("#pricingDate");

  configFolderElement.value = pushTestDefaultFolder;
  configFilenameElement.value = pushTestDefaultFilename;
  protobufFolderElement.value = pushTestDefaultProtobufFolder;

  // Set today's date for pricingDate
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  pricingDateElement.value = `${year}-${month}-${day}`;
}

function populateDropdown() {
  const servicePlatformDropdown = document.querySelector("#servicePlatform");
  const dataflowLogExtractPlatformDropdown = document.querySelector("#dataflowLogExtractPlatform");
  const backendDropdown = document.querySelector("#backend");

  dataflowLogExtractPlatformDropdown.innerHTML = ""; // Clear existing options
  servicePlatformDropdown.innerHTML = ""; // Clear existing options
  backendDropdown.innerHTML = ""; // Clear existing options

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

  backendList.forEach((backend) => {
    const option = document.createElement("option");
    option.value = backend;
    option.textContent = backend;
    backendDropdown.appendChild(option);
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
    // Set default values for Push Test fields
    const configFolderElement = document.querySelector("#configFolder");
    const configFilenameElement = document.querySelector("#configFilename");

    configFolderElement.value = pushTestDefaultFolder;
    configFilenameElement.value = pushTestDefaultFilename;
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

    const updatePushTestButton = document.querySelector("#updatePushTest");
    if (updatePushTestButton) {
      console.log("Update Push Test button initialized");
      updatePushTestButton.addEventListener("click", handleUpdatePushTest);
    }

    const resetPushTestButton = document.querySelector("#resetPushTest");
    if (resetPushTestButton) {
      console.log("Reset Push Test button initialized");
      resetPushTestButton.addEventListener("click", handleResetPushTest);
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
      console.log(`Action '${action}' executed on selected services.`);
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

  function handleUpdatePushTest() {
    const configFolder = document.querySelector("#configFolder").value;
    const configFilename = document.querySelector("#configFilename").value;
    const backend = document.querySelector("#backend").value;
    const pricingDate = document.querySelector("#pricingDate").value;
    const commandType = document.querySelector("#commandType").value;
    const commandName = document.querySelector("#commandName").value;
    const protobufFolder = document.querySelector("#protobufFolder").value;
    const protobufFilenamePush = document.querySelector("#protobufFilenamePush").value;
    // change button background color to orange
    const updatePushTestButton = document.querySelector("#updatePushTest");
    updatePushTestButton.style.backgroundColor = "var(--await-bg-color)"; // Change
    PushTestSetup(configFolder, configFilename, backend, pricingDate, commandType, commandName, protobufFolder, protobufFilenamePush).then((result) => {
      console.log("Push Test setup successful:", result.message);
      alert("Push Test setup successful.");
    }).finally(() => {
      updatePushTestButton.style.backgroundColor = ""; // Reset to initial color
    });
  }

  function handleResetPushTest() {
    document.querySelector("#configFolder").value = pushTestDefaultFolder;
    document.querySelector("#configFilename").value = pushTestDefaultFilename;
    document.querySelector("#backend").value = backendList[0] || ""; // Set to first option or empty
    document.querySelector("#pricingDate").value = "";
    document.querySelector("#commandType").value = "";
    document.querySelector("#commandName").value = "";
    document.querySelector("#protobufFolder").value = pushTestDefaultProtobufFolder;
    document.querySelector("#protobufFilenamePush").value = "";
    // change button background color to orange
    const resetPushTestButton = document.querySelector("#resetPushTest");
    resetPushTestButton.style.backgroundColor = "var(--await-bg-color)"; // Change to orange
    PushTestReset(configFolder, configFilename, backend, pricingDate, commandType, commandName, protobufFolder, protobufFilenamePush)
      .then((result) => {
        console.log("Push Test reset successful:", result.message);
        alert("Push Test reset successful.");
      })
      .finally(() => {
        resetPushTestButton.style.backgroundColor = ""; // Reset to initial color
      }
      );
  }
})