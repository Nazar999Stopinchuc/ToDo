import { getTaskLocalStorage, setTaskLocalStorage } from "./utyls";
import { langArr } from "./global";

export const changeLanguage = () => {
  const dropDownInput = document.querySelector('#lang-input');
  let defaultLang = 'en';

  if (!dropDownInput) {
    console.error('Элемент #lang-input не найден.');
    return;
  }

  function setLanguage() {
    let lang = dropDownInput.value;

    setTaskLocalStorage('lang', lang);
    installLang();
  };

  function installLang() {
    let currentLang = getTaskLocalStorage('lang');
    
    if (!currentLang.length) currentLang = defaultLang;

    document.querySelector('.form__input').placeholder = langArr.form_input[currentLang];

    for (let key in langArr) {
      const element = document.querySelector(`.lng-${key}`);
      if (element) {
        document.querySelector(`.lng-${key}`).textContent = langArr[key][currentLang];
      };
    };
  };

  dropDownInput.addEventListener('input', setLanguage);
  installLang();
};