import { buttonModule } from "./ButtonModule";
import EventBus from "./EventBus.js";
import EventModule from "./EventModule.js";
import { addUserAgentFlags, initMode } from "./UserAgentModule.js";
import { submitErrorHandler } from "./SubmitErrorHandler";
import "./styles/common.scss";
import "./styles/desktop.scss";
import "./styles/mobile.scss";
import "./styles/rectangles.css";

(function () {
  "use strict";

  const pageScript =
    require("raw-loader!../public/audioModule.bundle.js").default;
  addUserAgentFlags();
  EventModule.init();
  setupEventBus();

  // Create a MutationObserver to listen for changes to the DOM
  // textareas are added to the DOM after the page loads
  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        // Iterate through added nodes
        mutation.addedNodes.forEach((node) => {
          // Check if added node is a textarea with 'enterkeyhint' attribute
          if (
            node.nodeName === "TEXTAREA" &&
            node.hasAttribute("enterkeyhint")
          ) {
            // Stop observing to avoid any potential infinite loops
            observer.disconnect();

            // Do something with the textarea, like add an event listener
            annotateDOM(node);
            return;
          }

          // Check if added node contains a textarea with 'enterkeyhint' attribute
          if (node.querySelectorAll) {
            const textareas = node.querySelectorAll("textarea[enterkeyhint]");
            if (textareas.length > 0) {
              // Stop observing
              observer.disconnect();

              // Do something with the first textarea that has 'enterkeyhint'
              annotateDOM(textareas[0]);
              submitErrorHandler.initAudioOutputListener();
              submitErrorHandler.checkForRestorePoint();
              return;
            }
          }
        });
      }
    }
  };

  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: true };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(document.body, config);

  function setupEventBus() {
    // Setting the correct context
    let context = window;
    if (GM_info.scriptHandler !== "Userscripts") {
      context = unsafeWindow;
    }
    context.EventBus = EventBus; // Make the EventBus available to the page script
  }

  function annotateDOM(prompt) {
    // Add id attributes to important elements
    prompt.id = "saypi-prompt";
    prompt.parentElement.classList.add("saypi-prompt-container");
    const foundFooter = addIdFooter();
    const foundAudioControls = addIdAudioControls();
    const promptControlsContainer = prompt.parentElement.parentElement;
    promptControlsContainer.id = "saypi-prompt-controls-container";
    const foundPromptAncestor = addIdPromptAncestor(promptControlsContainer);
    const foundAudioOutputButton = addIdAudioOutputButton();
    addIdSubmitButton(promptControlsContainer);
    addTalkButton(document.body);
    buttonModule.createCallButton(promptControlsContainer, -1);
    buttonModule.createEnterButton();
    buttonModule.createExitButton();
    initMode();
  }

  function addIdPromptAncestor(container) {
    // climb up the DOM tree until we find a div with class 'w-full'
    let parent = container.parentElement;
    while (parent) {
      if (parent.classList.contains("w-full")) {
        parent.id = "saypi-prompt-ancestor";
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  function addIdSubmitButton(container) {
    const submitButtons = container.querySelectorAll("button[type=button]");
    if (submitButtons.length > 0) {
      const lastSubmitButton = submitButtons[submitButtons.length - 1];
      lastSubmitButton.id = "saypi-submitButton";
    }
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
        precedingDiv.lastElementChild.id = "saypi-footer";
        found = true; // set to found
      }
    });

    return found;
  }

  function addIdAudioControls() {
    // Find all audio elements on the page
    var audioElements = document.querySelectorAll("audio");
    var found = false; // default to not found

    audioElements.forEach(function (audio) {
      var nextDiv = audio.nextElementSibling;

      // If we've already found a div, we can skip further iterations
      if (found) return;

      // Check if the preceding element is a div
      if (nextDiv && nextDiv.tagName.toLowerCase() === "div") {
        // Assign an ID to the div
        nextDiv.id = "saypi-audio-controls";
        found = true; // set to found
      }
    });

    return found;
  }

  function addIdAudioOutputButton() {
    // audio button is the last button element in the audio controls container
    const audioButton = document.querySelector(
      "#saypi-audio-controls > div > div.relative.flex.items-center.justify-end.self-end.p-2 > button"
    );
    if (!audioButton) {
      return false;
    } else {
      audioButton.id = "saypi-audio-output-button";
    }
    return true;
  }

  function injectScript(callback) {
    var scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.id = "saypi-script";
    scriptElement.textContent = pageScript;
    document.body.appendChild(scriptElement);

    // Call the callback function after the script is added
    if (callback) {
      callback();
    }
  }

  function addTalkButton(container) {
    // Create a containing div
    var panel = document.createElement("div");
    panel.id = "saypi-panel";

    if (container) {
      container.appendChild(panel);
    } else {
      document.body.appendChild(panel);
    }

    // talk "button" is no longer a button, but a div
    var button = document.createElement("div");
    button.id = "saypi-talkButton";

    const classNames =
      "relative flex mt-1 mb-1 rounded-full px-2 py-3 text-center bg-cream-550 hover:bg-cream-650 hover:text-brand-green-700 text-muted";
    button.classList.add(classNames.split(" "));

    // Enable autosubmit by default
    button.dataset.autosubmit = "true";
    button.classList.add("autoSubmit");

    panel.appendChild(button);
    buttonModule.addTalkIcon(button);

    // Call the function to inject the script after the button has been added
    injectScript();
  }

  // Start observing the entire document for changes to child nodes and subtree
  observer.observe(document, { childList: true, subtree: true });
})();
