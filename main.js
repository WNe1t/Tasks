const addTaskBtn = document.getElementById('add-task-btn'); // находим кнопку "Добавить" по её id
const deskTaskImput = document.getElementById('description-task'); // находим поле, куда вводятся задачи, по его id="" в html
const todoWrapper = document.querySelector('.todos-wrapper'); // находим контейнер, где будут отображаться задачи

let tasks; // список задач: если в хранилище нет задач, создаём пустой список, иначе загружаем сохранённые задачи
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));

let todoItemeElems = []; // список DOM-элементов задач для работы с их статусами

// шаблон для задачи
function Task(description) { 
    this.description = description; // что нужно сделать
    this.completed = false; // выполнена ли задача (по умолчанию нет)
}

const createTemlate = (task, index) => {
    return `
    <div class='todo-item ${task.completed ? 'checked' : ''}'>
        <div class='description'>${task.description}</div>
        <div class='buttons'>
            <input onclick="completeTask(${index})" class='btn-comlete' type="checkbox" ${task.completed ? 'checked' : ''}>
            <button onclick="deleteTask(${index})" class='btn-delete'>
                <i>
                    <span class="material-symbols-outlined">close</span> 
                </i>
            </button>
        </div>
    </div>
    `
    // <span class="material-symbols-outlined">close</span>       для изменения иконки, изменить из google icons на код из "Вставка значка"
    // если мы хотим поменять стиль галочки, надо зайти в css: .buttons input и поменять на то что нужно
}

// сортировка задач: сначала новые задачи добовляются, затем старые спускаются в низ
const filterTasks = () => {
    const activeTasks = tasks.filter(item => !item.completed); // старые
    const completedTasks = tasks.filter(item => item.completed); // новые
    tasks = [...activeTasks, ...completedTasks]; // объединяем
};

// обновление списка задач на странице
const fillHtmlList = () => {
    todoWrapper.innerHTML = ''; // очищаем контейнер
    if (tasks.length > 0) { // если есть задачи
        filterTasks(); // сортируем их
        tasks.forEach((item, index) => { // для каждой задачи создаём HTML
            todoWrapper.innerHTML += createTemlate(item, index);
        });
        todoItemeElems = document.querySelectorAll('.todo-item'); // обновляем список элементов задач
    }
};

// загружаем список задач при запуске
fillHtmlList();

// сохраняем список задач в хранилище
const updateLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// меняем статус выполнения задачи
const completeTask = index => {
    tasks[index].completed = !tasks[index].completed; // меняем статус на противоположный
    updateLocal(); // сохраняем изменения
    fillHtmlList(); // обновляем список
};

// добавляем новую задачу при нажатии кнопки
addTaskBtn.addEventListener('click', () => {
    tasks.push(new Task(deskTaskImput.value)); // добавляем задачу в список
    updateLocal(); // сохраняем в хранилище
    fillHtmlList(); // обновляем список на странице
    deskTaskImput.value = ''; // очищаем поле ввода
});

// добавляем задачу при нажатии Enter или другими словами событие ( -_ -)
function checkPhoneKey(key) {
    if (key === 'Enter') {
        tasks.push(new Task(deskTaskImput.value));
        updateLocal();
        fillHtmlList();
        deskTaskImput.value = '';
    }
}

// удаляем задачу
const deleteTask = index => {
    tasks.splice(index, 1); // удаляем из списка
    updateLocal(); // сохраняем изменения
    fillHtmlList(); // обновляем список на странице
};