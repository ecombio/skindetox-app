<script>
document.addEventListener('DOMContentLoaded', function() {
  const carouselContainer = document.querySelector('.carousel-container');
  const carousel = document.querySelector('.carousel');
  const items = document.querySelectorAll('.carousel-item');
  const paginationContainer = document.querySelector('.pagination-container');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  const itemWidth = items[0].offsetWidth + 15; // Including margin

  // Create pagination dots
  items.forEach((item, index) => {
    const dot = document.createElement('div');
    dot.classList.add('pagination-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      carouselContainer.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
      updateDots(index);
      updateButtons();
    });
    paginationContainer.appendChild(dot);
  });

  const updateDots = (activeIndex) => {
    document.querySelectorAll('.pagination-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  };

  const updateButtons = () => {
    const maxScrollLeft = carouselContainer.scrollWidth - carouselContainer.clientWidth;
    prevButton.disabled = carouselContainer.scrollLeft <= 0;
    nextButton.disabled = carouselContainer.scrollLeft >= maxScrollLeft;
  };

  prevButton.addEventListener('click', () => {
    carouselContainer.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  });

  nextButton.addEventListener('click', () => {
    carouselContainer.scrollBy({ left: itemWidth, behavior: 'smooth' });
  });

  // Scroll event to update active dot and buttons
  carouselContainer.addEventListener('scroll', () => {
    const currentIndex = Math.round(carouselContainer.scrollLeft / itemWidth);
    updateDots(currentIndex);
    updateButtons();
  });

  // Drag to slide functionality
  let isDown = false;
  let startX;
  let scrollLeft;

  carouselContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carouselContainer.offsetLeft;
    scrollLeft = carouselContainer.scrollLeft;
    carouselContainer.classList.add('active');
  });

  carouselContainer.addEventListener('mouseleave', () => {
    isDown = false;
    carouselContainer.classList.remove('active');
  });

  carouselContainer.addEventListener('mouseup', () => {
    isDown = false;
    carouselContainer.classList.remove('active');
  });

  carouselContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carouselContainer.offsetLeft;
    const walk = (x - startX);
    carouselContainer.scrollLeft = scrollLeft - walk;
  });

  // Initialize buttons state
  updateButtons();
});
</script>