// JavaScript to handle slider thumb position and icon changes
const slider = document.querySelector(".slider");
const sliderValue = document.getElementById("sliderValue");
const icons = document.querySelectorAll(".icon");

const moveSlider = (position) => {
  slider.value = position;
  // fire input event to update sliderValue
  slider.dispatchEvent(new Event("input"));
};

slider.addEventListener("input", function () {
  icons.forEach((icon) => icon.classList.remove("active"));
  const selectedIcon = icons[slider.value];
  selectedIcon.classList.add("active");
  switch (this.value) {
    case "0":
      sliderValue.textContent = "speed";
      break;
    case "1":
      sliderValue.textContent = "balanced";
      break;
    case "2":
      sliderValue.textContent = "accuracy";
      break;
    default:
      sliderValue.textContent = "balanced";
  }
});

icons.forEach((icon) => {
  icon.addEventListener("click", function () {
    icons.forEach((icon) => icon.classList.remove("active"));
    this.classList.add("active");
    switch (this.id) {
      case "speed":
        moveSlider(0);
        break;
      case "balanced":
        moveSlider(1);
        break;
      case "accuracy":
        moveSlider(2);
        break;
      default:
        moveSlider(1);
    }
  });
});
