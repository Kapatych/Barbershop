/// Menu
const nav = document.querySelector('.nav');

// Menu without js
nav.classList.remove('no-js');

// Mobile menu
const toggleButton = document.querySelector('.nav__toggle');
const underlay = document.querySelector('.nav__underlay');

const toggleNav = (e) => {
  e.preventDefault();
  nav.classList.toggle('nav--opened')
};

toggleButton.addEventListener('click', (e) => toggleNav(e));
underlay.addEventListener('click', (e) => toggleNav(e));

/// Slider
const slider = (sliderName, delay) => {
  const sliderItems = document.querySelectorAll(`.${sliderName}__item`);
  const sliderDots = document.querySelectorAll(`.${sliderName} .slider__toggle`);
  const sliderControls = document.querySelectorAll(`.${sliderName} .slider__control`);
  let activeSlideIndex = 0;

  const showSlide = index => {
    //Show active button
    sliderDots.forEach(button => button.classList.remove('slider__toggle--active'));
    sliderDots[index].classList.add('slider__toggle--active');
    //Show active slide
    sliderItems.forEach(item => item.classList.remove('slider__item--active'));
    sliderItems[index].classList.add('slider__item--active')
  };

  if (sliderControls.length) {
    sliderControls.forEach(item => {
      item.addEventListener('click', () => {
        if (item.classList.contains('slider__control--prev')) {
          (activeSlideIndex === 0)
            ? activeSlideIndex = sliderItems.length - 1
            : activeSlideIndex--;
        } else {
          (activeSlideIndex >= sliderItems.length - 1)
            ? activeSlideIndex = 0
            : activeSlideIndex++;
        }
        showSlide(activeSlideIndex)
      })
    })
  }

  sliderDots.forEach(item => {
    item.addEventListener('click', event => {
      activeSlideIndex = event.target.dataset.id - 1;
      showSlide(activeSlideIndex)
    });
  });

  setInterval(() => {
    if (activeSlideIndex > sliderItems.length - 1) activeSlideIndex = 0;
    showSlide(activeSlideIndex);
    activeSlideIndex++;
  }, delay);

};

if (document.documentElement.clientWidth < 768) {
  slider('advantages', 2000);
}
slider('reviews', 3000);
