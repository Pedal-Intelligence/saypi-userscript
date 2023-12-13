document.addEventListener("DOMContentLoaded", function () {
  // Update elements with internationalised content
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    let messageKey = el.getAttribute("data-i18n");
    // we use the chrome api instead of i18n.ts because module loading is not supported in the popup
    el.textContent = chrome.i18n.getMessage(messageKey);
  });
  // Update attributes for internationalisation
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    let attrInfo = el.getAttribute("data-i18n-attr").split(":");
    let attrName = attrInfo[0];
    let messageKey = attrInfo[1];
    el.setAttribute(attrName, chrome.i18n.getMessage(messageKey));
  });

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
      const messageKey = "mode_" + result.prefer;
      output.textContent = chrome.i18n.getMessage(messageKey);
      setActiveIcon(result.prefer);
    }
  });

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    var preference = preferenceIcons[this.value];
    const messageKey = "mode_" + preference;
    output.textContent = chrome.i18n.getMessage(messageKey);
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
