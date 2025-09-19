# SimpleSlider
Минималистичный, лёгкий, адаптивный слайдер контента

Подключение:

<link rel="stylesheet" type="text/css" href="slider.css">
<script src="slider.js"></script>

Инициация в самом скрипте. Параметры по умолчанию:

$('.slider').simpleSlider({
  itemsPerPage: 4, // слайдов на страницу
  step: 1, // null = по странице, 1 = по одному слайду
  margin: 5, // отступ между элементами
  speed: 500, // скорость переключения
  loop: false, // цикличность
  viewport: 500, // ширина, при которой устройства считается мобильным
  showButtons: true, // кнопки Вперел/Назад
  showPagination: true, // точки пагинации
  swipeThreshold: 50 // сдвиг для свайпа
});
