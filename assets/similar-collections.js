document.addEventListener('DOMContentLoaded', function() {
  let carouselContainer = document.querySelector('.carousel-container');
  let carousel = document.querySelector('.carousel');
  let items = document.querySelectorAll('.carousel-item');
  let prevButton = document.querySelector('.prev');
  let nextButton = document.querySelector('.next');
  let currentIndex = 0;
  let itemWidth = items[0].offsetWidth + 15; // Including margin

  function updateCarousel() {
    let newTransform = `translateX(-${currentIndex * itemWidth}px)`;
    carousel.style.transform = newTransform;

    // Disable or enable buttons
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === items.length - 1;
  }

  function checkButtons() {
    prevButton.disabled = carouselContainer.scrollLeft <= 0;
    nextButton.disabled = carouselContainer.scrollLeft + carouselContainer.clientWidth >= carouselContainer.scrollWidth;
  }

  prevButton.addEventListener('click', function() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
      checkButtons();
    }
  });

  nextButton.addEventListener('click', function() {
    if (currentIndex < items.length - 1) {
      currentIndex++;
      updateCarousel();
      checkButtons();
    }
  });

  // Drag to slide functionality
  let isDown = false;
  let startX;
  let scrollLeft;

  carouselContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    carouselContainer.classList.add('active');
    startX = e.pageX - carouselContainer.offsetLeft;
    scrollLeft = carouselContainer.scrollLeft;
  });

  carouselContainer.addEventListener('mouseleave', () => {
    isDown = false;
    carouselContainer.classList.remove('active');
  });

  carouselContainer.addEventListener('mouseup', () => {
    isDown = false;
    carouselContainer.classList.remove('active');
    checkButtons(); // Ensure buttons are correctly enabled/disabled after dragging
  });

  carouselContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carouselContainer.offsetLeft;
    const walk = (x - startX) * 3; // Scroll faster
    carouselContainer.scrollLeft = scrollLeft - walk;
    checkButtons(); // Ensure buttons are correctly enabled/disabled during dragging
  });

  // Initialize buttons state
  updateCarousel();
});
