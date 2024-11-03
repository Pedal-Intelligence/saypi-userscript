// utility functions
if (!Util) function Util() {}

Util.addClass = function (el, className) {
  var classList = className.split(" ");
  el.classList.add(classList[0]);
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(" "));
};

Util.removeClass = function (el, className) {
  var classList = className.split(" ");
  el.classList.remove(classList[0]);
  if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(" "));
};

Util.toggleClass = function (el, className, bool) {
  if (bool) Util.addClass(el, className);
  else Util.removeClass(el, className);
};

Util.moveFocus = function (element) {
  if (!element) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute("tabindex", "-1");
    element.focus();
  }
};

Util.getIndexInArray = function (array, el) {
  return Array.prototype.indexOf.call(array, el);
};

// File#: _1_language-picker
// Usage: codyhouse.co/license
(function () {
  class LanguagePicker {
    constructor(element) {
      (async () => {
        this.element = element;
        this.select = this.element.getElementsByTagName("select")[0];
        this.options = this.select.options;
        await selectInitialLanguageOption(this.options);
        this.pickerId = this.select.getAttribute("id");
        this.trigger = false;
        this.dropdown = false;
        this.firstLanguage = false;
        // dropdown arrow inside the button element
        this.arrowSvgPath =
          '<svg viewBox="0 0 16 16"><polygon points="3,5 8,11 13,5 "></polygon></svg>';
        this.globeSvgPath =
          '<svg viewBox="0 0 16 16"><path d="M8,0C3.6,0,0,3.6,0,8s3.6,8,8,8s8-3.6,8-8S12.4,0,8,0z M13.9,7H12c-0.1-1.5-0.4-2.9-0.8-4.1 C12.6,3.8,13.6,5.3,13.9,7z M8,14c-0.6,0-1.8-1.9-2-5H10C9.8,12.1,8.6,14,8,14z M6,7c0.2-3.1,1.3-5,2-5s1.8,1.9,2,5H6z M4.9,2.9 C4.4,4.1,4.1,5.5,4,7H2.1C2.4,5.3,3.4,3.8,4.9,2.9z M2.1,9H4c0.1,1.5,0.4,2.9,0.8,4.1C3.4,12.2,2.4,10.7,2.1,9z M11.1,13.1 c0.5-1.2,0.7-2.6,0.8-4.1h1.9C13.6,10.7,12.6,12.2,11.1,13.1z"></path></svg>';

        initLanguagePicker(this);
        initLanguagePickerEvents(this);
      })();
    }
  }

  /**
   * Initialize the language picker.
   * @param {LanguagePicker} picker - The language picker instance.
   */
  function initLanguagePicker(picker) {
    // create the custom dropdown element
    var buttonPicker = initButtonPicker(picker);
    var listPicker = initListPicker(picker);
    picker.element.appendChild(buttonPicker);
    picker.element.appendChild(listPicker);

    // save picker elements
    picker.dropdown = picker.element.getElementsByClassName(
      "language-picker__dropdown"
    )[0];
    picker.languages = picker.dropdown.getElementsByClassName(
      "language-picker__item"
    );
    picker.firstLanguage = picker.languages[0];
    picker.trigger = picker.element.getElementsByClassName(
      "language-picker__button"
    )[0];
  }

  function languageMatches(optionLang, userLang) {
    if (optionLang === userLang) {
      return true;
    }
    if (userLang.startsWith(optionLang + "-")) {
      return true;
    }
    return false;
  }

  /**
   * Initialise the language options, setting the selected one.
   * @param {HTMLOptionsCollection} options
   */
  async function selectInitialLanguageOption(options) {
    const result = await new Promise((resolve) =>
      chrome.storage.sync.get(["language"], resolve)
    );
    var language = result.language;
    const systemLanguage = navigator.language;
    if (language === undefined) {
      /* the user has not set a preferred language, default to the system language */
      language = systemLanguage;
      console.log(
        `No language preference set, defaulting to system language: ${language}`
      );
    }
    /* select the user's preferred language (or '' for auto-detect language) */
    var preferedLanguageMatched = false;
    for (var i = 0; i < options.length; i++) {
      // note that the language is matched on the lang attribute, not value
      if (languageMatches(options[i].lang, language)) {
        preferedLanguageMatched = true;
        options[i].selected = true;
        options.selectedIndex = i;
      } else {
        options[i].selected = false;
      }
    }
    const systemLanguageMatched =
      preferedLanguageMatched && languageMatches(language, systemLanguage);
    if (!systemLanguageMatched) {
      /* the user's preferred language is not available, default to a newly created 'system' option */
      const systemOption = document.createElement("option");
      systemOption.value = "system";
      systemOption.lang = systemLanguage;
      systemOption.text = `System (${systemLanguage})`;
      options.add(systemOption);
      if (!preferedLanguageMatched) {
        systemOption.selected = true;
        options.selectedIndex = options.length - 1;
      }
    }
  }

  /**
   *
   * @param {HTMLOptionsCollection} options - The available options.
   * @returns {HTMLOptionElement} - The selected option.
   */
  function getSelectedOption(options) {
    return options[options.selectedIndex];
  }

  function initLanguagePickerEvents(picker) {
    // make sure to add the icon class to the arrow dropdown inside the button element
    var svgs = picker.trigger.getElementsByTagName("svg");
    Util.addClass(svgs[0], "li4-icon");
    Util.addClass(svgs[1], "li4-icon");
    // language selection in dropdown
    // ⚠️ Important: you need to modify this function in production
    initLanguageSelection(picker);

    // click events
    picker.trigger.addEventListener("click", function () {
      toggleLanguagePicker(picker, false);
    });
    // keyboard navigation
    picker.dropdown.addEventListener("keydown", function (event) {
      if (
        (event.keyCode && event.keyCode == 38) ||
        (event.key && event.key.toLowerCase() == "arrowup")
      ) {
        keyboardNavigatePicker(picker, "prev");
      } else if (
        (event.keyCode && event.keyCode == 40) ||
        (event.key && event.key.toLowerCase() == "arrowdown")
      ) {
        keyboardNavigatePicker(picker, "next");
      }
    });
  }

  function toggleLanguagePicker(picker, bool) {
    var ariaExpanded;
    if (bool) {
      ariaExpanded = bool;
    } else {
      ariaExpanded =
        picker.trigger.getAttribute("aria-expanded") == "true"
          ? "false"
          : "true";
    }
    picker.trigger.setAttribute("aria-expanded", ariaExpanded);
    if (ariaExpanded == "true") {
      picker.firstLanguage.focus(); // fallback if transition is not supported
      picker.dropdown.addEventListener("transitionend", function cb() {
        picker.firstLanguage.focus();
        picker.dropdown.removeEventListener("transitionend", cb);
      });
      // place dropdown
      placeDropdown(picker);
    }
  }

  function placeDropdown(picker) {
    var triggerBoundingRect = picker.trigger.getBoundingClientRect();
    Util.toggleClass(
      picker.dropdown,
      "language-picker__dropdown--right",
      window.innerWidth < triggerBoundingRect.left + picker.dropdown.offsetWidth
    );
    /* In an extension popup, there's never enough space to display the downdown above the trigger
    Util.toggleClass(
      picker.dropdown,
      "language-picker__dropdown--up",
      window.innerHeight <
        triggerBoundingRect.bottom + picker.dropdown.offsetHeight
    );
    */
  }

  function checkLanguagePickerClick(picker, target) {
    // if user clicks outside the language picker -> close it
    if (!picker.element.contains(target)) toggleLanguagePicker(picker, "false");
  }

  function moveFocusToPickerTrigger(picker) {
    if (picker.trigger.getAttribute("aria-expanded") == "false") return;
    if (
      document.activeElement.closest(".language-picker__dropdown") ==
      picker.dropdown
    )
      picker.trigger.focus();
  }

  /**
   * Initializes the button picker.
   *
   * @param {LanguagePicker} picker - The picker object.
   * @param {HTMLOptionElement} selectedOption - The selected option.
   * @returns {HTMLButtonElement} - The created button element.
   */
  function initButtonPicker(picker) {
    const selectedOption = getSelectedOption(picker.options);
    // create the button element -> picker trigger]
    var button = document.createElement("button");
    button.classList.add("language-picker__button");
    const dataTriggerClasses =
      picker.element.getAttribute("data-trigger-class");
    for (const dataTriggerClass of dataTriggerClasses.split(" ")) {
      button.classList.add(dataTriggerClass);
    }
    button.setAttribute(
      "aria-label",
      selectedOption.value +
        " " +
        picker.element.getElementsByTagName("label")[0].textContent
    );
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", picker.pickerId + "-dropdown");

    var span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.classList.add("language-picker__label");
    span.classList.add("language-picker__flag");
    span.classList.add("language-picker__flag--" + selectedOption.value);

    span.appendChild(createSvgElement(picker.globeSvgPath));

    const optionText = document.createElement("em");
    optionText.innerText = selectedOption.text;
    span.appendChild(optionText);

    button.appendChild(span);
    button.appendChild(createSvgElement(picker.arrowSvgPath));
    return button;
  }

  function createSvgElement(svgString) {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    return svgDoc.documentElement;
  }

  function saveLanguagePreference(language) {
    chrome.storage.sync.set({ language: language }, function () {
      console.log("Preference saved: Language is set to " + language);
    });
  }

  /**
   *
   * @param {HTMLOptionsCollection} options
   * @returns {HTMLUListElement} - The created list element.
   */
  function buildOptionsList(options) {
    var list = document.createElement("ul");
    list.classList.add("language-picker__list");
    list.setAttribute("role", "listbox");

    Array.from(options).forEach(function (option) {
      var selected = option.selected;
      var language = option.getAttribute("lang");

      var listItem = document.createElement("li");
      var link = document.createElement("a");
      link.setAttribute("lang", language);
      link.setAttribute("hreflang", language);
      link.href = "#";
      if (selected) {
        link.setAttribute("aria-selected", "true");
      }
      link.setAttribute("data-value", option.value);
      link.classList.add(
        "language-picker__item",
        "language-picker__flag",
        "language-picker__flag--" + option.value
      );
      link.setAttribute("role", "option");
      
      const optionTextSpan = document.createElement("span");
      optionTextSpan.innerText = option.text;
      link.appendChild(optionTextSpan);
    
      link.addEventListener("click", function () {
        saveLanguagePreference(option.lang);
      });

      listItem.appendChild(link);
      list.appendChild(listItem);
    });
    return list;
  }

  /**
   * Initializes the list picker for the language picker.
   * @param {LanguagePicker} picker - The language picker object.
   * @returns {HTMLElement} - The created language picker dropdown.
   */
  function initListPicker(picker) {
    // create language picker dropdown
    var dropdown = document.createElement("div");
    dropdown.classList.add("language-picker__dropdown");
    dropdown.setAttribute("aria-describedby", picker.pickerId + "-description");
    dropdown.id = picker.pickerId + "-dropdown";

    var description = document.createElement("p");
    description.classList.add("li4-sr-only");
    description.id = picker.pickerId + "-description";
    description.textContent =
      picker.element.getElementsByTagName("label")[0].textContent;

    var list = buildOptionsList(picker.options);

    dropdown.appendChild(description);
    dropdown.appendChild(list);

    return dropdown;
  }

  function getLanguageUrl(option) {
    // ⚠️ Important: You should replace this return value with the real link to your website in the selected language
    // option.value gives you the value of the language that you can use to create your real url (e.g, 'english' or 'italiano')
    return "#";
  }

  function initLanguageSelection(picker) {
    picker.element
      .getElementsByClassName("language-picker__list")[0]
      .addEventListener("click", function (event) {
        var language = event.target.closest(".language-picker__item");
        if (!language) return;

        if (
          language.hasAttribute("aria-selected") &&
          language.getAttribute("aria-selected") == "true"
        ) {
          // selecting the same language
          event.preventDefault();
          picker.trigger.setAttribute("aria-expanded", "false"); // hide dropdown
        } else {
          // ⚠️ Important: this 'else' code needs to be removed in production.
          // The user has to be redirected to the new url -> nothing to do here
          event.preventDefault();
          picker.element
            .getElementsByClassName("language-picker__list")[0]
            .querySelector('[aria-selected="true"]')
            .removeAttribute("aria-selected");
          language.setAttribute("aria-selected", "true");
          picker.trigger
            .getElementsByClassName("language-picker__label")[0]
            .setAttribute(
              "class",
              "language-picker__label language-picker__flag language-picker__flag--" +
                language.getAttribute("data-value")
            );
          picker.trigger
            .getElementsByClassName("language-picker__label")[0]
            .getElementsByTagName("em")[0].textContent = language.textContent;
          picker.trigger.setAttribute("aria-expanded", "false");
        }
      });
  }

  function keyboardNavigatePicker(picker, direction) {
    var index = Util.getIndexInArray(picker.languages, document.activeElement);
    index = direction == "next" ? index + 1 : index - 1;
    if (index < 0) index = picker.languages.length - 1;
    if (index >= picker.languages.length) index = 0;
    Util.moveFocus(picker.languages[index]);
  }

  //initialize the LanguagePicker objects
  var languagePicker = document.getElementsByClassName("js-language-picker");
  if (languagePicker.length > 0) {
    var pickerArray = [];
    for (var i = 0; i < languagePicker.length; i++) {
      (function (i) {
        var picker = new LanguagePicker(languagePicker[i]);
        pickerArray.push(picker);
        picker.select.addEventListener("change", function () {
          chrome.storage.sync.set({ language: this.value }, function () {
            console.log("Preference saved: Language is set to " + this.value);
          });
        });
      })(i);
    }

    // listen for key events
    window.addEventListener("keyup", function (event) {
      if (
        (event.keyCode && event.keyCode == 27) ||
        (event.key && event.key.toLowerCase() == "escape")
      ) {
        // close language picker on 'Esc'
        pickerArray.forEach(function (element) {
          moveFocusToPickerTrigger(element); // if focus is within dropdown, move it to dropdown trigger
          toggleLanguagePicker(element, "false"); // close dropdown
        });
      }
    });
    // close language picker when clicking outside it
    window.addEventListener("click", function (event) {
      pickerArray.forEach(function (element) {
        checkLanguagePickerClick(element, event.target);
      });
    });
  }
})();
