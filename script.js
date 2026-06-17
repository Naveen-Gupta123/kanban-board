const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const addBtn = document.getElementById('addBtn');
const containers = document.querySelectorAll('.tasks-container');
const trashZone = document.getElementById('trash-zone');
const clearBoardBtn = document.getElementById('clearBoardBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Event Handler Setup
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text === "") return;
    
    const priority = priorityInput.value;
    createCard(text, 'todo', priority);
    taskInput.value = "";
    saveStateToStorage();
});

// Programmatic Element Card Generator Block
function createCard(text, columnId, priority = 'medium') {
    if (!text) return;

    const card = document.createElement('div');
    card.classList.add('task-card');
    card.setAttribute('draggable', 'true');
    card.id = 'card-' + Date.now() + Math.random().toString(36).substr(2, 5);

    // Dynamic Priority Badge Insertion
    const badge = document.createElement('span');
    badge.classList.add('card-priority', `p-${priority}`);
    badge.innerText = priority;
    card.appendChild(badge);

    // Text Container Node Selection
    const textSpan = document.createElement('span');
    textSpan.style.display = 'block';
    textSpan.innerText = text;
    card.appendChild(textSpan);

    // Drag Tracking State Listeners
    card.addEventListener('dragstart', () => card.classList.add('dragging'));
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        saveStateToStorage();
    });

    // Double-Click text content editing capability
    card.addEventListener('dblclick', () => {
        const currentText = textSpan.innerText;
        const newText = prompt("Edit your task description:", currentText);
        if (newText !== null && newText.trim() !== "") {
            textSpan.innerText = newText.trim();
            saveStateToStorage();
        }
    });

    document.getElementById(columnId).appendChild(card);
}

// Map Column Containers Drag Rules
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

// Deletion Trash Zone Listener Mapping
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

// Metric Counters Function Update Logic
function updateCounters() {
    containers.forEach(container => {
        const count = container.querySelectorAll('.task-card').length;
        document.getElementById(`${container.id}-count`).innerText = count;
    });
}

// Local Cache Serialization Processing
function saveStateToStorage() {
    const boardState = {};
    containers.forEach(container => {
        const cards = container.querySelectorAll('.task-card');
        
        // Save both text values and priority classes safely inside objects array
        const cardData = Array.from(cards).map(card => {
            const pClass = card.querySelector('.card-priority').classList[1]; // grabs p-low, p-medium, etc.
            return {
                text: card.querySelector('span:not(.card-priority)').innerText,
                priority: pClass.replace('p-', '') // leaves 'low', 'medium', etc.
            };
        });
        boardState[container.id] = cardData;
    });

    localStorage.setItem('kanbanDataAdvanced', JSON.stringify(boardState));
    updateCounters();
}

function loadStateFromStorage() {
    const storedData = localStorage.getItem('kanbanDataAdvanced');
    if (!storedData) return;

    const boardState = JSON.parse(storedData);
    Object.keys(boardState).forEach(columnId => {
        boardState[columnId].forEach(task => {
            createCard(task.text, columnId, task.priority);
        });
    });
    updateCounters();
}

// Master Canvas Clear Button Trigger
clearBoardBtn.addEventListener('click', () => {
    if (confirm("Are you absolutely sure you want to clear all tasks?")) {
        containers.forEach(container => container.innerHTML = "");
        localStorage.removeItem('kanbanDataAdvanced');
        updateCounters();
    }
});

// Visual Palette Light/Dark Toggle Handler
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('lightThemeActive', isLight);
});

if (localStorage.getItem('lightThemeActive') === 'true') {
    document.body.classList.add('light-theme');
}

// Fire data read layout injection sequence
loadStateFromStorage();