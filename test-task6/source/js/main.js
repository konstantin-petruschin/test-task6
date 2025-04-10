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
