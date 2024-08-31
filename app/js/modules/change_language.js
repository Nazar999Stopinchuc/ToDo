import { langArr, hash } from "./global";

export const changeLanguage = () => {
  const dropDownInput = document.querySelector('#lang-input');
  const allLangs = ['en', 'fr', 'ua'];

  function installURLLang() {
    let lang = dropDownInput.value;
    location.href = `${window.location.pathname}#${lang}`;
    location.reload();
  };

  function installLang() {
    if (!allLangs.includes(hash)) {
      location.href = `${window.location.pathname}#en`;
      location.reload();
    };
    
    document.querySelector('.form__input').placeholder = langArr.form_input[hash]

    for (let key in langArr) {
      const element = document.querySelector(`.lng-${key}`);
      if (element) {
        document.querySelector(`.lng-${key}`).textContent = langArr[key][hash];
      };
    };
  };

  dropDownInput.addEventListener('input', () => {
    installURLLang();
  });

  installLang();
};