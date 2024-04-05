document.addEventListener('DOMContentLoaded', function () {
  // Membaca data dari localStorage saat halaman dimuat
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    todos.push(...JSON.parse(storedTodos));
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
    submitForm.reset();
  });
});

const todos = [];

const RENDER_EVENT = 'render-todo';

function addTodo() {
  const textTodo = document.getElementById('title').value;
  const timestamp = document.getElementById('date').value;
  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
  todos.push(todoObject);

  // Menyimpan data buku dengan kunci yang unik
  localStorage.setItem('todo-' + generatedID, JSON.stringify(todoObject));

  // Menyimpan semua data buku dalam bentuk array di localStorage
  localStorage.setItem('todos', JSON.stringify(todos));

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Fungsi membuat ID
function generateId() {
  return +new Date();
}

// Menggabungkan todo menjadi objek
function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById('todos');
  uncompletedTODOList.innerHTML = '';
  const completedTODOList = document.getElementById('completed-todos');
  completedTODOList.innerHTML = '';

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted) {
      uncompletedTODOList.append(todoElement);
    } else {
      completedTODOList.append(todoElement);
    }
  }
});

// membuat fungsi untuk menangkap todo ke website
function makeTodo(todoObject) {
  // buat elemen h2 untuk sititle
  const textTitle = document.createElement('h2');
  textTitle.innerText = todoObject.task;

  // buat elemen p untuk tanggal/waktu
  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = todoObject.timestamp;

  // buat elemen div untuk cek
  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `todo-${todoObject.id}`);

  if (todoObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');

    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');

    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(todoObject.id);
    });
    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');

    checkButton.addEventListener('click', function () {
      addTaskToCompleted(todoObject.id);
    });
    container.append(checkButton);
  }

  // membuat fungsi cek
  function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  // membuat fungsi undo
  function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  // membuat fungsi delete
  function removeTaskFromCompleted(todoId) {
    const todoIndex = findTodo(todoId);

    if (todoIndex === -1) return;

    todos.splice(todoIndex, 1);
    localStorage.removeItem('todo-' + todoId); // Menghapus data dari localStorage
    localStorage.setItem('todos', JSON.stringify(todos)); // Memperbarui data todos di localStorage
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  // membuat fungsi mencari id
  function findTodo(todoId) {
    for (const todoItem of todos) {
      if (todoItem.id === todoId) {
        return todoItem;
      }
    }
    return null;
  }

  return container;
}
