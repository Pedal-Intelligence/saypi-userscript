import ButtonModule from "./ButtonModule.js";
import EventModule from "./EventModule.js";
import { isMobileView, addUserAgentFlags } from "./UserAgentModule.js";
import "./talkButton.css";
import "./mobile.scss";
import "./rectangles.css";
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
  EventModule.init();

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
            if (!annotateDOM()) {
              console.warn("Required elements not found in DOM");
            }
            if (isMobileView()) {
              buttonModule.createExitButton();
            }
            observer.disconnect();
            return;
          }
        }
      }
    }
  });

  function annotateDOM() {
    // Add an ID to the prompt textarea
    const foundPrompt = addIdPromptTextArea();
    const foundFooter = addIdFooter();
    return foundPrompt && foundFooter;
  }

  function addIdPromptTextArea() {
    var textarea = document.getElementById("saypi-prompt");
    if (!textarea) {
      // Find the first <textarea> element and give it an id
      var textareaElement = document.querySelector("textarea");
      if (textareaElement) {
        textareaElement.id = "saypi-prompt";
      } else {
        console.warn("No <textarea> element found");
        return false;
      }
    }
    return true;
  }

  function addIdFooter() {
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
    buttonModule.addTalkIcon(button);

    // Call the function to inject the script after the button has been added
    injectScript(registerAudioButtonEvents);
  }

  function registerAudioButtonEvents() {
    const button = document.getElementById("saypi-talkButton");

    // Setting the correct context
    let context = window;
    if (GM_info.scriptHandler !== "Userscripts") {
      context = unsafeWindow;
    }
    EventModule.setContext(context); // Set the context for EventModule

    // Attach the event listeners
    button.addEventListener(
      "mousedown",
      EventModule.handleTalkMouseDown.bind(EventModule)
    );
    button.addEventListener(
      "mouseup",
      EventModule.handleTalkMouseUp.bind(EventModule)
    );
    button.addEventListener("dblclick", () =>
      EventModule.handleTalkDoubleClick(button)
    );
    button.addEventListener("touchstart", (e) =>
      EventModule.handleTalkTouchStart(button, e)
    );
    button.addEventListener("touchend", () =>
      EventModule.handleTalkTouchEnd(button)
    );

    EventModule.registerOtherAudioButtonEvents(button);
    EventModule.registerCustomAudioEventListeners();
    EventModule.registerHotkey();
  }

  // Start observing the entire document for changes to child nodes and subtree
  observer.observe(document, { childList: true, subtree: true });
})();
