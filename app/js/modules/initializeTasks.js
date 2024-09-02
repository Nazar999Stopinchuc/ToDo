import { setTaskLocalStorage, getTaskLocalStorage, showError } from "./utyls";
import { langArr, hash } from "./global";

export function initializeTasks(form, input, dateInput, tasksInner, buttonCancel, updatedTasks) {
  let editId = null;
  let isEditTask = false;

  function setDate() {
    const dateText = document.querySelector('.form-date__date');

    if (dateInput.value.length == 0) {
      dateText.textContent = `${langArr.date[hash]}: ${getCurrentDate()}`;
    } else {
      dateText.textContent = `${langArr.date[hash]}: ${dateInput.value}`;
    }

    dateInput.addEventListener('input', () => {
      dateText.textContent = `${langArr.date[hash]}: ${dateInput.value}`;
    });

    return dateInput.value.length ? dateInput.value : getCurrentDate();
  };

  function addTask(e) {
    e.preventDefault();
    const task = input.value.trim().replace(/\s+/g, ' ');

    if (task == '' || task.split(' ').every(char => char === '')) {
      showError(langArr.err_enter_task[hash]);
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

  function saveEditTask(task) {
    const arrFromLS = getTaskLocalStorage('tasks');

    const index = arrFromLS.findIndex(obj => obj.id === editId);

    if (index !== -1) {
      arrFromLS[index].task = task;
      setTaskLocalStorage('tasks', arrFromLS);
      updatedTasks();
    } else {
      return showError(langArr.err_task_not_found[hash])
    };

    resrtSentForm();
  };

  function resrtSentForm() {
    editId = null;
    isEditTask = false;
    buttonCancel.classList.add('none');
    form.reset();
  };

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
};