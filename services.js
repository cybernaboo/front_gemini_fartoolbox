async function DataFlowExtractPushButton() {
    console.log('Formulaire DataFlow Log soumis:');

    // wait 3 secondes before executing the next line with async
    await new Promise(resolve => setTimeout(resolve, 3000));

    const dateId = document.getElementById('dateId').value;
    const inputId = document.getElementById('inputId').value;
    const dataflow = document.getElementById('dataflow').value;
    const nbLignes = document.getElementById('nbLignes').value;

    console.log(`DateId: ${dateId}`);
    console.log(`InputId: ${inputId}`);
    console.log(`Dataflow: ${dataflow}`);
    console.log(`Nb de lignes: ${nbLignes}`);
}
