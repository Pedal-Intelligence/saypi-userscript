// JavaScript to handle slider thumb position and icon changes
const slider = document.querySelector(".slider");
const icons = document.querySelectorAll(".flex span");

slider.addEventListener("input", function () {
  icons.forEach((icon) => icon.classList.remove("text-black"));
  icons[slider.value - 1].classList.add("text-black");
});
