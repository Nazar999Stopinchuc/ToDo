import { setTaskLocalStorage, getTaskLocalStorage } from "./utyls";

export const changeTheme = () => {
  const dropDownInput = document.querySelector('#theme-input');
  const defaultTheme = 'dark';
  
  function installThem() {
    const сurrentThem = getTaskLocalStorage('theme');
    if (!сurrentThem || !сurrentThem.length) {
      document.documentElement.className = defaultTheme;
    } else {
      document.documentElement.className = '';
      document.documentElement.classList.add(сurrentThem);
    }
  };

  dropDownInput.addEventListener('input', () => {
    setTaskLocalStorage('theme', dropDownInput.value);
    installThem();
  });

  installThem();
};