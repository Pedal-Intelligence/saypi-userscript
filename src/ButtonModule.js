export default class ButtonModule {
  constructor() {
    this.textarea = document.getElementById("prompt");
    this.talkButton = document.getElementById("saypi-talkButton");
  }

  // Function to create a new button
  createButton(label, callback) {
    const button = document.createElement("button");
    button.textContent = label;
    button.onclick = callback;
    return button;
  }

  // Function to style a given button
  styleButton(button, styles) {
    for (let key in styles) {
      if (styles.hasOwnProperty(key)) {
        button.style[key] = styles[key];
      }
    }
  }

  // Simulate an "Enter" keypress event on a form
  simulateFormSubmit() {
    const enterEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Enter",
      keyCode: 13,
      which: 13,
    });

    this.textarea.dispatchEvent(enterEvent);
  }

  // Function to handle auto-submit based on the button's data attribute
  handleAutoSubmit(text) {
    if (this.talkButton.dataset.autosubmit === "false") {
      console.log("Autosubmit is disabled");
    } else {
      this.simulateFormSubmit();
    }
  }
}
