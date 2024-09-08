import { formatNumber, getCurrentLanguage } from "./utyls";

export function initializeCalendar(dateInput, updateTasksCallback, setDateCallback) {
  const showCalendarBtn = document.querySelector('.form-date__btn');
  const calendar = document.querySelector('.calendar');
  const header = document.querySelector(".calendar__month");
  const dates = document.querySelector(".calendar__days");
  const navs = document.querySelectorAll("#prev, #next");


  const months = [
    {
      en: 'January',
      fr: 'Janvier',
      ua: 'Січень',
    },

    {
      en: 'February',
      fr: 'Février',
      ua: 'Лютий',
    },

    {
      en: 'March',
      fr: 'Mars',
      ua: 'Березень',
    },

    {
      en: 'April',
      fr: 'Avril',
      ua: 'Квітень',
    },

    {
      en: 'May',
      fr: 'Mai',
      ua: 'Травень',
    },

    {
      en: 'June',
      fr: 'Juin',
      ua: 'Червень',
    },

    {
      en: 'July',
      fr: 'Juillet',
      ua: 'Липень',
    },

    {
      en: 'August',
      fr: 'Août',
      ua: 'Серпень',
    },
    {
      en: 'September',
      fr: 'Septembre',
      ua: 'Вересень',
    },

    {
      en: 'October',
      fr: 'Octobre ',
      ua: 'Жовтень',
    },

    {
      en: 'November',
      fr: 'Novembre',
      ua: 'Листопад',
    },

    {
      en: 'December',
      fr: 'Décembre',
      ua: 'Грудень',
    },

  ];

  let date = new Date();
  let month = date.getMonth();
  let year = date.getFullYear();

  function changeDate(e) {
    const target = e.target;

    if (!target.classList.contains('active')) return;

    dateInput.value = target.dataset.date;
    calendar.classList.add('none');

    updateTasksCallback();
    setDateCallback();
  };

  function renderCalendar() {
    const start = new Date(year, month, 1).getDay();
    const adjustedStart = start === 0 ? 6 : start - 1;
    const endDate = new Date(year, month + 1, 0).getDate();
    const end = new Date(year, month, endDate).getDay();
    const adjustedEnd = end === 0 ? 6 : end - 1;
    const endDatePrev = new Date(year, month, 0).getDate();

    let datesHtml = "";

    for (let i = adjustedStart; i > 0; i--) {
      datesHtml += `<li class="inactive">${endDatePrev - i + 1}</li>`;
    }

    for (let i = 1; i <= endDate; i++) {
      let className =
        i === date.getDate() &&
          month === new Date().getMonth() &&
          year === new Date().getFullYear()
          ? 'today'
          : "";
      datesHtml += `<li class="active ${className}" data-date="${formatNumber(i)}.${formatNumber(month + 1)}.${year}">${i}</li>`;
    }

    for (let i = adjustedEnd; i < 6; i++) {
      datesHtml += `<li class="inactive">${i - adjustedEnd + 1}</li>`;
    }

    dates.innerHTML = datesHtml;
    header.textContent = `${months[month][getCurrentLanguage()]} ${year}`;
  }

  navs.forEach((nav) => {
    nav.addEventListener("click", (e) => {
      const btnId = e.target.id;

      if (btnId === "prev" && month === 0) {
        year--;
        month = 11;
      } else if (btnId === "next" && month === 11) {
        year++;
        month = 0;
      } else {
        month = btnId === "next" ? month + 1 : month - 1;
      }

      date = new Date(year, month, new Date().getDate());
      year = date.getFullYear();
      month = date.getMonth();

      renderCalendar();
    });
  });

  showCalendarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    calendar.classList.toggle('none');
    renderCalendar();
  });

  dates.addEventListener('click', changeDate);

  document.addEventListener('click', (e) => {
    const target = e.target;

    if (calendar.classList.contains('none')) return;

    if (!calendar.contains(target)) {
      calendar.classList.add('none');
    }
  });
};