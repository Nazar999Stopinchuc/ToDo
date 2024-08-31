export const burger = () => {
  const burger = document.querySelector('.burger');
  const pageStatus = document.querySelector('.page-status');

  burger.addEventListener('click', () => {
    pageStatus.classList.toggle('page-status--active');
    document.body.classList.toggle('lock');

    if (pageStatus.classList.contains('page-status--active')) {
      burger.classList.add('burger--active');
      document.body.classList.add('lock');
    }
    else {
      burger.classList.remove('burger--active');
      document.body.classList.remove('lock');
    }
  });

  pageStatus.addEventListener('click', (e) => {
    if (e.target.classList.contains('page-status')) {
      pageStatus.classList.remove('page-status--active');
      burger.classList.remove('burger--active');
      document.body.classList.remove('lock');
    }
  });
};
