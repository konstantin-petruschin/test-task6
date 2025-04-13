const toggleButtonElement = document.querySelector('.header__toggle');
const menuElement = document.querySelector('.header__nav');


toggleButtonElement.addEventListener('click', function () {
  toggleButtonElement.classList.toggle('header__toggle--closed');
  menuElement.classList.toggle('header__nav--open');

  if (menuElement.classList.contains('header__nav--open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

const slider = new Swiper('.credits-swiper', {
  slidesPerView: 1,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
},
});

function startTimer(duration) {
  let timer = duration, hours, minutes, seconds;
  const display = document.getElementById('timer');

  const interval = setInterval(function () {
      hours = parseInt(timer / 3600, 10);
      minutes = parseInt((timer % 3600) / 60, 10);
      seconds = parseInt(timer % 60, 10);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = hours + ":" + minutes + ":" + seconds;

      if (--timer < 0) {
          clearInterval(interval);
          startTimer(duration); // Запускаем таймер заново
      }
  }, 1000);
}

window.onload = function () {
  const tenMinutes = 60 * 10; // 10 минут
  startTimer(tenMinutes);
};


