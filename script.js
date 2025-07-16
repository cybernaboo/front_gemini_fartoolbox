document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.querySelector('.tabs');
    const serviceTable = document.querySelector('table');

    // Gérer le changement d'onglet
    tabsContainer.addEventListener('click', (event) => {
        const clickedTab = event.target;
        if (!clickedTab.matches('.tab-link')) return;

        // Mettre à jour les classes actives pour les boutons d'onglets
        document.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');

        // Mettre à jour les classes actives pour le contenu des onglets
        const tabId = clickedTab.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
                content.classList.add('active');
            }
        });
    });

    // Gérer les boutons Start/Stop dans le tableau des services
    if (serviceTable) {
        serviceTable.addEventListener('click', (event) => {
            const target = event.target;

            if (target.matches('.btn-start') && !target.disabled) {
                updateServiceStatus(target, 'Running');
            }

            if (target.matches('.btn-stop') && !target.disabled) {
                updateServiceStatus(target, 'Stopped');
            }
        });
    }

    function updateServiceStatus(button, newStatus) {
        const row = button.closest('tr');
        const statusDiv = row.querySelector('.status');
        const startButton = row.querySelector('.btn-start');
        const stopButton = row.querySelector('.btn-stop');

        statusDiv.dataset.status = newStatus;
        statusDiv.innerHTML = `<span class="status-indicator"></span>${newStatus}`;

        if (newStatus === 'Running') {
            startButton.disabled = true;
            stopButton.disabled = false;
        } else if (newStatus === 'Stopped') {
            startButton.disabled = false;
            stopButton.disabled = true;
        }
    }
});
