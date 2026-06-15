// ... keep elements and createCard logic from commit 3 above ...

const containers = document.querySelectorAll('.tasks-container');

// Map interactive listening states to each tracking column array
containers.forEach(container => {
    container.addEventListener('dragover', (e) => {
        e.preventDefault(); // CRITICAL rule override: permits drop loops to execute
        container.classList.add('hovered');
    });

    container.addEventListener('dragleave', () => {
        container.classList.remove('hovered');
    });

    container.addEventListener('drop', () => {
        container.classList.remove('hovered');
        const activeCard = document.querySelector('.dragging');
        if (activeCard) {
            container.appendChild(activeCard); // Native migration execution
        }
    });
});