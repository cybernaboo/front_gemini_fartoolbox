document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.querySelector('.tabs');
    const serviceTable = document.querySelector('table');

    // Gérer le changement d'onglet
    tabsContainer.addEventListener('click', (event) => {
        const clickedTab = event.target;
        if (!clickedTab.matches('.tab-link')) return;

        document.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');

        const tabId = clickedTab.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
                content.classList.add('active');
            }
        });
    });

    // Gérer les actions de masse
    document.querySelector('.btn-start').addEventListener('click', () => handleMassAction('start'));
    document.querySelector('.btn-stop').addEventListener('click', () => handleMassAction('stop'));
    document.querySelector('.btn-restart').addEventListener('click', () => handleMassAction('restart'));

    function handleMassAction(action) {
        const checkboxes = document.querySelectorAll(`.action-checkbox[data-action="${action}"]:checked`);
        checkboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            if (action === 'start' || action === 'restart') {
                simulateStarting(row, action);
            } else {
                updateServiceStatus(row, getActionStatus(action));
            }
        });
    }

    function simulateStarting(row, action) {
        const statusDiv = row.querySelector('.status');
        statusDiv.dataset.status = 'Starting';
        statusDiv.innerHTML = `<span class="status-indicator"></span>Starting...`;

        setTimeout(() => {
            updateServiceStatus(row, getActionStatus(action));
        }, 2000); // Simule un délai de 2 secondes
    }

    function getActionStatus(action) {
        switch (action) {
            case 'start':
            case 'restart':
                return 'Running';
            case 'stop':
                return 'Stopped';
            default:
                return 'Unknown';
        }
    }

    function updateServiceStatus(row, newStatus) {
        const statusDiv = row.querySelector('.status');
        statusDiv.dataset.status = newStatus;
        statusDiv.innerHTML = `<span class="status-indicator"></span>${newStatus}`;
    }
});
