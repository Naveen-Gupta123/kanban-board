const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const containers = document.querySelectorAll('.tasks-container');

// Kickstart deployment pipeline
addBtn.addEventListener('click', () => {
    createCard(taskInput.value.trim(), 'todo');
    taskInput.value = "";
    saveStateToStorage();
});

function createCard(text, columnId) {
    if (!text) return;

    const card = document.createElement('div');
    card.classList.add('task-card');
    card.setAttribute('draggable', 'true');
    card.id = 'card-' + Date.now() + Math.random().toString(36).substr(2, 5);
    card.innerText = text;

    card.addEventListener('dragstart', () => card.classList.add('dragging'));
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        saveStateToStorage(); // Sync state when card is dropped
    });

    document.getElementById(columnId).appendChild(card);
}

// Map column zone parameters
containers.forEach(container => {
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        container.classList.add('hovered');
    });

    container.addEventListener('dragleave', () => container.classList.remove('hovered'));

    container.addEventListener('drop', () => {
        container.classList.remove('hovered');
        const activeCard = document.querySelector('.dragging');
        if (activeCard) {
            container.appendChild(activeCard);
            saveStateToStorage(); // Save order updates
        }
    });
});

// Storage Synchronization Engines
function saveStateToStorage() {
    const boardState = {};
    
    containers.forEach(container => {
        const cards = container.querySelectorAll('.task-card');
        const cardTexts = Array.from(cards).map(card => card.innerText);
        boardState[container.id] = cardTexts;
    });

    localStorage.setItem('kanbanData', JSON.stringify(boardState));
}

function loadStateFromStorage() {
    const storedData = localStorage.getItem('kanbanData');
    if (!storedData) return;

    const boardState = JSON.parse(storedData);
    
    Object.keys(boardState).forEach(columnId => {
        boardState[columnId].forEach(taskText => {
            createCard(taskText, columnId);
        });
    });
}

// Fire storage read loop instantly upon browser loading sequence
loadStateFromStorage();