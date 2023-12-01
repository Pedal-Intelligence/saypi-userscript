document.addEventListener("DOMContentLoaded", function () {
  var slider = document.getElementById("customRange");
  var output = document.getElementById("sliderValue");
  var preferenceIcons = {
    0: "speed",
    1: "balanced",
    2: "accuracy",
  };

  // Load the saved preference when the popup opens
  chrome.storage.sync.get(["prefer"], function (result) {
    if (result.prefer) {
      var selectedValue = Object.keys(preferenceIcons).find(
        (key) => preferenceIcons[key] === result.prefer
      );
      slider.value = selectedValue;
      output.textContent = result.prefer;
      setActiveIcon(result.prefer);
    }
  });

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    var preference = preferenceIcons[this.value];
    output.textContent = preference;
    setActiveIcon(preference);

    // Save the preference
    chrome.storage.sync.set({ prefer: preference }, function () {
      console.log("Preference saved: " + preference);
    });
  };

  // Set active icon based on the preference
  function setActiveIcon(preference) {
    Object.keys(preferenceIcons).forEach((key) => {
      var iconId = preferenceIcons[key];
      var iconElement = document.getElementById(iconId);
      if (iconId === preference) {
        iconElement.classList.add("active");
      } else {
        iconElement.classList.remove("active");
      }
    });
  }

  const icons = document.querySelectorAll(".icon");
  const moveSlider = (position) => {
    slider.value = position;
    // fire input event to update sliderValue
    slider.dispatchEvent(new Event("input"));
  };
  // Add event listener for the icon click
  icons.forEach((icon) => {
    icon.addEventListener("click", function () {
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
});
