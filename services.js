import { apiPort } from "./script.js";

export async function dataFlowLogExtract(platform, dateId, inputId, dataflow, nbLignes) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("DataFlow Extract called with parameters:");
  console.log(`Platform: ${platform}`);
  console.log(`DateId: ${dateId}`);
  console.log(`InputId: ${inputId}`);
  console.log(`Dataflow: ${dataflow}`);
  console.log(`Nb de lignes: ${nbLignes}`);
  // Simulate a successful extraction
  return { status: 'ok', message: 'DataFlow extraction successful.' };
}

export async function ProtobufExtract(filename, filterType, filterValue) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Protobuf Extract called with parameters:");
  console.log(`Filename: ${filename}`);
  console.log(`Filter Type: ${filterType}`);
  console.log(`Filter Value: ${filterValue}`);
  // Simulate a successful extraction
  return { status: 'ok', message: 'Protobuf extraction successful.' };
}

export async function getServiceList(platform) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`Fetching service list for platform & apiPort: ${platform} & ${apiPort}`);
  return [
    { name: "FAR Gateway", status: "Running" },
    { name: "Data Processor", status: "Stopped" },
    { name: "Authentication Service", status: "Running" },
    { name: "Monitoring Agent", status: "Stopped" },
    { name: "Logging Pipeline", status: "Stopped" },
  ];
}

export async function serviceGlobalAction(action, platform) {
  // setimeout to simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (action !== 'All_Service_Start' && action !== 'All_Service_Stop' && action !== 'All_Service_Restart') {
    console.error("Action or platform is not specified.");
    return (['ko', 'Action or platform is not specified.']);
  }
  console.log(`Executing global action: ${action} on platform: ${platform}`);
  return (['ok', 'Action executed successfully : ' + action]); // Simulate successful action response
}

export async function serviceAction(serviceList, action, platform) {
  // setimeout to simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // mock return status from API Fetch
  if (!Array.isArray(serviceList) || serviceList.length === 0) {
    console.log("Service list is empty or not an array.");
    return (['ko', 'Service list is empty or not an array.']);
  }
  //test with or condition
  else if (action != 'start' && action != 'stop' && action != 'restart') {
    console.error(`Invalid action specified '${action}'. Use 'start', 'stop', or 'restart'.`);
    return (['ko', `Invalid action specified "${action}". Use "start", "stop", or "restart".`]);
  }
  console.log(`Executing service action: ${action} on services:`, serviceList, `on platform: ${platform}`);
  return (['ok', 'Action executed successfully.']); // Simulate successful action response
}

export async function PushTestSetup(configFolder, configFilename, backend, pricingDate, commandType, commandName, dslFolder, dslFilename, protobufFolder, protobufFilenamePush) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Push Test Setup called with parameters:");
  console.log(`Config Folder: ${configFolder}`);
  console.log(`Config Filename: ${configFilename}`);
  console.log(`Backend: ${backend}`);
  console.log(`Pricing Date: ${pricingDate}`);
  console.log(`Command Type: ${commandType}`);
  console.log(`Command Name: ${commandName}`);
  console.log(`Dslib Folder: ${dslFolder}`);
  console.log(`Dslib Filename: ${dslFilename}`);
  console.log(`Protobuf Folder: ${protobufFolder}`);
  console.log(`Protobuf Filename Push: ${protobufFilenamePush}`);
  // Simulate a successful setup
  return { status: 'ok', message: 'Push Test setup successful.' };
}

export async function PushTestReset(configFolder, configFilename) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Push Test Reset called with parameters:");
  console.log(`Config Folder: ${configFolder}`);
  console.log(`Config Filename: ${configFilename}`);
  console.log(`Backend: ${backend}`);
  console.log(`Pricing Date: ${pricingDate}`);
  console.log(`Command Type: ${commandType}`);
  console.log(`Command Name: ${commandName}`);
  console.log(`Dslib Folder: ${dslFolder}`);
  console.log(`Dslib Filename: ${dslFilename}`);
  console.log(`Protobuf Folder: ${protobufFolder}`);
  console.log(`Protobuf Filename Push: ${protobufFilenamePush}`);
  // Simulate a successful reset
  return { status: 'ok', message: 'Push Test reset successful.' };
}
