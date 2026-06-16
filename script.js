const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const containers = document.querySelectorAll('.tasks-container');
const trashZone = document.getElementById('trash-zone');
const clearBoardBtn = document.getElementById('clearBoardBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Activation Event Handlers setup
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text === "") return;
    createCard(text, 'todo');
    taskInput.value = "";
    saveStateToStorage();
});

// Programmatic Element Card node assembly generator block
function createCard(text, columnId) {
    if (!text) return;

    const card = document.createElement('div');
    card.classList.add('task-card');
    card.setAttribute('draggable', 'true');
    card.id = 'card-' + Date.now() + Math.random().toString(36).substr(2, 5);
    card.innerText = text;

    // Drag tracking state listening vectors
    card.addEventListener('dragstart', () => card.classList.add('dragging'));
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        saveStateToStorage();
    });

    // Double-Click text content editing capability logic block
    card.addEventListener('dblclick', () => {
        const currentText = card.innerText;
        const newText = prompt("Edit your task description:", currentText);
        if (newText !== null && newText.trim() !== "") {
            card.innerText = newText.trim();
            saveStateToStorage();
        }
    });

    document.getElementById(columnId).appendChild(card);
}

// Map column tracking parameters loop
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
            saveStateToStorage();
        }
    });
});

// Deletion Destination Trash-Zone Drop intercept tracking mechanics
trashZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    trashZone.classList.add('trash-hover');
});

trashZone.addEventListener('dragleave', () => trashZone.classList.remove('trash-hover'));

trashZone.addEventListener('drop', () => {
    trashZone.classList.remove('trash-hover');
    const activeCard = document.querySelector('.dragging');
    if (activeCard) {
        activeCard.remove();
        saveStateToStorage();
    }
});

// Metric Calculation Loop counters mapping function update logic
function updateCounters() {
    containers.forEach(container => {
        const count = container.querySelectorAll('.task-card').length;
        document.getElementById(`${container.id}-count`).innerText = count;
    });
}

// Local Cache Serialization Processing Units
function saveStateToStorage() {
    const boardState = {};
    containers.forEach(container => {
        const cards = container.querySelectorAll('.task-card');
        const cardTexts = Array.from(cards).map(card => card.innerText);
        boardState[container.id] = cardTexts;
    });

    localStorage.setItem('kanbanData', JSON.stringify(boardState));
    updateCounters();
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
    updateCounters();
}

// Master Canvas clear command controller execution loop
clearBoardBtn.addEventListener('click', () => {
    if (confirm("Are you absolutely sure you want to clear all tasks?")) {
        containers.forEach(container => container.innerHTML = "");
        localStorage.removeItem('kanbanData');
        updateCounters();
    }
});

// UI Dynamic Visual Palette Toggle layout switch handler mapping
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('lightThemeActive', isLight);
});

// Persistent layout memory settings evaluation sequence logic handle
if (localStorage.getItem('lightThemeActive') === 'true') {
    document.body.classList.add('light-theme');
}

// Auto running storage parse execution pipelines trigger
loadStateFromStorage();