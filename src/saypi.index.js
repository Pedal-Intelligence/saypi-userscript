import ButtonModule from "./ButtonModule.js";
import "./talkButton.css";
import "./mobile.css";
import "./rectangles.css";
import talkIconSVG from "./waveform.svg";
import rectanglesSVG from "./rectangles.svg";
(function () {
  "use strict";

  const buttonModule = new ButtonModule();

  const localConfig = {
    appServerUrl: "http://localhost:3000",
    apiServerUrl: "https://localhost:5000",
    // Add other configuration properties as needed
  };

  // Define a global configuration property
  const productionConfig = {
    appServerUrl: "https://app.saypi.ai",
    apiServerUrl: "https://api.saypi.ai",
    // Add other configuration properties as needed
  };
  const config = productionConfig;

  const pageScript = require("raw-loader!./transcriber.js").default;
  addUserAgentFlags();

  // Create a MutationObserver to listen for changes to the DOM
  var observer = new MutationObserver(function (mutations) {
    // Check each mutation
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];

      // If nodes were added, check each one
      if (mutation.addedNodes.length > 0) {
        for (var j = 0; j < mutation.addedNodes.length; j++) {
          var node = mutation.addedNodes[j];

          // If the node is the appropriate container element, add the button and stop observing
          if (
            node.nodeName.toLowerCase() === "div" &&
            node.classList.contains("fixed") &&
            node.classList.contains("bottom-16")
          ) {
            var footer = node;
            var buttonContainer = footer.querySelector(
              ".relative.flex.flex-col"
            );
            if (buttonContainer) {
              addTalkButton(buttonContainer);
            } else {
              console.warn("No button container found in footer");
            }
            if (!identifyFooter()) {
              console.warn("Footer not found");
            }
            observer.disconnect();
            return;
          }
        }
      }
    }
  });
  function identifyFooter() {
    // Find all audio elements on the page
    var audioElements = document.querySelectorAll("audio");
    var found = false; // default to not found

    audioElements.forEach(function (audio) {
      var precedingDiv = audio.previousElementSibling;

      // If we've already found a div, we can skip further iterations
      if (found) return;

      // Check if the preceding element is a div
      if (precedingDiv && precedingDiv.tagName.toLowerCase() === "div") {
        // Assign an ID to the div
        precedingDiv.id = "saypi-footer";
        found = true; // set to found
      }
    });

    return found;
  }

  function injectScript(callback) {
    var scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.id = "saypi-script";
    const configText = "var config = " + JSON.stringify(config) + ";";
    scriptElement.textContent = configText + pageScript;
    document.body.appendChild(scriptElement);

    // Call the callback function after the script is added
    if (callback) {
      callback();
    }
  }

  function isMobileView() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function addTalkButton(container) {
    // create a containing div
    var panel = document.createElement("div");
    panel.id = "saypi-panel";
    container.appendChild(panel);

    // Create the talk button using ButtonModule
    const label =
      "Talk (Hold Control + Space to use hotkey. Double click to toggle auto-submit on/off)";
    var button = buttonModule.createButton("", () => {}); // The callback is empty for now, but you can add functionalities if needed.

    button.id = "saypi-talkButton";
    button.type = "button";

    // Set ARIA label and tooltip
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);

    const classNames =
      "relative flex mt-1 mb-1 rounded-full px-2 py-3 text-center bg-cream-550 hover:bg-cream-650 hover:text-brand-green-700 text-muted";
    button.classList.add(classNames.split(" "));

    // Enable autosubmit by default
    button.dataset.autosubmit = "true";
    button.classList.add("autoSubmit");

    panel.appendChild(button);
    addTalkIcon(button);

    // Call the function to inject the script after the button has been added
    injectScript(registerAudioButtonEvents);
  }

  function addTalkIcon(button) {
    updateIconContent(button);

    window.matchMedia("(max-width: 768px)").addListener(() => {
      updateIconContent(button);
    });
  }

  function updateIconContent(iconContainer) {
    if (isMobileView()) {
      iconContainer.innerHTML = rectanglesSVG;
    } else {
      iconContainer.innerHTML = talkIconSVG;
    }
  }

  function addUserAgentFlags() {
    var isFirefoxAndroid =
      /Firefox/.test(navigator.userAgent) &&
      /Android/.test(navigator.userAgent);
    if (isFirefoxAndroid) {
      // hack for Firefox on Android, which doesn't support :active correctly
      document.documentElement.classList.add("firefox-android");
    }
  }

  function registerAudioButtonEvents() {
    const button = document.getElementById("saypi-talkButton");
    let context = window;
    if (GM_info.scriptHandler !== "Userscripts") {
      context = unsafeWindow;
    }

    const talkHandlers = {
      mousedown: function () {
        idPromptTextArea();
        context.startRecording();
      },
      mouseup: function () {
        if (typeof context?.stopRecording === "function") {
          context.stopRecording();
        }
      },
      dblclick: function () {
        // Toggle the CSS classes to indicate the mode
        button.classList.toggle("autoSubmit");
        if (button.getAttribute("data-autosubmit") === "true") {
          button.setAttribute("data-autosubmit", "false");
          console.log("autosubmit disabled");
        } else {
          button.setAttribute("data-autosubmit", "true");
          console.log("autosubmit enabled");
        }
      },
      touchstart: function (e) {
        e.preventDefault();
        idPromptTextArea();
        context.startRecording();
        button.classList.add("active");
      },
      touchend: function () {
        button.classList.remove("active");
        context.stopRecording();
      },
    };

    for (const eventType in talkHandlers) {
      button.addEventListener(eventType, talkHandlers[eventType]);
    }

    registerOtherAudioButtonEvents(button);
    registerCustomAudioEventListeners();
    registerHotkey();
  }

  function registerOtherAudioButtonEvents(button) {
    /* other handlers for the talk button, but not 'press to talk' */

    // "warm up" the microphone by acquiring it before the user presses the button
    button.addEventListener("mouseenter", setupRecording);
    button.addEventListener("mouseleave", tearDownRecording);
    window.addEventListener("beforeunload", tearDownRecording);

    button.addEventListener("touchcancel", function () {
      this.classList.remove("active"); // Remove the active class (for Firefox on Android)
      tearDownRecording();
    });
  }

  function registerCustomAudioEventListeners() {
    window.addEventListener("saypi:piReadyToRespond", function (e) {
      console.log("piReadyToRespond event received by UI script");
      if (isSafari()) {
        pokeUser();
      }
    });

    window.addEventListener("saypi:piSpeaking", function (e) {
      // Handle the piSpeaking event, e.g., start an animation or show a UI element.
      console.log("piSpeaking event received by UI script");
      if (isSafari()) {
        unpokeUser();
      }
    });
  }

  function createPlayButton() {
    const label = "Hear Pi's response";
    let playButton = buttonModule.createButton("", () => {});
    playButton.id = "saypi-playButton";
    playButton.type = "button";
    playButton.className = "hidden play-button";
    playButton.setAttribute("aria-label", label);
    playButton.setAttribute("title", label);
    playButton.addEventListener("click", handlePlayButtonClick);
    document.body.appendChild(playButton);
    return playButton;
  }

  function showPlayButton() {
    let playButton = document.getElementById("saypi-playButton");
    if (!playButton) {
      playButton = createPlayButton();
    }
    playButton.classList.remove("hidden");
  }

  function hidePlayButton() {
    let playButton = document.getElementById("saypi-playButton");
    if (playButton) {
      playButton.classList.add("hidden");
    }
  }

  let talkButton = document.getElementById("saypi-talkButton");
  function pokeUser() {
    animate("readyToRespond");
    showPlayButton();
  }

  function unpokeUser() {
    inanimate("readyToRespond");
    hidePlayButton();
  }

  function handlePlayButtonClick() {
    unpokeUser();
    piAudioManager.userPlay();
  }

  /* begin animation functions */
  function animate(animation) {
    stopOtherAnimations(animation);

    let rectangles = document.querySelectorAll(
      ".outermost, .second, .third, .fourth, .fifth, .innermost"
    );

    // To activate the animation
    rectangles.forEach((rect) => rect.classList.add(animation));
  }

  function inanimate(animation) {
    let rectangles = document.querySelectorAll(
      ".outermost, .second, .third, .fourth, .fifth, .innermost"
    );

    // To revert to the default pulse animation
    rectangles.forEach((rect) => rect.classList.remove(animation));
  }

  function stopAllAnimations() {
    const talkButtonAnimations = ["readyToRespond"];
    talkButtonAnimations.forEach((animation) => inanimate(animation));
  }

  function stopOtherAnimations(keepAnimation) {
    const talkButtonAnimations = ["readyToRespond"];
    talkButtonAnimations.forEach((animation) => {
      if (animation !== keepAnimation) {
        inanimate(animation);
      }
    });
  }
  /* end animation functions */

  function registerHotkey() {
    // Register a hotkey for the button
    let ctrlDown = false;

    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey && event.code === "Space" && !ctrlDown) {
        ctrlDown = true;
        // Simulate mousedown event
        let mouseDownEvent = new Event("mousedown");
        document
          .getElementById("saypi-talkButton")
          .dispatchEvent(mouseDownEvent);
        talkButton.classList.add("active"); // Add the active class
      }
    });

    document.addEventListener("keyup", function (event) {
      if (ctrlDown && event.code === "Space") {
        ctrlDown = false;
        // Simulate mouseup event
        let mouseUpEvent = new Event("mouseup");
        document.getElementById("saypi-talkButton").dispatchEvent(mouseUpEvent);
        talkButton.classList.remove("active");
      }
    });
  }

  function idPromptTextArea() {
    var textarea = document.getElementById("prompt");
    if (!textarea) {
      // Find the first <textarea> element and give it an id
      var textareaElement = document.querySelector("textarea");
      if (textareaElement) {
        textareaElement.id = "prompt";
      } else {
        console.log("No <textarea> element found");
      }
    }
  }

  // Start observing the entire document for changes to child nodes and subtree
  observer.observe(document, { childList: true, subtree: true });
})();
