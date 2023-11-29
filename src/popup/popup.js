// JavaScript to handle slider thumb position and icon changes
const slider = document.querySelector(".slider");
const icons = document.querySelectorAll(".icon");

slider.addEventListener("input", function () {
  icons.forEach((icon) => icon.classList.remove("active"));
  const selectedIcon = icons[slider.value];
  selectedIcon.classList.add("active");
});
