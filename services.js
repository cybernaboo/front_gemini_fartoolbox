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
  return [
    { name: "FAR Gateway", status: "Running" },
    { name: "Data Processor", status: "Stopped" },
    { name: "Authentication Service", status: "Running" },
    { name: "Monitoring Agent", status: "Stopped" },
    { name: "Logging Pipeline", status: "Stopped" },
  ];
}

export async function serviceGlobalAction(action, platform) {
  // mock return status from API Fetch
  if (action !== "start" && action !== "stop" && action !== "restart") {
    console.error("Invalid action specified. Use 'start', 'stop', or 'restart'.");
    return (['ko', 'Invalid action specified. Use "start", "stop", or "restart".']);
  }
  console.log(`Executing global action: ${action} on platform: ${platform}`);
  return (['ok', 'Action executed successfully.']); // Simulate successful action response
}


export async function serviceAction(serviceList, action, platform) {
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
