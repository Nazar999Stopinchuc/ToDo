export function setTaskLocalStorage(key, data) {
  const jsonString = JSON.stringify(data);
  localStorage.setItem(key, jsonString);
};

export function getTaskLocalStorage(key) {
  const data = localStorage.getItem(key);
  const dataObjekt = JSON.parse(data);

  return dataObjekt ? dataObjekt : [];
};

export function scrollToElement(elementId) {
  const element = document.querySelector(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

export function showError(text) {
  const errorBox = document.querySelector('.error');
  const errorText = document.querySelector('.error__text');
  const errorBtnToClose = document.querySelector('.error__btn');

  errorBox.classList.remove('none');
  errorText.textContent = text;

  errorBtnToClose.addEventListener('click', () => {
    errorBox.classList.add('none');
    return;
  });

  errorBox.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;
    if (target.classList.contains('error')) errorBox.classList.add('none');
    return;
  });

  setTimeout(() => {
    errorBox.classList.add('none');
    return;
  }, 5000);
};

export function dropDown() {
  document.querySelectorAll('.drop-down').forEach(function (dropDownWrapper) {

    const dropDownBtn = dropDownWrapper.querySelector('.drop-down__btn');
    const itemsList = dropDownWrapper.querySelector('.drop-down__list');
    const dropDownInput = dropDownWrapper.querySelector('.drop-down__input');
    const dropDownsWrap = document.querySelector('.page-status')


    dropDownBtn.addEventListener('click', () => {
      itemsList.classList.toggle('none');
      dropDownBtn.classList.toggle('active');
    });

    itemsList.addEventListener('click', (e) => {
      const target = e.target;

      if (target && target.tagName === 'LI') {
        dropDownInput.value = target.dataset.val;

        const event = new Event('input', { bubbles: true });
        dropDownInput.dispatchEvent(event);
      };
    });

    document.addEventListener('click', (e) => {
      if (e.target !== dropDownBtn) {
        itemsList.classList.add('none');
        dropDownBtn.classList.remove('active');
      }
    });
  });
};

export function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
  const year = today.getFullYear();

  return `${day}.${month}.${year}`;
};

export function formatNumber(num) {
  if (typeof num === 'number' && num >= 0 && num < 10) {
    return num < 10 ? '0' + num : num.toString();
  } else {

    return num.toString();
  }
}

export function getCurrentLanguage() {
  let defaultLang = 'en';
  let currentLang = getTaskLocalStorage('lang');

  if (!currentLang.length) currentLang = defaultLang;

  return currentLang;
};
