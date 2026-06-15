const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const todoContainer = document.getElementById('todo');

addBtn.addEventListener('click', createCard);

function createCard() {
    const text = taskInput.value.trim();
    if (text === "") return;

    const card = document.createElement('div');
    card.classList.add('task-card');
    card.setAttribute('draggable', 'true'); // Native parameter activation
    card.innerText = text;

    // Attach a distinct timestamp tracking parameter to avoid tracking conflicts
    card.id = 'card-' + Date.now();

    // Attach Drag Initialization Events directly to the generated card node
    card.addEventListener('dragstart', () => card.classList.add('dragging'));
    card.addEventListener('dragend', () => card.classList.remove('dragging'));

    todoContainer.appendChild(card);
    taskInput.value = ""; // Empty input buffer
}