import { setTaskLocalStorage, getTaskLocalStorage, scrollToElement, showError, dropDown, getCurrentDate, getCurrentLanguage } from "./modules/utyls";
import { changeTheme } from "./modules/change_theme";
import { burger } from "./modules/burger";
import { changeLanguage } from "./modules/change_language";
import { langArr } from "./modules/global";
import { initializeCalendar } from "./modules/initializeCalendar";

const form = document.querySelector('#form');
const buttonCancel = document.querySelector('.form__btn-cancele');
const input = document.querySelector('#input');
const dateInput = document.querySelector('#input-date');
const tasksInner = document.querySelector('.to-do__inner')
const tasksList = document.querySelector('.to-do__lict');
const tasksListPinned = document.querySelector('.to-do__list-pinned');
const tasksListDone = document.querySelector('.to-do__list-done');

let editId = null;
let isEditTask = false;

function setDate() {
  const dateText = document.querySelector('#date');

  if (dateInput.value.length == 0) {
    dateText.textContent = `${getCurrentDate()}`;
  } else {
    dateText.textContent = `${dateInput.value}`;
  }

  return dateInput.value.length ? dateInput.value : getCurrentDate();
}

function addTask(e) {
  e.preventDefault();
  const task = input.value.trim().replace(/\s+/g, ' ');

  if (task == '' || task.split(' ').every(char => char === '')) {
    showError(langArr.err_enter_task[getCurrentLanguage()]);
    return;
  };

  if (isEditTask) {
    saveEditTask(task);
    return;
  }

  const arrFromLs = getTaskLocalStorage('tasks');
  arrFromLs.push({
    id: Date.now(),
    task: task,
    done: false,
    pinned: false,
    date: setDate(),
  });

  setTaskLocalStorage('tasks', arrFromLs);
  updatedTasks();
  input.value = '';
  input.focus();
};

function deleteTask(e) {
  const parentNode = e.target.closest('.to-do__item');
  const id = Number(parentNode.id);
  const arrFromLS = getTaskLocalStorage('tasks');

  const updatedArray = arrFromLS.filter(obj => obj.id !== id);

  setTaskLocalStorage('tasks', updatedArray);
  updatedTasks();

};

function doneTask(e) {
  const parentNode = e.target.closest('.to-do__item');
  const id = Number(parentNode.id);
  const arrFromLS = getTaskLocalStorage('tasks');

  const index = arrFromLS.findIndex(obj => obj.id === id);

  if (index === -1) return showError(langArr.err_task_not_found[getCurrentLanguage()]);;

  if (!arrFromLS[index].done && arrFromLS[index].pinned) {
    arrFromLS[index].pinned = false;
  }

  if (arrFromLS[index].done) {
    arrFromLS[index].done = false;
  } else {
    arrFromLS[index].done = true;
  };

  setTaskLocalStorage('tasks', arrFromLS);
  updatedTasks();
};

function pinnedTask(e) {
  const parentNode = e.target.closest('.to-do__item');
  const id = Number(parentNode.id);
  const arrFromLS = getTaskLocalStorage('tasks');

  const index = arrFromLS.findIndex(obj => obj.id === id);

  if (index === -1) return showError(langArr.err_task_not_found[getCurrentLanguage()]);

  if (!arrFromLS[index].pinned && arrFromLS[index].done) {
    return showError(langArr.err_pin_task[getCurrentLanguage()]);
  };

  if (arrFromLS[index].pinned) {
    arrFromLS[index].pinned = false;
  } else {
    arrFromLS[index].pinned = true;
  };

  setTaskLocalStorage('tasks', arrFromLS);
  updatedTasks();
}

function editTask(e) {
  const parentNode = e.target.closest('.to-do__item');
  const text = parentNode.querySelector('.to-do__task-text').textContent;
  editId = Number(parentNode.id);

  input.value = text;
  buttonCancel.classList.remove('none');
  isEditTask = true;
  scrollToElement('#form');
};

function saveEditTask(task) {
  const arrFromLS = getTaskLocalStorage('tasks');

  const index = arrFromLS.findIndex(obj => obj.id === editId);

  if (index !== -1) {
    arrFromLS[index].task = task;
    setTaskLocalStorage('tasks', arrFromLS);
    updatedTasks();
  } else {
    return showError(langArr.err_task_not_found[getCurrentLanguage()])
  };

  resrtSentForm();
};

function dragEndDrop() {
  const items = document.querySelectorAll('.to-do__item');
  const tasksAllBox = document.querySelector('#tasks-all');
  const tasksPinnedBox = document.querySelector('#tasks-pinned');
  const tasksDoneBox = document.querySelector('#tasks-done');

  tasksAllBox.addEventListener('dragover', allowDrop);
  tasksPinnedBox.addEventListener('dragover', allowDrop);
  tasksDoneBox.addEventListener('dragover', allowDrop);

  tasksAllBox.addEventListener('drop', drop);
  tasksPinnedBox.addEventListener('drop', drop);
  tasksDoneBox.addEventListener('drop', drop);

  items.forEach(elem => {
    elem.addEventListener('dragstart', drag);
  });

  tasksInner.addEventListener('dragstart', drag);


  function allowDrop(e) {
    e.preventDefault();
  }

  function drag(e) {
    const target = e.target;
    e.dataTransfer.setData('id', target.id);
  }

  function drop(e) {
    const arrFromLS = getTaskLocalStorage('tasks');
    const itemId = Number(e.dataTransfer.getData('id'));
    const status = this.dataset.status;

    const index = arrFromLS.findIndex(obj => obj.id === itemId);

    if (index === -1) {
      showError(langArr.err_not_found[getCurrentLanguage()]);
      return;
    }
    arrFromLS[index].pinned = false;
    arrFromLS[index].done = false;
    if (arrFromLS[index][status] !== 'all') {
      arrFromLS[index][status] = true;
    }

    setTaskLocalStorage('tasks', arrFromLS);
    updatedTasks();
  }
}

function updatedTasks() {
  const tasksArr = getTaskLocalStorage('tasks');
  const arrayFilterByDate = tasksArr.filter(obj => obj.date == setDate());

  tasksList.innerHTML = '';
  tasksListPinned.innerHTML = '';
  tasksListDone.innerHTML = '';
  if (!arrayFilterByDate || !arrayFilterByDate.length) return;

  arrayFilterByDate.forEach((tasksItem) => {
    const { id, task, done, pinned } = tasksItem;

    const item = `<li class="to-do__item ${done ? 'done' : ''} ${pinned ? 'pinned' : ''}" id="${id}" draggable="true">
                <span class="to-do__task-text">${task}</span>
                <div class="to-do__task-control">
                  <button class="to-do__done ${done ? 'active' : ''}">
                    <svg class="to-do__svg">
                      <use xlink:href="images/sprite.svg#check-mark"></use>
                    </svg>
                  </button>
                  <button class="to-do__pinned ${pinned ? 'active' : ''}">
                    <svg class="to-do__svg">
                      <use xlink:href="images/sprite.svg#pin"></use>
                    </svg>
                  </button>
                  <button class="to-do__edit">
                    <svg class="to-do__svg">
                      <use xlink:href="images/sprite.svg#edit"></use>
                    </svg>
                  </button>
                  <button class="to-do__delete">
                    <svg class="to-do__svg">
                      <use xlink:href="images/sprite.svg#delete"></use>
                    </svg>
                  </button>
                </div>
              </li>`;

    if (done) {
      tasksListDone.insertAdjacentHTML('beforeend', item);
    } else if (pinned) {
      tasksListPinned.insertAdjacentHTML('beforeend', item);
    } else {
      tasksList.insertAdjacentHTML('beforeend', item);
    }
  });
};

function resrtSentForm() {
  editId = null;
  isEditTask = false;
  buttonCancel.classList.add('none');
  form.reset();
};


document.addEventListener('DOMContentLoaded', () => {

  form.addEventListener('submit', addTask);

  buttonCancel.addEventListener('click', resrtSentForm);

  tasksInner.addEventListener('click', e => {
    const target = e.target.closest('.to-do__task-control');
    if (!target) return;

    if (e.target.closest('.to-do__delete')) {
      deleteTask(e);
    } else if (e.target.closest('.to-do__done')) {
      doneTask(e);
    } else if (e.target.closest('.to-do__pinned')) {
      pinnedTask(e);
    } else if (e.target.closest('.to-do__edit')) {
      editTask(e);
    }
  });

  dateInput.addEventListener('input', updatedTasks);

  setDate();
  changeTheme();
  changeLanguage();
  updatedTasks();
  dragEndDrop();
  burger();
  dropDown();
  initializeCalendar(dateInput, updatedTasks, setDate);
});
