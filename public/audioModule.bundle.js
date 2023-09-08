// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.3.6
// @description  Speak to Pi with OpenAI's Whisper
// @author       Ross Cadogan
// @match        https://pi.ai/talk
// @inject-into  page
// @updateURL    https://app.saypi.ai/saypi.user.js
// @downloadURL  https://app.saypi.ai/saypi.user.js
// @license      MIT
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/UserAgentModule.js":
/*!********************************!*\
  !*** ./src/UserAgentModule.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addDeviceFlags: () => (/* binding */ addDeviceFlags),
/* harmony export */   addUserAgentFlags: () => (/* binding */ addUserAgentFlags),
/* harmony export */   addViewFlags: () => (/* binding */ addViewFlags),
/* harmony export */   enterMobileMode: () => (/* binding */ enterMobileMode),
/* harmony export */   exitMobileMode: () => (/* binding */ exitMobileMode),
/* harmony export */   isMobileDevice: () => (/* binding */ isMobileDevice),
/* harmony export */   isMobileView: () => (/* binding */ isMobileView),
/* harmony export */   isSafari: () => (/* binding */ isSafari)
/* harmony export */ });
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.matchMedia("(max-width: 768px)").matches;
}

// Use localStorage to persist user preference
function isMobileView() {
  var userViewPreference = localStorage.getItem("userViewPreference");
  if (userViewPreference) {
    return userViewPreference === "mobile";
  }
  return isMobileDevice();
}
function exitMobileMode() {
  localStorage.setItem("userViewPreference", "desktop"); // Save preference

  var element = document.documentElement;
  element.classList.remove("mobile-view");
  element.classList.add("desktop-view");
}
function enterMobileMode() {
  localStorage.setItem("userViewPreference", "mobile"); // Save preference

  var element = document.documentElement;
  element.classList.remove("desktop-view");
  element.classList.add("mobile-view");
}
function addUserAgentFlags() {
  var isFirefoxAndroid = /Firefox/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);
  var element = document.documentElement;
  if (isFirefoxAndroid) {
    element.classList.add("firefox-android");
  }
  addDeviceFlags(element);
  addViewFlags(element);
}
function addDeviceFlags(element) {
  if (isMobileDevice()) {
    element.classList.add("mobile-device");
  }
}
function addViewFlags(element) {
  if (isMobileView()) {
    element.classList.add("mobile-view");
  } else {
    element.classList.remove("mobile-view");
    element.classList.add("desktop-view");
  }
}

/***/ }),

/***/ "./src/state-machines/AudioOutputMachine.js":
/*!**************************************************!*\
  !*** ./src/state-machines/AudioOutputMachine.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   audioOutputMachine: () => (/* binding */ audioOutputMachine)
/* harmony export */ });
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xstate */ "./node_modules/xstate/es/Machine.js");
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! xstate */ "./node_modules/xstate/es/index.js");
/* harmony import */ var _UserAgentModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../UserAgentModule */ "./src/UserAgentModule.js");


var EventBus = window.EventBus;
var audioElement = document.querySelector("audio");
if (!audioElement) {
  console.error("Audio element not found in output machine!");
}
var audioOutputMachine = (0,xstate__WEBPACK_IMPORTED_MODULE_1__.createMachine)({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7A8qgLgA4EB0GEANmAMQVbIQDK+yATvgNoAMAuoqISywM+bADt+IAB6IAjACYArCQAsATg0AOAGwBmAOxdDXebIA0IAJ6IV2lSU2KuXRSpX7FuzWoC+Pi2iYuATE+CR0DBhiUNSEFMiW3HxIIILColgSKTIIKvJqJPqyXGq2urLadopq2hbWuXYOTi5uHl6+-iCB2HhEpBGY0bFosGBJkmki4pI5eQVFJWUVVTV1iPr62iTazlwqst5qihvafgHoPSH99IMxsPhYhOMpkxlZoLP5hcWlessq1VqVkQSlkJCUzkUBz22jUzl0Zy6F2CfTCcQSURihBGY14EyEU0yM3WxRIcO08lhbk0mxUmjWuX0uhIuxcujUTL02k0iO6KNCJHRlkx1Huj2eAgJb2JCAWZK4FKpdNp9OBCAM8hZu0U8nkXncpV5yN6AqFIrAYggkAlqSl02yJK48sVpWVdlV9TymuabOKO0UmlkRqCJtI2NQowgsXiiTxLztRIdCC020UFNKHk0Gt0DM89kczm0smqak0ZdOnT5obROKjYqeccl6XtHzk8kMTVK7OVWcUDI8YIBzgBWZq7I65xDVxrEcg1FYYAGNteLekjudlNdNPduccJF0zQptn0x4RleN05I9cIc4GzDYnEbtubidbCAUHccXdKNN7DMDJA+kWaYHHCaZ+J0YhYFa8ApFW074i+7xrggAC0QL1OhWqsjhkLBpcqJkJQYCIYSyGfAytjKAekKtJ43j4fy1yRNEpHSkmSjKB4+iBkoBiBmUlH7E0hayO41TKox1aCjGmJsauOSeFsRzlAelQaLoB6UfImgiS4J6yPoajsnYUmXuGkbya+KGyLZYLkjpzS2fo8j9jpqjNDqmgqFwsgaIoZmEdekBWeRcjaEZnbqJSAInAy2iKFxWYGIY8i2FmEE+EAA */
  id: "audioOutput",
  context: {
    userStarted: true,
    audioElement: audioElement
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        loadStart: "loading"
      }
    },
    loading: {
      on: {
        play: "playing",
        pause: "paused",
        stop: "stopped"
      },
      entry: {
        type: "emitEvent",
        params: {
          eventName: "saypi:ready"
        }
      }
    },
    playing: {
      on: {
        pause: "paused",
        stop: "stopped",
        ended: "stopped"
      },
      entry: [{
        type: "autoPauseSafari"
      }, {
        type: "emitEvent",
        params: {
          eventName: "saypi:piSpeaking"
        }
      }]
    },
    paused: {
      on: {
        play: "playing",
        stop: "stopped",
        reload: {
          target: "loading",
          description: "Reload the audio stream for Safari.\nThis is the only command that external modules can send the machine.",
          action: (0,xstate__WEBPACK_IMPORTED_MODULE_2__.assign)(function (context, event) {
            context.audioElement.load();
            context.audioElement.play();
            return {
              userStarted: true,
              audioElement: context.audioElement
            };
          }),
          cond: "isSafariMobile"
        }
      },
      entry: {
        type: "emitEvent",
        params: {
          eventName: "saypi:pause"
        }
      }
    },
    stopped: {
      on: {
        loadStart: {
          target: "loading",
          description: "Fired when the audio element's src attribute changes with a new response track."
        }
      },
      entry: [{
        type: "emitEvent",
        params: {
          eventName: "saypi:piStoppedSpeaking"
        }
      }, (0,xstate__WEBPACK_IMPORTED_MODULE_2__.assign)(function (context, event) {
        return {
          userStarted: false,
          audioElement: context.audioElement
        };
      }), "seekToEnd"]
    }
  },
  predictableActionArguments: true,
  preserveActionOrder: true
}, {
  actions: {
    emitEvent: function emitEvent(context, event, _ref) {
      var action = _ref.action;
      EventBus.emit(action.params.eventName);
    },
    autoPauseSafari: function autoPauseSafari(context, event) {
      if (!(0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_0__.isSafari)() || !(0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_0__.isMobileView)()) {
        return;
      }
      if (!context.userStarted) {
        (0,xstate__WEBPACK_IMPORTED_MODULE_2__.raise)("pause"); // raise and send are available in xstate but not in @xstate/fsm
        //context.audioElement.pause();
      }
    },

    seekToEnd: function seekToEnd(context, event) {
      var audio = context.audioElement;
      if (audio.duration && !audio.ended && audio.currentTime < audio.duration) {
        audio.currentTime = audio.duration; // seek the audio to the end
        audio.play(); // trigger the ended event
      }
    }
  },

  guards: {
    isSafariMobile: function isSafariMobile(context, event) {
      return (0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_0__.isSafari)() && (0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_0__.isMobileView)();
    }
  }
});

/***/ }),

/***/ "./node_modules/xstate/es/Actor.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/Actor.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDeferredActor: () => (/* binding */ createDeferredActor),
/* harmony export */   createInvocableActor: () => (/* binding */ createInvocableActor),
/* harmony export */   createNullActor: () => (/* binding */ createNullActor),
/* harmony export */   isActor: () => (/* binding */ isActor),
/* harmony export */   isSpawnedActor: () => (/* binding */ isSpawnedActor),
/* harmony export */   toActorRef: () => (/* binding */ toActorRef)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");
/* harmony import */ var _serviceScope_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./serviceScope.js */ "./node_modules/xstate/es/serviceScope.js");




function createNullActor(id) {
  var _a;

  return _a = {
    id: id,
    send: function () {
      return void 0;
    },
    subscribe: function () {
      return {
        unsubscribe: function () {
          return void 0;
        }
      };
    },
    getSnapshot: function () {
      return undefined;
    },
    toJSON: function () {
      return {
        id: id
      };
    }
  }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
    return this;
  }, _a;
}
/**
 * Creates a deferred actor that is able to be invoked given the provided
 * invocation information in its `.meta` value.
 *
 * @param invokeDefinition The meta information needed to invoke the actor.
 */

function createInvocableActor(invokeDefinition, machine, context, _event) {
  var _a;

  var invokeSrc = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toInvokeSource)(invokeDefinition.src);
  var serviceCreator = (_a = machine === null || machine === void 0 ? void 0 : machine.options.services) === null || _a === void 0 ? void 0 : _a[invokeSrc.type];
  var resolvedData = invokeDefinition.data ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapContext)(invokeDefinition.data, context, _event) : undefined;
  var tempActor = serviceCreator ? createDeferredActor(serviceCreator, invokeDefinition.id, resolvedData) : createNullActor(invokeDefinition.id); // @ts-ignore

  tempActor.meta = invokeDefinition;
  return tempActor;
}
function createDeferredActor(entity, id, data) {
  var tempActor = createNullActor(id); // @ts-ignore

  tempActor.deferred = true;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(entity)) {
    // "mute" the existing service scope so potential spawned actors within the `.initialState` stay deferred here
    var initialState_1 = tempActor.state = (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_1__.provide)(undefined, function () {
      return (data ? entity.withContext(data) : entity).initialState;
    });

    tempActor.getSnapshot = function () {
      return initialState_1;
    };
  }

  return tempActor;
}
function isActor(item) {
  try {
    return typeof item.send === 'function';
  } catch (e) {
    return false;
  }
}
function isSpawnedActor(item) {
  return isActor(item) && 'id' in item;
} // TODO: refactor the return type, this could be written in a better way but it's best to avoid unneccessary breaking changes now

function toActorRef(actorRefLike) {
  var _a;

  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((_a = {
    subscribe: function () {
      return {
        unsubscribe: function () {
          return void 0;
        }
      };
    },
    id: 'anonymous',
    getSnapshot: function () {
      return undefined;
    }
  }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
    return this;
  }, _a), actorRefLike);
}




/***/ }),

/***/ "./node_modules/xstate/es/Machine.js":
/*!*******************************************!*\
  !*** ./node_modules/xstate/es/Machine.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Machine: () => (/* binding */ Machine),
/* harmony export */   createMachine: () => (/* binding */ createMachine)
/* harmony export */ });
/* harmony import */ var _StateNode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateNode.js */ "./node_modules/xstate/es/StateNode.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");



var warned = false;
function Machine(config, options, initialContext) {
  if (initialContext === void 0) {
    initialContext = config.context;
  }

  return new _StateNode_js__WEBPACK_IMPORTED_MODULE_0__.StateNode(config, options, initialContext);
}
function createMachine(config, options) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION && !('predictableActionArguments' in config) && !warned) {
    warned = true;
    console.warn('It is highly recommended to set `predictableActionArguments` to `true` when using `createMachine`. https://xstate.js.org/docs/guides/actions.html');
  }

  return new _StateNode_js__WEBPACK_IMPORTED_MODULE_0__.StateNode(config, options);
}




/***/ }),

/***/ "./node_modules/xstate/es/State.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/State.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   State: () => (/* binding */ State),
/* harmony export */   bindActionToState: () => (/* binding */ bindActionToState),
/* harmony export */   isState: () => (/* binding */ isState),
/* harmony export */   isStateConfig: () => (/* binding */ isStateConfig),
/* harmony export */   stateValuesEqual: () => (/* binding */ stateValuesEqual)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.js */ "./node_modules/xstate/es/constants.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");
/* harmony import */ var _stateUtils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./stateUtils.js */ "./node_modules/xstate/es/stateUtils.js");
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./actions.js */ "./node_modules/xstate/es/actions.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");







function stateValuesEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (a === undefined || b === undefined) {
    return false;
  }

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(a) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(b)) {
    return a === b;
  }

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  return aKeys.length === bKeys.length && aKeys.every(function (key) {
    return stateValuesEqual(a[key], b[key]);
  });
}
function isStateConfig(state) {
  if (typeof state !== 'object' || state === null) {
    return false;
  }

  return 'value' in state && '_event' in state;
}
/**
 * @deprecated Use `isStateConfig(object)` or `state instanceof State` instead.
 */

var isState = isStateConfig;
function bindActionToState(action, state) {
  var exec = action.exec;

  var boundAction = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, action), {
    exec: exec !== undefined ? function () {
      return exec(state.context, state.event, {
        action: action,
        state: state,
        _event: state._event
      });
    } : undefined
  });

  return boundAction;
}

var State =
/*#__PURE__*/

/** @class */
function () {
  /**
   * Creates a new State instance.
   * @param value The state value
   * @param context The extended state
   * @param historyValue The tree representing historical values of the state nodes
   * @param history The previous state
   * @param actions An array of action objects to execute as side-effects
   * @param activities A mapping of activities and whether they are started (`true`) or stopped (`false`).
   * @param meta
   * @param events Internal event queue. Should be empty with run-to-completion semantics.
   * @param configuration
   */
  function State(config) {
    var _this = this;

    var _a;

    this.actions = [];
    this.activities = _constants_js__WEBPACK_IMPORTED_MODULE_2__.EMPTY_ACTIVITY_MAP;
    this.meta = {};
    this.events = [];
    this.value = config.value;
    this.context = config.context;
    this._event = config._event;
    this._sessionid = config._sessionid;
    this.event = this._event.data;
    this.historyValue = config.historyValue;
    this.history = config.history;
    this.actions = config.actions || [];
    this.activities = config.activities || _constants_js__WEBPACK_IMPORTED_MODULE_2__.EMPTY_ACTIVITY_MAP;
    this.meta = (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_3__.getMeta)(config.configuration);
    this.events = config.events || [];
    this.matches = this.matches.bind(this);
    this.toStrings = this.toStrings.bind(this);
    this.configuration = config.configuration;
    this.transitions = config.transitions;
    this.children = config.children;
    this.done = !!config.done;
    this.tags = (_a = Array.isArray(config.tags) ? new Set(config.tags) : config.tags) !== null && _a !== void 0 ? _a : new Set();
    this.machine = config.machine;
    Object.defineProperty(this, 'nextEvents', {
      get: function () {
        return (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_3__.nextEvents)(_this.configuration);
      }
    });
  }
  /**
   * Creates a new State instance for the given `stateValue` and `context`.
   * @param stateValue
   * @param context
   */


  State.from = function (stateValue, context) {
    if (stateValue instanceof State) {
      if (stateValue.context !== context) {
        return new State({
          value: stateValue.value,
          context: context,
          _event: stateValue._event,
          _sessionid: null,
          historyValue: stateValue.historyValue,
          history: stateValue.history,
          actions: [],
          activities: stateValue.activities,
          meta: {},
          events: [],
          configuration: [],
          transitions: [],
          children: {}
        });
      }

      return stateValue;
    }

    var _event = _actions_js__WEBPACK_IMPORTED_MODULE_4__.initEvent;
    return new State({
      value: stateValue,
      context: context,
      _event: _event,
      _sessionid: null,
      historyValue: undefined,
      history: undefined,
      actions: [],
      activities: undefined,
      meta: undefined,
      events: [],
      configuration: [],
      transitions: [],
      children: {}
    });
  };
  /**
   * Creates a new State instance for the given `config`.
   * @param config The state config
   */


  State.create = function (config) {
    return new State(config);
  };
  /**
   * Creates a new `State` instance for the given `stateValue` and `context` with no actions (side-effects).
   * @param stateValue
   * @param context
   */


  State.inert = function (stateValue, context) {
    if (stateValue instanceof State) {
      if (!stateValue.actions.length) {
        return stateValue;
      }

      var _event = _actions_js__WEBPACK_IMPORTED_MODULE_4__.initEvent;
      return new State({
        value: stateValue.value,
        context: context,
        _event: _event,
        _sessionid: null,
        historyValue: stateValue.historyValue,
        history: stateValue.history,
        activities: stateValue.activities,
        configuration: stateValue.configuration,
        transitions: [],
        children: {}
      });
    }

    return State.from(stateValue, context);
  };
  /**
   * Returns an array of all the string leaf state node paths.
   * @param stateValue
   * @param delimiter The character(s) that separate each subpath in the string state node path.
   */


  State.prototype.toStrings = function (stateValue, delimiter) {
    var _this = this;

    if (stateValue === void 0) {
      stateValue = this.value;
    }

    if (delimiter === void 0) {
      delimiter = '.';
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(stateValue)) {
      return [stateValue];
    }

    var valueKeys = Object.keys(stateValue);
    return valueKeys.concat.apply(valueKeys, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__read)(valueKeys.map(function (key) {
      return _this.toStrings(stateValue[key], delimiter).map(function (s) {
        return key + delimiter + s;
      });
    })), false));
  };

  State.prototype.toJSON = function () {
    var _a = this;
        _a.configuration;
        _a.transitions;
        var tags = _a.tags;
        _a.machine;
        var jsonValues = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__rest)(_a, ["configuration", "transitions", "tags", "machine"]);

    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, jsonValues), {
      tags: Array.from(tags)
    });
  };

  State.prototype.matches = function (parentStateValue) {
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.matchesState)(parentStateValue, this.value);
  };
  /**
   * Whether the current state configuration has a state node with the specified `tag`.
   * @param tag
   */


  State.prototype.hasTag = function (tag) {
    return this.tags.has(tag);
  };
  /**
   * Determines whether sending the `event` will cause a non-forbidden transition
   * to be selected, even if the transitions have no actions nor
   * change the state value.
   *
   * @param event The event to test
   * @returns Whether the event will cause a transition
   */


  State.prototype.can = function (event) {
    var _a;

    if (_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(!!this.machine, "state.can(...) used outside of a machine-created State object; this will always return false.");
    }

    var transitionData = (_a = this.machine) === null || _a === void 0 ? void 0 : _a.getTransitionData(this, event);
    return !!(transitionData === null || transitionData === void 0 ? void 0 : transitionData.transitions.length) && // Check that at least one transition is not forbidden
    transitionData.transitions.some(function (t) {
      return t.target !== undefined || t.actions.length;
    });
  };

  return State;
}();




/***/ }),

/***/ "./node_modules/xstate/es/StateNode.js":
/*!*********************************************!*\
  !*** ./node_modules/xstate/es/StateNode.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StateNode: () => (/* binding */ StateNode)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./State.js */ "./node_modules/xstate/es/State.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./actionTypes.js */ "./node_modules/xstate/es/actionTypes.js");
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./actions.js */ "./node_modules/xstate/es/actions.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.js */ "./node_modules/xstate/es/constants.js");
/* harmony import */ var _stateUtils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./stateUtils.js */ "./node_modules/xstate/es/stateUtils.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Actor.js */ "./node_modules/xstate/es/Actor.js");
/* harmony import */ var _invokeUtils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./invokeUtils.js */ "./node_modules/xstate/es/invokeUtils.js");











var NULL_EVENT = '';
var STATE_IDENTIFIER = '#';
var WILDCARD = '*';
var EMPTY_OBJECT = {};

var isStateId = function (str) {
  return str[0] === STATE_IDENTIFIER;
};

var createDefaultOptions = function () {
  return {
    actions: {},
    guards: {},
    services: {},
    activities: {},
    delays: {}
  };
};

var validateArrayifiedTransitions = function (stateNode, event, transitions) {
  var hasNonLastUnguardedTarget = transitions.slice(0, -1).some(function (transition) {
    return !('cond' in transition) && !('in' in transition) && ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(transition.target) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(transition.target));
  });
  var eventText = event === NULL_EVENT ? 'the transient event' : "event '".concat(event, "'");
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(!hasNonLastUnguardedTarget, "One or more transitions for ".concat(eventText, " on state '").concat(stateNode.id, "' are unreachable. ") + "Make sure that the default transition is the last one defined.");
};

var StateNode =
/*#__PURE__*/

/** @class */
function () {
  function StateNode(
  /**
   * The raw config used to create the machine.
   */
  config, options,
  /**
   * The initial extended state
   */
  _context, // TODO: this is unsafe, but we're removing it in v5 anyway
  _stateInfo) {
    if (_context === void 0) {
      _context = 'context' in config ? config.context : undefined;
    }

    var _this = this;

    var _a;

    this.config = config;
    this._context = _context;
    /**
     * The order this state node appears. Corresponds to the implicit SCXML document order.
     */

    this.order = -1;
    this.__xstatenode = true;
    this.__cache = {
      events: undefined,
      relativeValue: new Map(),
      initialStateValue: undefined,
      initialState: undefined,
      on: undefined,
      transitions: undefined,
      candidates: {},
      delayedTransitions: undefined
    };
    this.idMap = {};
    this.tags = [];
    this.options = Object.assign(createDefaultOptions(), options);
    this.parent = _stateInfo === null || _stateInfo === void 0 ? void 0 : _stateInfo.parent;
    this.key = this.config.key || (_stateInfo === null || _stateInfo === void 0 ? void 0 : _stateInfo.key) || this.config.id || '(machine)';
    this.machine = this.parent ? this.parent.machine : this;
    this.path = this.parent ? this.parent.path.concat(this.key) : [];
    this.delimiter = this.config.delimiter || (this.parent ? this.parent.delimiter : _constants_js__WEBPACK_IMPORTED_MODULE_1__.STATE_DELIMITER);
    this.id = this.config.id || (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([this.machine.key], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(this.path), false).join(this.delimiter);
    this.version = this.parent ? this.parent.version : this.config.version;
    this.type = this.config.type || (this.config.parallel ? 'parallel' : this.config.states && Object.keys(this.config.states).length ? 'compound' : this.config.history ? 'history' : 'atomic');
    this.schema = this.parent ? this.machine.schema : (_a = this.config.schema) !== null && _a !== void 0 ? _a : {};
    this.description = this.config.description;

    if (!_environment_js__WEBPACK_IMPORTED_MODULE_3__.IS_PRODUCTION) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(!('parallel' in this.config), "The \"parallel\" property is deprecated and will be removed in version 4.1. ".concat(this.config.parallel ? "Replace with `type: 'parallel'`" : "Use `type: '".concat(this.type, "'`"), " in the config for state node '").concat(this.id, "' instead."));
    }

    this.initial = this.config.initial;
    this.states = this.config.states ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapValues)(this.config.states, function (stateConfig, key) {
      var _a;

      var stateNode = new StateNode(stateConfig, {}, undefined, {
        parent: _this,
        key: key
      });
      Object.assign(_this.idMap, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((_a = {}, _a[stateNode.id] = stateNode, _a), stateNode.idMap));
      return stateNode;
    }) : EMPTY_OBJECT; // Document order

    var order = 0;

    function dfs(stateNode) {
      var e_1, _a;

      stateNode.order = order++;

      try {
        for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)((0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getAllChildren)(stateNode)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var child = _c.value;
          dfs(child);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }

    dfs(this); // History config

    this.history = this.config.history === true ? 'shallow' : this.config.history || false;
    this._transient = !!this.config.always || (!this.config.on ? false : Array.isArray(this.config.on) ? this.config.on.some(function (_a) {
      var event = _a.event;
      return event === NULL_EVENT;
    }) : NULL_EVENT in this.config.on);
    this.strict = !!this.config.strict; // TODO: deprecate (entry)

    this.onEntry = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(this.config.entry || this.config.onEntry).map(function (action) {
      return (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObject)(action);
    }); // TODO: deprecate (exit)

    this.onExit = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(this.config.exit || this.config.onExit).map(function (action) {
      return (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObject)(action);
    });
    this.meta = this.config.meta;
    this.doneData = this.type === 'final' ? this.config.data : undefined;
    this.invoke = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(this.config.invoke).map(function (invokeConfig, i) {
      var _a, _b;

      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(invokeConfig)) {
        var invokeId = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createInvokeId)(_this.id, i);
        _this.machine.options.services = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((_a = {}, _a[invokeId] = invokeConfig, _a), _this.machine.options.services);
        return (0,_invokeUtils_js__WEBPACK_IMPORTED_MODULE_6__.toInvokeDefinition)({
          src: invokeId,
          id: invokeId
        });
      } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(invokeConfig.src)) {
        var invokeId = invokeConfig.id || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createInvokeId)(_this.id, i);
        return (0,_invokeUtils_js__WEBPACK_IMPORTED_MODULE_6__.toInvokeDefinition)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, invokeConfig), {
          id: invokeId,
          src: invokeConfig.src
        }));
      } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(invokeConfig.src) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(invokeConfig.src)) {
        var invokeId = invokeConfig.id || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createInvokeId)(_this.id, i);
        _this.machine.options.services = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((_b = {}, _b[invokeId] = invokeConfig.src, _b), _this.machine.options.services);
        return (0,_invokeUtils_js__WEBPACK_IMPORTED_MODULE_6__.toInvokeDefinition)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({
          id: invokeId
        }, invokeConfig), {
          src: invokeId
        }));
      } else {
        var invokeSource = invokeConfig.src;
        return (0,_invokeUtils_js__WEBPACK_IMPORTED_MODULE_6__.toInvokeDefinition)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({
          id: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createInvokeId)(_this.id, i)
        }, invokeConfig), {
          src: invokeSource
        }));
      }
    });
    this.activities = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(this.config.activities).concat(this.invoke).map(function (activity) {
      return (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActivityDefinition)(activity);
    });
    this.transition = this.transition.bind(this);
    this.tags = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(this.config.tags); // TODO: this is the real fix for initialization once
    // state node getters are deprecated
    // if (!this.parent) {
    //   this._init();
    // }
  }

  StateNode.prototype._init = function () {
    if (this.__cache.transitions) {
      return;
    }

    (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getAllStateNodes)(this).forEach(function (stateNode) {
      return stateNode.on;
    });
  };
  /**
   * Clones this state machine with custom options and context.
   *
   * @param options Options (actions, guards, activities, services) to recursively merge with the existing options.
   * @param context Custom context (will override predefined context)
   */


  StateNode.prototype.withConfig = function (options, context) {
    var _a = this.options,
        actions = _a.actions,
        activities = _a.activities,
        guards = _a.guards,
        services = _a.services,
        delays = _a.delays;
    return new StateNode(this.config, {
      actions: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, actions), options.actions),
      activities: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, activities), options.activities),
      guards: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, guards), options.guards),
      services: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, services), options.services),
      delays: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, delays), options.delays)
    }, context !== null && context !== void 0 ? context : this.context);
  };
  /**
   * Clones this state machine with custom context.
   *
   * @param context Custom context (will override predefined context, not recursive)
   */


  StateNode.prototype.withContext = function (context) {
    return new StateNode(this.config, this.options, context);
  };

  Object.defineProperty(StateNode.prototype, "context", {
    get: function () {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(this._context) ? this._context() : this._context;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "definition", {
    /**
     * The well-structured state node definition.
     */
    get: function () {
      return {
        id: this.id,
        key: this.key,
        version: this.version,
        context: this.context,
        type: this.type,
        initial: this.initial,
        history: this.history,
        states: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapValues)(this.states, function (state) {
          return state.definition;
        }),
        on: this.on,
        transitions: this.transitions,
        entry: this.onEntry,
        exit: this.onExit,
        activities: this.activities || [],
        meta: this.meta,
        order: this.order || -1,
        data: this.doneData,
        invoke: this.invoke,
        description: this.description,
        tags: this.tags
      };
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.toJSON = function () {
    return this.definition;
  };

  Object.defineProperty(StateNode.prototype, "on", {
    /**
     * The mapping of events to transitions.
     */
    get: function () {
      if (this.__cache.on) {
        return this.__cache.on;
      }

      var transitions = this.transitions;
      return this.__cache.on = transitions.reduce(function (map, transition) {
        map[transition.eventType] = map[transition.eventType] || [];
        map[transition.eventType].push(transition);
        return map;
      }, {});
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "after", {
    get: function () {
      return this.__cache.delayedTransitions || (this.__cache.delayedTransitions = this.getDelayedTransitions(), this.__cache.delayedTransitions);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "transitions", {
    /**
     * All the transitions that can be taken from this state node.
     */
    get: function () {
      return this.__cache.transitions || (this.__cache.transitions = this.formatTransitions(), this.__cache.transitions);
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.getCandidates = function (eventName) {
    if (this.__cache.candidates[eventName]) {
      return this.__cache.candidates[eventName];
    }

    var transient = eventName === NULL_EVENT;
    var candidates = this.transitions.filter(function (transition) {
      var sameEventType = transition.eventType === eventName; // null events should only match against eventless transitions

      return transient ? sameEventType : sameEventType || transition.eventType === WILDCARD;
    });
    this.__cache.candidates[eventName] = candidates;
    return candidates;
  };
  /**
   * All delayed transitions from the config.
   */


  StateNode.prototype.getDelayedTransitions = function () {
    var _this = this;

    var afterConfig = this.config.after;

    if (!afterConfig) {
      return [];
    }

    var mutateEntryExit = function (delay, i) {
      var delayRef = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(delay) ? "".concat(_this.id, ":delay[").concat(i, "]") : delay;
      var eventType = (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.after)(delayRef, _this.id);

      _this.onEntry.push((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.send)(eventType, {
        delay: delay
      }));

      _this.onExit.push((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.cancel)(eventType));

      return eventType;
    };

    var delayedTransitions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isArray)(afterConfig) ? afterConfig.map(function (transition, i) {
      var eventType = mutateEntryExit(transition.delay, i);
      return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, transition), {
        event: eventType
      });
    }) : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(Object.keys(afterConfig).map(function (delay, i) {
      var configTransition = afterConfig[delay];
      var resolvedTransition = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(configTransition) ? {
        target: configTransition
      } : configTransition;
      var resolvedDelay = !isNaN(+delay) ? +delay : delay;
      var eventType = mutateEntryExit(resolvedDelay, i);
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(resolvedTransition).map(function (transition) {
        return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, transition), {
          event: eventType,
          delay: resolvedDelay
        });
      });
    }));
    return delayedTransitions.map(function (delayedTransition) {
      var delay = delayedTransition.delay;
      return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, _this.formatTransition(delayedTransition)), {
        delay: delay
      });
    });
  };
  /**
   * Returns the state nodes represented by the current state value.
   *
   * @param state The state value or State instance
   */


  StateNode.prototype.getStateNodes = function (state) {
    var _a;

    var _this = this;

    if (!state) {
      return [];
    }

    var stateValue = state instanceof _State_js__WEBPACK_IMPORTED_MODULE_7__.State ? state.value : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStateValue)(state, this.delimiter);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(stateValue)) {
      var initialStateValue = this.getStateNode(stateValue).initial;
      return initialStateValue !== undefined ? this.getStateNodes((_a = {}, _a[stateValue] = initialStateValue, _a)) : [this, this.states[stateValue]];
    }

    var subStateKeys = Object.keys(stateValue);
    var subStateNodes = [this];
    subStateNodes.push.apply(subStateNodes, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(subStateKeys.map(function (subStateKey) {
      return _this.getStateNode(subStateKey).getStateNodes(stateValue[subStateKey]);
    }))), false));
    return subStateNodes;
  };
  /**
   * Returns `true` if this state node explicitly handles the given event.
   *
   * @param event The event in question
   */


  StateNode.prototype.handles = function (event) {
    var eventType = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getEventType)(event);
    return this.events.includes(eventType);
  };
  /**
   * Resolves the given `state` to a new `State` instance relative to this machine.
   *
   * This ensures that `.events` and `.nextEvents` represent the correct values.
   *
   * @param state The state to resolve
   */


  StateNode.prototype.resolveState = function (state) {
    var stateFromConfig = state instanceof _State_js__WEBPACK_IMPORTED_MODULE_7__.State ? state : _State_js__WEBPACK_IMPORTED_MODULE_7__.State.create(state);
    var configuration = Array.from((0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getConfiguration)([], this.getStateNodes(stateFromConfig.value)));
    return new _State_js__WEBPACK_IMPORTED_MODULE_7__.State((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, stateFromConfig), {
      value: this.resolve(stateFromConfig.value),
      configuration: configuration,
      done: (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.isInFinalState)(configuration, this),
      tags: (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getTagsFromConfiguration)(configuration),
      machine: this.machine
    }));
  };

  StateNode.prototype.transitionLeafNode = function (stateValue, state, _event) {
    var stateNode = this.getStateNode(stateValue);
    var next = stateNode.next(state, _event);

    if (!next || !next.transitions.length) {
      return this.next(state, _event);
    }

    return next;
  };

  StateNode.prototype.transitionCompoundNode = function (stateValue, state, _event) {
    var subStateKeys = Object.keys(stateValue);
    var stateNode = this.getStateNode(subStateKeys[0]);

    var next = stateNode._transition(stateValue[subStateKeys[0]], state, _event);

    if (!next || !next.transitions.length) {
      return this.next(state, _event);
    }

    return next;
  };

  StateNode.prototype.transitionParallelNode = function (stateValue, state, _event) {
    var e_2, _a;

    var transitionMap = {};

    try {
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(Object.keys(stateValue)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var subStateKey = _c.value;
        var subStateValue = stateValue[subStateKey];

        if (!subStateValue) {
          continue;
        }

        var subStateNode = this.getStateNode(subStateKey);

        var next = subStateNode._transition(subStateValue, state, _event);

        if (next) {
          transitionMap[subStateKey] = next;
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    var stateTransitions = Object.keys(transitionMap).map(function (key) {
      return transitionMap[key];
    });
    var enabledTransitions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(stateTransitions.map(function (st) {
      return st.transitions;
    }));
    var willTransition = stateTransitions.some(function (st) {
      return st.transitions.length > 0;
    });

    if (!willTransition) {
      return this.next(state, _event);
    }

    var configuration = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(Object.keys(transitionMap).map(function (key) {
      return transitionMap[key].configuration;
    }));
    return {
      transitions: enabledTransitions,
      exitSet: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(stateTransitions.map(function (t) {
        return t.exitSet;
      })),
      configuration: configuration,
      source: state,
      actions: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(Object.keys(transitionMap).map(function (key) {
        return transitionMap[key].actions;
      }))
    };
  };

  StateNode.prototype._transition = function (stateValue, state, _event) {
    // leaf node
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(stateValue)) {
      return this.transitionLeafNode(stateValue, state, _event);
    } // hierarchical node


    if (Object.keys(stateValue).length === 1) {
      return this.transitionCompoundNode(stateValue, state, _event);
    } // orthogonal node


    return this.transitionParallelNode(stateValue, state, _event);
  };

  StateNode.prototype.getTransitionData = function (state, event) {
    return this._transition(state.value, state, (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(event));
  };

  StateNode.prototype.next = function (state, _event) {
    var e_3, _a;

    var _this = this;

    var eventName = _event.name;
    var actions = [];
    var nextStateNodes = [];
    var selectedTransition;

    try {
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(this.getCandidates(eventName)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var candidate = _c.value;
        var cond = candidate.cond,
            stateIn = candidate.in;
        var resolvedContext = state.context;
        var isInState = stateIn ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(stateIn) && isStateId(stateIn) ? // Check if in state by ID
        state.matches((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStateValue)(this.getStateNodeById(stateIn).path, this.delimiter)) : // Check if in state by relative grandparent
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.matchesState)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStateValue)(stateIn, this.delimiter), (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.path)(this.path.slice(0, -2))(state.value)) : true;
        var guardPassed = false;

        try {
          guardPassed = !cond || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.evaluateGuard)(this.machine, cond, resolvedContext, _event, state);
        } catch (err) {
          throw new Error("Unable to evaluate guard '".concat(cond.name || cond.type, "' in transition for event '").concat(eventName, "' in state node '").concat(this.id, "':\n").concat(err.message));
        }

        if (guardPassed && isInState) {
          if (candidate.target !== undefined) {
            nextStateNodes = candidate.target;
          }

          actions.push.apply(actions, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(candidate.actions), false));
          selectedTransition = candidate;
          break;
        }
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    if (!selectedTransition) {
      return undefined;
    }

    if (!nextStateNodes.length) {
      return {
        transitions: [selectedTransition],
        exitSet: [],
        configuration: state.value ? [this] : [],
        source: state,
        actions: actions
      };
    }

    var allNextStateNodes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(nextStateNodes.map(function (stateNode) {
      return _this.getRelativeStateNodes(stateNode, state.historyValue);
    }));
    var isInternal = !!selectedTransition.internal;
    return {
      transitions: [selectedTransition],
      exitSet: isInternal ? [] : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(nextStateNodes.map(function (targetNode) {
        return _this.getPotentiallyReenteringNodes(targetNode);
      })),
      configuration: allNextStateNodes,
      source: state,
      actions: actions
    };
  }; // even though the name of this function mentions reentry nodes
  // we are pushing its result into `exitSet`
  // that's because what we exit might be reentered (it's an invariant of reentrancy)


  StateNode.prototype.getPotentiallyReenteringNodes = function (targetNode) {
    if (this.order < targetNode.order) {
      return [this];
    }

    var nodes = [];
    var marker = this;
    var possibleAncestor = targetNode;

    while (marker && marker !== possibleAncestor) {
      nodes.push(marker);
      marker = marker.parent;
    }

    if (marker !== possibleAncestor) {
      // we never got to `possibleAncestor`, therefore the initial `marker` "escapes" it
      // it's in a different part of the tree so no states will be reentered for such an external transition
      return [];
    }

    nodes.push(possibleAncestor);
    return nodes;
  };

  StateNode.prototype.getActions = function (resolvedConfig, isDone, transition, currentContext, _event, prevState, predictableExec) {
    var e_4, _a, e_5, _b;

    var _this = this;

    var prevConfig = prevState ? (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getConfiguration)([], this.getStateNodes(prevState.value)) : [];
    var entrySet = new Set();

    try {
      for (var _c = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(Array.from(resolvedConfig).sort(function (a, b) {
        return a.order - b.order;
      })), _d = _c.next(); !_d.done; _d = _c.next()) {
        var sn = _d.value;

        if (!(0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.has)(prevConfig, sn) || (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.has)(transition.exitSet, sn) || sn.parent && entrySet.has(sn.parent)) {
          entrySet.add(sn);
        }
      }
    } catch (e_4_1) {
      e_4 = {
        error: e_4_1
      };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_4) throw e_4.error;
      }
    }

    try {
      for (var prevConfig_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(prevConfig), prevConfig_1_1 = prevConfig_1.next(); !prevConfig_1_1.done; prevConfig_1_1 = prevConfig_1.next()) {
        var sn = prevConfig_1_1.value;

        if (!(0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.has)(resolvedConfig, sn) || (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.has)(transition.exitSet, sn.parent)) {
          transition.exitSet.push(sn);
        }
      }
    } catch (e_5_1) {
      e_5 = {
        error: e_5_1
      };
    } finally {
      try {
        if (prevConfig_1_1 && !prevConfig_1_1.done && (_b = prevConfig_1.return)) _b.call(prevConfig_1);
      } finally {
        if (e_5) throw e_5.error;
      }
    }

    transition.exitSet.sort(function (a, b) {
      return b.order - a.order;
    });
    var entryStates = Array.from(entrySet).sort(function (a, b) {
      return a.order - b.order;
    });
    var exitStates = new Set(transition.exitSet);
    var doneEvents = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(entryStates.map(function (sn) {
      var events = [];

      if (sn.type !== 'final') {
        return events;
      }

      var parent = sn.parent;

      if (!parent.parent) {
        return events;
      }

      events.push((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.done)(sn.id, sn.doneData), // TODO: deprecate - final states should not emit done events for their own state.
      (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.done)(parent.id, sn.doneData ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapContext)(sn.doneData, currentContext, _event) : undefined));
      var grandparent = parent.parent;

      if (grandparent.type === 'parallel') {
        if ((0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getChildren)(grandparent).every(function (parentNode) {
          return (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.isInFinalState)(transition.configuration, parentNode);
        })) {
          events.push((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.done)(grandparent.id));
        }
      }

      return events;
    }));
    var entryActions = entryStates.map(function (stateNode) {
      var entryActions = stateNode.onEntry;
      var invokeActions = stateNode.activities.map(function (activity) {
        return (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.start)(activity);
      });
      return {
        type: 'entry',
        actions: (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObjects)(predictableExec ? (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(entryActions), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(invokeActions), false) : (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(invokeActions), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(entryActions), false), _this.machine.options.actions)
      };
    }).concat({
      type: 'state_done',
      actions: doneEvents.map(function (event) {
        return (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.raise)(event);
      })
    });
    var exitActions = Array.from(exitStates).map(function (stateNode) {
      return {
        type: 'exit',
        actions: (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObjects)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(stateNode.onExit), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(stateNode.activities.map(function (activity) {
          return (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.stop)(activity);
        })), false), _this.machine.options.actions)
      };
    });
    var actions = exitActions.concat({
      type: 'transition',
      actions: (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObjects)(transition.actions, this.machine.options.actions)
    }).concat(entryActions);

    if (isDone) {
      var stopActions = (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObjects)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(resolvedConfig), false).sort(function (a, b) {
        return b.order - a.order;
      }).map(function (stateNode) {
        return stateNode.onExit;
      })), this.machine.options.actions).filter(function (action) {
        return !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isRaisableAction)(action);
      });
      return actions.concat({
        type: 'stop',
        actions: stopActions
      });
    }

    return actions;
  };
  /**
   * Determines the next state given the current `state` and sent `event`.
   *
   * @param state The current State instance or state value
   * @param event The event that was sent at the current state
   * @param context The current context (extended state) of the current state
   */


  StateNode.prototype.transition = function (state, event, context, exec) {
    if (state === void 0) {
      state = this.initialState;
    }

    var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(event);

    var currentState;

    if (state instanceof _State_js__WEBPACK_IMPORTED_MODULE_7__.State) {
      currentState = context === undefined ? state : this.resolveState(_State_js__WEBPACK_IMPORTED_MODULE_7__.State.from(state, context));
    } else {
      var resolvedStateValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(state) ? this.resolve((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.pathToStateValue)(this.getResolvedPath(state))) : this.resolve(state);
      var resolvedContext = context !== null && context !== void 0 ? context : this.machine.context;
      currentState = this.resolveState(_State_js__WEBPACK_IMPORTED_MODULE_7__.State.from(resolvedStateValue, resolvedContext));
    }

    if (!_environment_js__WEBPACK_IMPORTED_MODULE_3__.IS_PRODUCTION && _event.name === WILDCARD) {
      throw new Error("An event cannot have the wildcard type ('".concat(WILDCARD, "')"));
    }

    if (this.strict) {
      if (!this.events.includes(_event.name) && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isBuiltInEvent)(_event.name)) {
        throw new Error("Machine '".concat(this.id, "' does not accept event '").concat(_event.name, "'"));
      }
    }

    var stateTransition = this._transition(currentState.value, currentState, _event) || {
      transitions: [],
      configuration: [],
      exitSet: [],
      source: currentState,
      actions: []
    };
    var prevConfig = (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getConfiguration)([], this.getStateNodes(currentState.value));
    var resolvedConfig = stateTransition.configuration.length ? (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getConfiguration)(prevConfig, stateTransition.configuration) : prevConfig;
    stateTransition.configuration = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(resolvedConfig), false);
    return this.resolveTransition(stateTransition, currentState, currentState.context, exec, _event);
  };

  StateNode.prototype.resolveRaisedTransition = function (state, _event, originalEvent, predictableExec) {
    var _a;

    var currentActions = state.actions;
    state = this.transition(state, _event, undefined, predictableExec); // Save original event to state
    // TODO: this should be the raised event! Delete in V5 (breaking)

    state._event = originalEvent;
    state.event = originalEvent.data;

    (_a = state.actions).unshift.apply(_a, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(currentActions), false));

    return state;
  };

  StateNode.prototype.resolveTransition = function (stateTransition, currentState, context, predictableExec, _event) {
    var e_6, _a, e_7, _b;

    var _this = this;

    if (_event === void 0) {
      _event = _actions_js__WEBPACK_IMPORTED_MODULE_5__.initEvent;
    }

    var configuration = stateTransition.configuration; // Transition will "apply" if:
    // - this is the initial state (there is no current state)
    // - OR there are transitions

    var willTransition = !currentState || stateTransition.transitions.length > 0;
    var resolvedConfiguration = willTransition ? stateTransition.configuration : currentState ? currentState.configuration : [];
    var isDone = (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.isInFinalState)(resolvedConfiguration, this);
    var resolvedStateValue = willTransition ? (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getValue)(this.machine, configuration) : undefined;
    var historyValue = currentState ? currentState.historyValue ? currentState.historyValue : stateTransition.source ? this.machine.historyValue(currentState.value) : undefined : undefined;
    var actionBlocks = this.getActions(new Set(resolvedConfiguration), isDone, stateTransition, context, _event, currentState, predictableExec);
    var activities = currentState ? (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, currentState.activities) : {};

    try {
      for (var actionBlocks_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(actionBlocks), actionBlocks_1_1 = actionBlocks_1.next(); !actionBlocks_1_1.done; actionBlocks_1_1 = actionBlocks_1.next()) {
        var block = actionBlocks_1_1.value;

        try {
          for (var _c = (e_7 = void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(block.actions)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var action = _d.value;

            if (action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__.start) {
              activities[action.activity.id || action.activity.type] = action;
            } else if (action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__.stop) {
              activities[action.activity.id || action.activity.type] = false;
            }
          }
        } catch (e_7_1) {
          e_7 = {
            error: e_7_1
          };
        } finally {
          try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
          } finally {
            if (e_7) throw e_7.error;
          }
        }
      }
    } catch (e_6_1) {
      e_6 = {
        error: e_6_1
      };
    } finally {
      try {
        if (actionBlocks_1_1 && !actionBlocks_1_1.done && (_a = actionBlocks_1.return)) _a.call(actionBlocks_1);
      } finally {
        if (e_6) throw e_6.error;
      }
    }

    var _e = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.resolveActions)(this, currentState, context, _event, actionBlocks, predictableExec, this.machine.config.predictableActionArguments || this.machine.config.preserveActionOrder), 2),
        resolvedActions = _e[0],
        updatedContext = _e[1];

    var _f = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.partition)(resolvedActions, _utils_js__WEBPACK_IMPORTED_MODULE_0__.isRaisableAction), 2),
        raisedEvents = _f[0],
        nonRaisedActions = _f[1];

    var invokeActions = resolvedActions.filter(function (action) {
      var _a;

      return action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__.start && ((_a = action.activity) === null || _a === void 0 ? void 0 : _a.type) === _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__.invoke;
    });
    var children = invokeActions.reduce(function (acc, action) {
      acc[action.activity.id] = (0,_Actor_js__WEBPACK_IMPORTED_MODULE_9__.createInvocableActor)(action.activity, _this.machine, updatedContext, _event);
      return acc;
    }, currentState ? (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, currentState.children) : {});
    var nextState = new _State_js__WEBPACK_IMPORTED_MODULE_7__.State({
      value: resolvedStateValue || currentState.value,
      context: updatedContext,
      _event: _event,
      // Persist _sessionid between states
      _sessionid: currentState ? currentState._sessionid : null,
      historyValue: resolvedStateValue ? historyValue ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.updateHistoryValue)(historyValue, resolvedStateValue) : undefined : currentState ? currentState.historyValue : undefined,
      history: !resolvedStateValue || stateTransition.source ? currentState : undefined,
      actions: resolvedStateValue ? nonRaisedActions : [],
      activities: resolvedStateValue ? activities : currentState ? currentState.activities : {},
      events: [],
      configuration: resolvedConfiguration,
      transitions: stateTransition.transitions,
      children: children,
      done: isDone,
      tags: (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getTagsFromConfiguration)(resolvedConfiguration),
      machine: this
    });
    var didUpdateContext = context !== updatedContext;
    nextState.changed = _event.name === _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__.update || didUpdateContext; // Dispose of penultimate histories to prevent memory leaks

    var history = nextState.history;

    if (history) {
      delete history.history;
    } // There are transient transitions if the machine is not in a final state
    // and if some of the state nodes have transient ("always") transitions.


    var hasAlwaysTransitions = !isDone && (this._transient || configuration.some(function (stateNode) {
      return stateNode._transient;
    })); // If there are no enabled transitions, check if there are transient transitions.
    // If there are transient transitions, continue checking for more transitions
    // because an transient transition should be triggered even if there are no
    // enabled transitions.
    //
    // If we're already working on an transient transition then stop to prevent an infinite loop.
    //
    // Otherwise, if there are no enabled nor transient transitions, we are done.

    if (!willTransition && (!hasAlwaysTransitions || _event.name === NULL_EVENT)) {
      return nextState;
    }

    var maybeNextState = nextState;

    if (!isDone) {
      if (hasAlwaysTransitions) {
        maybeNextState = this.resolveRaisedTransition(maybeNextState, {
          type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__.nullEvent
        }, _event, predictableExec);
      }

      while (raisedEvents.length) {
        var raisedEvent = raisedEvents.shift();
        maybeNextState = this.resolveRaisedTransition(maybeNextState, raisedEvent._event, _event, predictableExec);
      }
    } // Detect if state changed


    var changed = maybeNextState.changed || (history ? !!maybeNextState.actions.length || didUpdateContext || typeof history.value !== typeof maybeNextState.value || !(0,_State_js__WEBPACK_IMPORTED_MODULE_7__.stateValuesEqual)(maybeNextState.value, history.value) : undefined);
    maybeNextState.changed = changed; // Preserve original history after raised events

    maybeNextState.history = history;
    return maybeNextState;
  };
  /**
   * Returns the child state node from its relative `stateKey`, or throws.
   */


  StateNode.prototype.getStateNode = function (stateKey) {
    if (isStateId(stateKey)) {
      return this.machine.getStateNodeById(stateKey);
    }

    if (!this.states) {
      throw new Error("Unable to retrieve child state '".concat(stateKey, "' from '").concat(this.id, "'; no child states exist."));
    }

    var result = this.states[stateKey];

    if (!result) {
      throw new Error("Child state '".concat(stateKey, "' does not exist on '").concat(this.id, "'"));
    }

    return result;
  };
  /**
   * Returns the state node with the given `stateId`, or throws.
   *
   * @param stateId The state ID. The prefix "#" is removed.
   */


  StateNode.prototype.getStateNodeById = function (stateId) {
    var resolvedStateId = isStateId(stateId) ? stateId.slice(STATE_IDENTIFIER.length) : stateId;

    if (resolvedStateId === this.id) {
      return this;
    }

    var stateNode = this.machine.idMap[resolvedStateId];

    if (!stateNode) {
      throw new Error("Child state node '#".concat(resolvedStateId, "' does not exist on machine '").concat(this.id, "'"));
    }

    return stateNode;
  };
  /**
   * Returns the relative state node from the given `statePath`, or throws.
   *
   * @param statePath The string or string array relative path to the state node.
   */


  StateNode.prototype.getStateNodeByPath = function (statePath) {
    if (typeof statePath === 'string' && isStateId(statePath)) {
      try {
        return this.getStateNodeById(statePath.slice(1));
      } catch (e) {// try individual paths
        // throw e;
      }
    }

    var arrayStatePath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStatePath)(statePath, this.delimiter).slice();
    var currentStateNode = this;

    while (arrayStatePath.length) {
      var key = arrayStatePath.shift();

      if (!key.length) {
        break;
      }

      currentStateNode = currentStateNode.getStateNode(key);
    }

    return currentStateNode;
  };
  /**
   * Resolves a partial state value with its full representation in this machine.
   *
   * @param stateValue The partial state value to resolve.
   */


  StateNode.prototype.resolve = function (stateValue) {
    var _a;

    var _this = this;

    if (!stateValue) {
      return this.initialStateValue || EMPTY_OBJECT; // TODO: type-specific properties
    }

    switch (this.type) {
      case 'parallel':
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapValues)(this.initialStateValue, function (subStateValue, subStateKey) {
          return subStateValue ? _this.getStateNode(subStateKey).resolve(stateValue[subStateKey] || subStateValue) : EMPTY_OBJECT;
        });

      case 'compound':
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(stateValue)) {
          var subStateNode = this.getStateNode(stateValue);

          if (subStateNode.type === 'parallel' || subStateNode.type === 'compound') {
            return _a = {}, _a[stateValue] = subStateNode.initialStateValue, _a;
          }

          return stateValue;
        }

        if (!Object.keys(stateValue).length) {
          return this.initialStateValue || {};
        }

        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapValues)(stateValue, function (subStateValue, subStateKey) {
          return subStateValue ? _this.getStateNode(subStateKey).resolve(subStateValue) : EMPTY_OBJECT;
        });

      default:
        return stateValue || EMPTY_OBJECT;
    }
  };

  StateNode.prototype.getResolvedPath = function (stateIdentifier) {
    if (isStateId(stateIdentifier)) {
      var stateNode = this.machine.idMap[stateIdentifier.slice(STATE_IDENTIFIER.length)];

      if (!stateNode) {
        throw new Error("Unable to find state node '".concat(stateIdentifier, "'"));
      }

      return stateNode.path;
    }

    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStatePath)(stateIdentifier, this.delimiter);
  };

  Object.defineProperty(StateNode.prototype, "initialStateValue", {
    get: function () {
      var _a;

      if (this.__cache.initialStateValue) {
        return this.__cache.initialStateValue;
      }

      var initialStateValue;

      if (this.type === 'parallel') {
        initialStateValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapFilterValues)(this.states, function (state) {
          return state.initialStateValue || EMPTY_OBJECT;
        }, function (stateNode) {
          return !(stateNode.type === 'history');
        });
      } else if (this.initial !== undefined) {
        if (!this.states[this.initial]) {
          throw new Error("Initial state '".concat(this.initial, "' not found on '").concat(this.key, "'"));
        }

        initialStateValue = (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.isLeafNode)(this.states[this.initial]) ? this.initial : (_a = {}, _a[this.initial] = this.states[this.initial].initialStateValue, _a);
      } else {
        // The finite state value of a machine without child states is just an empty object
        initialStateValue = {};
      }

      this.__cache.initialStateValue = initialStateValue;
      return this.__cache.initialStateValue;
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.getInitialState = function (stateValue, context) {
    this._init(); // TODO: this should be in the constructor (see note in constructor)


    var configuration = this.getStateNodes(stateValue);
    return this.resolveTransition({
      configuration: configuration,
      exitSet: [],
      transitions: [],
      source: undefined,
      actions: []
    }, undefined, context !== null && context !== void 0 ? context : this.machine.context, undefined);
  };

  Object.defineProperty(StateNode.prototype, "initialState", {
    /**
     * The initial State instance, which includes all actions to be executed from
     * entering the initial state.
     */
    get: function () {
      var initialStateValue = this.initialStateValue;

      if (!initialStateValue) {
        throw new Error("Cannot retrieve initial state from simple state '".concat(this.id, "'."));
      }

      return this.getInitialState(initialStateValue);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "target", {
    /**
     * The target state value of the history state node, if it exists. This represents the
     * default state value to transition to if no history value exists yet.
     */
    get: function () {
      var target;

      if (this.type === 'history') {
        var historyConfig = this.config;

        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(historyConfig.target)) {
          target = isStateId(historyConfig.target) ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.pathToStateValue)(this.machine.getStateNodeById(historyConfig.target).path.slice(this.path.length - 1)) : historyConfig.target;
        } else {
          target = historyConfig.target;
        }
      }

      return target;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Returns the leaf nodes from a state path relative to this state node.
   *
   * @param relativeStateId The relative state path to retrieve the state nodes
   * @param history The previous state to retrieve history
   * @param resolve Whether state nodes should resolve to initial child state nodes
   */

  StateNode.prototype.getRelativeStateNodes = function (relativeStateId, historyValue, resolve) {
    if (resolve === void 0) {
      resolve = true;
    }

    return resolve ? relativeStateId.type === 'history' ? relativeStateId.resolveHistory(historyValue) : relativeStateId.initialStateNodes : [relativeStateId];
  };

  Object.defineProperty(StateNode.prototype, "initialStateNodes", {
    get: function () {
      var _this = this;

      if ((0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.isLeafNode)(this)) {
        return [this];
      } // Case when state node is compound but no initial state is defined


      if (this.type === 'compound' && !this.initial) {
        if (!_environment_js__WEBPACK_IMPORTED_MODULE_3__.IS_PRODUCTION) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "Compound state node '".concat(this.id, "' has no initial state."));
        }

        return [this];
      }

      var initialStateNodePaths = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStatePaths)(this.initialStateValue);
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(initialStateNodePaths.map(function (initialPath) {
        return _this.getFromRelativePath(initialPath);
      }));
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Retrieves state nodes from a relative path to this state node.
   *
   * @param relativePath The relative path from this state node
   * @param historyValue
   */

  StateNode.prototype.getFromRelativePath = function (relativePath) {
    if (!relativePath.length) {
      return [this];
    }

    var _a = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(relativePath),
        stateKey = _a[0],
        childStatePath = _a.slice(1);

    if (!this.states) {
      throw new Error("Cannot retrieve subPath '".concat(stateKey, "' from node with no states"));
    }

    var childStateNode = this.getStateNode(stateKey);

    if (childStateNode.type === 'history') {
      return childStateNode.resolveHistory();
    }

    if (!this.states[stateKey]) {
      throw new Error("Child state '".concat(stateKey, "' does not exist on '").concat(this.id, "'"));
    }

    return this.states[stateKey].getFromRelativePath(childStatePath);
  };

  StateNode.prototype.historyValue = function (relativeStateValue) {
    if (!Object.keys(this.states).length) {
      return undefined;
    }

    return {
      current: relativeStateValue || this.initialStateValue,
      states: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapFilterValues)(this.states, function (stateNode, key) {
        if (!relativeStateValue) {
          return stateNode.historyValue();
        }

        var subStateValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(relativeStateValue) ? undefined : relativeStateValue[key];
        return stateNode.historyValue(subStateValue || stateNode.initialStateValue);
      }, function (stateNode) {
        return !stateNode.history;
      })
    };
  };
  /**
   * Resolves to the historical value(s) of the parent state node,
   * represented by state nodes.
   *
   * @param historyValue
   */


  StateNode.prototype.resolveHistory = function (historyValue) {
    var _this = this;

    if (this.type !== 'history') {
      return [this];
    }

    var parent = this.parent;

    if (!historyValue) {
      var historyTarget = this.target;
      return historyTarget ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStatePaths)(historyTarget).map(function (relativeChildPath) {
        return parent.getFromRelativePath(relativeChildPath);
      })) : parent.initialStateNodes;
    }

    var subHistoryValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.nestedPath)(parent.path, 'states')(historyValue).current;

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(subHistoryValue)) {
      return [parent.getStateNode(subHistoryValue)];
    }

    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStatePaths)(subHistoryValue).map(function (subStatePath) {
      return _this.history === 'deep' ? parent.getFromRelativePath(subStatePath) : [parent.states[subStatePath[0]]];
    }));
  };

  Object.defineProperty(StateNode.prototype, "stateIds", {
    /**
     * All the state node IDs of this state node and its descendant state nodes.
     */
    get: function () {
      var _this = this;

      var childStateIds = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(Object.keys(this.states).map(function (stateKey) {
        return _this.states[stateKey].stateIds;
      }));
      return [this.id].concat(childStateIds);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "events", {
    /**
     * All the event types accepted by this state node and its descendants.
     */
    get: function () {
      var e_8, _a, e_9, _b;

      if (this.__cache.events) {
        return this.__cache.events;
      }

      var states = this.states;
      var events = new Set(this.ownEvents);

      if (states) {
        try {
          for (var _c = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(Object.keys(states)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var stateId = _d.value;
            var state = states[stateId];

            if (state.states) {
              try {
                for (var _e = (e_9 = void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(state.events)), _f = _e.next(); !_f.done; _f = _e.next()) {
                  var event_1 = _f.value;
                  events.add("".concat(event_1));
                }
              } catch (e_9_1) {
                e_9 = {
                  error: e_9_1
                };
              } finally {
                try {
                  if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                } finally {
                  if (e_9) throw e_9.error;
                }
              }
            }
          }
        } catch (e_8_1) {
          e_8 = {
            error: e_8_1
          };
        } finally {
          try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
          } finally {
            if (e_8) throw e_8.error;
          }
        }
      }

      return this.__cache.events = Array.from(events);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "ownEvents", {
    /**
     * All the events that have transitions directly from this state node.
     *
     * Excludes any inert events.
     */
    get: function () {
      var events = new Set(this.transitions.filter(function (transition) {
        return !(!transition.target && !transition.actions.length && transition.internal);
      }).map(function (transition) {
        return transition.eventType;
      }));
      return Array.from(events);
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.resolveTarget = function (_target) {
    var _this = this;

    if (_target === undefined) {
      // an undefined target signals that the state node should not transition from that state when receiving that event
      return undefined;
    }

    return _target.map(function (target) {
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(target)) {
        return target;
      }

      var isInternalTarget = target[0] === _this.delimiter; // If internal target is defined on machine,
      // do not include machine key on target

      if (isInternalTarget && !_this.parent) {
        return _this.getStateNodeByPath(target.slice(1));
      }

      var resolvedTarget = isInternalTarget ? _this.key + target : target;

      if (_this.parent) {
        try {
          var targetStateNode = _this.parent.getStateNodeByPath(resolvedTarget);

          return targetStateNode;
        } catch (err) {
          throw new Error("Invalid transition definition for state node '".concat(_this.id, "':\n").concat(err.message));
        }
      } else {
        return _this.getStateNodeByPath(resolvedTarget);
      }
    });
  };

  StateNode.prototype.formatTransition = function (transitionConfig) {
    var _this = this;

    var normalizedTarget = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.normalizeTarget)(transitionConfig.target);
    var internal = 'internal' in transitionConfig ? transitionConfig.internal : normalizedTarget ? normalizedTarget.some(function (_target) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(_target) && _target[0] === _this.delimiter;
    }) : true;
    var guards = this.machine.options.guards;
    var target = this.resolveTarget(normalizedTarget);

    var transition = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, transitionConfig), {
      actions: (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObjects)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(transitionConfig.actions)),
      cond: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toGuard)(transitionConfig.cond, guards),
      target: target,
      source: this,
      internal: internal,
      eventType: transitionConfig.event,
      toJSON: function () {
        return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, transition), {
          target: transition.target ? transition.target.map(function (t) {
            return "#".concat(t.id);
          }) : undefined,
          source: "#".concat(_this.id)
        });
      }
    });

    return transition;
  };

  StateNode.prototype.formatTransitions = function () {
    var e_10, _a;

    var _this = this;

    var onConfig;

    if (!this.config.on) {
      onConfig = [];
    } else if (Array.isArray(this.config.on)) {
      onConfig = this.config.on;
    } else {
      var _b = this.config.on,
          _c = WILDCARD,
          _d = _b[_c],
          wildcardConfigs = _d === void 0 ? [] : _d,
          strictTransitionConfigs_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__rest)(_b, [typeof _c === "symbol" ? _c : _c + ""]);

      onConfig = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(Object.keys(strictTransitionConfigs_1).map(function (key) {
        if (!_environment_js__WEBPACK_IMPORTED_MODULE_3__.IS_PRODUCTION && key === NULL_EVENT) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "Empty string transition configs (e.g., `{ on: { '': ... }}`) for transient transitions are deprecated. Specify the transition in the `{ always: ... }` property instead. " + "Please check the `on` configuration for \"#".concat(_this.id, "\"."));
        }

        var transitionConfigArray = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toTransitionConfigArray)(key, strictTransitionConfigs_1[key]);

        if (!_environment_js__WEBPACK_IMPORTED_MODULE_3__.IS_PRODUCTION) {
          validateArrayifiedTransitions(_this, key, transitionConfigArray);
        }

        return transitionConfigArray;
      }).concat((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toTransitionConfigArray)(WILDCARD, wildcardConfigs)));
    }

    var eventlessConfig = this.config.always ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toTransitionConfigArray)('', this.config.always) : [];
    var doneConfig = this.config.onDone ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toTransitionConfigArray)(String((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.done)(this.id)), this.config.onDone) : [];

    if (!_environment_js__WEBPACK_IMPORTED_MODULE_3__.IS_PRODUCTION) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(!(this.config.onDone && !this.parent), "Root nodes cannot have an \".onDone\" transition. Please check the config of \"".concat(this.id, "\"."));
    }

    var invokeConfig = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(this.invoke.map(function (invokeDef) {
      var settleTransitions = [];

      if (invokeDef.onDone) {
        settleTransitions.push.apply(settleTransitions, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toTransitionConfigArray)(String((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.doneInvoke)(invokeDef.id)), invokeDef.onDone)), false));
      }

      if (invokeDef.onError) {
        settleTransitions.push.apply(settleTransitions, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toTransitionConfigArray)(String((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.error)(invokeDef.id)), invokeDef.onError)), false));
      }

      return settleTransitions;
    }));
    var delayedTransitions = this.after;
    var formattedTransitions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(doneConfig), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(invokeConfig), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(onConfig), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(eventlessConfig), false).map(function (transitionConfig) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(transitionConfig).map(function (transition) {
        return _this.formatTransition(transition);
      });
    }));

    try {
      for (var delayedTransitions_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(delayedTransitions), delayedTransitions_1_1 = delayedTransitions_1.next(); !delayedTransitions_1_1.done; delayedTransitions_1_1 = delayedTransitions_1.next()) {
        var delayedTransition = delayedTransitions_1_1.value;
        formattedTransitions.push(delayedTransition);
      }
    } catch (e_10_1) {
      e_10 = {
        error: e_10_1
      };
    } finally {
      try {
        if (delayedTransitions_1_1 && !delayedTransitions_1_1.done && (_a = delayedTransitions_1.return)) _a.call(delayedTransitions_1);
      } finally {
        if (e_10) throw e_10.error;
      }
    }

    return formattedTransitions;
  };

  return StateNode;
}();




/***/ }),

/***/ "./node_modules/xstate/es/_virtual/_tslib.js":
/*!***************************************************!*\
  !*** ./node_modules/xstate/es/_virtual/_tslib.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __values: () => (/* binding */ __values)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}




/***/ }),

/***/ "./node_modules/xstate/es/actionTypes.js":
/*!***********************************************!*\
  !*** ./node_modules/xstate/es/actionTypes.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   after: () => (/* binding */ after),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   cancel: () => (/* binding */ cancel),
/* harmony export */   choose: () => (/* binding */ choose),
/* harmony export */   doneState: () => (/* binding */ doneState),
/* harmony export */   error: () => (/* binding */ error),
/* harmony export */   errorExecution: () => (/* binding */ errorExecution),
/* harmony export */   errorPlatform: () => (/* binding */ errorPlatform),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   invoke: () => (/* binding */ invoke),
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   nullEvent: () => (/* binding */ nullEvent),
/* harmony export */   pure: () => (/* binding */ pure),
/* harmony export */   raise: () => (/* binding */ raise),
/* harmony export */   send: () => (/* binding */ send),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   stop: () => (/* binding */ stop),
/* harmony export */   update: () => (/* binding */ update)
/* harmony export */ });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "./node_modules/xstate/es/types.js");


var start = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Start;
var stop = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Stop;
var raise = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Raise;
var send = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Send;
var cancel = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Cancel;
var nullEvent = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.NullEvent;
var assign = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Assign;
var after = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.After;
var doneState = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.DoneState;
var log = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Log;
var init = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Init;
var invoke = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Invoke;
var errorExecution = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.ErrorExecution;
var errorPlatform = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.ErrorPlatform;
var error = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.ErrorCustom;
var update = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Update;
var choose = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Choose;
var pure = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Pure;




/***/ }),

/***/ "./node_modules/xstate/es/actions.js":
/*!*******************************************!*\
  !*** ./node_modules/xstate/es/actions.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionTypes: () => (/* reexport module object */ _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   after: () => (/* binding */ after),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   cancel: () => (/* binding */ cancel),
/* harmony export */   choose: () => (/* binding */ choose),
/* harmony export */   done: () => (/* binding */ done),
/* harmony export */   doneInvoke: () => (/* binding */ doneInvoke),
/* harmony export */   error: () => (/* binding */ error),
/* harmony export */   escalate: () => (/* binding */ escalate),
/* harmony export */   forwardTo: () => (/* binding */ forwardTo),
/* harmony export */   getActionFunction: () => (/* binding */ getActionFunction),
/* harmony export */   initEvent: () => (/* binding */ initEvent),
/* harmony export */   isActionObject: () => (/* binding */ isActionObject),
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   pure: () => (/* binding */ pure),
/* harmony export */   raise: () => (/* binding */ raise),
/* harmony export */   resolveActions: () => (/* binding */ resolveActions),
/* harmony export */   resolveLog: () => (/* binding */ resolveLog),
/* harmony export */   resolveRaise: () => (/* binding */ resolveRaise),
/* harmony export */   resolveSend: () => (/* binding */ resolveSend),
/* harmony export */   resolveStop: () => (/* binding */ resolveStop),
/* harmony export */   respond: () => (/* binding */ respond),
/* harmony export */   send: () => (/* binding */ send),
/* harmony export */   sendParent: () => (/* binding */ sendParent),
/* harmony export */   sendTo: () => (/* binding */ sendTo),
/* harmony export */   sendUpdate: () => (/* binding */ sendUpdate),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   stop: () => (/* binding */ stop),
/* harmony export */   toActionObject: () => (/* binding */ toActionObject),
/* harmony export */   toActionObjects: () => (/* binding */ toActionObjects),
/* harmony export */   toActivityDefinition: () => (/* binding */ toActivityDefinition)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types.js */ "./node_modules/xstate/es/types.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actionTypes.js */ "./node_modules/xstate/es/actionTypes.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");








var initEvent = /*#__PURE__*/(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toSCXMLEvent)({
  type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.init
});
function getActionFunction(actionType, actionFunctionMap) {
  return actionFunctionMap ? actionFunctionMap[actionType] || undefined : undefined;
}
function toActionObject(action, actionFunctionMap) {
  var actionObject;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(action) || typeof action === 'number') {
    var exec = getActionFunction(action, actionFunctionMap);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(exec)) {
      actionObject = {
        type: action,
        exec: exec
      };
    } else if (exec) {
      actionObject = exec;
    } else {
      actionObject = {
        type: action,
        exec: undefined
      };
    }
  } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action)) {
    actionObject = {
      // Convert action to string if unnamed
      type: action.name || action.toString(),
      exec: action
    };
  } else {
    var exec = getActionFunction(action.type, actionFunctionMap);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(exec)) {
      actionObject = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, action), {
        exec: exec
      });
    } else if (exec) {
      var actionType = exec.type || action.type;
      actionObject = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, exec), action), {
        type: actionType
      });
    } else {
      actionObject = action;
    }
  }

  return actionObject;
}
var toActionObjects = function (action, actionFunctionMap) {
  if (!action) {
    return [];
  }

  var actions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(action) ? action : [action];
  return actions.map(function (subAction) {
    return toActionObject(subAction, actionFunctionMap);
  });
};
function toActivityDefinition(action) {
  var actionObject = toActionObject(action);
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({
    id: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(action) ? action : actionObject.id
  }, actionObject), {
    type: actionObject.type
  });
}
/**
 * Raises an event. This places the event in the internal event queue, so that
 * the event is immediately consumed by the machine in the current step.
 *
 * @param eventType The event to raise.
 */

function raise(event, options) {
  return {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.raise,
    event: typeof event === 'function' ? event : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toEventObject)(event),
    delay: options ? options.delay : undefined,
    id: options === null || options === void 0 ? void 0 : options.id
  };
}
function resolveRaise(action, ctx, _event, delaysMap) {
  var meta = {
    _event: _event
  };
  var resolvedEvent = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toSCXMLEvent)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action.event) ? action.event(ctx, _event.data, meta) : action.event);
  var resolvedDelay;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(action.delay)) {
    var configDelay = delaysMap && delaysMap[action.delay];
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
  } else {
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
  }

  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, action), {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.raise,
    _event: resolvedEvent,
    delay: resolvedDelay
  });
}
/**
 * Sends an event. This returns an action that will be read by an interpreter to
 * send the event in the next step, after the current step is finished executing.
 *
 * @deprecated Use the `sendTo(...)` action creator instead.
 *
 * @param event The event to send.
 * @param options Options to pass into the send event:
 *  - `id` - The unique send event identifier (used with `cancel()`).
 *  - `delay` - The number of milliseconds to delay the sending of the event.
 *  - `to` - The target of this event (by default, the machine the event was sent from).
 */

function send(event, options) {
  return {
    to: options ? options.to : undefined,
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.send,
    event: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(event) ? event : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toEventObject)(event),
    delay: options ? options.delay : undefined,
    // TODO: don't auto-generate IDs here like that
    // there is too big chance of the ID collision
    id: options && options.id !== undefined ? options.id : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(event) ? event.name : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getEventType)(event)
  };
}
function resolveSend(action, ctx, _event, delaysMap) {
  var meta = {
    _event: _event
  }; // TODO: helper function for resolving Expr

  var resolvedEvent = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toSCXMLEvent)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action.event) ? action.event(ctx, _event.data, meta) : action.event);
  var resolvedDelay;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(action.delay)) {
    var configDelay = delaysMap && delaysMap[action.delay];
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
  } else {
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
  }

  var resolvedTarget = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action.to) ? action.to(ctx, _event.data, meta) : action.to;
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, action), {
    to: resolvedTarget,
    _event: resolvedEvent,
    event: resolvedEvent.data,
    delay: resolvedDelay
  });
}
/**
 * Sends an event to this machine's parent.
 *
 * @param event The event to send to the parent machine.
 * @param options Options to pass into the send event.
 */

function sendParent(event, options) {
  return send(event, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, options), {
    to: _types_js__WEBPACK_IMPORTED_MODULE_3__.SpecialTargets.Parent
  }));
}
/**
 * Sends an event to an actor.
 *
 * @param actor The `ActorRef` to send the event to.
 * @param event The event to send, or an expression that evaluates to the event to send
 * @param options Send action options
 * @returns An XState send action object
 */

function sendTo(actor, event, options) {
  return send(event, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, options), {
    to: actor
  }));
}
/**
 * Sends an update event to this machine's parent.
 */

function sendUpdate() {
  return sendParent(_actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.update);
}
/**
 * Sends an event back to the sender of the original event.
 *
 * @param event The event to send back to the sender
 * @param options Options to pass into the send event
 */

function respond(event, options) {
  return send(event, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, options), {
    to: function (_, __, _a) {
      var _event = _a._event;
      return _event.origin; // TODO: handle when _event.origin is undefined
    }
  }));
}

var defaultLogExpr = function (context, event) {
  return {
    context: context,
    event: event
  };
};
/**
 *
 * @param expr The expression function to evaluate which will be logged.
 *  Takes in 2 arguments:
 *  - `ctx` - the current state context
 *  - `event` - the event that caused this action to be executed.
 * @param label The label to give to the logged expression.
 */


function log(expr, label) {
  if (expr === void 0) {
    expr = defaultLogExpr;
  }

  return {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.log,
    label: label,
    expr: expr
  };
}
var resolveLog = function (action, ctx, _event) {
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, action), {
    value: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(action.expr) ? action.expr : action.expr(ctx, _event.data, {
      _event: _event
    })
  });
};
/**
 * Cancels an in-flight `send(...)` action. A canceled sent action will not
 * be executed, nor will its event be sent, unless it has already been sent
 * (e.g., if `cancel(...)` is called after the `send(...)` action's `delay`).
 *
 * @param sendId The `id` of the `send(...)` action to cancel.
 */

var cancel = function (sendId) {
  return {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.cancel,
    sendId: sendId
  };
};
/**
 * Starts an activity.
 *
 * @param activity The activity to start.
 */

function start(activity) {
  var activityDef = toActivityDefinition(activity);
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.Start,
    activity: activityDef,
    exec: undefined
  };
}
/**
 * Stops an activity.
 *
 * @param actorRef The activity to stop.
 */

function stop(actorRef) {
  var activity = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(actorRef) ? actorRef : toActivityDefinition(actorRef);
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.Stop,
    activity: activity,
    exec: undefined
  };
}
function resolveStop(action, context, _event) {
  var actorRefOrString = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action.activity) ? action.activity(context, _event.data) : action.activity;
  var resolvedActorRef = typeof actorRefOrString === 'string' ? {
    id: actorRefOrString
  } : actorRefOrString;
  var actionObject = {
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.Stop,
    activity: resolvedActorRef
  };
  return actionObject;
}
/**
 * Updates the current context of the machine.
 *
 * @param assignment An object that represents the partial context to update.
 */

var assign = function (assignment) {
  return {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.assign,
    assignment: assignment
  };
};
function isActionObject(action) {
  return typeof action === 'object' && 'type' in action;
}
/**
 * Returns an event type that represents an implicit event that
 * is sent after the specified `delay`.
 *
 * @param delayRef The delay in milliseconds
 * @param id The state node ID where this event is handled
 */

function after(delayRef, id) {
  var idSuffix = id ? "#".concat(id) : '';
  return "".concat(_types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.After, "(").concat(delayRef, ")").concat(idSuffix);
}
/**
 * Returns an event that represents that a final state node
 * has been reached in the parent state node.
 *
 * @param id The final state node's parent state node `id`
 * @param data The data to pass into the event
 */

function done(id, data) {
  var type = "".concat(_types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.DoneState, ".").concat(id);
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}
/**
 * Returns an event that represents that an invoked service has terminated.
 *
 * An invoked service is terminated when it has reached a top-level final state node,
 * but not when it is canceled.
 *
 * @param id The final state node ID
 * @param data The data to pass into the event
 */

function doneInvoke(id, data) {
  var type = "".concat(_types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.DoneInvoke, ".").concat(id);
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}
function error(id, data) {
  var type = "".concat(_types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.ErrorPlatform, ".").concat(id);
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}
function pure(getActions) {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.Pure,
    get: getActions
  };
}
/**
 * Forwards (sends) an event to a specified service.
 *
 * @param target The target service to forward the event to.
 * @param options Options to pass into the send action creator.
 */

function forwardTo(target, options) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_4__.IS_PRODUCTION && (!target || typeof target === 'function')) {
    var originalTarget_1 = target;

    target = function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      var resolvedTarget = typeof originalTarget_1 === 'function' ? originalTarget_1.apply(void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(args), false)) : originalTarget_1;

      if (!resolvedTarget) {
        throw new Error("Attempted to forward event to undefined actor. This risks an infinite loop in the sender.");
      }

      return resolvedTarget;
    };
  }

  return send(function (_, event) {
    return event;
  }, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, options), {
    to: target
  }));
}
/**
 * Escalates an error by sending it as an event to this machine's parent.
 *
 * @param errorData The error data to send, or the expression function that
 * takes in the `context`, `event`, and `meta`, and returns the error data to send.
 * @param options Options to pass into the send action creator.
 */

function escalate(errorData, options) {
  return sendParent(function (context, event, meta) {
    return {
      type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.error,
      data: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(errorData) ? errorData(context, event, meta) : errorData
    };
  }, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, options), {
    to: _types_js__WEBPACK_IMPORTED_MODULE_3__.SpecialTargets.Parent
  }));
}
function choose(conds) {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.Choose,
    conds: conds
  };
}

var pluckAssigns = function (actionBlocks) {
  var e_1, _a;

  var assignActions = [];

  try {
    for (var actionBlocks_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(actionBlocks), actionBlocks_1_1 = actionBlocks_1.next(); !actionBlocks_1_1.done; actionBlocks_1_1 = actionBlocks_1.next()) {
      var block = actionBlocks_1_1.value;
      var i = 0;

      while (i < block.actions.length) {
        if (block.actions[i].type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.assign) {
          assignActions.push(block.actions[i]);
          block.actions.splice(i, 1);
          continue;
        }

        i++;
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (actionBlocks_1_1 && !actionBlocks_1_1.done && (_a = actionBlocks_1.return)) _a.call(actionBlocks_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return assignActions;
};

function resolveActions(machine, currentState, currentContext, _event, actionBlocks, predictableExec, preserveActionOrder) {
  if (preserveActionOrder === void 0) {
    preserveActionOrder = false;
  }

  var assignActions = preserveActionOrder ? [] : pluckAssigns(actionBlocks);
  var updatedContext = assignActions.length ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.updateContext)(currentContext, _event, assignActions, currentState) : currentContext;
  var preservedContexts = preserveActionOrder ? [currentContext] : undefined;
  var deferredToBlockEnd = [];

  function handleAction(blockType, actionObject) {
    var _a;

    switch (actionObject.type) {
      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.raise:
        {
          var raisedAction = resolveRaise(actionObject, updatedContext, _event, machine.options.delays);

          if (predictableExec && typeof raisedAction.delay === 'number') {
            predictableExec(raisedAction, updatedContext, _event);
          }

          return raisedAction;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.send:
        var sendAction = resolveSend(actionObject, updatedContext, _event, machine.options.delays); // TODO: fix ActionTypes.Init

        if (!_environment_js__WEBPACK_IMPORTED_MODULE_4__.IS_PRODUCTION) {
          var configuredDelay = actionObject.delay; // warn after resolving as we can create better contextual message here

          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.warn)(!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(configuredDelay) || typeof sendAction.delay === 'number', // tslint:disable-next-line:max-line-length
          "No delay reference for delay expression '".concat(configuredDelay, "' was found on machine '").concat(machine.id, "'"));
        }

        if (predictableExec && sendAction.to !== _types_js__WEBPACK_IMPORTED_MODULE_3__.SpecialTargets.Internal) {
          if (blockType === 'entry') {
            deferredToBlockEnd.push(sendAction);
          } else {
            predictableExec(sendAction, updatedContext, _event);
          }
        }

        return sendAction;

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.log:
        {
          var resolved = resolveLog(actionObject, updatedContext, _event);
          predictableExec === null || predictableExec === void 0 ? void 0 : predictableExec(resolved, updatedContext, _event);
          return resolved;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.choose:
        {
          var chooseAction = actionObject;
          var matchedActions = (_a = chooseAction.conds.find(function (condition) {
            var guard = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toGuard)(condition.cond, machine.options.guards);
            return !guard || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.evaluateGuard)(machine, guard, updatedContext, _event, !predictableExec ? currentState : undefined);
          })) === null || _a === void 0 ? void 0 : _a.actions;

          if (!matchedActions) {
            return [];
          }

          var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(resolveActions(machine, currentState, updatedContext, _event, [{
            type: blockType,
            actions: toActionObjects((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toArray)(matchedActions), machine.options.actions)
          }], predictableExec, preserveActionOrder), 2),
              resolvedActionsFromChoose = _b[0],
              resolvedContextFromChoose = _b[1];

          updatedContext = resolvedContextFromChoose;
          preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
          return resolvedActionsFromChoose;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.pure:
        {
          var matchedActions = actionObject.get(updatedContext, _event.data);

          if (!matchedActions) {
            return [];
          }

          var _c = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(resolveActions(machine, currentState, updatedContext, _event, [{
            type: blockType,
            actions: toActionObjects((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toArray)(matchedActions), machine.options.actions)
          }], predictableExec, preserveActionOrder), 2),
              resolvedActionsFromPure = _c[0],
              resolvedContext = _c[1];

          updatedContext = resolvedContext;
          preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
          return resolvedActionsFromPure;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.stop:
        {
          var resolved = resolveStop(actionObject, updatedContext, _event);
          predictableExec === null || predictableExec === void 0 ? void 0 : predictableExec(resolved, currentContext, _event);
          return resolved;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.assign:
        {
          updatedContext = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.updateContext)(updatedContext, _event, [actionObject], !predictableExec ? currentState : undefined);
          preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
          break;
        }

      default:
        var resolvedActionObject = toActionObject(actionObject, machine.options.actions);
        var exec_1 = resolvedActionObject.exec;

        if (predictableExec) {
          predictableExec(resolvedActionObject, updatedContext, _event);
        } else if (exec_1 && preservedContexts) {
          var contextIndex_1 = preservedContexts.length - 1;

          var wrapped = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, resolvedActionObject), {
            exec: function (_ctx) {
              var args = [];

              for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
              }

              exec_1.apply(void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([preservedContexts[contextIndex_1]], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(args), false));
            }
          });

          resolvedActionObject = wrapped;
        }

        return resolvedActionObject;
    }
  }

  function processBlock(block) {
    var e_2, _a;

    var resolvedActions = [];

    try {
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(block.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
        var action = _c.value;
        var resolved = handleAction(block.type, action);

        if (resolved) {
          resolvedActions = resolvedActions.concat(resolved);
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    deferredToBlockEnd.forEach(function (action) {
      predictableExec(action, updatedContext, _event);
    });
    deferredToBlockEnd.length = 0;
    return resolvedActions;
  }

  var resolvedActions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(actionBlocks.map(processBlock));
  return [resolvedActions, updatedContext];
}




/***/ }),

/***/ "./node_modules/xstate/es/behaviors.js":
/*!*********************************************!*\
  !*** ./node_modules/xstate/es/behaviors.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromPromise: () => (/* binding */ fromPromise),
/* harmony export */   fromReducer: () => (/* binding */ fromReducer),
/* harmony export */   spawnBehavior: () => (/* binding */ spawnBehavior)
/* harmony export */ });
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions.js */ "./node_modules/xstate/es/actions.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Actor.js */ "./node_modules/xstate/es/Actor.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");




/**
 * Returns an actor behavior from a reducer and its initial state.
 *
 * @param transition The pure reducer that returns the next state given the current state and event.
 * @param initialState The initial state of the reducer.
 * @returns An actor behavior
 */

function fromReducer(transition, initialState) {
  return {
    transition: transition,
    initialState: initialState
  };
}
function fromPromise(promiseFn) {
  var initialState = {
    error: undefined,
    data: undefined,
    status: 'pending'
  };
  return {
    transition: function (state, event, _a) {
      var parent = _a.parent,
          id = _a.id,
          observers = _a.observers;

      switch (event.type) {
        case 'fulfill':
          parent === null || parent === void 0 ? void 0 : parent.send((0,_actions_js__WEBPACK_IMPORTED_MODULE_0__.doneInvoke)(id, event.data));
          return {
            error: undefined,
            data: event.data,
            status: 'fulfilled'
          };

        case 'reject':
          parent === null || parent === void 0 ? void 0 : parent.send((0,_actions_js__WEBPACK_IMPORTED_MODULE_0__.error)(id, event.error));
          observers.forEach(function (observer) {
            observer.error(event.error);
          });
          return {
            error: event.error,
            data: undefined,
            status: 'rejected'
          };

        default:
          return state;
      }
    },
    initialState: initialState,
    start: function (_a) {
      var self = _a.self;
      promiseFn().then(function (data) {
        self.send({
          type: 'fulfill',
          data: data
        });
      }, function (reason) {
        self.send({
          type: 'reject',
          error: reason
        });
      });
      return initialState;
    }
  };
}
function spawnBehavior(behavior, options) {
  if (options === void 0) {
    options = {};
  }

  var state = behavior.initialState;
  var observers = new Set();
  var mailbox = [];
  var flushing = false;

  var flush = function () {
    if (flushing) {
      return;
    }

    flushing = true;

    while (mailbox.length > 0) {
      var event_1 = mailbox.shift();
      state = behavior.transition(state, event_1, actorCtx);
      observers.forEach(function (observer) {
        return observer.next(state);
      });
    }

    flushing = false;
  };

  var actor = (0,_Actor_js__WEBPACK_IMPORTED_MODULE_1__.toActorRef)({
    id: options.id,
    send: function (event) {
      mailbox.push(event);
      flush();
    },
    getSnapshot: function () {
      return state;
    },
    subscribe: function (next, handleError, complete) {
      var observer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.toObserver)(next, handleError, complete);
      observers.add(observer);
      observer.next(state);
      return {
        unsubscribe: function () {
          observers.delete(observer);
        }
      };
    }
  });
  var actorCtx = {
    parent: options.parent,
    self: actor,
    id: options.id || 'anonymous',
    observers: observers
  };
  state = behavior.start ? behavior.start(actorCtx) : state;
  return actor;
}




/***/ }),

/***/ "./node_modules/xstate/es/constants.js":
/*!*********************************************!*\
  !*** ./node_modules/xstate/es/constants.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_GUARD_TYPE: () => (/* binding */ DEFAULT_GUARD_TYPE),
/* harmony export */   EMPTY_ACTIVITY_MAP: () => (/* binding */ EMPTY_ACTIVITY_MAP),
/* harmony export */   STATE_DELIMITER: () => (/* binding */ STATE_DELIMITER),
/* harmony export */   TARGETLESS_KEY: () => (/* binding */ TARGETLESS_KEY)
/* harmony export */ });
var STATE_DELIMITER = '.';
var EMPTY_ACTIVITY_MAP = {};
var DEFAULT_GUARD_TYPE = 'xstate.guard';
var TARGETLESS_KEY = '';




/***/ }),

/***/ "./node_modules/xstate/es/devTools.js":
/*!********************************************!*\
  !*** ./node_modules/xstate/es/devTools.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getGlobal: () => (/* binding */ getGlobal),
/* harmony export */   registerService: () => (/* binding */ registerService)
/* harmony export */ });
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");


function getGlobal() {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof __webpack_require__.g !== 'undefined') {
    return __webpack_require__.g;
  }

  if (!_environment_js__WEBPACK_IMPORTED_MODULE_0__.IS_PRODUCTION) {
    console.warn('XState could not find a global object in this environment. Please let the maintainers know and raise an issue here: https://github.com/statelyai/xstate/issues');
  }
}

function getDevTools() {
  var global = getGlobal();

  if (global && '__xstate__' in global) {
    return global.__xstate__;
  }

  return undefined;
}

function registerService(service) {
  if (!getGlobal()) {
    return;
  }

  var devTools = getDevTools();

  if (devTools) {
    devTools.register(service);
  }
}




/***/ }),

/***/ "./node_modules/xstate/es/environment.js":
/*!***********************************************!*\
  !*** ./node_modules/xstate/es/environment.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IS_PRODUCTION: () => (/* binding */ IS_PRODUCTION)
/* harmony export */ });
var IS_PRODUCTION = "development" === 'production';




/***/ }),

/***/ "./node_modules/xstate/es/index.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionTypes: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_10__.ActionTypes),
/* harmony export */   Interpreter: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.Interpreter),
/* harmony export */   InterpreterStatus: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.InterpreterStatus),
/* harmony export */   Machine: () => (/* reexport safe */ _Machine_js__WEBPACK_IMPORTED_MODULE_3__.Machine),
/* harmony export */   SpecialTargets: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_10__.SpecialTargets),
/* harmony export */   State: () => (/* reexport safe */ _State_js__WEBPACK_IMPORTED_MODULE_7__.State),
/* harmony export */   StateNode: () => (/* reexport safe */ _StateNode_js__WEBPACK_IMPORTED_MODULE_8__.StateNode),
/* harmony export */   actions: () => (/* reexport module object */ _actions_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   cancel: () => (/* binding */ cancel),
/* harmony export */   choose: () => (/* binding */ choose),
/* harmony export */   createMachine: () => (/* reexport safe */ _Machine_js__WEBPACK_IMPORTED_MODULE_3__.createMachine),
/* harmony export */   createSchema: () => (/* reexport safe */ _schema_js__WEBPACK_IMPORTED_MODULE_6__.createSchema),
/* harmony export */   doneInvoke: () => (/* binding */ doneInvoke),
/* harmony export */   forwardTo: () => (/* binding */ forwardTo),
/* harmony export */   interpret: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.interpret),
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   mapState: () => (/* reexport safe */ _mapState_js__WEBPACK_IMPORTED_MODULE_4__.mapState),
/* harmony export */   matchState: () => (/* reexport safe */ _match_js__WEBPACK_IMPORTED_MODULE_5__.matchState),
/* harmony export */   matchesState: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.matchesState),
/* harmony export */   pure: () => (/* binding */ pure),
/* harmony export */   raise: () => (/* binding */ raise),
/* harmony export */   send: () => (/* binding */ send),
/* harmony export */   sendParent: () => (/* binding */ sendParent),
/* harmony export */   sendTo: () => (/* binding */ sendTo),
/* harmony export */   sendUpdate: () => (/* binding */ sendUpdate),
/* harmony export */   spawn: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.spawn),
/* harmony export */   spawnBehavior: () => (/* reexport safe */ _behaviors_js__WEBPACK_IMPORTED_MODULE_9__.spawnBehavior),
/* harmony export */   stop: () => (/* binding */ stop),
/* harmony export */   t: () => (/* reexport safe */ _schema_js__WEBPACK_IMPORTED_MODULE_6__.t),
/* harmony export */   toActorRef: () => (/* reexport safe */ _Actor_js__WEBPACK_IMPORTED_MODULE_1__.toActorRef),
/* harmony export */   toEventObject: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.toEventObject),
/* harmony export */   toObserver: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.toObserver),
/* harmony export */   toSCXMLEvent: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.toSCXMLEvent)
/* harmony export */ });
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions.js */ "./node_modules/xstate/es/actions.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Actor.js */ "./node_modules/xstate/es/Actor.js");
/* harmony import */ var _interpreter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interpreter.js */ "./node_modules/xstate/es/interpreter.js");
/* harmony import */ var _Machine_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Machine.js */ "./node_modules/xstate/es/Machine.js");
/* harmony import */ var _mapState_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mapState.js */ "./node_modules/xstate/es/mapState.js");
/* harmony import */ var _match_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./match.js */ "./node_modules/xstate/es/match.js");
/* harmony import */ var _schema_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./schema.js */ "./node_modules/xstate/es/schema.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./State.js */ "./node_modules/xstate/es/State.js");
/* harmony import */ var _StateNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./StateNode.js */ "./node_modules/xstate/es/StateNode.js");
/* harmony import */ var _behaviors_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./behaviors.js */ "./node_modules/xstate/es/behaviors.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./types.js */ "./node_modules/xstate/es/types.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");















var assign = _actions_js__WEBPACK_IMPORTED_MODULE_0__.assign,
    cancel = _actions_js__WEBPACK_IMPORTED_MODULE_0__.cancel,
    send = _actions_js__WEBPACK_IMPORTED_MODULE_0__.send,
    sendTo = _actions_js__WEBPACK_IMPORTED_MODULE_0__.sendTo,
    sendParent = _actions_js__WEBPACK_IMPORTED_MODULE_0__.sendParent,
    sendUpdate = _actions_js__WEBPACK_IMPORTED_MODULE_0__.sendUpdate,
    forwardTo = _actions_js__WEBPACK_IMPORTED_MODULE_0__.forwardTo,
    doneInvoke = _actions_js__WEBPACK_IMPORTED_MODULE_0__.doneInvoke,
    raise = _actions_js__WEBPACK_IMPORTED_MODULE_0__.raise,
    log = _actions_js__WEBPACK_IMPORTED_MODULE_0__.log,
    pure = _actions_js__WEBPACK_IMPORTED_MODULE_0__.pure,
    choose = _actions_js__WEBPACK_IMPORTED_MODULE_0__.choose,
    stop = _actions_js__WEBPACK_IMPORTED_MODULE_0__.stop;




/***/ }),

/***/ "./node_modules/xstate/es/interpreter.js":
/*!***********************************************!*\
  !*** ./node_modules/xstate/es/interpreter.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Interpreter: () => (/* binding */ Interpreter),
/* harmony export */   InterpreterStatus: () => (/* binding */ InterpreterStatus),
/* harmony export */   interpret: () => (/* binding */ interpret),
/* harmony export */   spawn: () => (/* binding */ spawn)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types.js */ "./node_modules/xstate/es/types.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./State.js */ "./node_modules/xstate/es/State.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./actionTypes.js */ "./node_modules/xstate/es/actionTypes.js");
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./actions.js */ "./node_modules/xstate/es/actions.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");
/* harmony import */ var _scheduler_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./scheduler.js */ "./node_modules/xstate/es/scheduler.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Actor.js */ "./node_modules/xstate/es/Actor.js");
/* harmony import */ var _registry_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./registry.js */ "./node_modules/xstate/es/registry.js");
/* harmony import */ var _devTools_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./devTools.js */ "./node_modules/xstate/es/devTools.js");
/* harmony import */ var _serviceScope_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./serviceScope.js */ "./node_modules/xstate/es/serviceScope.js");
/* harmony import */ var _behaviors_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./behaviors.js */ "./node_modules/xstate/es/behaviors.js");














var DEFAULT_SPAWN_OPTIONS = {
  sync: false,
  autoForward: false
};
var InterpreterStatus;

(function (InterpreterStatus) {
  InterpreterStatus[InterpreterStatus["NotStarted"] = 0] = "NotStarted";
  InterpreterStatus[InterpreterStatus["Running"] = 1] = "Running";
  InterpreterStatus[InterpreterStatus["Stopped"] = 2] = "Stopped";
})(InterpreterStatus || (InterpreterStatus = {}));

var Interpreter =
/*#__PURE__*/

/** @class */
function () {
  /**
   * Creates a new Interpreter instance (i.e., service) for the given machine with the provided options, if any.
   *
   * @param machine The machine to be interpreted
   * @param options Interpreter options
   */
  function Interpreter(machine, options) {
    if (options === void 0) {
      options = Interpreter.defaultOptions;
    }

    var _this = this;

    this.machine = machine;
    this.delayedEventsMap = {};
    this.listeners = new Set();
    this.contextListeners = new Set();
    this.stopListeners = new Set();
    this.doneListeners = new Set();
    this.eventListeners = new Set();
    this.sendListeners = new Set();
    /**
     * Whether the service is started.
     */

    this.initialized = false;
    this.status = InterpreterStatus.NotStarted;
    this.children = new Map();
    this.forwardTo = new Set();
    this._outgoingQueue = [];
    /**
     * Alias for Interpreter.prototype.start
     */

    this.init = this.start;
    /**
     * Sends an event to the running interpreter to trigger a transition.
     *
     * An array of events (batched) can be sent as well, which will send all
     * batched events to the running interpreter. The listeners will be
     * notified only **once** when all events are processed.
     *
     * @param event The event(s) to send
     */

    this.send = function (event, payload) {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isArray)(event)) {
        _this.batch(event);

        return _this.state;
      }

      var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toEventObject)(event, payload));

      if (_this.status === InterpreterStatus.Stopped) {
        // do nothing
        if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "Event \"".concat(_event.name, "\" was sent to stopped service \"").concat(_this.machine.id, "\". This service has already reached its final state, and will not transition.\nEvent: ").concat(JSON.stringify(_event.data)));
        }

        return _this.state;
      }

      if (_this.status !== InterpreterStatus.Running && !_this.options.deferEvents) {
        throw new Error("Event \"".concat(_event.name, "\" was sent to uninitialized service \"").concat(_this.machine.id // tslint:disable-next-line:max-line-length
        , "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options.\nEvent: ").concat(JSON.stringify(_event.data)));
      }

      _this.scheduler.schedule(function () {
        // Forward copy of event to child actors
        _this.forward(_event);

        var nextState = _this._nextState(_event);

        _this.update(nextState, _event);
      });

      return _this._state; // TODO: deprecate (should return void)
      // tslint:disable-next-line:semicolon
    };

    this.sendTo = function (event, to, immediate) {
      var isParent = _this.parent && (to === _types_js__WEBPACK_IMPORTED_MODULE_2__.SpecialTargets.Parent || _this.parent.id === to);
      var target = isParent ? _this.parent : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(to) ? to === _types_js__WEBPACK_IMPORTED_MODULE_2__.SpecialTargets.Internal ? _this : _this.children.get(to) || _registry_js__WEBPACK_IMPORTED_MODULE_3__.registry.get(to) : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isActor)(to) ? to : undefined;

      if (!target) {
        if (!isParent) {
          throw new Error("Unable to send event to child '".concat(to, "' from service '").concat(_this.id, "'."));
        } // tslint:disable-next-line:no-console


        if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "Service '".concat(_this.id, "' has no parent: unable to send event ").concat(event.type));
        }

        return;
      }

      if ('machine' in target) {
        // perhaps those events should be rejected in the parent
        // but atm it doesn't have easy access to all of the information that is required to do it reliably
        if (_this.status !== InterpreterStatus.Stopped || _this.parent !== target || // we need to send events to the parent from exit handlers of a machine that reached its final state
        _this.state.done) {
          // Send SCXML events to machines
          var scxmlEvent = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, event), {
            name: event.name === _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.error ? "".concat((0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.error)(_this.id)) : event.name,
            origin: _this.sessionId
          });

          if (!immediate && _this.machine.config.predictableActionArguments) {
            _this._outgoingQueue.push([target, scxmlEvent]);
          } else {
            target.send(scxmlEvent);
          }
        }
      } else {
        // Send normal events to other targets
        if (!immediate && _this.machine.config.predictableActionArguments) {
          _this._outgoingQueue.push([target, event.data]);
        } else {
          target.send(event.data);
        }
      }
    };

    this._exec = function (action, context, _event, actionFunctionMap) {
      if (actionFunctionMap === void 0) {
        actionFunctionMap = _this.machine.options.actions;
      }

      var actionOrExec = action.exec || (0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.getActionFunction)(action.type, actionFunctionMap);
      var exec = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(actionOrExec) ? actionOrExec : actionOrExec ? actionOrExec.exec : action.exec;

      if (exec) {
        try {
          return exec(context, _event.data, !_this.machine.config.predictableActionArguments ? {
            action: action,
            state: _this.state,
            _event: _event
          } : {
            action: action,
            _event: _event
          });
        } catch (err) {
          if (_this.parent) {
            _this.parent.send({
              type: 'xstate.error',
              data: err
            });
          }

          throw err;
        }
      }

      switch (action.type) {
        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.raise:
          {
            // if raise action reached the interpreter then it's a delayed one
            var sendAction_1 = action;

            _this.defer(sendAction_1);

            break;
          }

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.send:
          var sendAction = action;

          if (typeof sendAction.delay === 'number') {
            _this.defer(sendAction);

            return;
          } else {
            if (sendAction.to) {
              _this.sendTo(sendAction._event, sendAction.to, _event === _actions_js__WEBPACK_IMPORTED_MODULE_6__.initEvent);
            } else {
              _this.send(sendAction._event);
            }
          }

          break;

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.cancel:
          _this.cancel(action.sendId);

          break;

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.start:
          {
            if (_this.status !== InterpreterStatus.Running) {
              return;
            }

            var activity = action.activity; // If the activity will be stopped right after it's started
            // (such as in transient states)
            // don't bother starting the activity.

            if ( // in v4 with `predictableActionArguments` invokes are called eagerly when the `this.state` still points to the previous state
            !_this.machine.config.predictableActionArguments && !_this.state.activities[activity.id || activity.type]) {
              break;
            } // Invoked services


            if (activity.type === _types_js__WEBPACK_IMPORTED_MODULE_2__.ActionTypes.Invoke) {
              var invokeSource = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toInvokeSource)(activity.src);
              var serviceCreator = _this.machine.options.services ? _this.machine.options.services[invokeSource.type] : undefined;
              var id = activity.id,
                  data = activity.data;

              if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(!('forward' in activity), // tslint:disable-next-line:max-line-length
                "`forward` property is deprecated (found in invocation of '".concat(activity.src, "' in in machine '").concat(_this.machine.id, "'). ") + "Please use `autoForward` instead.");
              }

              var autoForward = 'autoForward' in activity ? activity.autoForward : !!activity.forward;

              if (!serviceCreator) {
                // tslint:disable-next-line:no-console
                if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
                  (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "No service found for invocation '".concat(activity.src, "' in machine '").concat(_this.machine.id, "'."));
                }

                return;
              }

              var resolvedData = data ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapContext)(data, context, _event) : undefined;

              if (typeof serviceCreator === 'string') {
                // TODO: warn
                return;
              }

              var source = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(serviceCreator) ? serviceCreator(context, _event.data, {
                data: resolvedData,
                src: invokeSource,
                meta: activity.meta
              }) : serviceCreator;

              if (!source) {
                // TODO: warn?
                return;
              }

              var options = void 0;

              if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(source)) {
                source = resolvedData ? source.withContext(resolvedData) : source;
                options = {
                  autoForward: autoForward
                };
              }

              _this.spawn(source, id, options);
            } else {
              _this.spawnActivity(activity);
            }

            break;
          }

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.stop:
          {
            _this.stopChild(action.activity.id);

            break;
          }

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.log:
          var _a = action,
              label = _a.label,
              value = _a.value;

          if (label) {
            _this.logger(label, value);
          } else {
            _this.logger(value);
          }

          break;

        default:
          if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "No implementation found for action type '".concat(action.type, "'"));
          }

          break;
      }
    };

    var resolvedOptions = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, Interpreter.defaultOptions), options);

    var clock = resolvedOptions.clock,
        logger = resolvedOptions.logger,
        parent = resolvedOptions.parent,
        id = resolvedOptions.id;
    var resolvedId = id !== undefined ? id : machine.id;
    this.id = resolvedId;
    this.logger = logger;
    this.clock = clock;
    this.parent = parent;
    this.options = resolvedOptions;
    this.scheduler = new _scheduler_js__WEBPACK_IMPORTED_MODULE_7__.Scheduler({
      deferEvents: this.options.deferEvents
    });
    this.sessionId = _registry_js__WEBPACK_IMPORTED_MODULE_3__.registry.bookId();
  }

  Object.defineProperty(Interpreter.prototype, "initialState", {
    get: function () {
      var _this = this;

      if (this._initialState) {
        return this._initialState;
      }

      return (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_8__.provide)(this, function () {
        _this._initialState = _this.machine.initialState;
        return _this._initialState;
      });
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Interpreter.prototype, "state", {
    /**
     * @deprecated Use `.getSnapshot()` instead.
     */
    get: function () {
      if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(this.status !== InterpreterStatus.NotStarted, "Attempted to read state from uninitialized service '".concat(this.id, "'. Make sure the service is started first."));
      }

      return this._state;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Executes the actions of the given state, with that state's `context` and `event`.
   *
   * @param state The state whose actions will be executed
   * @param actionsConfig The action implementations to use
   */

  Interpreter.prototype.execute = function (state, actionsConfig) {
    var e_1, _a;

    try {
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(state.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
        var action = _c.value;
        this.exec(action, state, actionsConfig);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };

  Interpreter.prototype.update = function (state, _event) {
    var e_2, _a, e_3, _b, e_4, _c, e_5, _d;

    var _this = this; // Attach session ID to state


    state._sessionid = this.sessionId; // Update state

    this._state = state; // Execute actions

    if ((!this.machine.config.predictableActionArguments || // this is currently required to execute initial actions as the `initialState` gets cached
    // we can't just recompute it (and execute actions while doing so) because we try to preserve identity of actors created within initial assigns
    _event === _actions_js__WEBPACK_IMPORTED_MODULE_6__.initEvent) && this.options.execute) {
      this.execute(this.state);
    } else {
      var item = void 0;

      while (item = this._outgoingQueue.shift()) {
        item[0].send(item[1]);
      }
    } // Update children


    this.children.forEach(function (child) {
      _this.state.children[child.id] = child;
    }); // Dev tools

    if (this.devTools) {
      this.devTools.send(_event.data, state);
    } // Execute listeners


    if (state.event) {
      try {
        for (var _e = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.eventListeners), _f = _e.next(); !_f.done; _f = _e.next()) {
          var listener = _f.value;
          listener(state.event);
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
        } finally {
          if (e_2) throw e_2.error;
        }
      }
    }

    try {
      for (var _g = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.listeners), _h = _g.next(); !_h.done; _h = _g.next()) {
        var listener = _h.value;
        listener(state, state.event);
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    try {
      for (var _j = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.contextListeners), _k = _j.next(); !_k.done; _k = _j.next()) {
        var contextListener = _k.value;
        contextListener(this.state.context, this.state.history ? this.state.history.context : undefined);
      }
    } catch (e_4_1) {
      e_4 = {
        error: e_4_1
      };
    } finally {
      try {
        if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
      } finally {
        if (e_4) throw e_4.error;
      }
    }

    if (this.state.done) {
      // get final child state node
      var finalChildStateNode = state.configuration.find(function (sn) {
        return sn.type === 'final' && sn.parent === _this.machine;
      });
      var doneData = finalChildStateNode && finalChildStateNode.doneData ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapContext)(finalChildStateNode.doneData, state.context, _event) : undefined;
      this._doneEvent = (0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.doneInvoke)(this.id, doneData);

      try {
        for (var _l = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.doneListeners), _m = _l.next(); !_m.done; _m = _l.next()) {
          var listener = _m.value;
          listener(this._doneEvent);
        }
      } catch (e_5_1) {
        e_5 = {
          error: e_5_1
        };
      } finally {
        try {
          if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
        } finally {
          if (e_5) throw e_5.error;
        }
      }

      this._stop();

      this._stopChildren();

      _registry_js__WEBPACK_IMPORTED_MODULE_3__.registry.free(this.sessionId);
    }
  };
  /*
   * Adds a listener that is notified whenever a state transition happens. The listener is called with
   * the next state and the event object that caused the state transition.
   *
   * @param listener The state listener
   */


  Interpreter.prototype.onTransition = function (listener) {
    this.listeners.add(listener); // Send current state to listener

    if (this.status === InterpreterStatus.Running) {
      listener(this.state, this.state.event);
    }

    return this;
  };

  Interpreter.prototype.subscribe = function (nextListenerOrObserver, _, // TODO: error listener
  completeListener) {
    var _this = this;

    var observer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toObserver)(nextListenerOrObserver, _, completeListener);
    this.listeners.add(observer.next); // Send current state to listener

    if (this.status !== InterpreterStatus.NotStarted) {
      observer.next(this.state);
    }

    var completeOnce = function () {
      _this.doneListeners.delete(completeOnce);

      _this.stopListeners.delete(completeOnce);

      observer.complete();
    };

    if (this.status === InterpreterStatus.Stopped) {
      observer.complete();
    } else {
      this.onDone(completeOnce);
      this.onStop(completeOnce);
    }

    return {
      unsubscribe: function () {
        _this.listeners.delete(observer.next);

        _this.doneListeners.delete(completeOnce);

        _this.stopListeners.delete(completeOnce);
      }
    };
  };
  /**
   * Adds an event listener that is notified whenever an event is sent to the running interpreter.
   * @param listener The event listener
   */


  Interpreter.prototype.onEvent = function (listener) {
    this.eventListeners.add(listener);
    return this;
  };
  /**
   * Adds an event listener that is notified whenever a `send` event occurs.
   * @param listener The event listener
   */


  Interpreter.prototype.onSend = function (listener) {
    this.sendListeners.add(listener);
    return this;
  };
  /**
   * Adds a context listener that is notified whenever the state context changes.
   * @param listener The context listener
   */


  Interpreter.prototype.onChange = function (listener) {
    this.contextListeners.add(listener);
    return this;
  };
  /**
   * Adds a listener that is notified when the machine is stopped.
   * @param listener The listener
   */


  Interpreter.prototype.onStop = function (listener) {
    this.stopListeners.add(listener);
    return this;
  };
  /**
   * Adds a state listener that is notified when the statechart has reached its final state.
   * @param listener The state listener
   */


  Interpreter.prototype.onDone = function (listener) {
    if (this.status === InterpreterStatus.Stopped && this._doneEvent) {
      listener(this._doneEvent);
    } else {
      this.doneListeners.add(listener);
    }

    return this;
  };
  /**
   * Removes a listener.
   * @param listener The listener to remove
   */


  Interpreter.prototype.off = function (listener) {
    this.listeners.delete(listener);
    this.eventListeners.delete(listener);
    this.sendListeners.delete(listener);
    this.stopListeners.delete(listener);
    this.doneListeners.delete(listener);
    this.contextListeners.delete(listener);
    return this;
  };
  /**
   * Starts the interpreter from the given state, or the initial state.
   * @param initialState The state to start the statechart from
   */


  Interpreter.prototype.start = function (initialState) {
    var _this = this;

    if (this.status === InterpreterStatus.Running) {
      // Do not restart the service if it is already started
      return this;
    } // yes, it's a hack but we need the related cache to be populated for some things to work (like delayed transitions)
    // this is usually called by `machine.getInitialState` but if we rehydrate from a state we might bypass this call
    // we also don't want to call this method here as it resolves the full initial state which might involve calling assign actions
    // and that could potentially lead to some unwanted side-effects (even such as creating some rogue actors)


    this.machine._init();

    _registry_js__WEBPACK_IMPORTED_MODULE_3__.registry.register(this.sessionId, this);
    this.initialized = true;
    this.status = InterpreterStatus.Running;
    var resolvedState = initialState === undefined ? this.initialState : (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_8__.provide)(this, function () {
      return (0,_State_js__WEBPACK_IMPORTED_MODULE_9__.isStateConfig)(initialState) ? _this.machine.resolveState(initialState) : _this.machine.resolveState(_State_js__WEBPACK_IMPORTED_MODULE_9__.State.from(initialState, _this.machine.context));
    });

    if (this.options.devTools) {
      this.attachDev();
    }

    this.scheduler.initialize(function () {
      _this.update(resolvedState, _actions_js__WEBPACK_IMPORTED_MODULE_6__.initEvent);
    });
    return this;
  };

  Interpreter.prototype._stopChildren = function () {
    // TODO: think about converting those to actions
    this.children.forEach(function (child) {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(child.stop)) {
        child.stop();
      }
    });
    this.children.clear();
  };

  Interpreter.prototype._stop = function () {
    var e_6, _a, e_7, _b, e_8, _c, e_9, _d, e_10, _e;

    try {
      for (var _f = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.listeners), _g = _f.next(); !_g.done; _g = _f.next()) {
        var listener = _g.value;
        this.listeners.delete(listener);
      }
    } catch (e_6_1) {
      e_6 = {
        error: e_6_1
      };
    } finally {
      try {
        if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
      } finally {
        if (e_6) throw e_6.error;
      }
    }

    try {
      for (var _h = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.stopListeners), _j = _h.next(); !_j.done; _j = _h.next()) {
        var listener = _j.value; // call listener, then remove

        listener();
        this.stopListeners.delete(listener);
      }
    } catch (e_7_1) {
      e_7 = {
        error: e_7_1
      };
    } finally {
      try {
        if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
      } finally {
        if (e_7) throw e_7.error;
      }
    }

    try {
      for (var _k = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.contextListeners), _l = _k.next(); !_l.done; _l = _k.next()) {
        var listener = _l.value;
        this.contextListeners.delete(listener);
      }
    } catch (e_8_1) {
      e_8 = {
        error: e_8_1
      };
    } finally {
      try {
        if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
      } finally {
        if (e_8) throw e_8.error;
      }
    }

    try {
      for (var _m = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.doneListeners), _o = _m.next(); !_o.done; _o = _m.next()) {
        var listener = _o.value;
        this.doneListeners.delete(listener);
      }
    } catch (e_9_1) {
      e_9 = {
        error: e_9_1
      };
    } finally {
      try {
        if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
      } finally {
        if (e_9) throw e_9.error;
      }
    }

    if (!this.initialized) {
      // Interpreter already stopped; do nothing
      return this;
    }

    this.initialized = false;
    this.status = InterpreterStatus.Stopped;
    this._initialState = undefined;

    try {
      // we are going to stop within the current sync frame
      // so we can safely just cancel this here as nothing async should be fired anyway
      for (var _p = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(Object.keys(this.delayedEventsMap)), _q = _p.next(); !_q.done; _q = _p.next()) {
        var key = _q.value;
        this.clock.clearTimeout(this.delayedEventsMap[key]);
      }
    } catch (e_10_1) {
      e_10 = {
        error: e_10_1
      };
    } finally {
      try {
        if (_q && !_q.done && (_e = _p.return)) _e.call(_p);
      } finally {
        if (e_10) throw e_10.error;
      }
    } // clear everything that might be enqueued


    this.scheduler.clear();
    this.scheduler = new _scheduler_js__WEBPACK_IMPORTED_MODULE_7__.Scheduler({
      deferEvents: this.options.deferEvents
    });
  };
  /**
   * Stops the interpreter and unsubscribe all listeners.
   *
   * This will also notify the `onStop` listeners.
   */


  Interpreter.prototype.stop = function () {
    // TODO: add warning for stopping non-root interpreters
    var _this = this; // grab the current scheduler as it will be replaced in _stop


    var scheduler = this.scheduler;

    this._stop(); // let what is currently processed to be finished


    scheduler.schedule(function () {
      // it feels weird to handle this here but we need to handle this even slightly "out of band"
      var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)({
        type: 'xstate.stop'
      });

      var nextState = (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_8__.provide)(_this, function () {
        var exitActions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__read)(_this.state.configuration), false).sort(function (a, b) {
          return b.order - a.order;
        }).map(function (stateNode) {
          return (0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.toActionObjects)(stateNode.onExit, _this.machine.options.actions);
        }));

        var _a = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__read)((0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.resolveActions)(_this.machine, _this.state, _this.state.context, _event, [{
          type: 'exit',
          actions: exitActions
        }], _this.machine.config.predictableActionArguments ? _this._exec : undefined, _this.machine.config.predictableActionArguments || _this.machine.config.preserveActionOrder), 2),
            resolvedActions = _a[0],
            updatedContext = _a[1];

        var newState = new _State_js__WEBPACK_IMPORTED_MODULE_9__.State({
          value: _this.state.value,
          context: updatedContext,
          _event: _event,
          _sessionid: _this.sessionId,
          historyValue: undefined,
          history: _this.state,
          actions: resolvedActions.filter(function (action) {
            return !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isRaisableAction)(action);
          }),
          activities: {},
          events: [],
          configuration: [],
          transitions: [],
          children: {},
          done: _this.state.done,
          tags: _this.state.tags,
          machine: _this.machine
        });
        newState.changed = true;
        return newState;
      });

      _this.update(nextState, _event);

      _this._stopChildren();

      _registry_js__WEBPACK_IMPORTED_MODULE_3__.registry.free(_this.sessionId);
    });
    return this;
  };

  Interpreter.prototype.batch = function (events) {
    var _this = this;

    if (this.status === InterpreterStatus.NotStarted && this.options.deferEvents) {
      // tslint:disable-next-line:no-console
      if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "".concat(events.length, " event(s) were sent to uninitialized service \"").concat(this.machine.id, "\" and are deferred. Make sure .start() is called for this service.\nEvent: ").concat(JSON.stringify(event)));
      }
    } else if (this.status !== InterpreterStatus.Running) {
      throw new Error( // tslint:disable-next-line:max-line-length
      "".concat(events.length, " event(s) were sent to uninitialized service \"").concat(this.machine.id, "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options."));
    }

    if (!events.length) {
      return;
    }

    var exec = !!this.machine.config.predictableActionArguments && this._exec;
    this.scheduler.schedule(function () {
      var e_11, _a;

      var nextState = _this.state;
      var batchChanged = false;
      var batchedActions = [];

      var _loop_1 = function (event_1) {
        var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(event_1);

        _this.forward(_event);

        nextState = (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_8__.provide)(_this, function () {
          return _this.machine.transition(nextState, _event, undefined, exec || undefined);
        });
        batchedActions.push.apply(batchedActions, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__read)(_this.machine.config.predictableActionArguments ? nextState.actions : nextState.actions.map(function (a) {
          return (0,_State_js__WEBPACK_IMPORTED_MODULE_9__.bindActionToState)(a, nextState);
        })), false));
        batchChanged = batchChanged || !!nextState.changed;
      };

      try {
        for (var events_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
          var event_1 = events_1_1.value;

          _loop_1(event_1);
        }
      } catch (e_11_1) {
        e_11 = {
          error: e_11_1
        };
      } finally {
        try {
          if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
        } finally {
          if (e_11) throw e_11.error;
        }
      }

      nextState.changed = batchChanged;
      nextState.actions = batchedActions;

      _this.update(nextState, (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(events[events.length - 1]));
    });
  };
  /**
   * Returns a send function bound to this interpreter instance.
   *
   * @param event The event to be sent by the sender.
   */


  Interpreter.prototype.sender = function (event) {
    return this.send.bind(this, event);
  };

  Interpreter.prototype._nextState = function (event, exec) {
    var _this = this;

    if (exec === void 0) {
      exec = !!this.machine.config.predictableActionArguments && this._exec;
    }

    var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(event);

    if (_event.name.indexOf(_actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.errorPlatform) === 0 && !this.state.nextEvents.some(function (nextEvent) {
      return nextEvent.indexOf(_actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.errorPlatform) === 0;
    })) {
      throw _event.data.data;
    }

    var nextState = (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_8__.provide)(this, function () {
      return _this.machine.transition(_this.state, _event, undefined, exec || undefined);
    });
    return nextState;
  };
  /**
   * Returns the next state given the interpreter's current state and the event.
   *
   * This is a pure method that does _not_ update the interpreter's state.
   *
   * @param event The event to determine the next state
   */


  Interpreter.prototype.nextState = function (event) {
    return this._nextState(event, false);
  };

  Interpreter.prototype.forward = function (event) {
    var e_12, _a;

    try {
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.forwardTo), _c = _b.next(); !_c.done; _c = _b.next()) {
        var id = _c.value;
        var child = this.children.get(id);

        if (!child) {
          throw new Error("Unable to forward event '".concat(event, "' from interpreter '").concat(this.id, "' to nonexistant child '").concat(id, "'."));
        }

        child.send(event);
      }
    } catch (e_12_1) {
      e_12 = {
        error: e_12_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_12) throw e_12.error;
      }
    }
  };

  Interpreter.prototype.defer = function (sendAction) {
    var _this = this;

    var timerId = this.clock.setTimeout(function () {
      if ('to' in sendAction && sendAction.to) {
        _this.sendTo(sendAction._event, sendAction.to, true);
      } else {
        _this.send(sendAction._event);
      }
    }, sendAction.delay);

    if (sendAction.id) {
      this.delayedEventsMap[sendAction.id] = timerId;
    }
  };

  Interpreter.prototype.cancel = function (sendId) {
    this.clock.clearTimeout(this.delayedEventsMap[sendId]);
    delete this.delayedEventsMap[sendId];
  };

  Interpreter.prototype.exec = function (action, state, actionFunctionMap) {
    if (actionFunctionMap === void 0) {
      actionFunctionMap = this.machine.options.actions;
    }

    this._exec(action, state.context, state._event, actionFunctionMap);
  };

  Interpreter.prototype.removeChild = function (childId) {
    var _a;

    this.children.delete(childId);
    this.forwardTo.delete(childId); // this.state might not exist at the time this is called,
    // such as when a child is added then removed while initializing the state

    (_a = this.state) === null || _a === void 0 ? true : delete _a.children[childId];
  };

  Interpreter.prototype.stopChild = function (childId) {
    var child = this.children.get(childId);

    if (!child) {
      return;
    }

    this.removeChild(childId);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(child.stop)) {
      child.stop();
    }
  };

  Interpreter.prototype.spawn = function (entity, name, options) {
    if (this.status !== InterpreterStatus.Running) {
      return (0,_Actor_js__WEBPACK_IMPORTED_MODULE_10__.createDeferredActor)(entity, name);
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPromiseLike)(entity)) {
      return this.spawnPromise(Promise.resolve(entity), name);
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(entity)) {
      return this.spawnCallback(entity, name);
    } else if ((0,_Actor_js__WEBPACK_IMPORTED_MODULE_10__.isSpawnedActor)(entity)) {
      return this.spawnActor(entity, name);
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isObservable)(entity)) {
      return this.spawnObservable(entity, name);
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(entity)) {
      return this.spawnMachine(entity, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, options), {
        id: name
      }));
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isBehavior)(entity)) {
      return this.spawnBehavior(entity, name);
    } else {
      throw new Error("Unable to spawn entity \"".concat(name, "\" of type \"").concat(typeof entity, "\"."));
    }
  };

  Interpreter.prototype.spawnMachine = function (machine, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var childService = new Interpreter(machine, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, this.options), {
      parent: this,
      id: options.id || machine.id
    }));

    var resolvedOptions = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, DEFAULT_SPAWN_OPTIONS), options);

    if (resolvedOptions.sync) {
      childService.onTransition(function (state) {
        _this.send(_actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.update, {
          state: state,
          id: childService.id
        });
      });
    }

    var actor = childService;
    this.children.set(childService.id, actor);

    if (resolvedOptions.autoForward) {
      this.forwardTo.add(childService.id);
    }

    childService.onDone(function (doneEvent) {
      _this.removeChild(childService.id);

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(doneEvent, {
        origin: childService.id
      }));
    }).start();
    return actor;
  };

  Interpreter.prototype.spawnBehavior = function (behavior, id) {
    var actorRef = (0,_behaviors_js__WEBPACK_IMPORTED_MODULE_11__.spawnBehavior)(behavior, {
      id: id,
      parent: this
    });
    this.children.set(id, actorRef);
    return actorRef;
  };

  Interpreter.prototype.spawnPromise = function (promise, id) {
    var _a;

    var _this = this;

    var canceled = false;
    var resolvedData;
    promise.then(function (response) {
      if (!canceled) {
        resolvedData = response;

        _this.removeChild(id);

        _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)((0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.doneInvoke)(id, response), {
          origin: id
        }));
      }
    }, function (errorData) {
      if (!canceled) {
        _this.removeChild(id);

        var errorEvent = (0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.error)(id, errorData);

        try {
          // Send "error.platform.id" to this (parent).
          _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(errorEvent, {
            origin: id
          }));
        } catch (error) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.reportUnhandledExceptionOnInvocation)(errorData, error, id);

          if (_this.devTools) {
            _this.devTools.send(errorEvent, _this.state);
          }

          if (_this.machine.strict) {
            // it would be better to always stop the state machine if unhandled
            // exception/promise rejection happens but because we don't want to
            // break existing code so enforce it on strict mode only especially so
            // because documentation says that onError is optional
            _this.stop();
          }
        }
      }
    });
    var actor = (_a = {
      id: id,
      send: function () {
        return void 0;
      },
      subscribe: function (next, handleError, complete) {
        var observer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toObserver)(next, handleError, complete);
        var unsubscribed = false;
        promise.then(function (response) {
          if (unsubscribed) {
            return;
          }

          observer.next(response);

          if (unsubscribed) {
            return;
          }

          observer.complete();
        }, function (err) {
          if (unsubscribed) {
            return;
          }

          observer.error(err);
        });
        return {
          unsubscribe: function () {
            return unsubscribed = true;
          }
        };
      },
      stop: function () {
        canceled = true;
      },
      toJSON: function () {
        return {
          id: id
        };
      },
      getSnapshot: function () {
        return resolvedData;
      }
    }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
      return this;
    }, _a);
    this.children.set(id, actor);
    return actor;
  };

  Interpreter.prototype.spawnCallback = function (callback, id) {
    var _a;

    var _this = this;

    var canceled = false;
    var receivers = new Set();
    var listeners = new Set();
    var emitted;

    var receive = function (e) {
      emitted = e;
      listeners.forEach(function (listener) {
        return listener(e);
      });

      if (canceled) {
        return;
      }

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(e, {
        origin: id
      }));
    };

    var callbackStop;

    try {
      callbackStop = callback(receive, function (newListener) {
        receivers.add(newListener);
      });
    } catch (err) {
      this.send((0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.error)(id, err));
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPromiseLike)(callbackStop)) {
      // it turned out to be an async function, can't reliably check this before calling `callback`
      // because transpiled async functions are not recognizable
      return this.spawnPromise(callbackStop, id);
    }

    var actor = (_a = {
      id: id,
      send: function (event) {
        return receivers.forEach(function (receiver) {
          return receiver(event);
        });
      },
      subscribe: function (next) {
        var observer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toObserver)(next);
        listeners.add(observer.next);
        return {
          unsubscribe: function () {
            listeners.delete(observer.next);
          }
        };
      },
      stop: function () {
        canceled = true;

        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(callbackStop)) {
          callbackStop();
        }
      },
      toJSON: function () {
        return {
          id: id
        };
      },
      getSnapshot: function () {
        return emitted;
      }
    }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
      return this;
    }, _a);
    this.children.set(id, actor);
    return actor;
  };

  Interpreter.prototype.spawnObservable = function (source, id) {
    var _a;

    var _this = this;

    var emitted;
    var subscription = source.subscribe(function (value) {
      emitted = value;

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(value, {
        origin: id
      }));
    }, function (err) {
      _this.removeChild(id);

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)((0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.error)(id, err), {
        origin: id
      }));
    }, function () {
      _this.removeChild(id);

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)((0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.doneInvoke)(id), {
        origin: id
      }));
    });
    var actor = (_a = {
      id: id,
      send: function () {
        return void 0;
      },
      subscribe: function (next, handleError, complete) {
        return source.subscribe(next, handleError, complete);
      },
      stop: function () {
        return subscription.unsubscribe();
      },
      getSnapshot: function () {
        return emitted;
      },
      toJSON: function () {
        return {
          id: id
        };
      }
    }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
      return this;
    }, _a);
    this.children.set(id, actor);
    return actor;
  };

  Interpreter.prototype.spawnActor = function (actor, name) {
    this.children.set(name, actor);
    return actor;
  };

  Interpreter.prototype.spawnActivity = function (activity) {
    var implementation = this.machine.options && this.machine.options.activities ? this.machine.options.activities[activity.type] : undefined;

    if (!implementation) {
      if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "No implementation found for activity '".concat(activity.type, "'"));
      } // tslint:disable-next-line:no-console


      return;
    } // Start implementation


    var dispose = implementation(this.state.context, activity);
    this.spawnEffect(activity.id, dispose);
  };

  Interpreter.prototype.spawnEffect = function (id, dispose) {
    var _a;

    this.children.set(id, (_a = {
      id: id,
      send: function () {
        return void 0;
      },
      subscribe: function () {
        return {
          unsubscribe: function () {
            return void 0;
          }
        };
      },
      stop: dispose || undefined,
      getSnapshot: function () {
        return undefined;
      },
      toJSON: function () {
        return {
          id: id
        };
      }
    }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
      return this;
    }, _a));
  };

  Interpreter.prototype.attachDev = function () {
    var global = (0,_devTools_js__WEBPACK_IMPORTED_MODULE_12__.getGlobal)();

    if (this.options.devTools && global) {
      if (global.__REDUX_DEVTOOLS_EXTENSION__) {
        var devToolsOptions = typeof this.options.devTools === 'object' ? this.options.devTools : undefined;
        this.devTools = global.__REDUX_DEVTOOLS_EXTENSION__.connect((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({
          name: this.id,
          autoPause: true,
          stateSanitizer: function (state) {
            return {
              value: state.value,
              context: state.context,
              actions: state.actions
            };
          }
        }, devToolsOptions), {
          features: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({
            jump: false,
            skip: false
          }, devToolsOptions ? devToolsOptions.features : undefined)
        }), this.machine);
        this.devTools.init(this.state);
      } // add XState-specific dev tooling hook


      (0,_devTools_js__WEBPACK_IMPORTED_MODULE_12__.registerService)(this);
    }
  };

  Interpreter.prototype.toJSON = function () {
    return {
      id: this.id
    };
  };

  Interpreter.prototype[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
    return this;
  };

  Interpreter.prototype.getSnapshot = function () {
    if (this.status === InterpreterStatus.NotStarted) {
      return this.initialState;
    }

    return this._state;
  };
  /**
   * The default interpreter options:
   *
   * - `clock` uses the global `setTimeout` and `clearTimeout` functions
   * - `logger` uses the global `console.log()` method
   */


  Interpreter.defaultOptions = {
    execute: true,
    deferEvents: true,
    clock: {
      setTimeout: function (fn, ms) {
        return setTimeout(fn, ms);
      },
      clearTimeout: function (id) {
        return clearTimeout(id);
      }
    },
    logger: /*#__PURE__*/console.log.bind(console),
    devTools: false
  };
  Interpreter.interpret = interpret;
  return Interpreter;
}();

var resolveSpawnOptions = function (nameOrOptions) {
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(nameOrOptions)) {
    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, DEFAULT_SPAWN_OPTIONS), {
      name: nameOrOptions
    });
  }

  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, DEFAULT_SPAWN_OPTIONS), {
    name: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.uniqueId)()
  }), nameOrOptions);
};

function spawn(entity, nameOrOptions) {
  var resolvedOptions = resolveSpawnOptions(nameOrOptions);
  return (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_8__.consume)(function (service) {
    if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
      var isLazyEntity = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(entity) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(entity);
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(!!service || isLazyEntity, "Attempted to spawn an Actor (ID: \"".concat((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(entity) ? entity.id : 'undefined', "\") outside of a service. This will have no effect."));
    }

    if (service) {
      return service.spawn(entity, resolvedOptions.name, resolvedOptions);
    } else {
      return (0,_Actor_js__WEBPACK_IMPORTED_MODULE_10__.createDeferredActor)(entity, resolvedOptions.name);
    }
  });
}
/**
 * Creates a new Interpreter instance for the given machine with the provided options, if any.
 *
 * @param machine The machine to interpret
 * @param options Interpreter options
 */

function interpret(machine, options) {
  var interpreter = new Interpreter(machine, options);
  return interpreter;
}




/***/ }),

/***/ "./node_modules/xstate/es/invokeUtils.js":
/*!***********************************************!*\
  !*** ./node_modules/xstate/es/invokeUtils.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toInvokeDefinition: () => (/* binding */ toInvokeDefinition),
/* harmony export */   toInvokeSource: () => (/* binding */ toInvokeSource)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actionTypes.js */ "./node_modules/xstate/es/actionTypes.js");






function toInvokeSource(src) {
  if (typeof src === 'string') {
    var simpleSrc = {
      type: src
    };

    simpleSrc.toString = function () {
      return src;
    }; // v4 compat - TODO: remove in v5


    return simpleSrc;
  }

  return src;
}
function toInvokeDefinition(invokeConfig) {
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_1__.invoke
  }, invokeConfig), {
    toJSON: function () {
      invokeConfig.onDone;
          invokeConfig.onError;
          var invokeDef = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__rest)(invokeConfig, ["onDone", "onError"]);

      return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, invokeDef), {
        type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_1__.invoke,
        src: toInvokeSource(invokeConfig.src)
      });
    }
  });
}




/***/ }),

/***/ "./node_modules/xstate/es/mapState.js":
/*!********************************************!*\
  !*** ./node_modules/xstate/es/mapState.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mapState: () => (/* binding */ mapState)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");



function mapState(stateMap, stateId) {
  var e_1, _a;

  var foundStateId;

  try {
    for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(Object.keys(stateMap)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var mappedStateId = _c.value;

      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.matchesState)(mappedStateId, stateId) && (!foundStateId || stateId.length > foundStateId.length)) {
        foundStateId = mappedStateId;
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return stateMap[foundStateId];
}




/***/ }),

/***/ "./node_modules/xstate/es/match.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/match.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   matchState: () => (/* binding */ matchState)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./State.js */ "./node_modules/xstate/es/State.js");



function matchState(state, patterns, defaultValue) {
  var e_1, _a;

  var resolvedState = _State_js__WEBPACK_IMPORTED_MODULE_0__.State.from(state, state instanceof _State_js__WEBPACK_IMPORTED_MODULE_0__.State ? state.context : undefined);

  try {
    for (var patterns_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(patterns), patterns_1_1 = patterns_1.next(); !patterns_1_1.done; patterns_1_1 = patterns_1.next()) {
      var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__read)(patterns_1_1.value, 2),
          stateValue = _b[0],
          getValue = _b[1];

      if (resolvedState.matches(stateValue)) {
        return getValue(resolvedState);
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (patterns_1_1 && !patterns_1_1.done && (_a = patterns_1.return)) _a.call(patterns_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return defaultValue(resolvedState);
}




/***/ }),

/***/ "./node_modules/xstate/es/registry.js":
/*!********************************************!*\
  !*** ./node_modules/xstate/es/registry.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registry: () => (/* binding */ registry)
/* harmony export */ });
var children = /*#__PURE__*/new Map();
var sessionIdIndex = 0;
var registry = {
  bookId: function () {
    return "x:".concat(sessionIdIndex++);
  },
  register: function (id, actor) {
    children.set(id, actor);
    return id;
  },
  get: function (id) {
    return children.get(id);
  },
  free: function (id) {
    children.delete(id);
  }
};




/***/ }),

/***/ "./node_modules/xstate/es/scheduler.js":
/*!*********************************************!*\
  !*** ./node_modules/xstate/es/scheduler.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Scheduler: () => (/* binding */ Scheduler)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");


var defaultOptions = {
  deferEvents: false
};

var Scheduler =
/*#__PURE__*/

/** @class */
function () {
  function Scheduler(options) {
    this.processingEvent = false;
    this.queue = [];
    this.initialized = false;
    this.options = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, defaultOptions), options);
  }

  Scheduler.prototype.initialize = function (callback) {
    this.initialized = true;

    if (callback) {
      if (!this.options.deferEvents) {
        this.schedule(callback);
        return;
      }

      this.process(callback);
    }

    this.flushEvents();
  };

  Scheduler.prototype.schedule = function (task) {
    if (!this.initialized || this.processingEvent) {
      this.queue.push(task);
      return;
    }

    if (this.queue.length !== 0) {
      throw new Error('Event queue should be empty when it is not processing events');
    }

    this.process(task);
    this.flushEvents();
  };

  Scheduler.prototype.clear = function () {
    this.queue = [];
  };

  Scheduler.prototype.flushEvents = function () {
    var nextCallback = this.queue.shift();

    while (nextCallback) {
      this.process(nextCallback);
      nextCallback = this.queue.shift();
    }
  };

  Scheduler.prototype.process = function (callback) {
    this.processingEvent = true;

    try {
      callback();
    } catch (e) {
      // there is no use to keep the future events
      // as the situation is not anymore the same
      this.clear();
      throw e;
    } finally {
      this.processingEvent = false;
    }
  };

  return Scheduler;
}();




/***/ }),

/***/ "./node_modules/xstate/es/schema.js":
/*!******************************************!*\
  !*** ./node_modules/xstate/es/schema.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSchema: () => (/* binding */ createSchema),
/* harmony export */   t: () => (/* binding */ t)
/* harmony export */ });
function createSchema(schema) {
  return schema;
}
var t = createSchema;




/***/ }),

/***/ "./node_modules/xstate/es/serviceScope.js":
/*!************************************************!*\
  !*** ./node_modules/xstate/es/serviceScope.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   consume: () => (/* binding */ consume),
/* harmony export */   provide: () => (/* binding */ provide)
/* harmony export */ });
/**
 * Maintains a stack of the current service in scope.
 * This is used to provide the correct service to spawn().
 */
var serviceStack = [];
var provide = function (service, fn) {
  serviceStack.push(service);
  var result = fn(service);
  serviceStack.pop();
  return result;
};
var consume = function (fn) {
  return fn(serviceStack[serviceStack.length - 1]);
};




/***/ }),

/***/ "./node_modules/xstate/es/stateUtils.js":
/*!**********************************************!*\
  !*** ./node_modules/xstate/es/stateUtils.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAdjList: () => (/* binding */ getAdjList),
/* harmony export */   getAllChildren: () => (/* binding */ getAllChildren),
/* harmony export */   getAllStateNodes: () => (/* binding */ getAllStateNodes),
/* harmony export */   getChildren: () => (/* binding */ getChildren),
/* harmony export */   getConfiguration: () => (/* binding */ getConfiguration),
/* harmony export */   getMeta: () => (/* binding */ getMeta),
/* harmony export */   getTagsFromConfiguration: () => (/* binding */ getTagsFromConfiguration),
/* harmony export */   getValue: () => (/* binding */ getValue),
/* harmony export */   has: () => (/* binding */ has),
/* harmony export */   isInFinalState: () => (/* binding */ isInFinalState),
/* harmony export */   isLeafNode: () => (/* binding */ isLeafNode),
/* harmony export */   nextEvents: () => (/* binding */ nextEvents)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");



var isLeafNode = function (stateNode) {
  return stateNode.type === 'atomic' || stateNode.type === 'final';
};
function getAllChildren(stateNode) {
  return Object.keys(stateNode.states).map(function (key) {
    return stateNode.states[key];
  });
}
function getChildren(stateNode) {
  return getAllChildren(stateNode).filter(function (sn) {
    return sn.type !== 'history';
  });
}
function getAllStateNodes(stateNode) {
  var stateNodes = [stateNode];

  if (isLeafNode(stateNode)) {
    return stateNodes;
  }

  return stateNodes.concat((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(getChildren(stateNode).map(getAllStateNodes)));
}
function getConfiguration(prevStateNodes, stateNodes) {
  var e_1, _a, e_2, _b, e_3, _c, e_4, _d;

  var prevConfiguration = new Set(prevStateNodes);
  var prevAdjList = getAdjList(prevConfiguration);
  var configuration = new Set(stateNodes);

  try {
    // add all ancestors
    for (var configuration_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(configuration), configuration_1_1 = configuration_1.next(); !configuration_1_1.done; configuration_1_1 = configuration_1.next()) {
      var s = configuration_1_1.value;
      var m = s.parent;

      while (m && !configuration.has(m)) {
        configuration.add(m);
        m = m.parent;
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (configuration_1_1 && !configuration_1_1.done && (_a = configuration_1.return)) _a.call(configuration_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  var adjList = getAdjList(configuration);

  try {
    // add descendants
    for (var configuration_2 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(configuration), configuration_2_1 = configuration_2.next(); !configuration_2_1.done; configuration_2_1 = configuration_2.next()) {
      var s = configuration_2_1.value; // if previously active, add existing child nodes

      if (s.type === 'compound' && (!adjList.get(s) || !adjList.get(s).length)) {
        if (prevAdjList.get(s)) {
          prevAdjList.get(s).forEach(function (sn) {
            return configuration.add(sn);
          });
        } else {
          s.initialStateNodes.forEach(function (sn) {
            return configuration.add(sn);
          });
        }
      } else {
        if (s.type === 'parallel') {
          try {
            for (var _e = (e_3 = void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(getChildren(s))), _f = _e.next(); !_f.done; _f = _e.next()) {
              var child = _f.value;

              if (!configuration.has(child)) {
                configuration.add(child);

                if (prevAdjList.get(child)) {
                  prevAdjList.get(child).forEach(function (sn) {
                    return configuration.add(sn);
                  });
                } else {
                  child.initialStateNodes.forEach(function (sn) {
                    return configuration.add(sn);
                  });
                }
              }
            }
          } catch (e_3_1) {
            e_3 = {
              error: e_3_1
            };
          } finally {
            try {
              if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
            } finally {
              if (e_3) throw e_3.error;
            }
          }
        }
      }
    }
  } catch (e_2_1) {
    e_2 = {
      error: e_2_1
    };
  } finally {
    try {
      if (configuration_2_1 && !configuration_2_1.done && (_b = configuration_2.return)) _b.call(configuration_2);
    } finally {
      if (e_2) throw e_2.error;
    }
  }

  try {
    // add all ancestors
    for (var configuration_3 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(configuration), configuration_3_1 = configuration_3.next(); !configuration_3_1.done; configuration_3_1 = configuration_3.next()) {
      var s = configuration_3_1.value;
      var m = s.parent;

      while (m && !configuration.has(m)) {
        configuration.add(m);
        m = m.parent;
      }
    }
  } catch (e_4_1) {
    e_4 = {
      error: e_4_1
    };
  } finally {
    try {
      if (configuration_3_1 && !configuration_3_1.done && (_d = configuration_3.return)) _d.call(configuration_3);
    } finally {
      if (e_4) throw e_4.error;
    }
  }

  return configuration;
}

function getValueFromAdj(baseNode, adjList) {
  var childStateNodes = adjList.get(baseNode);

  if (!childStateNodes) {
    return {}; // todo: fix?
  }

  if (baseNode.type === 'compound') {
    var childStateNode = childStateNodes[0];

    if (childStateNode) {
      if (isLeafNode(childStateNode)) {
        return childStateNode.key;
      }
    } else {
      return {};
    }
  }

  var stateValue = {};
  childStateNodes.forEach(function (csn) {
    stateValue[csn.key] = getValueFromAdj(csn, adjList);
  });
  return stateValue;
}

function getAdjList(configuration) {
  var e_5, _a;

  var adjList = new Map();

  try {
    for (var configuration_4 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(configuration), configuration_4_1 = configuration_4.next(); !configuration_4_1.done; configuration_4_1 = configuration_4.next()) {
      var s = configuration_4_1.value;

      if (!adjList.has(s)) {
        adjList.set(s, []);
      }

      if (s.parent) {
        if (!adjList.has(s.parent)) {
          adjList.set(s.parent, []);
        }

        adjList.get(s.parent).push(s);
      }
    }
  } catch (e_5_1) {
    e_5 = {
      error: e_5_1
    };
  } finally {
    try {
      if (configuration_4_1 && !configuration_4_1.done && (_a = configuration_4.return)) _a.call(configuration_4);
    } finally {
      if (e_5) throw e_5.error;
    }
  }

  return adjList;
}
function getValue(rootNode, configuration) {
  var config = getConfiguration([rootNode], configuration);
  return getValueFromAdj(rootNode, getAdjList(config));
}
function has(iterable, item) {
  if (Array.isArray(iterable)) {
    return iterable.some(function (member) {
      return member === item;
    });
  }

  if (iterable instanceof Set) {
    return iterable.has(item);
  }

  return false; // TODO: fix
}
function nextEvents(configuration) {
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__read)(new Set((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__read)(configuration.map(function (sn) {
    return sn.ownEvents;
  })), false)))), false);
}
function isInFinalState(configuration, stateNode) {
  if (stateNode.type === 'compound') {
    return getChildren(stateNode).some(function (s) {
      return s.type === 'final' && has(configuration, s);
    });
  }

  if (stateNode.type === 'parallel') {
    return getChildren(stateNode).every(function (sn) {
      return isInFinalState(configuration, sn);
    });
  }

  return false;
}
function getMeta(configuration) {
  if (configuration === void 0) {
    configuration = [];
  }

  return configuration.reduce(function (acc, stateNode) {
    if (stateNode.meta !== undefined) {
      acc[stateNode.id] = stateNode.meta;
    }

    return acc;
  }, {});
}
function getTagsFromConfiguration(configuration) {
  return new Set((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(configuration.map(function (sn) {
    return sn.tags;
  })));
}




/***/ }),

/***/ "./node_modules/xstate/es/types.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/types.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionTypes: () => (/* binding */ ActionTypes),
/* harmony export */   SpecialTargets: () => (/* binding */ SpecialTargets)
/* harmony export */ });
var ActionTypes;

(function (ActionTypes) {
  ActionTypes["Start"] = "xstate.start";
  ActionTypes["Stop"] = "xstate.stop";
  ActionTypes["Raise"] = "xstate.raise";
  ActionTypes["Send"] = "xstate.send";
  ActionTypes["Cancel"] = "xstate.cancel";
  ActionTypes["NullEvent"] = "";
  ActionTypes["Assign"] = "xstate.assign";
  ActionTypes["After"] = "xstate.after";
  ActionTypes["DoneState"] = "done.state";
  ActionTypes["DoneInvoke"] = "done.invoke";
  ActionTypes["Log"] = "xstate.log";
  ActionTypes["Init"] = "xstate.init";
  ActionTypes["Invoke"] = "xstate.invoke";
  ActionTypes["ErrorExecution"] = "error.execution";
  ActionTypes["ErrorCommunication"] = "error.communication";
  ActionTypes["ErrorPlatform"] = "error.platform";
  ActionTypes["ErrorCustom"] = "xstate.error";
  ActionTypes["Update"] = "xstate.update";
  ActionTypes["Pure"] = "xstate.pure";
  ActionTypes["Choose"] = "xstate.choose";
})(ActionTypes || (ActionTypes = {}));

var SpecialTargets;

(function (SpecialTargets) {
  SpecialTargets["Parent"] = "#_parent";
  SpecialTargets["Internal"] = "#_internal";
})(SpecialTargets || (SpecialTargets = {}));




/***/ }),

/***/ "./node_modules/xstate/es/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createInvokeId: () => (/* binding */ createInvokeId),
/* harmony export */   evaluateGuard: () => (/* binding */ evaluateGuard),
/* harmony export */   flatten: () => (/* binding */ flatten),
/* harmony export */   getActionType: () => (/* binding */ getActionType),
/* harmony export */   getEventType: () => (/* binding */ getEventType),
/* harmony export */   interopSymbols: () => (/* binding */ interopSymbols),
/* harmony export */   isActor: () => (/* binding */ isActor),
/* harmony export */   isArray: () => (/* binding */ isArray),
/* harmony export */   isBehavior: () => (/* binding */ isBehavior),
/* harmony export */   isBuiltInEvent: () => (/* binding */ isBuiltInEvent),
/* harmony export */   isFunction: () => (/* binding */ isFunction),
/* harmony export */   isMachine: () => (/* binding */ isMachine),
/* harmony export */   isObservable: () => (/* binding */ isObservable),
/* harmony export */   isPromiseLike: () => (/* binding */ isPromiseLike),
/* harmony export */   isRaisableAction: () => (/* binding */ isRaisableAction),
/* harmony export */   isStateLike: () => (/* binding */ isStateLike),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   keys: () => (/* binding */ keys),
/* harmony export */   mapContext: () => (/* binding */ mapContext),
/* harmony export */   mapFilterValues: () => (/* binding */ mapFilterValues),
/* harmony export */   mapValues: () => (/* binding */ mapValues),
/* harmony export */   matchesState: () => (/* binding */ matchesState),
/* harmony export */   nestedPath: () => (/* binding */ nestedPath),
/* harmony export */   normalizeTarget: () => (/* binding */ normalizeTarget),
/* harmony export */   partition: () => (/* binding */ partition),
/* harmony export */   path: () => (/* binding */ path),
/* harmony export */   pathToStateValue: () => (/* binding */ pathToStateValue),
/* harmony export */   pathsToStateValue: () => (/* binding */ pathsToStateValue),
/* harmony export */   reportUnhandledExceptionOnInvocation: () => (/* binding */ reportUnhandledExceptionOnInvocation),
/* harmony export */   symbolObservable: () => (/* binding */ symbolObservable),
/* harmony export */   toArray: () => (/* binding */ toArray),
/* harmony export */   toArrayStrict: () => (/* binding */ toArrayStrict),
/* harmony export */   toEventObject: () => (/* binding */ toEventObject),
/* harmony export */   toGuard: () => (/* binding */ toGuard),
/* harmony export */   toInvokeSource: () => (/* binding */ toInvokeSource),
/* harmony export */   toObserver: () => (/* binding */ toObserver),
/* harmony export */   toSCXMLEvent: () => (/* binding */ toSCXMLEvent),
/* harmony export */   toStatePath: () => (/* binding */ toStatePath),
/* harmony export */   toStatePaths: () => (/* binding */ toStatePaths),
/* harmony export */   toStateValue: () => (/* binding */ toStateValue),
/* harmony export */   toTransitionConfigArray: () => (/* binding */ toTransitionConfigArray),
/* harmony export */   uniqueId: () => (/* binding */ uniqueId),
/* harmony export */   updateContext: () => (/* binding */ updateContext),
/* harmony export */   updateHistoryStates: () => (/* binding */ updateHistoryStates),
/* harmony export */   updateHistoryValue: () => (/* binding */ updateHistoryValue),
/* harmony export */   warn: () => (/* binding */ warn)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./types.js */ "./node_modules/xstate/es/types.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actionTypes.js */ "./node_modules/xstate/es/actionTypes.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./node_modules/xstate/es/constants.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");






var _a;
function keys(value) {
  return Object.keys(value);
}
function matchesState(parentStateId, childStateId, delimiter) {
  if (delimiter === void 0) {
    delimiter = _constants_js__WEBPACK_IMPORTED_MODULE_0__.STATE_DELIMITER;
  }

  var parentStateValue = toStateValue(parentStateId, delimiter);
  var childStateValue = toStateValue(childStateId, delimiter);

  if (isString(childStateValue)) {
    if (isString(parentStateValue)) {
      return childStateValue === parentStateValue;
    } // Parent more specific than child


    return false;
  }

  if (isString(parentStateValue)) {
    return parentStateValue in childStateValue;
  }

  return Object.keys(parentStateValue).every(function (key) {
    if (!(key in childStateValue)) {
      return false;
    }

    return matchesState(parentStateValue[key], childStateValue[key]);
  });
}
function getEventType(event) {
  try {
    return isString(event) || typeof event === 'number' ? "".concat(event) : event.type;
  } catch (e) {
    throw new Error('Events must be strings or objects with a string event.type property.');
  }
}
function getActionType(action) {
  try {
    return isString(action) || typeof action === 'number' ? "".concat(action) : isFunction(action) ? action.name : action.type;
  } catch (e) {
    throw new Error('Actions must be strings or objects with a string action.type property.');
  }
}
function toStatePath(stateId, delimiter) {
  try {
    if (isArray(stateId)) {
      return stateId;
    }

    return stateId.toString().split(delimiter);
  } catch (e) {
    throw new Error("'".concat(stateId, "' is not a valid state path."));
  }
}
function isStateLike(state) {
  return typeof state === 'object' && 'value' in state && 'context' in state && 'event' in state && '_event' in state;
}
function toStateValue(stateValue, delimiter) {
  if (isStateLike(stateValue)) {
    return stateValue.value;
  }

  if (isArray(stateValue)) {
    return pathToStateValue(stateValue);
  }

  if (typeof stateValue !== 'string') {
    return stateValue;
  }

  var statePath = toStatePath(stateValue, delimiter);
  return pathToStateValue(statePath);
}
function pathToStateValue(statePath) {
  if (statePath.length === 1) {
    return statePath[0];
  }

  var value = {};
  var marker = value;

  for (var i = 0; i < statePath.length - 1; i++) {
    if (i === statePath.length - 2) {
      marker[statePath[i]] = statePath[i + 1];
    } else {
      marker[statePath[i]] = {};
      marker = marker[statePath[i]];
    }
  }

  return value;
}
function mapValues(collection, iteratee) {
  var result = {};
  var collectionKeys = Object.keys(collection);

  for (var i = 0; i < collectionKeys.length; i++) {
    var key = collectionKeys[i];
    result[key] = iteratee(collection[key], key, collection, i);
  }

  return result;
}
function mapFilterValues(collection, iteratee, predicate) {
  var e_1, _a;

  var result = {};

  try {
    for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(Object.keys(collection)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      var item = collection[key];

      if (!predicate(item)) {
        continue;
      }

      result[key] = iteratee(item, key, collection);
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return result;
}
/**
 * Retrieves a value at the given path.
 * @param props The deep path to the prop of the desired value
 */

var path = function (props) {
  return function (object) {
    var e_2, _a;

    var result = object;

    try {
      for (var props_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
        var prop = props_1_1.value;
        result = result[prop];
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (props_1_1 && !props_1_1.done && (_a = props_1.return)) _a.call(props_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    return result;
  };
};
/**
 * Retrieves a value at the given path via the nested accessor prop.
 * @param props The deep path to the prop of the desired value
 */

function nestedPath(props, accessorProp) {
  return function (object) {
    var e_3, _a;

    var result = object;

    try {
      for (var props_2 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(props), props_2_1 = props_2.next(); !props_2_1.done; props_2_1 = props_2.next()) {
        var prop = props_2_1.value;
        result = result[accessorProp][prop];
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (props_2_1 && !props_2_1.done && (_a = props_2.return)) _a.call(props_2);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    return result;
  };
}
function toStatePaths(stateValue) {
  if (!stateValue) {
    return [[]];
  }

  if (isString(stateValue)) {
    return [[stateValue]];
  }

  var result = flatten(Object.keys(stateValue).map(function (key) {
    var subStateValue = stateValue[key];

    if (typeof subStateValue !== 'string' && (!subStateValue || !Object.keys(subStateValue).length)) {
      return [[key]];
    }

    return toStatePaths(stateValue[key]).map(function (subPath) {
      return [key].concat(subPath);
    });
  }));
  return result;
}
function pathsToStateValue(paths) {
  var e_4, _a;

  var result = {};

  if (paths && paths.length === 1 && paths[0].length === 1) {
    return paths[0][0];
  }

  try {
    for (var paths_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(paths), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
      var currentPath = paths_1_1.value;
      var marker = result; // tslint:disable-next-line:prefer-for-of

      for (var i = 0; i < currentPath.length; i++) {
        var subPath = currentPath[i];

        if (i === currentPath.length - 2) {
          marker[subPath] = currentPath[i + 1];
          break;
        }

        marker[subPath] = marker[subPath] || {};
        marker = marker[subPath];
      }
    }
  } catch (e_4_1) {
    e_4 = {
      error: e_4_1
    };
  } finally {
    try {
      if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) _a.call(paths_1);
    } finally {
      if (e_4) throw e_4.error;
    }
  }

  return result;
}
function flatten(array) {
  var _a;

  return (_a = []).concat.apply(_a, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__read)(array), false));
}
function toArrayStrict(value) {
  if (isArray(value)) {
    return value;
  }

  return [value];
}
function toArray(value) {
  if (value === undefined) {
    return [];
  }

  return toArrayStrict(value);
}
function mapContext(mapper, context, _event) {
  var e_5, _a;

  if (isFunction(mapper)) {
    return mapper(context, _event.data);
  }

  var result = {};

  try {
    for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(Object.keys(mapper)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      var subMapper = mapper[key];

      if (isFunction(subMapper)) {
        result[key] = subMapper(context, _event.data);
      } else {
        result[key] = subMapper;
      }
    }
  } catch (e_5_1) {
    e_5 = {
      error: e_5_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_5) throw e_5.error;
    }
  }

  return result;
}
function isBuiltInEvent(eventType) {
  return /^(done|error)\./.test(eventType);
}
function isPromiseLike(value) {
  if (value instanceof Promise) {
    return true;
  } // Check if shape matches the Promise/A+ specification for a "thenable".


  if (value !== null && (isFunction(value) || typeof value === 'object') && isFunction(value.then)) {
    return true;
  }

  return false;
}
function isBehavior(value) {
  return value !== null && typeof value === 'object' && 'transition' in value && typeof value.transition === 'function';
}
function partition(items, predicate) {
  var e_6, _a;

  var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__read)([[], []], 2),
      truthy = _b[0],
      falsy = _b[1];

  try {
    for (var items_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
      var item = items_1_1.value;

      if (predicate(item)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
    }
  } catch (e_6_1) {
    e_6 = {
      error: e_6_1
    };
  } finally {
    try {
      if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
    } finally {
      if (e_6) throw e_6.error;
    }
  }

  return [truthy, falsy];
}
function updateHistoryStates(hist, stateValue) {
  return mapValues(hist.states, function (subHist, key) {
    if (!subHist) {
      return undefined;
    }

    var subStateValue = (isString(stateValue) ? undefined : stateValue[key]) || (subHist ? subHist.current : undefined);

    if (!subStateValue) {
      return undefined;
    }

    return {
      current: subStateValue,
      states: updateHistoryStates(subHist, subStateValue)
    };
  });
}
function updateHistoryValue(hist, stateValue) {
  return {
    current: stateValue,
    states: updateHistoryStates(hist, stateValue)
  };
}
function updateContext(context, _event, assignActions, state) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_2__.IS_PRODUCTION) {
    warn(!!context, 'Attempting to update undefined context');
  }

  var updatedContext = context ? assignActions.reduce(function (acc, assignAction) {
    var e_7, _a;

    var assignment = assignAction.assignment;
    var meta = {
      state: state,
      action: assignAction,
      _event: _event
    };
    var partialUpdate = {};

    if (isFunction(assignment)) {
      partialUpdate = assignment(acc, _event.data, meta);
    } else {
      try {
        for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(Object.keys(assignment)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var key = _c.value;
          var propAssignment = assignment[key];
          partialUpdate[key] = isFunction(propAssignment) ? propAssignment(acc, _event.data, meta) : propAssignment;
        }
      } catch (e_7_1) {
        e_7 = {
          error: e_7_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_7) throw e_7.error;
        }
      }
    }

    return Object.assign({}, acc, partialUpdate);
  }, context) : context;
  return updatedContext;
} // tslint:disable-next-line:no-empty

var warn = function () {};

if (!_environment_js__WEBPACK_IMPORTED_MODULE_2__.IS_PRODUCTION) {
  warn = function (condition, message) {
    var error = condition instanceof Error ? condition : undefined;

    if (!error && condition) {
      return;
    }

    if (console !== undefined) {
      var args = ["Warning: ".concat(message)];

      if (error) {
        args.push(error);
      } // tslint:disable-next-line:no-console


      console.warn.apply(console, args);
    }
  };
}
function isArray(value) {
  return Array.isArray(value);
} // tslint:disable-next-line:ban-types

function isFunction(value) {
  return typeof value === 'function';
}
function isString(value) {
  return typeof value === 'string';
}
function toGuard(condition, guardMap) {
  if (!condition) {
    return undefined;
  }

  if (isString(condition)) {
    return {
      type: _constants_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_GUARD_TYPE,
      name: condition,
      predicate: guardMap ? guardMap[condition] : undefined
    };
  }

  if (isFunction(condition)) {
    return {
      type: _constants_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_GUARD_TYPE,
      name: condition.name,
      predicate: condition
    };
  }

  return condition;
}
function isObservable(value) {
  try {
    return 'subscribe' in value && isFunction(value.subscribe);
  } catch (e) {
    return false;
  }
}
var symbolObservable = /*#__PURE__*/function () {
  return typeof Symbol === 'function' && Symbol.observable || '@@observable';
}(); // TODO: to be removed in v5, left it out just to minimize the scope of the change and maintain compatibility with older versions of integration paackages

var interopSymbols = (_a = {}, _a[symbolObservable] = function () {
  return this;
}, _a[Symbol.observable] = function () {
  return this;
}, _a);
function isMachine(value) {
  return !!value && '__xstatenode' in value;
}
function isActor(value) {
  return !!value && typeof value.send === 'function';
}
var uniqueId = /*#__PURE__*/function () {
  var currentId = 0;
  return function () {
    currentId++;
    return currentId.toString(16);
  };
}();
function toEventObject(event, payload // id?: TEvent['type']
) {
  if (isString(event) || typeof event === 'number') {
    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)({
      type: event
    }, payload);
  }

  return event;
}
function toSCXMLEvent(event, scxmlEvent) {
  if (!isString(event) && '$$type' in event && event.$$type === 'scxml') {
    return event;
  }

  var eventObject = toEventObject(event);
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)({
    name: eventObject.type,
    data: eventObject,
    $$type: 'scxml',
    type: 'external'
  }, scxmlEvent);
}
function toTransitionConfigArray(event, configLike) {
  var transitions = toArrayStrict(configLike).map(function (transitionLike) {
    if (typeof transitionLike === 'undefined' || typeof transitionLike === 'string' || isMachine(transitionLike)) {
      return {
        target: transitionLike,
        event: event
      };
    }

    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, transitionLike), {
      event: event
    });
  });
  return transitions;
}
function normalizeTarget(target) {
  if (target === undefined || target === _constants_js__WEBPACK_IMPORTED_MODULE_0__.TARGETLESS_KEY) {
    return undefined;
  }

  return toArray(target);
}
function reportUnhandledExceptionOnInvocation(originalError, currentError, id) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_2__.IS_PRODUCTION) {
    var originalStackTrace = originalError.stack ? " Stacktrace was '".concat(originalError.stack, "'") : '';

    if (originalError === currentError) {
      // tslint:disable-next-line:no-console
      console.error("Missing onError handler for invocation '".concat(id, "', error was '").concat(originalError, "'.").concat(originalStackTrace));
    } else {
      var stackTrace = currentError.stack ? " Stacktrace was '".concat(currentError.stack, "'") : ''; // tslint:disable-next-line:no-console

      console.error("Missing onError handler and/or unhandled exception/promise rejection for invocation '".concat(id, "'. ") + "Original error: '".concat(originalError, "'. ").concat(originalStackTrace, " Current error is '").concat(currentError, "'.").concat(stackTrace));
    }
  }
}
function evaluateGuard(machine, guard, context, _event, state) {
  var guards = machine.options.guards;
  var guardMeta = {
    state: state,
    cond: guard,
    _event: _event
  }; // TODO: do not hardcode!

  if (guard.type === _constants_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_GUARD_TYPE) {
    return ((guards === null || guards === void 0 ? void 0 : guards[guard.name]) || guard.predicate)(context, _event.data, guardMeta);
  }

  var condFn = guards === null || guards === void 0 ? void 0 : guards[guard.type];

  if (!condFn) {
    throw new Error("Guard '".concat(guard.type, "' is not implemented on machine '").concat(machine.id, "'."));
  }

  return condFn(context, _event.data, guardMeta);
}
function toInvokeSource(src) {
  if (typeof src === 'string') {
    return {
      type: src
    };
  }

  return src;
}
function toObserver(nextHandler, errorHandler, completionHandler) {
  var noop = function () {};

  var isObserver = typeof nextHandler === 'object';
  var self = isObserver ? nextHandler : null;
  return {
    next: ((isObserver ? nextHandler.next : nextHandler) || noop).bind(self),
    error: ((isObserver ? nextHandler.error : errorHandler) || noop).bind(self),
    complete: ((isObserver ? nextHandler.complete : completionHandler) || noop).bind(self)
  };
}
function createInvokeId(stateNodeId, index) {
  return "".concat(stateNodeId, ":invocation[").concat(index, "]");
}
function isRaisableAction(action) {
  return (action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.raise || action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.send && action.to === _types_js__WEBPACK_IMPORTED_MODULE_4__.SpecialTargets.Internal) && typeof action.delay !== 'number';
}




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./src/AudioModule.js ***!
  \****************************/
// import state machines for audio input and output
var _require = __webpack_require__(/*! xstate */ "./node_modules/xstate/es/index.js"),
  interpret = _require.interpret;
//const audioInputMachine = require("./state-machines/AudioInputMachine");
var _require2 = __webpack_require__(/*! ./state-machines/AudioOutputMachine */ "./src/state-machines/AudioOutputMachine.js"),
  audioOutputMachine = _require2.audioOutputMachine;

// depends on the injecting script (saypi.index.js) declaring the EventBus as a global variable
var EventBus = window.EventBus;

// audio output (Pi)
var audioElement = document.querySelector("audio");
if (!audioElement) {
  console.error("Audio element not found!");
} else {
  audioElement.preload = "auto"; // enable aggressive preloading of audio
}

// debug audio output machine
console.log("Audio Output Machine", audioOutputMachine);
var audioOutputActor = interpret(audioOutputMachine).onTransition(function (state) {
  return console.log(state.value);
}).start();
function registerAudioPlaybackEvents(audio, actor) {
  audio.addEventListener("loadstart", function () {
    actor.send("loadStart");
  });

  // Intercept Autoplay Events (can't autoplay full audio on Safari)
  audio.addEventListener("play", function () {
    actor.send("play");
  });

  // Event listeners for detecting when Pi is speaking
  audio.addEventListener("playing", function () {
    actor.send("play");
  });
  audio.addEventListener("pause", function () {
    actor.send("pause");
  });
  audio.addEventListener("ended", function () {
    actor.send("ended");
  });
}
registerAudioPlaybackEvents(audioElement, audioOutputActor);

// audio input (user)
var audioDataChunks = [];
var audioMimeType = "audio/webm;codecs=opus";

// Declare a global variable for the mediaRecorder
var mediaRecorder;
var threshold = 1000; // 1000 ms = 1 second, about the length of "Hey, Pi"

// This function will be called when the 'dataavailable' event fires
function handleDataAvailable(e) {
  // Add the audio data chunk to the array
  audioDataChunks.push(e.data);
}

// This function will be called when the 'stop' event fires
function handleStop() {
  // Create a Blob from the audio data chunks
  var audioBlob = new Blob(audioDataChunks, {
    type: audioMimeType
  });

  // Get the stop time and calculate the duration
  var stopTime = Date.now();
  var duration = stopTime - window.startTime;

  // If the duration is greater than the threshold, upload the audio for transcription
  if (duration >= threshold) {
    // Upload the audio to the server for transcription
    EventBus.emit("saypi:userFinishedSpeaking", {
      duration: duration,
      blob: audioBlob
    });
  }

  // Clear the array for the next recording
  audioDataChunks = [];
}
function setupRecording(callback) {
  if (mediaRecorder) {
    return;
  }

  // Get a stream from the user's microphone
  navigator.mediaDevices.getUserMedia({
    audio: true
  }).then(function (stream) {
    if (!MediaRecorder.isTypeSupported(audioMimeType)) {
      // use MP4 for Safari
      audioMimeType = "audio/mp4";
    }
    // Create a new MediaRecorder object using the stream and specifying the MIME type
    var options = {
      mimeType: audioMimeType
    };
    mediaRecorder = new MediaRecorder(stream, options);

    // Listen for the 'dataavailable' event
    mediaRecorder.addEventListener("dataavailable", handleDataAvailable);

    // Listen for the 'stop' event
    mediaRecorder.addEventListener("stop", handleStop);
  }).then(function () {
    // Invoke the callback function
    if (typeof callback === "function") {
      callback();
    }
  })["catch"](function (err) {
    console.error("Error getting audio stream: " + err);
  });
}
function tearDownRecording() {
  // Check if the MediaRecorder is set up
  if (!mediaRecorder) {
    return;
  }

  // Stop any ongoing recording
  if (mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }

  // Remove the MediaRecorder's event listeners
  mediaRecorder.removeEventListener("dataavailable", handleDataAvailable);
  mediaRecorder.removeEventListener("stop", handleStop);

  // Clear the MediaRecorder variable
  mediaRecorder = null;
}

// To request recording, other modules can dispatch a custom event audio:startRecording
function startRecording() {
  // Check if the MediaRecorder is set up
  if (!mediaRecorder) {
    setupRecording(startRecording);
    return;
  }
  // Check if Pi is currently speaking and stop her audio
  audioOutputActor.send("pause");

  // Start recording
  mediaRecorder.start();

  // Record the start time
  window.startTime = Date.now();
  EventBus.emit("saypi:userSpeaking");
}

// To stop recording, other modules can dispatch a custom event audio:stopRecording
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    // Stop recording
    mediaRecorder.stop();

    // Record the stop time and calculate the duration
    var stopTime = Date.now();
    var duration = stopTime - window.startTime;

    // If the duration is less than the threshold, don't upload the audio for transcription
    if (duration < threshold) {
      console.log("Recording was too short, not uploading for transcription");
      EventBus.emit("saypi:userStoppedSpeaking", {
        duration: duration
      });
      audioOutputActor.send("play"); // resume Pi's audio
    } else {
      audioOutputActor.send("stop"); // cancel Pi's audio
    }
  }
}

/* These events are used to control/pass requests to the audio module from other modules */
function registerAudioCommands() {
  EventBus.on("audio:setupRecording", function (e) {
    setupRecording();
  });
  EventBus.on("audio:tearDownRecording", function (e) {
    tearDownRecording();
  });
  EventBus.on("audio:startRecording", function (e) {
    startRecording();
  });
  EventBus.on("audio:stopRecording", function (e) {
    stopRecording();
  });
  EventBus.on("audio:reload", function (e) {
    audioOutputActor.send("reload");
  });
}
registerAudioCommands();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZW50TW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc3RhdGUtbWFjaGluZXMvQXVkaW9PdXRwdXRNYWNoaW5lLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL0FjdG9yLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL01hY2hpbmUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvU3RhdGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvU3RhdGVOb2RlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL192aXJ0dWFsL190c2xpYi5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9hY3Rpb25UeXBlcy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9hY3Rpb25zLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2JlaGF2aW9ycy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvZGV2VG9vbHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvZW52aXJvbm1lbnQuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvaW50ZXJwcmV0ZXIuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvaW52b2tlVXRpbHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvbWFwU3RhdGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvbWF0Y2guanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvcmVnaXN0cnkuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvc2NoZWR1bGVyLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL3NjaGVtYS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9zZXJ2aWNlU2NvcGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvc3RhdGVVdGlscy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy90eXBlcy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy91dGlscy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvQXVkaW9Nb2R1bGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGlzU2FmYXJpKCkge1xuICByZXR1cm4gL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc01vYmlsZURldmljZSgpIHtcbiAgcmV0dXJuIChcbiAgICAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QoXG4gICAgICBuYXZpZ2F0b3IudXNlckFnZW50XG4gICAgKSB8fCB3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKS5tYXRjaGVzXG4gICk7XG59XG5cbi8vIFVzZSBsb2NhbFN0b3JhZ2UgdG8gcGVyc2lzdCB1c2VyIHByZWZlcmVuY2VcbmV4cG9ydCBmdW5jdGlvbiBpc01vYmlsZVZpZXcoKSB7XG4gIGNvbnN0IHVzZXJWaWV3UHJlZmVyZW5jZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidXNlclZpZXdQcmVmZXJlbmNlXCIpO1xuXG4gIGlmICh1c2VyVmlld1ByZWZlcmVuY2UpIHtcbiAgICByZXR1cm4gdXNlclZpZXdQcmVmZXJlbmNlID09PSBcIm1vYmlsZVwiO1xuICB9XG5cbiAgcmV0dXJuIGlzTW9iaWxlRGV2aWNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGl0TW9iaWxlTW9kZSgpIHtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ1c2VyVmlld1ByZWZlcmVuY2VcIiwgXCJkZXNrdG9wXCIpOyAvLyBTYXZlIHByZWZlcmVuY2VcblxuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJtb2JpbGUtdmlld1wiKTtcbiAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZGVza3RvcC12aWV3XCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW50ZXJNb2JpbGVNb2RlKCkge1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJWaWV3UHJlZmVyZW5jZVwiLCBcIm1vYmlsZVwiKTsgLy8gU2F2ZSBwcmVmZXJlbmNlXG5cbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZGVza3RvcC12aWV3XCIpO1xuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJtb2JpbGUtdmlld1wiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFVzZXJBZ2VudEZsYWdzKCkge1xuICBjb25zdCBpc0ZpcmVmb3hBbmRyb2lkID1cbiAgICAvRmlyZWZveC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvQW5kcm9pZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuICBpZiAoaXNGaXJlZm94QW5kcm9pZCkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImZpcmVmb3gtYW5kcm9pZFwiKTtcbiAgfVxuXG4gIGFkZERldmljZUZsYWdzKGVsZW1lbnQpO1xuICBhZGRWaWV3RmxhZ3MoZWxlbWVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGREZXZpY2VGbGFncyhlbGVtZW50KSB7XG4gIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibW9iaWxlLWRldmljZVwiKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVmlld0ZsYWdzKGVsZW1lbnQpIHtcbiAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibW9iaWxlLXZpZXdcIik7XG4gIH0gZWxzZSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwibW9iaWxlLXZpZXdcIik7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZGVza3RvcC12aWV3XCIpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVNYWNoaW5lLCBhc3NpZ24sIHJhaXNlIH0gZnJvbSBcInhzdGF0ZVwiO1xuaW1wb3J0IHsgaXNTYWZhcmksIGlzTW9iaWxlVmlldyB9IGZyb20gXCIuLi9Vc2VyQWdlbnRNb2R1bGVcIjtcblxuY29uc3QgRXZlbnRCdXMgPSB3aW5kb3cuRXZlbnRCdXM7XG5cbmNvbnN0IGF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJhdWRpb1wiKTtcbmlmICghYXVkaW9FbGVtZW50KSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJBdWRpbyBlbGVtZW50IG5vdCBmb3VuZCBpbiBvdXRwdXQgbWFjaGluZSFcIik7XG59XG5cbmV4cG9ydCBjb25zdCBhdWRpb091dHB1dE1hY2hpbmUgPSBjcmVhdGVNYWNoaW5lKFxuICB7XG4gICAgLyoqIEB4c3RhdGUtbGF5b3V0IE40SWdwZ0pnNW1ET0lDNVFFTUN1RUNXQjdBOHFnTGdBNEVCMEdFQU5tQU1RVmJJUURLK3lBVHZnTm9BTUF1b3FJU3l3TStiQUR0K0lBQjZJQWpBQ1lBckNRQXNBVGcwQU9BR3dCbUFPeGREWGViSUEwSUFKNklWMmxTVTJLdVhSU3BYN0Z1eldvQytQaTJpWXVBVEUrQ1IwREJoaVVOU0VGTWlXM0h4SUlJTENvbGdTS1RJSUt2SnFKUHF5WEdxMnVyTGFkb3BxMmhiV3VYWU9UaTV1SGw2Ky1pQ0IySGhFcEJHWTBiRm9zR0JKa21raTRwSTVlUVZGSldVVlZUVjFpUHI2MmlUYXpsd3FzdDVxaWh2YWZnSG9QU0g5OUlNeHNQaFloT01wa3hsWm9MUDVoY1dsZXNzcTFWcVZrUVNsa0pDVXprVUJ6MjJqVXpsMFp5NkYyQ2ZUQ2NRU1VSaWhCR1kxNEV5RVUweU0zV3hSSWNPMDhsaGJrMG14VW1qV3VYMHVoSXV4Y3VqVVRMMDJrMGlPNktOQ0pIUmxreDFIdWoyZUFnSmIySkNBV1pLNEZLcGROcDlPQkNBTThoWnUwVThua1huY3BWNXlONkFxRklyQVlnZ2tBbHFTbDAyeUpLNDhzVnBXVmRsVjlUeW11YWJPS08wVW1sa1JxQ0p0STJOUW93Z3NYaWlUeEx6dFJJZENDMDIwVUZOS0hrMEd0MERNODlrY3ptMHNtcWFrMFpkT25UNW9iUk9LallxZWNjbDZYdEh6azhrTVRWSzdPVldjVURJOFlJQnpnQldacTdJNjV4RFZ4ckVjZzFGWVlBR050ZUxla2p1ZGxOZE5QZHVjY0pGMHpRcHRuMHg0UmxlTjA1STljSWM0R3pEWW5FYnR1YmlkYkNBVUhjY1hkS05ON0RNREpBK2tXYVlISENhWitKMFloWUZhOEFwRlcwNzRpKzd4cmdnQUMwUUwxT2hXcXNqaGtMQnBjcUprSlFZQ0lZU3lHZkF5dGpLQWVrS3RKNDNqNGZ5MXlSTkVwSFNrbVNqS0I0K2lCa29CaUJtVWxIN0UwaGF5TzQxVEtveDFhQ2pHbUpzYXVPU2VGc1J6bEFlbFFhTG9CNlVmSW1naVM0SjZ5UG9hanNuWVVtWHVHa2J5YStLR3lMWllMa2pwelMyZm84ajlqcHFqTkRxbWdxRndzZ2FJb1ptRWRla0JXZVJjamFFWm5icUpTQUluQXkyaUtGeFdZR0lZOGkyRm1FRStFQUEgKi9cbiAgICBpZDogXCJhdWRpb091dHB1dFwiLFxuICAgIGNvbnRleHQ6IHsgdXNlclN0YXJ0ZWQ6IHRydWUsIGF1ZGlvRWxlbWVudDogYXVkaW9FbGVtZW50IH0sXG4gICAgaW5pdGlhbDogXCJpZGxlXCIsXG4gICAgc3RhdGVzOiB7XG4gICAgICBpZGxlOiB7XG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgbG9hZFN0YXJ0OiBcImxvYWRpbmdcIixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBsb2FkaW5nOiB7XG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgcGxheTogXCJwbGF5aW5nXCIsXG4gICAgICAgICAgcGF1c2U6IFwicGF1c2VkXCIsXG4gICAgICAgICAgc3RvcDogXCJzdG9wcGVkXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGVudHJ5OiB7XG4gICAgICAgICAgdHlwZTogXCJlbWl0RXZlbnRcIixcbiAgICAgICAgICBwYXJhbXM6IHsgZXZlbnROYW1lOiBcInNheXBpOnJlYWR5XCIgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwbGF5aW5nOiB7XG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgcGF1c2U6IFwicGF1c2VkXCIsXG4gICAgICAgICAgc3RvcDogXCJzdG9wcGVkXCIsXG4gICAgICAgICAgZW5kZWQ6IFwic3RvcHBlZFwiLFxuICAgICAgICB9LFxuICAgICAgICBlbnRyeTogW1xuICAgICAgICAgIHsgdHlwZTogXCJhdXRvUGF1c2VTYWZhcmlcIiB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFwiZW1pdEV2ZW50XCIsXG4gICAgICAgICAgICBwYXJhbXM6IHsgZXZlbnROYW1lOiBcInNheXBpOnBpU3BlYWtpbmdcIiB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgcGF1c2VkOiB7XG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgcGxheTogXCJwbGF5aW5nXCIsXG4gICAgICAgICAgc3RvcDogXCJzdG9wcGVkXCIsXG4gICAgICAgICAgcmVsb2FkOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwibG9hZGluZ1wiLFxuXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogYFJlbG9hZCB0aGUgYXVkaW8gc3RyZWFtIGZvciBTYWZhcmkuXG5UaGlzIGlzIHRoZSBvbmx5IGNvbW1hbmQgdGhhdCBleHRlcm5hbCBtb2R1bGVzIGNhbiBzZW5kIHRoZSBtYWNoaW5lLmAsXG5cbiAgICAgICAgICAgIGFjdGlvbjogYXNzaWduKChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICAgICAgICBjb250ZXh0LmF1ZGlvRWxlbWVudC5sb2FkKCk7XG4gICAgICAgICAgICAgIGNvbnRleHQuYXVkaW9FbGVtZW50LnBsYXkoKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1c2VyU3RhcnRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhdWRpb0VsZW1lbnQ6IGNvbnRleHQuYXVkaW9FbGVtZW50LFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSksXG5cbiAgICAgICAgICAgIGNvbmQ6IFwiaXNTYWZhcmlNb2JpbGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBlbnRyeToge1xuICAgICAgICAgIHR5cGU6IFwiZW1pdEV2ZW50XCIsXG4gICAgICAgICAgcGFyYW1zOiB7IGV2ZW50TmFtZTogXCJzYXlwaTpwYXVzZVwiIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc3RvcHBlZDoge1xuICAgICAgICBvbjoge1xuICAgICAgICAgIGxvYWRTdGFydDoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcImxvYWRpbmdcIixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgRmlyZWQgd2hlbiB0aGUgYXVkaW8gZWxlbWVudCdzIHNyYyBhdHRyaWJ1dGUgY2hhbmdlcyB3aXRoIGEgbmV3IHJlc3BvbnNlIHRyYWNrLmAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgZW50cnk6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBcImVtaXRFdmVudFwiLFxuICAgICAgICAgICAgcGFyYW1zOiB7IGV2ZW50TmFtZTogXCJzYXlwaTpwaVN0b3BwZWRTcGVha2luZ1wiIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhc3NpZ24oKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyB1c2VyU3RhcnRlZDogZmFsc2UsIGF1ZGlvRWxlbWVudDogY29udGV4dC5hdWRpb0VsZW1lbnQgfTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBcInNlZWtUb0VuZFwiLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzOiB0cnVlLFxuICAgIHByZXNlcnZlQWN0aW9uT3JkZXI6IHRydWUsXG4gIH0sXG4gIHtcbiAgICBhY3Rpb25zOiB7XG4gICAgICBlbWl0RXZlbnQ6IChjb250ZXh0LCBldmVudCwgeyBhY3Rpb24gfSkgPT4ge1xuICAgICAgICBFdmVudEJ1cy5lbWl0KGFjdGlvbi5wYXJhbXMuZXZlbnROYW1lKTtcbiAgICAgIH0sXG4gICAgICBhdXRvUGF1c2VTYWZhcmk6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBpZiAoIWlzU2FmYXJpKCkgfHwgIWlzTW9iaWxlVmlldygpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb250ZXh0LnVzZXJTdGFydGVkKSB7XG4gICAgICAgICAgcmFpc2UoXCJwYXVzZVwiKTsgLy8gcmFpc2UgYW5kIHNlbmQgYXJlIGF2YWlsYWJsZSBpbiB4c3RhdGUgYnV0IG5vdCBpbiBAeHN0YXRlL2ZzbVxuICAgICAgICAgIC8vY29udGV4dC5hdWRpb0VsZW1lbnQucGF1c2UoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNlZWtUb0VuZDogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGF1ZGlvID0gY29udGV4dC5hdWRpb0VsZW1lbnQ7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhdWRpby5kdXJhdGlvbiAmJlxuICAgICAgICAgICFhdWRpby5lbmRlZCAmJlxuICAgICAgICAgIGF1ZGlvLmN1cnJlbnRUaW1lIDwgYXVkaW8uZHVyYXRpb25cbiAgICAgICAgKSB7XG4gICAgICAgICAgYXVkaW8uY3VycmVudFRpbWUgPSBhdWRpby5kdXJhdGlvbjsgLy8gc2VlayB0aGUgYXVkaW8gdG8gdGhlIGVuZFxuICAgICAgICAgIGF1ZGlvLnBsYXkoKTsgLy8gdHJpZ2dlciB0aGUgZW5kZWQgZXZlbnRcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICAgIGd1YXJkczoge1xuICAgICAgaXNTYWZhcmlNb2JpbGU6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICByZXR1cm4gaXNTYWZhcmkoKSAmJiBpc01vYmlsZVZpZXcoKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfVxuKTtcbiIsImltcG9ydCB7IF9fYXNzaWduIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgc3ltYm9sT2JzZXJ2YWJsZSwgdG9JbnZva2VTb3VyY2UsIG1hcENvbnRleHQsIGlzTWFjaGluZSB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgcHJvdmlkZSB9IGZyb20gJy4vc2VydmljZVNjb3BlLmpzJztcblxuZnVuY3Rpb24gY3JlYXRlTnVsbEFjdG9yKGlkKSB7XG4gIHZhciBfYTtcblxuICByZXR1cm4gX2EgPSB7XG4gICAgaWQ6IGlkLFxuICAgIHNlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgfSxcbiAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0sXG4gICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogaWRcbiAgICAgIH07XG4gICAgfVxuICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSwgX2E7XG59XG4vKipcclxuICogQ3JlYXRlcyBhIGRlZmVycmVkIGFjdG9yIHRoYXQgaXMgYWJsZSB0byBiZSBpbnZva2VkIGdpdmVuIHRoZSBwcm92aWRlZFxyXG4gKiBpbnZvY2F0aW9uIGluZm9ybWF0aW9uIGluIGl0cyBgLm1ldGFgIHZhbHVlLlxyXG4gKlxyXG4gKiBAcGFyYW0gaW52b2tlRGVmaW5pdGlvbiBUaGUgbWV0YSBpbmZvcm1hdGlvbiBuZWVkZWQgdG8gaW52b2tlIHRoZSBhY3Rvci5cclxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUludm9jYWJsZUFjdG9yKGludm9rZURlZmluaXRpb24sIG1hY2hpbmUsIGNvbnRleHQsIF9ldmVudCkge1xuICB2YXIgX2E7XG5cbiAgdmFyIGludm9rZVNyYyA9IHRvSW52b2tlU291cmNlKGludm9rZURlZmluaXRpb24uc3JjKTtcbiAgdmFyIHNlcnZpY2VDcmVhdG9yID0gKF9hID0gbWFjaGluZSA9PT0gbnVsbCB8fCBtYWNoaW5lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBtYWNoaW5lLm9wdGlvbnMuc2VydmljZXMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVtpbnZva2VTcmMudHlwZV07XG4gIHZhciByZXNvbHZlZERhdGEgPSBpbnZva2VEZWZpbml0aW9uLmRhdGEgPyBtYXBDb250ZXh0KGludm9rZURlZmluaXRpb24uZGF0YSwgY29udGV4dCwgX2V2ZW50KSA6IHVuZGVmaW5lZDtcbiAgdmFyIHRlbXBBY3RvciA9IHNlcnZpY2VDcmVhdG9yID8gY3JlYXRlRGVmZXJyZWRBY3RvcihzZXJ2aWNlQ3JlYXRvciwgaW52b2tlRGVmaW5pdGlvbi5pZCwgcmVzb2x2ZWREYXRhKSA6IGNyZWF0ZU51bGxBY3RvcihpbnZva2VEZWZpbml0aW9uLmlkKTsgLy8gQHRzLWlnbm9yZVxuXG4gIHRlbXBBY3Rvci5tZXRhID0gaW52b2tlRGVmaW5pdGlvbjtcbiAgcmV0dXJuIHRlbXBBY3Rvcjtcbn1cbmZ1bmN0aW9uIGNyZWF0ZURlZmVycmVkQWN0b3IoZW50aXR5LCBpZCwgZGF0YSkge1xuICB2YXIgdGVtcEFjdG9yID0gY3JlYXRlTnVsbEFjdG9yKGlkKTsgLy8gQHRzLWlnbm9yZVxuXG4gIHRlbXBBY3Rvci5kZWZlcnJlZCA9IHRydWU7XG5cbiAgaWYgKGlzTWFjaGluZShlbnRpdHkpKSB7XG4gICAgLy8gXCJtdXRlXCIgdGhlIGV4aXN0aW5nIHNlcnZpY2Ugc2NvcGUgc28gcG90ZW50aWFsIHNwYXduZWQgYWN0b3JzIHdpdGhpbiB0aGUgYC5pbml0aWFsU3RhdGVgIHN0YXkgZGVmZXJyZWQgaGVyZVxuICAgIHZhciBpbml0aWFsU3RhdGVfMSA9IHRlbXBBY3Rvci5zdGF0ZSA9IHByb3ZpZGUodW5kZWZpbmVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gKGRhdGEgPyBlbnRpdHkud2l0aENvbnRleHQoZGF0YSkgOiBlbnRpdHkpLmluaXRpYWxTdGF0ZTtcbiAgICB9KTtcblxuICAgIHRlbXBBY3Rvci5nZXRTbmFwc2hvdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpbml0aWFsU3RhdGVfMTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHRlbXBBY3Rvcjtcbn1cbmZ1bmN0aW9uIGlzQWN0b3IoaXRlbSkge1xuICB0cnkge1xuICAgIHJldHVybiB0eXBlb2YgaXRlbS5zZW5kID09PSAnZnVuY3Rpb24nO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5mdW5jdGlvbiBpc1NwYXduZWRBY3RvcihpdGVtKSB7XG4gIHJldHVybiBpc0FjdG9yKGl0ZW0pICYmICdpZCcgaW4gaXRlbTtcbn0gLy8gVE9ETzogcmVmYWN0b3IgdGhlIHJldHVybiB0eXBlLCB0aGlzIGNvdWxkIGJlIHdyaXR0ZW4gaW4gYSBiZXR0ZXIgd2F5IGJ1dCBpdCdzIGJlc3QgdG8gYXZvaWQgdW5uZWNjZXNzYXJ5IGJyZWFraW5nIGNoYW5nZXMgbm93XG5cbmZ1bmN0aW9uIHRvQWN0b3JSZWYoYWN0b3JSZWZMaWtlKSB7XG4gIHZhciBfYTtcblxuICByZXR1cm4gX19hc3NpZ24oKF9hID0ge1xuICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgaWQ6ICdhbm9ueW1vdXMnLFxuICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sIF9hKSwgYWN0b3JSZWZMaWtlKTtcbn1cblxuZXhwb3J0IHsgY3JlYXRlRGVmZXJyZWRBY3RvciwgY3JlYXRlSW52b2NhYmxlQWN0b3IsIGNyZWF0ZU51bGxBY3RvciwgaXNBY3RvciwgaXNTcGF3bmVkQWN0b3IsIHRvQWN0b3JSZWYgfTtcbiIsImltcG9ydCB7IFN0YXRlTm9kZSB9IGZyb20gJy4vU3RhdGVOb2RlLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcblxudmFyIHdhcm5lZCA9IGZhbHNlO1xuZnVuY3Rpb24gTWFjaGluZShjb25maWcsIG9wdGlvbnMsIGluaXRpYWxDb250ZXh0KSB7XG4gIGlmIChpbml0aWFsQ29udGV4dCA9PT0gdm9pZCAwKSB7XG4gICAgaW5pdGlhbENvbnRleHQgPSBjb25maWcuY29udGV4dDtcbiAgfVxuXG4gIHJldHVybiBuZXcgU3RhdGVOb2RlKGNvbmZpZywgb3B0aW9ucywgaW5pdGlhbENvbnRleHQpO1xufVxuZnVuY3Rpb24gY3JlYXRlTWFjaGluZShjb25maWcsIG9wdGlvbnMpIHtcbiAgaWYgKCFJU19QUk9EVUNUSU9OICYmICEoJ3ByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzJyBpbiBjb25maWcpICYmICF3YXJuZWQpIHtcbiAgICB3YXJuZWQgPSB0cnVlO1xuICAgIGNvbnNvbGUud2FybignSXQgaXMgaGlnaGx5IHJlY29tbWVuZGVkIHRvIHNldCBgcHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHNgIHRvIGB0cnVlYCB3aGVuIHVzaW5nIGBjcmVhdGVNYWNoaW5lYC4gaHR0cHM6Ly94c3RhdGUuanMub3JnL2RvY3MvZ3VpZGVzL2FjdGlvbnMuaHRtbCcpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTdGF0ZU5vZGUoY29uZmlnLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IHsgTWFjaGluZSwgY3JlYXRlTWFjaGluZSB9O1xuIiwiaW1wb3J0IHsgX19hc3NpZ24sIF9fc3ByZWFkQXJyYXksIF9fcmVhZCwgX19yZXN0IH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgRU1QVFlfQUNUSVZJVFlfTUFQIH0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuaW1wb3J0IHsgaXNTdHJpbmcsIG1hdGNoZXNTdGF0ZSwgd2FybiB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgZ2V0TWV0YSwgbmV4dEV2ZW50cyB9IGZyb20gJy4vc3RhdGVVdGlscy5qcyc7XG5pbXBvcnQgeyBpbml0RXZlbnQgfSBmcm9tICcuL2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuXG5mdW5jdGlvbiBzdGF0ZVZhbHVlc0VxdWFsKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChhID09PSB1bmRlZmluZWQgfHwgYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGlzU3RyaW5nKGEpIHx8IGlzU3RyaW5nKGIpKSB7XG4gICAgcmV0dXJuIGEgPT09IGI7XG4gIH1cblxuICB2YXIgYUtleXMgPSBPYmplY3Qua2V5cyhhKTtcbiAgdmFyIGJLZXlzID0gT2JqZWN0LmtleXMoYik7XG4gIHJldHVybiBhS2V5cy5sZW5ndGggPT09IGJLZXlzLmxlbmd0aCAmJiBhS2V5cy5ldmVyeShmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHN0YXRlVmFsdWVzRXF1YWwoYVtrZXldLCBiW2tleV0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGlzU3RhdGVDb25maWcoc3RhdGUpIHtcbiAgaWYgKHR5cGVvZiBzdGF0ZSAhPT0gJ29iamVjdCcgfHwgc3RhdGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gJ3ZhbHVlJyBpbiBzdGF0ZSAmJiAnX2V2ZW50JyBpbiBzdGF0ZTtcbn1cbi8qKlxyXG4gKiBAZGVwcmVjYXRlZCBVc2UgYGlzU3RhdGVDb25maWcob2JqZWN0KWAgb3IgYHN0YXRlIGluc3RhbmNlb2YgU3RhdGVgIGluc3RlYWQuXHJcbiAqL1xuXG52YXIgaXNTdGF0ZSA9IGlzU3RhdGVDb25maWc7XG5mdW5jdGlvbiBiaW5kQWN0aW9uVG9TdGF0ZShhY3Rpb24sIHN0YXRlKSB7XG4gIHZhciBleGVjID0gYWN0aW9uLmV4ZWM7XG5cbiAgdmFyIGJvdW5kQWN0aW9uID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbiksIHtcbiAgICBleGVjOiBleGVjICE9PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZXhlYyhzdGF0ZS5jb250ZXh0LCBzdGF0ZS5ldmVudCwge1xuICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICBfZXZlbnQ6IHN0YXRlLl9ldmVudFxuICAgICAgfSk7XG4gICAgfSA6IHVuZGVmaW5lZFxuICB9KTtcblxuICByZXR1cm4gYm91bmRBY3Rpb247XG59XG5cbnZhciBTdGF0ZSA9XG4vKiNfX1BVUkVfXyovXG5cbi8qKiBAY2xhc3MgKi9cbmZ1bmN0aW9uICgpIHtcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBTdGF0ZSBpbnN0YW5jZS5cclxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIHN0YXRlIHZhbHVlXHJcbiAgICogQHBhcmFtIGNvbnRleHQgVGhlIGV4dGVuZGVkIHN0YXRlXHJcbiAgICogQHBhcmFtIGhpc3RvcnlWYWx1ZSBUaGUgdHJlZSByZXByZXNlbnRpbmcgaGlzdG9yaWNhbCB2YWx1ZXMgb2YgdGhlIHN0YXRlIG5vZGVzXHJcbiAgICogQHBhcmFtIGhpc3RvcnkgVGhlIHByZXZpb3VzIHN0YXRlXHJcbiAgICogQHBhcmFtIGFjdGlvbnMgQW4gYXJyYXkgb2YgYWN0aW9uIG9iamVjdHMgdG8gZXhlY3V0ZSBhcyBzaWRlLWVmZmVjdHNcclxuICAgKiBAcGFyYW0gYWN0aXZpdGllcyBBIG1hcHBpbmcgb2YgYWN0aXZpdGllcyBhbmQgd2hldGhlciB0aGV5IGFyZSBzdGFydGVkIChgdHJ1ZWApIG9yIHN0b3BwZWQgKGBmYWxzZWApLlxyXG4gICAqIEBwYXJhbSBtZXRhXHJcbiAgICogQHBhcmFtIGV2ZW50cyBJbnRlcm5hbCBldmVudCBxdWV1ZS4gU2hvdWxkIGJlIGVtcHR5IHdpdGggcnVuLXRvLWNvbXBsZXRpb24gc2VtYW50aWNzLlxyXG4gICAqIEBwYXJhbSBjb25maWd1cmF0aW9uXHJcbiAgICovXG4gIGZ1bmN0aW9uIFN0YXRlKGNvbmZpZykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgX2E7XG5cbiAgICB0aGlzLmFjdGlvbnMgPSBbXTtcbiAgICB0aGlzLmFjdGl2aXRpZXMgPSBFTVBUWV9BQ1RJVklUWV9NQVA7XG4gICAgdGhpcy5tZXRhID0ge307XG4gICAgdGhpcy5ldmVudHMgPSBbXTtcbiAgICB0aGlzLnZhbHVlID0gY29uZmlnLnZhbHVlO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbmZpZy5jb250ZXh0O1xuICAgIHRoaXMuX2V2ZW50ID0gY29uZmlnLl9ldmVudDtcbiAgICB0aGlzLl9zZXNzaW9uaWQgPSBjb25maWcuX3Nlc3Npb25pZDtcbiAgICB0aGlzLmV2ZW50ID0gdGhpcy5fZXZlbnQuZGF0YTtcbiAgICB0aGlzLmhpc3RvcnlWYWx1ZSA9IGNvbmZpZy5oaXN0b3J5VmFsdWU7XG4gICAgdGhpcy5oaXN0b3J5ID0gY29uZmlnLmhpc3Rvcnk7XG4gICAgdGhpcy5hY3Rpb25zID0gY29uZmlnLmFjdGlvbnMgfHwgW107XG4gICAgdGhpcy5hY3Rpdml0aWVzID0gY29uZmlnLmFjdGl2aXRpZXMgfHwgRU1QVFlfQUNUSVZJVFlfTUFQO1xuICAgIHRoaXMubWV0YSA9IGdldE1ldGEoY29uZmlnLmNvbmZpZ3VyYXRpb24pO1xuICAgIHRoaXMuZXZlbnRzID0gY29uZmlnLmV2ZW50cyB8fCBbXTtcbiAgICB0aGlzLm1hdGNoZXMgPSB0aGlzLm1hdGNoZXMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRvU3RyaW5ncyA9IHRoaXMudG9TdHJpbmdzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlnLmNvbmZpZ3VyYXRpb247XG4gICAgdGhpcy50cmFuc2l0aW9ucyA9IGNvbmZpZy50cmFuc2l0aW9ucztcbiAgICB0aGlzLmNoaWxkcmVuID0gY29uZmlnLmNoaWxkcmVuO1xuICAgIHRoaXMuZG9uZSA9ICEhY29uZmlnLmRvbmU7XG4gICAgdGhpcy50YWdzID0gKF9hID0gQXJyYXkuaXNBcnJheShjb25maWcudGFncykgPyBuZXcgU2V0KGNvbmZpZy50YWdzKSA6IGNvbmZpZy50YWdzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBuZXcgU2V0KCk7XG4gICAgdGhpcy5tYWNoaW5lID0gY29uZmlnLm1hY2hpbmU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICduZXh0RXZlbnRzJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXh0RXZlbnRzKF90aGlzLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgU3RhdGUgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBgc3RhdGVWYWx1ZWAgYW5kIGBjb250ZXh0YC5cclxuICAgKiBAcGFyYW0gc3RhdGVWYWx1ZVxyXG4gICAqIEBwYXJhbSBjb250ZXh0XHJcbiAgICovXG5cblxuICBTdGF0ZS5mcm9tID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIGNvbnRleHQpIHtcbiAgICBpZiAoc3RhdGVWYWx1ZSBpbnN0YW5jZW9mIFN0YXRlKSB7XG4gICAgICBpZiAoc3RhdGVWYWx1ZS5jb250ZXh0ICE9PSBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RhdGUoe1xuICAgICAgICAgIHZhbHVlOiBzdGF0ZVZhbHVlLnZhbHVlLFxuICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICAgICAgX2V2ZW50OiBzdGF0ZVZhbHVlLl9ldmVudCxcbiAgICAgICAgICBfc2Vzc2lvbmlkOiBudWxsLFxuICAgICAgICAgIGhpc3RvcnlWYWx1ZTogc3RhdGVWYWx1ZS5oaXN0b3J5VmFsdWUsXG4gICAgICAgICAgaGlzdG9yeTogc3RhdGVWYWx1ZS5oaXN0b3J5LFxuICAgICAgICAgIGFjdGlvbnM6IFtdLFxuICAgICAgICAgIGFjdGl2aXRpZXM6IHN0YXRlVmFsdWUuYWN0aXZpdGllcyxcbiAgICAgICAgICBtZXRhOiB7fSxcbiAgICAgICAgICBldmVudHM6IFtdLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IFtdLFxuICAgICAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgICAgICBjaGlsZHJlbjoge31cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGF0ZVZhbHVlO1xuICAgIH1cblxuICAgIHZhciBfZXZlbnQgPSBpbml0RXZlbnQ7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZSh7XG4gICAgICB2YWx1ZTogc3RhdGVWYWx1ZSxcbiAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICBfZXZlbnQ6IF9ldmVudCxcbiAgICAgIF9zZXNzaW9uaWQ6IG51bGwsXG4gICAgICBoaXN0b3J5VmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgIGhpc3Rvcnk6IHVuZGVmaW5lZCxcbiAgICAgIGFjdGlvbnM6IFtdLFxuICAgICAgYWN0aXZpdGllczogdW5kZWZpbmVkLFxuICAgICAgbWV0YTogdW5kZWZpbmVkLFxuICAgICAgZXZlbnRzOiBbXSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IFtdLFxuICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgY2hpbGRyZW46IHt9XG4gICAgfSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgU3RhdGUgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBgY29uZmlnYC5cclxuICAgKiBAcGFyYW0gY29uZmlnIFRoZSBzdGF0ZSBjb25maWdcclxuICAgKi9cblxuXG4gIFN0YXRlLmNyZWF0ZSA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICByZXR1cm4gbmV3IFN0YXRlKGNvbmZpZyk7XG4gIH07XG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgYFN0YXRlYCBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGBzdGF0ZVZhbHVlYCBhbmQgYGNvbnRleHRgIHdpdGggbm8gYWN0aW9ucyAoc2lkZS1lZmZlY3RzKS5cclxuICAgKiBAcGFyYW0gc3RhdGVWYWx1ZVxyXG4gICAqIEBwYXJhbSBjb250ZXh0XHJcbiAgICovXG5cblxuICBTdGF0ZS5pbmVydCA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBjb250ZXh0KSB7XG4gICAgaWYgKHN0YXRlVmFsdWUgaW5zdGFuY2VvZiBTdGF0ZSkge1xuICAgICAgaWYgKCFzdGF0ZVZhbHVlLmFjdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZVZhbHVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2V2ZW50ID0gaW5pdEV2ZW50O1xuICAgICAgcmV0dXJuIG5ldyBTdGF0ZSh7XG4gICAgICAgIHZhbHVlOiBzdGF0ZVZhbHVlLnZhbHVlLFxuICAgICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgICBfZXZlbnQ6IF9ldmVudCxcbiAgICAgICAgX3Nlc3Npb25pZDogbnVsbCxcbiAgICAgICAgaGlzdG9yeVZhbHVlOiBzdGF0ZVZhbHVlLmhpc3RvcnlWYWx1ZSxcbiAgICAgICAgaGlzdG9yeTogc3RhdGVWYWx1ZS5oaXN0b3J5LFxuICAgICAgICBhY3Rpdml0aWVzOiBzdGF0ZVZhbHVlLmFjdGl2aXRpZXMsXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IHN0YXRlVmFsdWUuY29uZmlndXJhdGlvbixcbiAgICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgICBjaGlsZHJlbjoge31cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBTdGF0ZS5mcm9tKHN0YXRlVmFsdWUsIGNvbnRleHQpO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB0aGUgc3RyaW5nIGxlYWYgc3RhdGUgbm9kZSBwYXRocy5cclxuICAgKiBAcGFyYW0gc3RhdGVWYWx1ZVxyXG4gICAqIEBwYXJhbSBkZWxpbWl0ZXIgVGhlIGNoYXJhY3RlcihzKSB0aGF0IHNlcGFyYXRlIGVhY2ggc3VicGF0aCBpbiB0aGUgc3RyaW5nIHN0YXRlIG5vZGUgcGF0aC5cclxuICAgKi9cblxuXG4gIFN0YXRlLnByb3RvdHlwZS50b1N0cmluZ3MgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgZGVsaW1pdGVyKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmIChzdGF0ZVZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHN0YXRlVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgIH1cblxuICAgIGlmIChkZWxpbWl0ZXIgPT09IHZvaWQgMCkge1xuICAgICAgZGVsaW1pdGVyID0gJy4nO1xuICAgIH1cblxuICAgIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgICAgcmV0dXJuIFtzdGF0ZVZhbHVlXTtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWVLZXlzID0gT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlS2V5cy5jb25jYXQuYXBwbHkodmFsdWVLZXlzLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQodmFsdWVLZXlzLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gX3RoaXMudG9TdHJpbmdzKHN0YXRlVmFsdWVba2V5XSwgZGVsaW1pdGVyKS5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuIGtleSArIGRlbGltaXRlciArIHM7XG4gICAgICB9KTtcbiAgICB9KSksIGZhbHNlKSk7XG4gIH07XG5cbiAgU3RhdGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX2EgPSB0aGlzO1xuICAgICAgICBfYS5jb25maWd1cmF0aW9uO1xuICAgICAgICBfYS50cmFuc2l0aW9ucztcbiAgICAgICAgdmFyIHRhZ3MgPSBfYS50YWdzO1xuICAgICAgICBfYS5tYWNoaW5lO1xuICAgICAgICB2YXIganNvblZhbHVlcyA9IF9fcmVzdChfYSwgW1wiY29uZmlndXJhdGlvblwiLCBcInRyYW5zaXRpb25zXCIsIFwidGFnc1wiLCBcIm1hY2hpbmVcIl0pO1xuXG4gICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBqc29uVmFsdWVzKSwge1xuICAgICAgdGFnczogQXJyYXkuZnJvbSh0YWdzKVxuICAgIH0pO1xuICB9O1xuXG4gIFN0YXRlLnByb3RvdHlwZS5tYXRjaGVzID0gZnVuY3Rpb24gKHBhcmVudFN0YXRlVmFsdWUpIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0YXRlKHBhcmVudFN0YXRlVmFsdWUsIHRoaXMudmFsdWUpO1xuICB9O1xuICAvKipcclxuICAgKiBXaGV0aGVyIHRoZSBjdXJyZW50IHN0YXRlIGNvbmZpZ3VyYXRpb24gaGFzIGEgc3RhdGUgbm9kZSB3aXRoIHRoZSBzcGVjaWZpZWQgYHRhZ2AuXHJcbiAgICogQHBhcmFtIHRhZ1xyXG4gICAqL1xuXG5cbiAgU3RhdGUucHJvdG90eXBlLmhhc1RhZyA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgICByZXR1cm4gdGhpcy50YWdzLmhhcyh0YWcpO1xuICB9O1xuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgc2VuZGluZyB0aGUgYGV2ZW50YCB3aWxsIGNhdXNlIGEgbm9uLWZvcmJpZGRlbiB0cmFuc2l0aW9uXHJcbiAgICogdG8gYmUgc2VsZWN0ZWQsIGV2ZW4gaWYgdGhlIHRyYW5zaXRpb25zIGhhdmUgbm8gYWN0aW9ucyBub3JcclxuICAgKiBjaGFuZ2UgdGhlIHN0YXRlIHZhbHVlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byB0ZXN0XHJcbiAgICogQHJldHVybnMgV2hldGhlciB0aGUgZXZlbnQgd2lsbCBjYXVzZSBhIHRyYW5zaXRpb25cclxuICAgKi9cblxuXG4gIFN0YXRlLnByb3RvdHlwZS5jYW4gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgX2E7XG5cbiAgICBpZiAoSVNfUFJPRFVDVElPTikge1xuICAgICAgd2FybighIXRoaXMubWFjaGluZSwgXCJzdGF0ZS5jYW4oLi4uKSB1c2VkIG91dHNpZGUgb2YgYSBtYWNoaW5lLWNyZWF0ZWQgU3RhdGUgb2JqZWN0OyB0aGlzIHdpbGwgYWx3YXlzIHJldHVybiBmYWxzZS5cIik7XG4gICAgfVxuXG4gICAgdmFyIHRyYW5zaXRpb25EYXRhID0gKF9hID0gdGhpcy5tYWNoaW5lKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0VHJhbnNpdGlvbkRhdGEodGhpcywgZXZlbnQpO1xuICAgIHJldHVybiAhISh0cmFuc2l0aW9uRGF0YSA9PT0gbnVsbCB8fCB0cmFuc2l0aW9uRGF0YSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdHJhbnNpdGlvbkRhdGEudHJhbnNpdGlvbnMubGVuZ3RoKSAmJiAvLyBDaGVjayB0aGF0IGF0IGxlYXN0IG9uZSB0cmFuc2l0aW9uIGlzIG5vdCBmb3JiaWRkZW5cbiAgICB0cmFuc2l0aW9uRGF0YS50cmFuc2l0aW9ucy5zb21lKGZ1bmN0aW9uICh0KSB7XG4gICAgICByZXR1cm4gdC50YXJnZXQgIT09IHVuZGVmaW5lZCB8fCB0LmFjdGlvbnMubGVuZ3RoO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBTdGF0ZTtcbn0oKTtcblxuZXhwb3J0IHsgU3RhdGUsIGJpbmRBY3Rpb25Ub1N0YXRlLCBpc1N0YXRlLCBpc1N0YXRlQ29uZmlnLCBzdGF0ZVZhbHVlc0VxdWFsIH07XG4iLCJpbXBvcnQgeyBfX2Fzc2lnbiwgX19zcHJlYWRBcnJheSwgX19yZWFkLCBfX3ZhbHVlcywgX19yZXN0IH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiwgbWFwVmFsdWVzLCBpc0FycmF5LCBmbGF0dGVuLCB0b0FycmF5LCB0b1N0YXRlVmFsdWUsIGlzU3RyaW5nLCBnZXRFdmVudFR5cGUsIHRvU0NYTUxFdmVudCwgbWF0Y2hlc1N0YXRlLCBwYXRoLCBldmFsdWF0ZUd1YXJkLCBtYXBDb250ZXh0LCBpc1JhaXNhYmxlQWN0aW9uLCBwYXRoVG9TdGF0ZVZhbHVlLCBpc0J1aWx0SW5FdmVudCwgcGFydGl0aW9uLCB1cGRhdGVIaXN0b3J5VmFsdWUsIHRvU3RhdGVQYXRoLCBtYXBGaWx0ZXJWYWx1ZXMsIHdhcm4sIHRvU3RhdGVQYXRocywgbmVzdGVkUGF0aCwgbm9ybWFsaXplVGFyZ2V0LCB0b0d1YXJkLCB0b1RyYW5zaXRpb25Db25maWdBcnJheSwgaXNNYWNoaW5lLCBjcmVhdGVJbnZva2VJZCB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgU3RhdGUsIHN0YXRlVmFsdWVzRXF1YWwgfSBmcm9tICcuL1N0YXRlLmpzJztcbmltcG9ydCB7IHN0YXJ0IGFzIHN0YXJ0JDEsIHN0b3AgYXMgc3RvcCQxLCBpbnZva2UsIHVwZGF0ZSwgbnVsbEV2ZW50IH0gZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5pbXBvcnQgeyBkb25lLCBzdGFydCwgdG9BY3Rpb25PYmplY3RzLCByYWlzZSwgc3RvcCwgcmVzb2x2ZUFjdGlvbnMsIGRvbmVJbnZva2UsIGVycm9yLCB0b0FjdGlvbk9iamVjdCwgdG9BY3Rpdml0eURlZmluaXRpb24sIGFmdGVyLCBzZW5kLCBjYW5jZWwsIGluaXRFdmVudCB9IGZyb20gJy4vYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5pbXBvcnQgeyBTVEFURV9ERUxJTUlURVIgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgeyBnZXRBbGxTdGF0ZU5vZGVzLCBnZXRDb25maWd1cmF0aW9uLCBpc0luRmluYWxTdGF0ZSwgZ2V0VGFnc0Zyb21Db25maWd1cmF0aW9uLCBoYXMsIGdldENoaWxkcmVuLCBnZXRWYWx1ZSwgaXNMZWFmTm9kZSwgZ2V0QWxsQ2hpbGRyZW4gfSBmcm9tICcuL3N0YXRlVXRpbHMuanMnO1xuaW1wb3J0IHsgY3JlYXRlSW52b2NhYmxlQWN0b3IgfSBmcm9tICcuL0FjdG9yLmpzJztcbmltcG9ydCB7IHRvSW52b2tlRGVmaW5pdGlvbiB9IGZyb20gJy4vaW52b2tlVXRpbHMuanMnO1xuXG52YXIgTlVMTF9FVkVOVCA9ICcnO1xudmFyIFNUQVRFX0lERU5USUZJRVIgPSAnIyc7XG52YXIgV0lMRENBUkQgPSAnKic7XG52YXIgRU1QVFlfT0JKRUNUID0ge307XG5cbnZhciBpc1N0YXRlSWQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHJbMF0gPT09IFNUQVRFX0lERU5USUZJRVI7XG59O1xuXG52YXIgY3JlYXRlRGVmYXVsdE9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgYWN0aW9uczoge30sXG4gICAgZ3VhcmRzOiB7fSxcbiAgICBzZXJ2aWNlczoge30sXG4gICAgYWN0aXZpdGllczoge30sXG4gICAgZGVsYXlzOiB7fVxuICB9O1xufTtcblxudmFyIHZhbGlkYXRlQXJyYXlpZmllZFRyYW5zaXRpb25zID0gZnVuY3Rpb24gKHN0YXRlTm9kZSwgZXZlbnQsIHRyYW5zaXRpb25zKSB7XG4gIHZhciBoYXNOb25MYXN0VW5ndWFyZGVkVGFyZ2V0ID0gdHJhbnNpdGlvbnMuc2xpY2UoMCwgLTEpLnNvbWUoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICByZXR1cm4gISgnY29uZCcgaW4gdHJhbnNpdGlvbikgJiYgISgnaW4nIGluIHRyYW5zaXRpb24pICYmIChpc1N0cmluZyh0cmFuc2l0aW9uLnRhcmdldCkgfHwgaXNNYWNoaW5lKHRyYW5zaXRpb24udGFyZ2V0KSk7XG4gIH0pO1xuICB2YXIgZXZlbnRUZXh0ID0gZXZlbnQgPT09IE5VTExfRVZFTlQgPyAndGhlIHRyYW5zaWVudCBldmVudCcgOiBcImV2ZW50ICdcIi5jb25jYXQoZXZlbnQsIFwiJ1wiKTtcbiAgd2FybighaGFzTm9uTGFzdFVuZ3VhcmRlZFRhcmdldCwgXCJPbmUgb3IgbW9yZSB0cmFuc2l0aW9ucyBmb3IgXCIuY29uY2F0KGV2ZW50VGV4dCwgXCIgb24gc3RhdGUgJ1wiKS5jb25jYXQoc3RhdGVOb2RlLmlkLCBcIicgYXJlIHVucmVhY2hhYmxlLiBcIikgKyBcIk1ha2Ugc3VyZSB0aGF0IHRoZSBkZWZhdWx0IHRyYW5zaXRpb24gaXMgdGhlIGxhc3Qgb25lIGRlZmluZWQuXCIpO1xufTtcblxudmFyIFN0YXRlTm9kZSA9XG4vKiNfX1BVUkVfXyovXG5cbi8qKiBAY2xhc3MgKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU3RhdGVOb2RlKFxuICAvKipcclxuICAgKiBUaGUgcmF3IGNvbmZpZyB1c2VkIHRvIGNyZWF0ZSB0aGUgbWFjaGluZS5cclxuICAgKi9cbiAgY29uZmlnLCBvcHRpb25zLFxuICAvKipcclxuICAgKiBUaGUgaW5pdGlhbCBleHRlbmRlZCBzdGF0ZVxyXG4gICAqL1xuICBfY29udGV4dCwgLy8gVE9ETzogdGhpcyBpcyB1bnNhZmUsIGJ1dCB3ZSdyZSByZW1vdmluZyBpdCBpbiB2NSBhbnl3YXlcbiAgX3N0YXRlSW5mbykge1xuICAgIGlmIChfY29udGV4dCA9PT0gdm9pZCAwKSB7XG4gICAgICBfY29udGV4dCA9ICdjb250ZXh0JyBpbiBjb25maWcgPyBjb25maWcuY29udGV4dCA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIF9hO1xuXG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5fY29udGV4dCA9IF9jb250ZXh0O1xuICAgIC8qKlxyXG4gICAgICogVGhlIG9yZGVyIHRoaXMgc3RhdGUgbm9kZSBhcHBlYXJzLiBDb3JyZXNwb25kcyB0byB0aGUgaW1wbGljaXQgU0NYTUwgZG9jdW1lbnQgb3JkZXIuXHJcbiAgICAgKi9cblxuICAgIHRoaXMub3JkZXIgPSAtMTtcbiAgICB0aGlzLl9feHN0YXRlbm9kZSA9IHRydWU7XG4gICAgdGhpcy5fX2NhY2hlID0ge1xuICAgICAgZXZlbnRzOiB1bmRlZmluZWQsXG4gICAgICByZWxhdGl2ZVZhbHVlOiBuZXcgTWFwKCksXG4gICAgICBpbml0aWFsU3RhdGVWYWx1ZTogdW5kZWZpbmVkLFxuICAgICAgaW5pdGlhbFN0YXRlOiB1bmRlZmluZWQsXG4gICAgICBvbjogdW5kZWZpbmVkLFxuICAgICAgdHJhbnNpdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgIGNhbmRpZGF0ZXM6IHt9LFxuICAgICAgZGVsYXllZFRyYW5zaXRpb25zOiB1bmRlZmluZWRcbiAgICB9O1xuICAgIHRoaXMuaWRNYXAgPSB7fTtcbiAgICB0aGlzLnRhZ3MgPSBbXTtcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGNyZWF0ZURlZmF1bHRPcHRpb25zKCksIG9wdGlvbnMpO1xuICAgIHRoaXMucGFyZW50ID0gX3N0YXRlSW5mbyA9PT0gbnVsbCB8fCBfc3RhdGVJbmZvID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfc3RhdGVJbmZvLnBhcmVudDtcbiAgICB0aGlzLmtleSA9IHRoaXMuY29uZmlnLmtleSB8fCAoX3N0YXRlSW5mbyA9PT0gbnVsbCB8fCBfc3RhdGVJbmZvID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfc3RhdGVJbmZvLmtleSkgfHwgdGhpcy5jb25maWcuaWQgfHwgJyhtYWNoaW5lKSc7XG4gICAgdGhpcy5tYWNoaW5lID0gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5tYWNoaW5lIDogdGhpcztcbiAgICB0aGlzLnBhdGggPSB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LnBhdGguY29uY2F0KHRoaXMua2V5KSA6IFtdO1xuICAgIHRoaXMuZGVsaW1pdGVyID0gdGhpcy5jb25maWcuZGVsaW1pdGVyIHx8ICh0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmRlbGltaXRlciA6IFNUQVRFX0RFTElNSVRFUik7XG4gICAgdGhpcy5pZCA9IHRoaXMuY29uZmlnLmlkIHx8IF9fc3ByZWFkQXJyYXkoW3RoaXMubWFjaGluZS5rZXldLCBfX3JlYWQodGhpcy5wYXRoKSwgZmFsc2UpLmpvaW4odGhpcy5kZWxpbWl0ZXIpO1xuICAgIHRoaXMudmVyc2lvbiA9IHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQudmVyc2lvbiA6IHRoaXMuY29uZmlnLnZlcnNpb247XG4gICAgdGhpcy50eXBlID0gdGhpcy5jb25maWcudHlwZSB8fCAodGhpcy5jb25maWcucGFyYWxsZWwgPyAncGFyYWxsZWwnIDogdGhpcy5jb25maWcuc3RhdGVzICYmIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLnN0YXRlcykubGVuZ3RoID8gJ2NvbXBvdW5kJyA6IHRoaXMuY29uZmlnLmhpc3RvcnkgPyAnaGlzdG9yeScgOiAnYXRvbWljJyk7XG4gICAgdGhpcy5zY2hlbWEgPSB0aGlzLnBhcmVudCA/IHRoaXMubWFjaGluZS5zY2hlbWEgOiAoX2EgPSB0aGlzLmNvbmZpZy5zY2hlbWEpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHt9O1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSB0aGlzLmNvbmZpZy5kZXNjcmlwdGlvbjtcblxuICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgd2FybighKCdwYXJhbGxlbCcgaW4gdGhpcy5jb25maWcpLCBcIlRoZSBcXFwicGFyYWxsZWxcXFwiIHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB2ZXJzaW9uIDQuMS4gXCIuY29uY2F0KHRoaXMuY29uZmlnLnBhcmFsbGVsID8gXCJSZXBsYWNlIHdpdGggYHR5cGU6ICdwYXJhbGxlbCdgXCIgOiBcIlVzZSBgdHlwZTogJ1wiLmNvbmNhdCh0aGlzLnR5cGUsIFwiJ2BcIiksIFwiIGluIHRoZSBjb25maWcgZm9yIHN0YXRlIG5vZGUgJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInIGluc3RlYWQuXCIpKTtcbiAgICB9XG5cbiAgICB0aGlzLmluaXRpYWwgPSB0aGlzLmNvbmZpZy5pbml0aWFsO1xuICAgIHRoaXMuc3RhdGVzID0gdGhpcy5jb25maWcuc3RhdGVzID8gbWFwVmFsdWVzKHRoaXMuY29uZmlnLnN0YXRlcywgZnVuY3Rpb24gKHN0YXRlQ29uZmlnLCBrZXkpIHtcbiAgICAgIHZhciBfYTtcblxuICAgICAgdmFyIHN0YXRlTm9kZSA9IG5ldyBTdGF0ZU5vZGUoc3RhdGVDb25maWcsIHt9LCB1bmRlZmluZWQsIHtcbiAgICAgICAgcGFyZW50OiBfdGhpcyxcbiAgICAgICAga2V5OiBrZXlcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmFzc2lnbihfdGhpcy5pZE1hcCwgX19hc3NpZ24oKF9hID0ge30sIF9hW3N0YXRlTm9kZS5pZF0gPSBzdGF0ZU5vZGUsIF9hKSwgc3RhdGVOb2RlLmlkTWFwKSk7XG4gICAgICByZXR1cm4gc3RhdGVOb2RlO1xuICAgIH0pIDogRU1QVFlfT0JKRUNUOyAvLyBEb2N1bWVudCBvcmRlclxuXG4gICAgdmFyIG9yZGVyID0gMDtcblxuICAgIGZ1bmN0aW9uIGRmcyhzdGF0ZU5vZGUpIHtcbiAgICAgIHZhciBlXzEsIF9hO1xuXG4gICAgICBzdGF0ZU5vZGUub3JkZXIgPSBvcmRlcisrO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKGdldEFsbENoaWxkcmVuKHN0YXRlTm9kZSkpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgICAgdmFyIGNoaWxkID0gX2MudmFsdWU7XG4gICAgICAgICAgZGZzKGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICAgICAgZV8xID0ge1xuICAgICAgICAgIGVycm9yOiBlXzFfMVxuICAgICAgICB9O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGZzKHRoaXMpOyAvLyBIaXN0b3J5IGNvbmZpZ1xuXG4gICAgdGhpcy5oaXN0b3J5ID0gdGhpcy5jb25maWcuaGlzdG9yeSA9PT0gdHJ1ZSA/ICdzaGFsbG93JyA6IHRoaXMuY29uZmlnLmhpc3RvcnkgfHwgZmFsc2U7XG4gICAgdGhpcy5fdHJhbnNpZW50ID0gISF0aGlzLmNvbmZpZy5hbHdheXMgfHwgKCF0aGlzLmNvbmZpZy5vbiA/IGZhbHNlIDogQXJyYXkuaXNBcnJheSh0aGlzLmNvbmZpZy5vbikgPyB0aGlzLmNvbmZpZy5vbi5zb21lKGZ1bmN0aW9uIChfYSkge1xuICAgICAgdmFyIGV2ZW50ID0gX2EuZXZlbnQ7XG4gICAgICByZXR1cm4gZXZlbnQgPT09IE5VTExfRVZFTlQ7XG4gICAgfSkgOiBOVUxMX0VWRU5UIGluIHRoaXMuY29uZmlnLm9uKTtcbiAgICB0aGlzLnN0cmljdCA9ICEhdGhpcy5jb25maWcuc3RyaWN0OyAvLyBUT0RPOiBkZXByZWNhdGUgKGVudHJ5KVxuXG4gICAgdGhpcy5vbkVudHJ5ID0gdG9BcnJheSh0aGlzLmNvbmZpZy5lbnRyeSB8fCB0aGlzLmNvbmZpZy5vbkVudHJ5KS5tYXAoZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgcmV0dXJuIHRvQWN0aW9uT2JqZWN0KGFjdGlvbik7XG4gICAgfSk7IC8vIFRPRE86IGRlcHJlY2F0ZSAoZXhpdClcblxuICAgIHRoaXMub25FeGl0ID0gdG9BcnJheSh0aGlzLmNvbmZpZy5leGl0IHx8IHRoaXMuY29uZmlnLm9uRXhpdCkubWFwKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHJldHVybiB0b0FjdGlvbk9iamVjdChhY3Rpb24pO1xuICAgIH0pO1xuICAgIHRoaXMubWV0YSA9IHRoaXMuY29uZmlnLm1ldGE7XG4gICAgdGhpcy5kb25lRGF0YSA9IHRoaXMudHlwZSA9PT0gJ2ZpbmFsJyA/IHRoaXMuY29uZmlnLmRhdGEgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5pbnZva2UgPSB0b0FycmF5KHRoaXMuY29uZmlnLmludm9rZSkubWFwKGZ1bmN0aW9uIChpbnZva2VDb25maWcsIGkpIHtcbiAgICAgIHZhciBfYSwgX2I7XG5cbiAgICAgIGlmIChpc01hY2hpbmUoaW52b2tlQ29uZmlnKSkge1xuICAgICAgICB2YXIgaW52b2tlSWQgPSBjcmVhdGVJbnZva2VJZChfdGhpcy5pZCwgaSk7XG4gICAgICAgIF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcyA9IF9fYXNzaWduKChfYSA9IHt9LCBfYVtpbnZva2VJZF0gPSBpbnZva2VDb25maWcsIF9hKSwgX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzKTtcbiAgICAgICAgcmV0dXJuIHRvSW52b2tlRGVmaW5pdGlvbih7XG4gICAgICAgICAgc3JjOiBpbnZva2VJZCxcbiAgICAgICAgICBpZDogaW52b2tlSWRcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKGludm9rZUNvbmZpZy5zcmMpKSB7XG4gICAgICAgIHZhciBpbnZva2VJZCA9IGludm9rZUNvbmZpZy5pZCB8fCBjcmVhdGVJbnZva2VJZChfdGhpcy5pZCwgaSk7XG4gICAgICAgIHJldHVybiB0b0ludm9rZURlZmluaXRpb24oX19hc3NpZ24oX19hc3NpZ24oe30sIGludm9rZUNvbmZpZyksIHtcbiAgICAgICAgICBpZDogaW52b2tlSWQsXG4gICAgICAgICAgc3JjOiBpbnZva2VDb25maWcuc3JjXG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNNYWNoaW5lKGludm9rZUNvbmZpZy5zcmMpIHx8IGlzRnVuY3Rpb24oaW52b2tlQ29uZmlnLnNyYykpIHtcbiAgICAgICAgdmFyIGludm9rZUlkID0gaW52b2tlQ29uZmlnLmlkIHx8IGNyZWF0ZUludm9rZUlkKF90aGlzLmlkLCBpKTtcbiAgICAgICAgX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzID0gX19hc3NpZ24oKF9iID0ge30sIF9iW2ludm9rZUlkXSA9IGludm9rZUNvbmZpZy5zcmMsIF9iKSwgX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzKTtcbiAgICAgICAgcmV0dXJuIHRvSW52b2tlRGVmaW5pdGlvbihfX2Fzc2lnbihfX2Fzc2lnbih7XG4gICAgICAgICAgaWQ6IGludm9rZUlkXG4gICAgICAgIH0sIGludm9rZUNvbmZpZyksIHtcbiAgICAgICAgICBzcmM6IGludm9rZUlkXG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpbnZva2VTb3VyY2UgPSBpbnZva2VDb25maWcuc3JjO1xuICAgICAgICByZXR1cm4gdG9JbnZva2VEZWZpbml0aW9uKF9fYXNzaWduKF9fYXNzaWduKHtcbiAgICAgICAgICBpZDogY3JlYXRlSW52b2tlSWQoX3RoaXMuaWQsIGkpXG4gICAgICAgIH0sIGludm9rZUNvbmZpZyksIHtcbiAgICAgICAgICBzcmM6IGludm9rZVNvdXJjZVxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5hY3Rpdml0aWVzID0gdG9BcnJheSh0aGlzLmNvbmZpZy5hY3Rpdml0aWVzKS5jb25jYXQodGhpcy5pbnZva2UpLm1hcChmdW5jdGlvbiAoYWN0aXZpdHkpIHtcbiAgICAgIHJldHVybiB0b0FjdGl2aXR5RGVmaW5pdGlvbihhY3Rpdml0eSk7XG4gICAgfSk7XG4gICAgdGhpcy50cmFuc2l0aW9uID0gdGhpcy50cmFuc2l0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy50YWdzID0gdG9BcnJheSh0aGlzLmNvbmZpZy50YWdzKTsgLy8gVE9ETzogdGhpcyBpcyB0aGUgcmVhbCBmaXggZm9yIGluaXRpYWxpemF0aW9uIG9uY2VcbiAgICAvLyBzdGF0ZSBub2RlIGdldHRlcnMgYXJlIGRlcHJlY2F0ZWRcbiAgICAvLyBpZiAoIXRoaXMucGFyZW50KSB7XG4gICAgLy8gICB0aGlzLl9pbml0KCk7XG4gICAgLy8gfVxuICB9XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fX2NhY2hlLnRyYW5zaXRpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2V0QWxsU3RhdGVOb2Rlcyh0aGlzKS5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZU5vZGUub247XG4gICAgfSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIENsb25lcyB0aGlzIHN0YXRlIG1hY2hpbmUgd2l0aCBjdXN0b20gb3B0aW9ucyBhbmQgY29udGV4dC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgKGFjdGlvbnMsIGd1YXJkcywgYWN0aXZpdGllcywgc2VydmljZXMpIHRvIHJlY3Vyc2l2ZWx5IG1lcmdlIHdpdGggdGhlIGV4aXN0aW5nIG9wdGlvbnMuXHJcbiAgICogQHBhcmFtIGNvbnRleHQgQ3VzdG9tIGNvbnRleHQgKHdpbGwgb3ZlcnJpZGUgcHJlZGVmaW5lZCBjb250ZXh0KVxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS53aXRoQ29uZmlnID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNvbnRleHQpIHtcbiAgICB2YXIgX2EgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIGFjdGlvbnMgPSBfYS5hY3Rpb25zLFxuICAgICAgICBhY3Rpdml0aWVzID0gX2EuYWN0aXZpdGllcyxcbiAgICAgICAgZ3VhcmRzID0gX2EuZ3VhcmRzLFxuICAgICAgICBzZXJ2aWNlcyA9IF9hLnNlcnZpY2VzLFxuICAgICAgICBkZWxheXMgPSBfYS5kZWxheXM7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZU5vZGUodGhpcy5jb25maWcsIHtcbiAgICAgIGFjdGlvbnM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb25zKSwgb3B0aW9ucy5hY3Rpb25zKSxcbiAgICAgIGFjdGl2aXRpZXM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpdml0aWVzKSwgb3B0aW9ucy5hY3Rpdml0aWVzKSxcbiAgICAgIGd1YXJkczogX19hc3NpZ24oX19hc3NpZ24oe30sIGd1YXJkcyksIG9wdGlvbnMuZ3VhcmRzKSxcbiAgICAgIHNlcnZpY2VzOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgc2VydmljZXMpLCBvcHRpb25zLnNlcnZpY2VzKSxcbiAgICAgIGRlbGF5czogX19hc3NpZ24oX19hc3NpZ24oe30sIGRlbGF5cyksIG9wdGlvbnMuZGVsYXlzKVxuICAgIH0sIGNvbnRleHQgIT09IG51bGwgJiYgY29udGV4dCAhPT0gdm9pZCAwID8gY29udGV4dCA6IHRoaXMuY29udGV4dCk7XG4gIH07XG4gIC8qKlxyXG4gICAqIENsb25lcyB0aGlzIHN0YXRlIG1hY2hpbmUgd2l0aCBjdXN0b20gY29udGV4dC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb250ZXh0IEN1c3RvbSBjb250ZXh0ICh3aWxsIG92ZXJyaWRlIHByZWRlZmluZWQgY29udGV4dCwgbm90IHJlY3Vyc2l2ZSlcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUud2l0aENvbnRleHQgPSBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIHJldHVybiBuZXcgU3RhdGVOb2RlKHRoaXMuY29uZmlnLCB0aGlzLm9wdGlvbnMsIGNvbnRleHQpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImNvbnRleHRcIiwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGlzRnVuY3Rpb24odGhpcy5fY29udGV4dCkgPyB0aGlzLl9jb250ZXh0KCkgOiB0aGlzLl9jb250ZXh0O1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJkZWZpbml0aW9uXCIsIHtcbiAgICAvKipcclxuICAgICAqIFRoZSB3ZWxsLXN0cnVjdHVyZWQgc3RhdGUgbm9kZSBkZWZpbml0aW9uLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogdGhpcy5pZCxcbiAgICAgICAga2V5OiB0aGlzLmtleSxcbiAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgICBjb250ZXh0OiB0aGlzLmNvbnRleHQsXG4gICAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgICAgaW5pdGlhbDogdGhpcy5pbml0aWFsLFxuICAgICAgICBoaXN0b3J5OiB0aGlzLmhpc3RvcnksXG4gICAgICAgIHN0YXRlczogbWFwVmFsdWVzKHRoaXMuc3RhdGVzLCBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGUuZGVmaW5pdGlvbjtcbiAgICAgICAgfSksXG4gICAgICAgIG9uOiB0aGlzLm9uLFxuICAgICAgICB0cmFuc2l0aW9uczogdGhpcy50cmFuc2l0aW9ucyxcbiAgICAgICAgZW50cnk6IHRoaXMub25FbnRyeSxcbiAgICAgICAgZXhpdDogdGhpcy5vbkV4aXQsXG4gICAgICAgIGFjdGl2aXRpZXM6IHRoaXMuYWN0aXZpdGllcyB8fCBbXSxcbiAgICAgICAgbWV0YTogdGhpcy5tZXRhLFxuICAgICAgICBvcmRlcjogdGhpcy5vcmRlciB8fCAtMSxcbiAgICAgICAgZGF0YTogdGhpcy5kb25lRGF0YSxcbiAgICAgICAgaW52b2tlOiB0aGlzLmludm9rZSxcbiAgICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICAgIHRhZ3M6IHRoaXMudGFnc1xuICAgICAgfTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZpbml0aW9uO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcIm9uXCIsIHtcbiAgICAvKipcclxuICAgICAqIFRoZSBtYXBwaW5nIG9mIGV2ZW50cyB0byB0cmFuc2l0aW9ucy5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuX19jYWNoZS5vbikge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLm9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgdHJhbnNpdGlvbnMgPSB0aGlzLnRyYW5zaXRpb25zO1xuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5vbiA9IHRyYW5zaXRpb25zLnJlZHVjZShmdW5jdGlvbiAobWFwLCB0cmFuc2l0aW9uKSB7XG4gICAgICAgIG1hcFt0cmFuc2l0aW9uLmV2ZW50VHlwZV0gPSBtYXBbdHJhbnNpdGlvbi5ldmVudFR5cGVdIHx8IFtdO1xuICAgICAgICBtYXBbdHJhbnNpdGlvbi5ldmVudFR5cGVdLnB1c2godHJhbnNpdGlvbik7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgICB9LCB7fSk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImFmdGVyXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuZGVsYXllZFRyYW5zaXRpb25zIHx8ICh0aGlzLl9fY2FjaGUuZGVsYXllZFRyYW5zaXRpb25zID0gdGhpcy5nZXREZWxheWVkVHJhbnNpdGlvbnMoKSwgdGhpcy5fX2NhY2hlLmRlbGF5ZWRUcmFuc2l0aW9ucyk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcInRyYW5zaXRpb25zXCIsIHtcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgdHJhbnNpdGlvbnMgdGhhdCBjYW4gYmUgdGFrZW4gZnJvbSB0aGlzIHN0YXRlIG5vZGUuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUudHJhbnNpdGlvbnMgfHwgKHRoaXMuX19jYWNoZS50cmFuc2l0aW9ucyA9IHRoaXMuZm9ybWF0VHJhbnNpdGlvbnMoKSwgdGhpcy5fX2NhY2hlLnRyYW5zaXRpb25zKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldENhbmRpZGF0ZXMgPSBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgaWYgKHRoaXMuX19jYWNoZS5jYW5kaWRhdGVzW2V2ZW50TmFtZV0pIHtcbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuY2FuZGlkYXRlc1tldmVudE5hbWVdO1xuICAgIH1cblxuICAgIHZhciB0cmFuc2llbnQgPSBldmVudE5hbWUgPT09IE5VTExfRVZFTlQ7XG4gICAgdmFyIGNhbmRpZGF0ZXMgPSB0aGlzLnRyYW5zaXRpb25zLmZpbHRlcihmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgdmFyIHNhbWVFdmVudFR5cGUgPSB0cmFuc2l0aW9uLmV2ZW50VHlwZSA9PT0gZXZlbnROYW1lOyAvLyBudWxsIGV2ZW50cyBzaG91bGQgb25seSBtYXRjaCBhZ2FpbnN0IGV2ZW50bGVzcyB0cmFuc2l0aW9uc1xuXG4gICAgICByZXR1cm4gdHJhbnNpZW50ID8gc2FtZUV2ZW50VHlwZSA6IHNhbWVFdmVudFR5cGUgfHwgdHJhbnNpdGlvbi5ldmVudFR5cGUgPT09IFdJTERDQVJEO1xuICAgIH0pO1xuICAgIHRoaXMuX19jYWNoZS5jYW5kaWRhdGVzW2V2ZW50TmFtZV0gPSBjYW5kaWRhdGVzO1xuICAgIHJldHVybiBjYW5kaWRhdGVzO1xuICB9O1xuICAvKipcclxuICAgKiBBbGwgZGVsYXllZCB0cmFuc2l0aW9ucyBmcm9tIHRoZSBjb25maWcuXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldERlbGF5ZWRUcmFuc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGFmdGVyQ29uZmlnID0gdGhpcy5jb25maWcuYWZ0ZXI7XG5cbiAgICBpZiAoIWFmdGVyQ29uZmlnKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgdmFyIG11dGF0ZUVudHJ5RXhpdCA9IGZ1bmN0aW9uIChkZWxheSwgaSkge1xuICAgICAgdmFyIGRlbGF5UmVmID0gaXNGdW5jdGlvbihkZWxheSkgPyBcIlwiLmNvbmNhdChfdGhpcy5pZCwgXCI6ZGVsYXlbXCIpLmNvbmNhdChpLCBcIl1cIikgOiBkZWxheTtcbiAgICAgIHZhciBldmVudFR5cGUgPSBhZnRlcihkZWxheVJlZiwgX3RoaXMuaWQpO1xuXG4gICAgICBfdGhpcy5vbkVudHJ5LnB1c2goc2VuZChldmVudFR5cGUsIHtcbiAgICAgICAgZGVsYXk6IGRlbGF5XG4gICAgICB9KSk7XG5cbiAgICAgIF90aGlzLm9uRXhpdC5wdXNoKGNhbmNlbChldmVudFR5cGUpKTtcblxuICAgICAgcmV0dXJuIGV2ZW50VHlwZTtcbiAgICB9O1xuXG4gICAgdmFyIGRlbGF5ZWRUcmFuc2l0aW9ucyA9IGlzQXJyYXkoYWZ0ZXJDb25maWcpID8gYWZ0ZXJDb25maWcubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uLCBpKSB7XG4gICAgICB2YXIgZXZlbnRUeXBlID0gbXV0YXRlRW50cnlFeGl0KHRyYW5zaXRpb24uZGVsYXksIGkpO1xuICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0cmFuc2l0aW9uKSwge1xuICAgICAgICBldmVudDogZXZlbnRUeXBlXG4gICAgICB9KTtcbiAgICB9KSA6IGZsYXR0ZW4oT2JqZWN0LmtleXMoYWZ0ZXJDb25maWcpLm1hcChmdW5jdGlvbiAoZGVsYXksIGkpIHtcbiAgICAgIHZhciBjb25maWdUcmFuc2l0aW9uID0gYWZ0ZXJDb25maWdbZGVsYXldO1xuICAgICAgdmFyIHJlc29sdmVkVHJhbnNpdGlvbiA9IGlzU3RyaW5nKGNvbmZpZ1RyYW5zaXRpb24pID8ge1xuICAgICAgICB0YXJnZXQ6IGNvbmZpZ1RyYW5zaXRpb25cbiAgICAgIH0gOiBjb25maWdUcmFuc2l0aW9uO1xuICAgICAgdmFyIHJlc29sdmVkRGVsYXkgPSAhaXNOYU4oK2RlbGF5KSA/ICtkZWxheSA6IGRlbGF5O1xuICAgICAgdmFyIGV2ZW50VHlwZSA9IG11dGF0ZUVudHJ5RXhpdChyZXNvbHZlZERlbGF5LCBpKTtcbiAgICAgIHJldHVybiB0b0FycmF5KHJlc29sdmVkVHJhbnNpdGlvbikubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdHJhbnNpdGlvbiksIHtcbiAgICAgICAgICBldmVudDogZXZlbnRUeXBlLFxuICAgICAgICAgIGRlbGF5OiByZXNvbHZlZERlbGF5XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSkpO1xuICAgIHJldHVybiBkZWxheWVkVHJhbnNpdGlvbnMubWFwKGZ1bmN0aW9uIChkZWxheWVkVHJhbnNpdGlvbikge1xuICAgICAgdmFyIGRlbGF5ID0gZGVsYXllZFRyYW5zaXRpb24uZGVsYXk7XG4gICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIF90aGlzLmZvcm1hdFRyYW5zaXRpb24oZGVsYXllZFRyYW5zaXRpb24pKSwge1xuICAgICAgICBkZWxheTogZGVsYXlcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBzdGF0ZSBub2RlcyByZXByZXNlbnRlZCBieSB0aGUgY3VycmVudCBzdGF0ZSB2YWx1ZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgc3RhdGUgdmFsdWUgb3IgU3RhdGUgaW5zdGFuY2VcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0U3RhdGVOb2RlcyA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIXN0YXRlKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlVmFsdWUgPSBzdGF0ZSBpbnN0YW5jZW9mIFN0YXRlID8gc3RhdGUudmFsdWUgOiB0b1N0YXRlVmFsdWUoc3RhdGUsIHRoaXMuZGVsaW1pdGVyKTtcblxuICAgIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgICAgdmFyIGluaXRpYWxTdGF0ZVZhbHVlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3RhdGVWYWx1ZSkuaW5pdGlhbDtcbiAgICAgIHJldHVybiBpbml0aWFsU3RhdGVWYWx1ZSAhPT0gdW5kZWZpbmVkID8gdGhpcy5nZXRTdGF0ZU5vZGVzKChfYSA9IHt9LCBfYVtzdGF0ZVZhbHVlXSA9IGluaXRpYWxTdGF0ZVZhbHVlLCBfYSkpIDogW3RoaXMsIHRoaXMuc3RhdGVzW3N0YXRlVmFsdWVdXTtcbiAgICB9XG5cbiAgICB2YXIgc3ViU3RhdGVLZXlzID0gT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSk7XG4gICAgdmFyIHN1YlN0YXRlTm9kZXMgPSBbdGhpc107XG4gICAgc3ViU3RhdGVOb2Rlcy5wdXNoLmFwcGx5KHN1YlN0YXRlTm9kZXMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChmbGF0dGVuKHN1YlN0YXRlS2V5cy5tYXAoZnVuY3Rpb24gKHN1YlN0YXRlS2V5KSB7XG4gICAgICByZXR1cm4gX3RoaXMuZ2V0U3RhdGVOb2RlKHN1YlN0YXRlS2V5KS5nZXRTdGF0ZU5vZGVzKHN0YXRlVmFsdWVbc3ViU3RhdGVLZXldKTtcbiAgICB9KSkpLCBmYWxzZSkpO1xuICAgIHJldHVybiBzdWJTdGF0ZU5vZGVzO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGlzIHN0YXRlIG5vZGUgZXhwbGljaXRseSBoYW5kbGVzIHRoZSBnaXZlbiBldmVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgaW4gcXVlc3Rpb25cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuaGFuZGxlcyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBldmVudFR5cGUgPSBnZXRFdmVudFR5cGUoZXZlbnQpO1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5pbmNsdWRlcyhldmVudFR5cGUpO1xuICB9O1xuICAvKipcclxuICAgKiBSZXNvbHZlcyB0aGUgZ2l2ZW4gYHN0YXRlYCB0byBhIG5ldyBgU3RhdGVgIGluc3RhbmNlIHJlbGF0aXZlIHRvIHRoaXMgbWFjaGluZS5cclxuICAgKlxyXG4gICAqIFRoaXMgZW5zdXJlcyB0aGF0IGAuZXZlbnRzYCBhbmQgYC5uZXh0RXZlbnRzYCByZXByZXNlbnQgdGhlIGNvcnJlY3QgdmFsdWVzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlIFRoZSBzdGF0ZSB0byByZXNvbHZlXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmVTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBzdGF0ZUZyb21Db25maWcgPSBzdGF0ZSBpbnN0YW5jZW9mIFN0YXRlID8gc3RhdGUgOiBTdGF0ZS5jcmVhdGUoc3RhdGUpO1xuICAgIHZhciBjb25maWd1cmF0aW9uID0gQXJyYXkuZnJvbShnZXRDb25maWd1cmF0aW9uKFtdLCB0aGlzLmdldFN0YXRlTm9kZXMoc3RhdGVGcm9tQ29uZmlnLnZhbHVlKSkpO1xuICAgIHJldHVybiBuZXcgU3RhdGUoX19hc3NpZ24oX19hc3NpZ24oe30sIHN0YXRlRnJvbUNvbmZpZyksIHtcbiAgICAgIHZhbHVlOiB0aGlzLnJlc29sdmUoc3RhdGVGcm9tQ29uZmlnLnZhbHVlKSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZpZ3VyYXRpb24sXG4gICAgICBkb25lOiBpc0luRmluYWxTdGF0ZShjb25maWd1cmF0aW9uLCB0aGlzKSxcbiAgICAgIHRhZ3M6IGdldFRhZ3NGcm9tQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSxcbiAgICAgIG1hY2hpbmU6IHRoaXMubWFjaGluZVxuICAgIH0pKTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnRyYW5zaXRpb25MZWFmTm9kZSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KSB7XG4gICAgdmFyIHN0YXRlTm9kZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN0YXRlVmFsdWUpO1xuICAgIHZhciBuZXh0ID0gc3RhdGVOb2RlLm5leHQoc3RhdGUsIF9ldmVudCk7XG5cbiAgICBpZiAoIW5leHQgfHwgIW5leHQudHJhbnNpdGlvbnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdGhpcy5uZXh0KHN0YXRlLCBfZXZlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0O1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUudHJhbnNpdGlvbkNvbXBvdW5kTm9kZSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KSB7XG4gICAgdmFyIHN1YlN0YXRlS2V5cyA9IE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpO1xuICAgIHZhciBzdGF0ZU5vZGUgPSB0aGlzLmdldFN0YXRlTm9kZShzdWJTdGF0ZUtleXNbMF0pO1xuXG4gICAgdmFyIG5leHQgPSBzdGF0ZU5vZGUuX3RyYW5zaXRpb24oc3RhdGVWYWx1ZVtzdWJTdGF0ZUtleXNbMF1dLCBzdGF0ZSwgX2V2ZW50KTtcblxuICAgIGlmICghbmV4dCB8fCAhbmV4dC50cmFuc2l0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLm5leHQoc3RhdGUsIF9ldmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHQ7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS50cmFuc2l0aW9uUGFyYWxsZWxOb2RlID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpIHtcbiAgICB2YXIgZV8yLCBfYTtcblxuICAgIHZhciB0cmFuc2l0aW9uTWFwID0ge307XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIHN1YlN0YXRlS2V5ID0gX2MudmFsdWU7XG4gICAgICAgIHZhciBzdWJTdGF0ZVZhbHVlID0gc3RhdGVWYWx1ZVtzdWJTdGF0ZUtleV07XG5cbiAgICAgICAgaWYgKCFzdWJTdGF0ZVZhbHVlKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3ViU3RhdGVOb2RlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3ViU3RhdGVLZXkpO1xuXG4gICAgICAgIHZhciBuZXh0ID0gc3ViU3RhdGVOb2RlLl90cmFuc2l0aW9uKHN1YlN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpO1xuXG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgdHJhbnNpdGlvbk1hcFtzdWJTdGF0ZUtleV0gPSBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8yXzEpIHtcbiAgICAgIGVfMiA9IHtcbiAgICAgICAgZXJyb3I6IGVfMl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlVHJhbnNpdGlvbnMgPSBPYmplY3Qua2V5cyh0cmFuc2l0aW9uTWFwKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIHRyYW5zaXRpb25NYXBba2V5XTtcbiAgICB9KTtcbiAgICB2YXIgZW5hYmxlZFRyYW5zaXRpb25zID0gZmxhdHRlbihzdGF0ZVRyYW5zaXRpb25zLm1hcChmdW5jdGlvbiAoc3QpIHtcbiAgICAgIHJldHVybiBzdC50cmFuc2l0aW9ucztcbiAgICB9KSk7XG4gICAgdmFyIHdpbGxUcmFuc2l0aW9uID0gc3RhdGVUcmFuc2l0aW9ucy5zb21lKGZ1bmN0aW9uIChzdCkge1xuICAgICAgcmV0dXJuIHN0LnRyYW5zaXRpb25zLmxlbmd0aCA+IDA7XG4gICAgfSk7XG5cbiAgICBpZiAoIXdpbGxUcmFuc2l0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5uZXh0KHN0YXRlLCBfZXZlbnQpO1xuICAgIH1cblxuICAgIHZhciBjb25maWd1cmF0aW9uID0gZmxhdHRlbihPYmplY3Qua2V5cyh0cmFuc2l0aW9uTWFwKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIHRyYW5zaXRpb25NYXBba2V5XS5jb25maWd1cmF0aW9uO1xuICAgIH0pKTtcbiAgICByZXR1cm4ge1xuICAgICAgdHJhbnNpdGlvbnM6IGVuYWJsZWRUcmFuc2l0aW9ucyxcbiAgICAgIGV4aXRTZXQ6IGZsYXR0ZW4oc3RhdGVUcmFuc2l0aW9ucy5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIHQuZXhpdFNldDtcbiAgICAgIH0pKSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZpZ3VyYXRpb24sXG4gICAgICBzb3VyY2U6IHN0YXRlLFxuICAgICAgYWN0aW9uczogZmxhdHRlbihPYmplY3Qua2V5cyh0cmFuc2l0aW9uTWFwKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbk1hcFtrZXldLmFjdGlvbnM7XG4gICAgICB9KSlcbiAgICB9O1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuX3RyYW5zaXRpb24gPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCkge1xuICAgIC8vIGxlYWYgbm9kZVxuICAgIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbkxlYWZOb2RlKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpO1xuICAgIH0gLy8gaGllcmFyY2hpY2FsIG5vZGVcblxuXG4gICAgaWYgKE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbkNvbXBvdW5kTm9kZShzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KTtcbiAgICB9IC8vIG9ydGhvZ29uYWwgbm9kZVxuXG5cbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uUGFyYWxsZWxOb2RlKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0VHJhbnNpdGlvbkRhdGEgPSBmdW5jdGlvbiAoc3RhdGUsIGV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zaXRpb24oc3RhdGUudmFsdWUsIHN0YXRlLCB0b1NDWE1MRXZlbnQoZXZlbnQpKTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoc3RhdGUsIF9ldmVudCkge1xuICAgIHZhciBlXzMsIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBldmVudE5hbWUgPSBfZXZlbnQubmFtZTtcbiAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgIHZhciBuZXh0U3RhdGVOb2RlcyA9IFtdO1xuICAgIHZhciBzZWxlY3RlZFRyYW5zaXRpb247XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyh0aGlzLmdldENhbmRpZGF0ZXMoZXZlbnROYW1lKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGNhbmRpZGF0ZSA9IF9jLnZhbHVlO1xuICAgICAgICB2YXIgY29uZCA9IGNhbmRpZGF0ZS5jb25kLFxuICAgICAgICAgICAgc3RhdGVJbiA9IGNhbmRpZGF0ZS5pbjtcbiAgICAgICAgdmFyIHJlc29sdmVkQ29udGV4dCA9IHN0YXRlLmNvbnRleHQ7XG4gICAgICAgIHZhciBpc0luU3RhdGUgPSBzdGF0ZUluID8gaXNTdHJpbmcoc3RhdGVJbikgJiYgaXNTdGF0ZUlkKHN0YXRlSW4pID8gLy8gQ2hlY2sgaWYgaW4gc3RhdGUgYnkgSURcbiAgICAgICAgc3RhdGUubWF0Y2hlcyh0b1N0YXRlVmFsdWUodGhpcy5nZXRTdGF0ZU5vZGVCeUlkKHN0YXRlSW4pLnBhdGgsIHRoaXMuZGVsaW1pdGVyKSkgOiAvLyBDaGVjayBpZiBpbiBzdGF0ZSBieSByZWxhdGl2ZSBncmFuZHBhcmVudFxuICAgICAgICBtYXRjaGVzU3RhdGUodG9TdGF0ZVZhbHVlKHN0YXRlSW4sIHRoaXMuZGVsaW1pdGVyKSwgcGF0aCh0aGlzLnBhdGguc2xpY2UoMCwgLTIpKShzdGF0ZS52YWx1ZSkpIDogdHJ1ZTtcbiAgICAgICAgdmFyIGd1YXJkUGFzc2VkID0gZmFsc2U7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBndWFyZFBhc3NlZCA9ICFjb25kIHx8IGV2YWx1YXRlR3VhcmQodGhpcy5tYWNoaW5lLCBjb25kLCByZXNvbHZlZENvbnRleHQsIF9ldmVudCwgc3RhdGUpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gZXZhbHVhdGUgZ3VhcmQgJ1wiLmNvbmNhdChjb25kLm5hbWUgfHwgY29uZC50eXBlLCBcIicgaW4gdHJhbnNpdGlvbiBmb3IgZXZlbnQgJ1wiKS5jb25jYXQoZXZlbnROYW1lLCBcIicgaW4gc3RhdGUgbm9kZSAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIic6XFxuXCIpLmNvbmNhdChlcnIubWVzc2FnZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGd1YXJkUGFzc2VkICYmIGlzSW5TdGF0ZSkge1xuICAgICAgICAgIGlmIChjYW5kaWRhdGUudGFyZ2V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG5leHRTdGF0ZU5vZGVzID0gY2FuZGlkYXRlLnRhcmdldDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhY3Rpb25zLnB1c2guYXBwbHkoYWN0aW9ucywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGNhbmRpZGF0ZS5hY3Rpb25zKSwgZmFsc2UpKTtcbiAgICAgICAgICBzZWxlY3RlZFRyYW5zaXRpb24gPSBjYW5kaWRhdGU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzNfMSkge1xuICAgICAgZV8zID0ge1xuICAgICAgICBlcnJvcjogZV8zXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzMpIHRocm93IGVfMy5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXNlbGVjdGVkVHJhbnNpdGlvbikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAoIW5leHRTdGF0ZU5vZGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHJhbnNpdGlvbnM6IFtzZWxlY3RlZFRyYW5zaXRpb25dLFxuICAgICAgICBleGl0U2V0OiBbXSxcbiAgICAgICAgY29uZmlndXJhdGlvbjogc3RhdGUudmFsdWUgPyBbdGhpc10gOiBbXSxcbiAgICAgICAgc291cmNlOiBzdGF0ZSxcbiAgICAgICAgYWN0aW9uczogYWN0aW9uc1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgYWxsTmV4dFN0YXRlTm9kZXMgPSBmbGF0dGVuKG5leHRTdGF0ZU5vZGVzLm1hcChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICByZXR1cm4gX3RoaXMuZ2V0UmVsYXRpdmVTdGF0ZU5vZGVzKHN0YXRlTm9kZSwgc3RhdGUuaGlzdG9yeVZhbHVlKTtcbiAgICB9KSk7XG4gICAgdmFyIGlzSW50ZXJuYWwgPSAhIXNlbGVjdGVkVHJhbnNpdGlvbi5pbnRlcm5hbDtcbiAgICByZXR1cm4ge1xuICAgICAgdHJhbnNpdGlvbnM6IFtzZWxlY3RlZFRyYW5zaXRpb25dLFxuICAgICAgZXhpdFNldDogaXNJbnRlcm5hbCA/IFtdIDogZmxhdHRlbihuZXh0U3RhdGVOb2Rlcy5tYXAoZnVuY3Rpb24gKHRhcmdldE5vZGUpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmdldFBvdGVudGlhbGx5UmVlbnRlcmluZ05vZGVzKHRhcmdldE5vZGUpO1xuICAgICAgfSkpLFxuICAgICAgY29uZmlndXJhdGlvbjogYWxsTmV4dFN0YXRlTm9kZXMsXG4gICAgICBzb3VyY2U6IHN0YXRlLFxuICAgICAgYWN0aW9uczogYWN0aW9uc1xuICAgIH07XG4gIH07IC8vIGV2ZW4gdGhvdWdoIHRoZSBuYW1lIG9mIHRoaXMgZnVuY3Rpb24gbWVudGlvbnMgcmVlbnRyeSBub2Rlc1xuICAvLyB3ZSBhcmUgcHVzaGluZyBpdHMgcmVzdWx0IGludG8gYGV4aXRTZXRgXG4gIC8vIHRoYXQncyBiZWNhdXNlIHdoYXQgd2UgZXhpdCBtaWdodCBiZSByZWVudGVyZWQgKGl0J3MgYW4gaW52YXJpYW50IG9mIHJlZW50cmFuY3kpXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFBvdGVudGlhbGx5UmVlbnRlcmluZ05vZGVzID0gZnVuY3Rpb24gKHRhcmdldE5vZGUpIHtcbiAgICBpZiAodGhpcy5vcmRlciA8IHRhcmdldE5vZGUub3JkZXIpIHtcbiAgICAgIHJldHVybiBbdGhpc107XG4gICAgfVxuXG4gICAgdmFyIG5vZGVzID0gW107XG4gICAgdmFyIG1hcmtlciA9IHRoaXM7XG4gICAgdmFyIHBvc3NpYmxlQW5jZXN0b3IgPSB0YXJnZXROb2RlO1xuXG4gICAgd2hpbGUgKG1hcmtlciAmJiBtYXJrZXIgIT09IHBvc3NpYmxlQW5jZXN0b3IpIHtcbiAgICAgIG5vZGVzLnB1c2gobWFya2VyKTtcbiAgICAgIG1hcmtlciA9IG1hcmtlci5wYXJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKG1hcmtlciAhPT0gcG9zc2libGVBbmNlc3Rvcikge1xuICAgICAgLy8gd2UgbmV2ZXIgZ290IHRvIGBwb3NzaWJsZUFuY2VzdG9yYCwgdGhlcmVmb3JlIHRoZSBpbml0aWFsIGBtYXJrZXJgIFwiZXNjYXBlc1wiIGl0XG4gICAgICAvLyBpdCdzIGluIGEgZGlmZmVyZW50IHBhcnQgb2YgdGhlIHRyZWUgc28gbm8gc3RhdGVzIHdpbGwgYmUgcmVlbnRlcmVkIGZvciBzdWNoIGFuIGV4dGVybmFsIHRyYW5zaXRpb25cbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBub2Rlcy5wdXNoKHBvc3NpYmxlQW5jZXN0b3IpO1xuICAgIHJldHVybiBub2RlcztcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldEFjdGlvbnMgPSBmdW5jdGlvbiAocmVzb2x2ZWRDb25maWcsIGlzRG9uZSwgdHJhbnNpdGlvbiwgY3VycmVudENvbnRleHQsIF9ldmVudCwgcHJldlN0YXRlLCBwcmVkaWN0YWJsZUV4ZWMpIHtcbiAgICB2YXIgZV80LCBfYSwgZV81LCBfYjtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgcHJldkNvbmZpZyA9IHByZXZTdGF0ZSA/IGdldENvbmZpZ3VyYXRpb24oW10sIHRoaXMuZ2V0U3RhdGVOb2RlcyhwcmV2U3RhdGUudmFsdWUpKSA6IFtdO1xuICAgIHZhciBlbnRyeVNldCA9IG5ldyBTZXQoKTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfYyA9IF9fdmFsdWVzKEFycmF5LmZyb20ocmVzb2x2ZWRDb25maWcpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEub3JkZXIgLSBiLm9yZGVyO1xuICAgICAgfSkpLCBfZCA9IF9jLm5leHQoKTsgIV9kLmRvbmU7IF9kID0gX2MubmV4dCgpKSB7XG4gICAgICAgIHZhciBzbiA9IF9kLnZhbHVlO1xuXG4gICAgICAgIGlmICghaGFzKHByZXZDb25maWcsIHNuKSB8fCBoYXModHJhbnNpdGlvbi5leGl0U2V0LCBzbikgfHwgc24ucGFyZW50ICYmIGVudHJ5U2V0Lmhhcyhzbi5wYXJlbnQpKSB7XG4gICAgICAgICAgZW50cnlTZXQuYWRkKHNuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfNF8xKSB7XG4gICAgICBlXzQgPSB7XG4gICAgICAgIGVycm9yOiBlXzRfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9kICYmICFfZC5kb25lICYmIChfYSA9IF9jLnJldHVybikpIF9hLmNhbGwoX2MpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNCkgdGhyb3cgZV80LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBwcmV2Q29uZmlnXzEgPSBfX3ZhbHVlcyhwcmV2Q29uZmlnKSwgcHJldkNvbmZpZ18xXzEgPSBwcmV2Q29uZmlnXzEubmV4dCgpOyAhcHJldkNvbmZpZ18xXzEuZG9uZTsgcHJldkNvbmZpZ18xXzEgPSBwcmV2Q29uZmlnXzEubmV4dCgpKSB7XG4gICAgICAgIHZhciBzbiA9IHByZXZDb25maWdfMV8xLnZhbHVlO1xuXG4gICAgICAgIGlmICghaGFzKHJlc29sdmVkQ29uZmlnLCBzbikgfHwgaGFzKHRyYW5zaXRpb24uZXhpdFNldCwgc24ucGFyZW50KSkge1xuICAgICAgICAgIHRyYW5zaXRpb24uZXhpdFNldC5wdXNoKHNuKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfNV8xKSB7XG4gICAgICBlXzUgPSB7XG4gICAgICAgIGVycm9yOiBlXzVfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHByZXZDb25maWdfMV8xICYmICFwcmV2Q29uZmlnXzFfMS5kb25lICYmIChfYiA9IHByZXZDb25maWdfMS5yZXR1cm4pKSBfYi5jYWxsKHByZXZDb25maWdfMSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV81KSB0aHJvdyBlXzUuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJhbnNpdGlvbi5leGl0U2V0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBiLm9yZGVyIC0gYS5vcmRlcjtcbiAgICB9KTtcbiAgICB2YXIgZW50cnlTdGF0ZXMgPSBBcnJheS5mcm9tKGVudHJ5U2V0KS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gYS5vcmRlciAtIGIub3JkZXI7XG4gICAgfSk7XG4gICAgdmFyIGV4aXRTdGF0ZXMgPSBuZXcgU2V0KHRyYW5zaXRpb24uZXhpdFNldCk7XG4gICAgdmFyIGRvbmVFdmVudHMgPSBmbGF0dGVuKGVudHJ5U3RhdGVzLm1hcChmdW5jdGlvbiAoc24pIHtcbiAgICAgIHZhciBldmVudHMgPSBbXTtcblxuICAgICAgaWYgKHNuLnR5cGUgIT09ICdmaW5hbCcpIHtcbiAgICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICAgIH1cblxuICAgICAgdmFyIHBhcmVudCA9IHNuLnBhcmVudDtcblxuICAgICAgaWYgKCFwYXJlbnQucGFyZW50KSB7XG4gICAgICAgIHJldHVybiBldmVudHM7XG4gICAgICB9XG5cbiAgICAgIGV2ZW50cy5wdXNoKGRvbmUoc24uaWQsIHNuLmRvbmVEYXRhKSwgLy8gVE9ETzogZGVwcmVjYXRlIC0gZmluYWwgc3RhdGVzIHNob3VsZCBub3QgZW1pdCBkb25lIGV2ZW50cyBmb3IgdGhlaXIgb3duIHN0YXRlLlxuICAgICAgZG9uZShwYXJlbnQuaWQsIHNuLmRvbmVEYXRhID8gbWFwQ29udGV4dChzbi5kb25lRGF0YSwgY3VycmVudENvbnRleHQsIF9ldmVudCkgOiB1bmRlZmluZWQpKTtcbiAgICAgIHZhciBncmFuZHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG5cbiAgICAgIGlmIChncmFuZHBhcmVudC50eXBlID09PSAncGFyYWxsZWwnKSB7XG4gICAgICAgIGlmIChnZXRDaGlsZHJlbihncmFuZHBhcmVudCkuZXZlcnkoZnVuY3Rpb24gKHBhcmVudE5vZGUpIHtcbiAgICAgICAgICByZXR1cm4gaXNJbkZpbmFsU3RhdGUodHJhbnNpdGlvbi5jb25maWd1cmF0aW9uLCBwYXJlbnROb2RlKTtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICBldmVudHMucHVzaChkb25lKGdyYW5kcGFyZW50LmlkKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICB9KSk7XG4gICAgdmFyIGVudHJ5QWN0aW9ucyA9IGVudHJ5U3RhdGVzLm1hcChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICB2YXIgZW50cnlBY3Rpb25zID0gc3RhdGVOb2RlLm9uRW50cnk7XG4gICAgICB2YXIgaW52b2tlQWN0aW9ucyA9IHN0YXRlTm9kZS5hY3Rpdml0aWVzLm1hcChmdW5jdGlvbiAoYWN0aXZpdHkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXJ0KGFjdGl2aXR5KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2VudHJ5JyxcbiAgICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKHByZWRpY3RhYmxlRXhlYyA/IF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGVudHJ5QWN0aW9ucyksIGZhbHNlKSwgX19yZWFkKGludm9rZUFjdGlvbnMpLCBmYWxzZSkgOiBfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChpbnZva2VBY3Rpb25zKSwgZmFsc2UpLCBfX3JlYWQoZW50cnlBY3Rpb25zKSwgZmFsc2UpLCBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucylcbiAgICAgIH07XG4gICAgfSkuY29uY2F0KHtcbiAgICAgIHR5cGU6ICdzdGF0ZV9kb25lJyxcbiAgICAgIGFjdGlvbnM6IGRvbmVFdmVudHMubWFwKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICByZXR1cm4gcmFpc2UoZXZlbnQpO1xuICAgICAgfSlcbiAgICB9KTtcbiAgICB2YXIgZXhpdEFjdGlvbnMgPSBBcnJheS5mcm9tKGV4aXRTdGF0ZXMpLm1hcChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnZXhpdCcsXG4gICAgICAgIGFjdGlvbnM6IHRvQWN0aW9uT2JqZWN0cyhfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChzdGF0ZU5vZGUub25FeGl0KSwgZmFsc2UpLCBfX3JlYWQoc3RhdGVOb2RlLmFjdGl2aXRpZXMubWFwKGZ1bmN0aW9uIChhY3Rpdml0eSkge1xuICAgICAgICAgIHJldHVybiBzdG9wKGFjdGl2aXR5KTtcbiAgICAgICAgfSkpLCBmYWxzZSksIF90aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgICAgfTtcbiAgICB9KTtcbiAgICB2YXIgYWN0aW9ucyA9IGV4aXRBY3Rpb25zLmNvbmNhdCh7XG4gICAgICB0eXBlOiAndHJhbnNpdGlvbicsXG4gICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHModHJhbnNpdGlvbi5hY3Rpb25zLCB0aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgIH0pLmNvbmNhdChlbnRyeUFjdGlvbnMpO1xuXG4gICAgaWYgKGlzRG9uZSkge1xuICAgICAgdmFyIHN0b3BBY3Rpb25zID0gdG9BY3Rpb25PYmplY3RzKGZsYXR0ZW4oX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHJlc29sdmVkQ29uZmlnKSwgZmFsc2UpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGIub3JkZXIgLSBhLm9yZGVyO1xuICAgICAgfSkubWFwKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlTm9kZS5vbkV4aXQ7XG4gICAgICB9KSksIHRoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnMpLmZpbHRlcihmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIHJldHVybiAhaXNSYWlzYWJsZUFjdGlvbihhY3Rpb24pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gYWN0aW9ucy5jb25jYXQoe1xuICAgICAgICB0eXBlOiAnc3RvcCcsXG4gICAgICAgIGFjdGlvbnM6IHN0b3BBY3Rpb25zXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aW9ucztcbiAgfTtcbiAgLyoqXHJcbiAgICogRGV0ZXJtaW5lcyB0aGUgbmV4dCBzdGF0ZSBnaXZlbiB0aGUgY3VycmVudCBgc3RhdGVgIGFuZCBzZW50IGBldmVudGAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIGN1cnJlbnQgU3RhdGUgaW5zdGFuY2Ugb3Igc3RhdGUgdmFsdWVcclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRoYXQgd2FzIHNlbnQgYXQgdGhlIGN1cnJlbnQgc3RhdGVcclxuICAgKiBAcGFyYW0gY29udGV4dCBUaGUgY3VycmVudCBjb250ZXh0IChleHRlbmRlZCBzdGF0ZSkgb2YgdGhlIGN1cnJlbnQgc3RhdGVcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUudHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChzdGF0ZSwgZXZlbnQsIGNvbnRleHQsIGV4ZWMpIHtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGUgPSB0aGlzLmluaXRpYWxTdGF0ZTtcbiAgICB9XG5cbiAgICB2YXIgX2V2ZW50ID0gdG9TQ1hNTEV2ZW50KGV2ZW50KTtcblxuICAgIHZhciBjdXJyZW50U3RhdGU7XG5cbiAgICBpZiAoc3RhdGUgaW5zdGFuY2VvZiBTdGF0ZSkge1xuICAgICAgY3VycmVudFN0YXRlID0gY29udGV4dCA9PT0gdW5kZWZpbmVkID8gc3RhdGUgOiB0aGlzLnJlc29sdmVTdGF0ZShTdGF0ZS5mcm9tKHN0YXRlLCBjb250ZXh0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXNvbHZlZFN0YXRlVmFsdWUgPSBpc1N0cmluZyhzdGF0ZSkgPyB0aGlzLnJlc29sdmUocGF0aFRvU3RhdGVWYWx1ZSh0aGlzLmdldFJlc29sdmVkUGF0aChzdGF0ZSkpKSA6IHRoaXMucmVzb2x2ZShzdGF0ZSk7XG4gICAgICB2YXIgcmVzb2x2ZWRDb250ZXh0ID0gY29udGV4dCAhPT0gbnVsbCAmJiBjb250ZXh0ICE9PSB2b2lkIDAgPyBjb250ZXh0IDogdGhpcy5tYWNoaW5lLmNvbnRleHQ7XG4gICAgICBjdXJyZW50U3RhdGUgPSB0aGlzLnJlc29sdmVTdGF0ZShTdGF0ZS5mcm9tKHJlc29sdmVkU3RhdGVWYWx1ZSwgcmVzb2x2ZWRDb250ZXh0KSk7XG4gICAgfVxuXG4gICAgaWYgKCFJU19QUk9EVUNUSU9OICYmIF9ldmVudC5uYW1lID09PSBXSUxEQ0FSRCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQW4gZXZlbnQgY2Fubm90IGhhdmUgdGhlIHdpbGRjYXJkIHR5cGUgKCdcIi5jb25jYXQoV0lMRENBUkQsIFwiJylcIikpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0cmljdCkge1xuICAgICAgaWYgKCF0aGlzLmV2ZW50cy5pbmNsdWRlcyhfZXZlbnQubmFtZSkgJiYgIWlzQnVpbHRJbkV2ZW50KF9ldmVudC5uYW1lKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNYWNoaW5lICdcIi5jb25jYXQodGhpcy5pZCwgXCInIGRvZXMgbm90IGFjY2VwdCBldmVudCAnXCIpLmNvbmNhdChfZXZlbnQubmFtZSwgXCInXCIpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3RhdGVUcmFuc2l0aW9uID0gdGhpcy5fdHJhbnNpdGlvbihjdXJyZW50U3RhdGUudmFsdWUsIGN1cnJlbnRTdGF0ZSwgX2V2ZW50KSB8fCB7XG4gICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICBjb25maWd1cmF0aW9uOiBbXSxcbiAgICAgIGV4aXRTZXQ6IFtdLFxuICAgICAgc291cmNlOiBjdXJyZW50U3RhdGUsXG4gICAgICBhY3Rpb25zOiBbXVxuICAgIH07XG4gICAgdmFyIHByZXZDb25maWcgPSBnZXRDb25maWd1cmF0aW9uKFtdLCB0aGlzLmdldFN0YXRlTm9kZXMoY3VycmVudFN0YXRlLnZhbHVlKSk7XG4gICAgdmFyIHJlc29sdmVkQ29uZmlnID0gc3RhdGVUcmFuc2l0aW9uLmNvbmZpZ3VyYXRpb24ubGVuZ3RoID8gZ2V0Q29uZmlndXJhdGlvbihwcmV2Q29uZmlnLCBzdGF0ZVRyYW5zaXRpb24uY29uZmlndXJhdGlvbikgOiBwcmV2Q29uZmlnO1xuICAgIHN0YXRlVHJhbnNpdGlvbi5jb25maWd1cmF0aW9uID0gX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHJlc29sdmVkQ29uZmlnKSwgZmFsc2UpO1xuICAgIHJldHVybiB0aGlzLnJlc29sdmVUcmFuc2l0aW9uKHN0YXRlVHJhbnNpdGlvbiwgY3VycmVudFN0YXRlLCBjdXJyZW50U3RhdGUuY29udGV4dCwgZXhlYywgX2V2ZW50KTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmVSYWlzZWRUcmFuc2l0aW9uID0gZnVuY3Rpb24gKHN0YXRlLCBfZXZlbnQsIG9yaWdpbmFsRXZlbnQsIHByZWRpY3RhYmxlRXhlYykge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBjdXJyZW50QWN0aW9ucyA9IHN0YXRlLmFjdGlvbnM7XG4gICAgc3RhdGUgPSB0aGlzLnRyYW5zaXRpb24oc3RhdGUsIF9ldmVudCwgdW5kZWZpbmVkLCBwcmVkaWN0YWJsZUV4ZWMpOyAvLyBTYXZlIG9yaWdpbmFsIGV2ZW50IHRvIHN0YXRlXG4gICAgLy8gVE9ETzogdGhpcyBzaG91bGQgYmUgdGhlIHJhaXNlZCBldmVudCEgRGVsZXRlIGluIFY1IChicmVha2luZylcblxuICAgIHN0YXRlLl9ldmVudCA9IG9yaWdpbmFsRXZlbnQ7XG4gICAgc3RhdGUuZXZlbnQgPSBvcmlnaW5hbEV2ZW50LmRhdGE7XG5cbiAgICAoX2EgPSBzdGF0ZS5hY3Rpb25zKS51bnNoaWZ0LmFwcGx5KF9hLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoY3VycmVudEFjdGlvbnMpLCBmYWxzZSkpO1xuXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZVRyYW5zaXRpb24gPSBmdW5jdGlvbiAoc3RhdGVUcmFuc2l0aW9uLCBjdXJyZW50U3RhdGUsIGNvbnRleHQsIHByZWRpY3RhYmxlRXhlYywgX2V2ZW50KSB7XG4gICAgdmFyIGVfNiwgX2EsIGVfNywgX2I7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKF9ldmVudCA9PT0gdm9pZCAwKSB7XG4gICAgICBfZXZlbnQgPSBpbml0RXZlbnQ7XG4gICAgfVxuXG4gICAgdmFyIGNvbmZpZ3VyYXRpb24gPSBzdGF0ZVRyYW5zaXRpb24uY29uZmlndXJhdGlvbjsgLy8gVHJhbnNpdGlvbiB3aWxsIFwiYXBwbHlcIiBpZjpcbiAgICAvLyAtIHRoaXMgaXMgdGhlIGluaXRpYWwgc3RhdGUgKHRoZXJlIGlzIG5vIGN1cnJlbnQgc3RhdGUpXG4gICAgLy8gLSBPUiB0aGVyZSBhcmUgdHJhbnNpdGlvbnNcblxuICAgIHZhciB3aWxsVHJhbnNpdGlvbiA9ICFjdXJyZW50U3RhdGUgfHwgc3RhdGVUcmFuc2l0aW9uLnRyYW5zaXRpb25zLmxlbmd0aCA+IDA7XG4gICAgdmFyIHJlc29sdmVkQ29uZmlndXJhdGlvbiA9IHdpbGxUcmFuc2l0aW9uID8gc3RhdGVUcmFuc2l0aW9uLmNvbmZpZ3VyYXRpb24gOiBjdXJyZW50U3RhdGUgPyBjdXJyZW50U3RhdGUuY29uZmlndXJhdGlvbiA6IFtdO1xuICAgIHZhciBpc0RvbmUgPSBpc0luRmluYWxTdGF0ZShyZXNvbHZlZENvbmZpZ3VyYXRpb24sIHRoaXMpO1xuICAgIHZhciByZXNvbHZlZFN0YXRlVmFsdWUgPSB3aWxsVHJhbnNpdGlvbiA/IGdldFZhbHVlKHRoaXMubWFjaGluZSwgY29uZmlndXJhdGlvbikgOiB1bmRlZmluZWQ7XG4gICAgdmFyIGhpc3RvcnlWYWx1ZSA9IGN1cnJlbnRTdGF0ZSA/IGN1cnJlbnRTdGF0ZS5oaXN0b3J5VmFsdWUgPyBjdXJyZW50U3RhdGUuaGlzdG9yeVZhbHVlIDogc3RhdGVUcmFuc2l0aW9uLnNvdXJjZSA/IHRoaXMubWFjaGluZS5oaXN0b3J5VmFsdWUoY3VycmVudFN0YXRlLnZhbHVlKSA6IHVuZGVmaW5lZCA6IHVuZGVmaW5lZDtcbiAgICB2YXIgYWN0aW9uQmxvY2tzID0gdGhpcy5nZXRBY3Rpb25zKG5ldyBTZXQocmVzb2x2ZWRDb25maWd1cmF0aW9uKSwgaXNEb25lLCBzdGF0ZVRyYW5zaXRpb24sIGNvbnRleHQsIF9ldmVudCwgY3VycmVudFN0YXRlLCBwcmVkaWN0YWJsZUV4ZWMpO1xuICAgIHZhciBhY3Rpdml0aWVzID0gY3VycmVudFN0YXRlID8gX19hc3NpZ24oe30sIGN1cnJlbnRTdGF0ZS5hY3Rpdml0aWVzKSA6IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIGFjdGlvbkJsb2Nrc18xID0gX192YWx1ZXMoYWN0aW9uQmxvY2tzKSwgYWN0aW9uQmxvY2tzXzFfMSA9IGFjdGlvbkJsb2Nrc18xLm5leHQoKTsgIWFjdGlvbkJsb2Nrc18xXzEuZG9uZTsgYWN0aW9uQmxvY2tzXzFfMSA9IGFjdGlvbkJsb2Nrc18xLm5leHQoKSkge1xuICAgICAgICB2YXIgYmxvY2sgPSBhY3Rpb25CbG9ja3NfMV8xLnZhbHVlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yICh2YXIgX2MgPSAoZV83ID0gdm9pZCAwLCBfX3ZhbHVlcyhibG9jay5hY3Rpb25zKSksIF9kID0gX2MubmV4dCgpOyAhX2QuZG9uZTsgX2QgPSBfYy5uZXh0KCkpIHtcbiAgICAgICAgICAgIHZhciBhY3Rpb24gPSBfZC52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKGFjdGlvbi50eXBlID09PSBzdGFydCQxKSB7XG4gICAgICAgICAgICAgIGFjdGl2aXRpZXNbYWN0aW9uLmFjdGl2aXR5LmlkIHx8IGFjdGlvbi5hY3Rpdml0eS50eXBlXSA9IGFjdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uLnR5cGUgPT09IHN0b3AkMSkge1xuICAgICAgICAgICAgICBhY3Rpdml0aWVzW2FjdGlvbi5hY3Rpdml0eS5pZCB8fCBhY3Rpb24uYWN0aXZpdHkudHlwZV0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVfN18xKSB7XG4gICAgICAgICAgZV83ID0ge1xuICAgICAgICAgICAgZXJyb3I6IGVfN18xXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKF9kICYmICFfZC5kb25lICYmIChfYiA9IF9jLnJldHVybikpIF9iLmNhbGwoX2MpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBpZiAoZV83KSB0aHJvdyBlXzcuZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV82XzEpIHtcbiAgICAgIGVfNiA9IHtcbiAgICAgICAgZXJyb3I6IGVfNl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoYWN0aW9uQmxvY2tzXzFfMSAmJiAhYWN0aW9uQmxvY2tzXzFfMS5kb25lICYmIChfYSA9IGFjdGlvbkJsb2Nrc18xLnJldHVybikpIF9hLmNhbGwoYWN0aW9uQmxvY2tzXzEpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNikgdGhyb3cgZV82LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBfZSA9IF9fcmVhZChyZXNvbHZlQWN0aW9ucyh0aGlzLCBjdXJyZW50U3RhdGUsIGNvbnRleHQsIF9ldmVudCwgYWN0aW9uQmxvY2tzLCBwcmVkaWN0YWJsZUV4ZWMsIHRoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgfHwgdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVzZXJ2ZUFjdGlvbk9yZGVyKSwgMiksXG4gICAgICAgIHJlc29sdmVkQWN0aW9ucyA9IF9lWzBdLFxuICAgICAgICB1cGRhdGVkQ29udGV4dCA9IF9lWzFdO1xuXG4gICAgdmFyIF9mID0gX19yZWFkKHBhcnRpdGlvbihyZXNvbHZlZEFjdGlvbnMsIGlzUmFpc2FibGVBY3Rpb24pLCAyKSxcbiAgICAgICAgcmFpc2VkRXZlbnRzID0gX2ZbMF0sXG4gICAgICAgIG5vblJhaXNlZEFjdGlvbnMgPSBfZlsxXTtcblxuICAgIHZhciBpbnZva2VBY3Rpb25zID0gcmVzb2x2ZWRBY3Rpb25zLmZpbHRlcihmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICB2YXIgX2E7XG5cbiAgICAgIHJldHVybiBhY3Rpb24udHlwZSA9PT0gc3RhcnQkMSAmJiAoKF9hID0gYWN0aW9uLmFjdGl2aXR5KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudHlwZSkgPT09IGludm9rZTtcbiAgICB9KTtcbiAgICB2YXIgY2hpbGRyZW4gPSBpbnZva2VBY3Rpb25zLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBhY3Rpb24pIHtcbiAgICAgIGFjY1thY3Rpb24uYWN0aXZpdHkuaWRdID0gY3JlYXRlSW52b2NhYmxlQWN0b3IoYWN0aW9uLmFjdGl2aXR5LCBfdGhpcy5tYWNoaW5lLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgY3VycmVudFN0YXRlID8gX19hc3NpZ24oe30sIGN1cnJlbnRTdGF0ZS5jaGlsZHJlbikgOiB7fSk7XG4gICAgdmFyIG5leHRTdGF0ZSA9IG5ldyBTdGF0ZSh7XG4gICAgICB2YWx1ZTogcmVzb2x2ZWRTdGF0ZVZhbHVlIHx8IGN1cnJlbnRTdGF0ZS52YWx1ZSxcbiAgICAgIGNvbnRleHQ6IHVwZGF0ZWRDb250ZXh0LFxuICAgICAgX2V2ZW50OiBfZXZlbnQsXG4gICAgICAvLyBQZXJzaXN0IF9zZXNzaW9uaWQgYmV0d2VlbiBzdGF0ZXNcbiAgICAgIF9zZXNzaW9uaWQ6IGN1cnJlbnRTdGF0ZSA/IGN1cnJlbnRTdGF0ZS5fc2Vzc2lvbmlkIDogbnVsbCxcbiAgICAgIGhpc3RvcnlWYWx1ZTogcmVzb2x2ZWRTdGF0ZVZhbHVlID8gaGlzdG9yeVZhbHVlID8gdXBkYXRlSGlzdG9yeVZhbHVlKGhpc3RvcnlWYWx1ZSwgcmVzb2x2ZWRTdGF0ZVZhbHVlKSA6IHVuZGVmaW5lZCA6IGN1cnJlbnRTdGF0ZSA/IGN1cnJlbnRTdGF0ZS5oaXN0b3J5VmFsdWUgOiB1bmRlZmluZWQsXG4gICAgICBoaXN0b3J5OiAhcmVzb2x2ZWRTdGF0ZVZhbHVlIHx8IHN0YXRlVHJhbnNpdGlvbi5zb3VyY2UgPyBjdXJyZW50U3RhdGUgOiB1bmRlZmluZWQsXG4gICAgICBhY3Rpb25zOiByZXNvbHZlZFN0YXRlVmFsdWUgPyBub25SYWlzZWRBY3Rpb25zIDogW10sXG4gICAgICBhY3Rpdml0aWVzOiByZXNvbHZlZFN0YXRlVmFsdWUgPyBhY3Rpdml0aWVzIDogY3VycmVudFN0YXRlID8gY3VycmVudFN0YXRlLmFjdGl2aXRpZXMgOiB7fSxcbiAgICAgIGV2ZW50czogW10sXG4gICAgICBjb25maWd1cmF0aW9uOiByZXNvbHZlZENvbmZpZ3VyYXRpb24sXG4gICAgICB0cmFuc2l0aW9uczogc3RhdGVUcmFuc2l0aW9uLnRyYW5zaXRpb25zLFxuICAgICAgY2hpbGRyZW46IGNoaWxkcmVuLFxuICAgICAgZG9uZTogaXNEb25lLFxuICAgICAgdGFnczogZ2V0VGFnc0Zyb21Db25maWd1cmF0aW9uKHJlc29sdmVkQ29uZmlndXJhdGlvbiksXG4gICAgICBtYWNoaW5lOiB0aGlzXG4gICAgfSk7XG4gICAgdmFyIGRpZFVwZGF0ZUNvbnRleHQgPSBjb250ZXh0ICE9PSB1cGRhdGVkQ29udGV4dDtcbiAgICBuZXh0U3RhdGUuY2hhbmdlZCA9IF9ldmVudC5uYW1lID09PSB1cGRhdGUgfHwgZGlkVXBkYXRlQ29udGV4dDsgLy8gRGlzcG9zZSBvZiBwZW51bHRpbWF0ZSBoaXN0b3JpZXMgdG8gcHJldmVudCBtZW1vcnkgbGVha3NcblxuICAgIHZhciBoaXN0b3J5ID0gbmV4dFN0YXRlLmhpc3Rvcnk7XG5cbiAgICBpZiAoaGlzdG9yeSkge1xuICAgICAgZGVsZXRlIGhpc3RvcnkuaGlzdG9yeTtcbiAgICB9IC8vIFRoZXJlIGFyZSB0cmFuc2llbnQgdHJhbnNpdGlvbnMgaWYgdGhlIG1hY2hpbmUgaXMgbm90IGluIGEgZmluYWwgc3RhdGVcbiAgICAvLyBhbmQgaWYgc29tZSBvZiB0aGUgc3RhdGUgbm9kZXMgaGF2ZSB0cmFuc2llbnQgKFwiYWx3YXlzXCIpIHRyYW5zaXRpb25zLlxuXG5cbiAgICB2YXIgaGFzQWx3YXlzVHJhbnNpdGlvbnMgPSAhaXNEb25lICYmICh0aGlzLl90cmFuc2llbnQgfHwgY29uZmlndXJhdGlvbi5zb21lKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZU5vZGUuX3RyYW5zaWVudDtcbiAgICB9KSk7IC8vIElmIHRoZXJlIGFyZSBubyBlbmFibGVkIHRyYW5zaXRpb25zLCBjaGVjayBpZiB0aGVyZSBhcmUgdHJhbnNpZW50IHRyYW5zaXRpb25zLlxuICAgIC8vIElmIHRoZXJlIGFyZSB0cmFuc2llbnQgdHJhbnNpdGlvbnMsIGNvbnRpbnVlIGNoZWNraW5nIGZvciBtb3JlIHRyYW5zaXRpb25zXG4gICAgLy8gYmVjYXVzZSBhbiB0cmFuc2llbnQgdHJhbnNpdGlvbiBzaG91bGQgYmUgdHJpZ2dlcmVkIGV2ZW4gaWYgdGhlcmUgYXJlIG5vXG4gICAgLy8gZW5hYmxlZCB0cmFuc2l0aW9ucy5cbiAgICAvL1xuICAgIC8vIElmIHdlJ3JlIGFscmVhZHkgd29ya2luZyBvbiBhbiB0cmFuc2llbnQgdHJhbnNpdGlvbiB0aGVuIHN0b3AgdG8gcHJldmVudCBhbiBpbmZpbml0ZSBsb29wLlxuICAgIC8vXG4gICAgLy8gT3RoZXJ3aXNlLCBpZiB0aGVyZSBhcmUgbm8gZW5hYmxlZCBub3IgdHJhbnNpZW50IHRyYW5zaXRpb25zLCB3ZSBhcmUgZG9uZS5cblxuICAgIGlmICghd2lsbFRyYW5zaXRpb24gJiYgKCFoYXNBbHdheXNUcmFuc2l0aW9ucyB8fCBfZXZlbnQubmFtZSA9PT0gTlVMTF9FVkVOVCkpIHtcbiAgICAgIHJldHVybiBuZXh0U3RhdGU7XG4gICAgfVxuXG4gICAgdmFyIG1heWJlTmV4dFN0YXRlID0gbmV4dFN0YXRlO1xuXG4gICAgaWYgKCFpc0RvbmUpIHtcbiAgICAgIGlmIChoYXNBbHdheXNUcmFuc2l0aW9ucykge1xuICAgICAgICBtYXliZU5leHRTdGF0ZSA9IHRoaXMucmVzb2x2ZVJhaXNlZFRyYW5zaXRpb24obWF5YmVOZXh0U3RhdGUsIHtcbiAgICAgICAgICB0eXBlOiBudWxsRXZlbnRcbiAgICAgICAgfSwgX2V2ZW50LCBwcmVkaWN0YWJsZUV4ZWMpO1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAocmFpc2VkRXZlbnRzLmxlbmd0aCkge1xuICAgICAgICB2YXIgcmFpc2VkRXZlbnQgPSByYWlzZWRFdmVudHMuc2hpZnQoKTtcbiAgICAgICAgbWF5YmVOZXh0U3RhdGUgPSB0aGlzLnJlc29sdmVSYWlzZWRUcmFuc2l0aW9uKG1heWJlTmV4dFN0YXRlLCByYWlzZWRFdmVudC5fZXZlbnQsIF9ldmVudCwgcHJlZGljdGFibGVFeGVjKTtcbiAgICAgIH1cbiAgICB9IC8vIERldGVjdCBpZiBzdGF0ZSBjaGFuZ2VkXG5cblxuICAgIHZhciBjaGFuZ2VkID0gbWF5YmVOZXh0U3RhdGUuY2hhbmdlZCB8fCAoaGlzdG9yeSA/ICEhbWF5YmVOZXh0U3RhdGUuYWN0aW9ucy5sZW5ndGggfHwgZGlkVXBkYXRlQ29udGV4dCB8fCB0eXBlb2YgaGlzdG9yeS52YWx1ZSAhPT0gdHlwZW9mIG1heWJlTmV4dFN0YXRlLnZhbHVlIHx8ICFzdGF0ZVZhbHVlc0VxdWFsKG1heWJlTmV4dFN0YXRlLnZhbHVlLCBoaXN0b3J5LnZhbHVlKSA6IHVuZGVmaW5lZCk7XG4gICAgbWF5YmVOZXh0U3RhdGUuY2hhbmdlZCA9IGNoYW5nZWQ7IC8vIFByZXNlcnZlIG9yaWdpbmFsIGhpc3RvcnkgYWZ0ZXIgcmFpc2VkIGV2ZW50c1xuXG4gICAgbWF5YmVOZXh0U3RhdGUuaGlzdG9yeSA9IGhpc3Rvcnk7XG4gICAgcmV0dXJuIG1heWJlTmV4dFN0YXRlO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBjaGlsZCBzdGF0ZSBub2RlIGZyb20gaXRzIHJlbGF0aXZlIGBzdGF0ZUtleWAsIG9yIHRocm93cy5cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0U3RhdGVOb2RlID0gZnVuY3Rpb24gKHN0YXRlS2V5KSB7XG4gICAgaWYgKGlzU3RhdGVJZChzdGF0ZUtleSkpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hY2hpbmUuZ2V0U3RhdGVOb2RlQnlJZChzdGF0ZUtleSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHJldHJpZXZlIGNoaWxkIHN0YXRlICdcIi5jb25jYXQoc3RhdGVLZXksIFwiJyBmcm9tICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJzsgbm8gY2hpbGQgc3RhdGVzIGV4aXN0LlwiKSk7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IHRoaXMuc3RhdGVzW3N0YXRlS2V5XTtcblxuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZCBzdGF0ZSAnXCIuY29uY2F0KHN0YXRlS2V5LCBcIicgZG9lcyBub3QgZXhpc3Qgb24gJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBzdGF0ZSBub2RlIHdpdGggdGhlIGdpdmVuIGBzdGF0ZUlkYCwgb3IgdGhyb3dzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlSWQgVGhlIHN0YXRlIElELiBUaGUgcHJlZml4IFwiI1wiIGlzIHJlbW92ZWQuXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFN0YXRlTm9kZUJ5SWQgPSBmdW5jdGlvbiAoc3RhdGVJZCkge1xuICAgIHZhciByZXNvbHZlZFN0YXRlSWQgPSBpc1N0YXRlSWQoc3RhdGVJZCkgPyBzdGF0ZUlkLnNsaWNlKFNUQVRFX0lERU5USUZJRVIubGVuZ3RoKSA6IHN0YXRlSWQ7XG5cbiAgICBpZiAocmVzb2x2ZWRTdGF0ZUlkID09PSB0aGlzLmlkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgc3RhdGVOb2RlID0gdGhpcy5tYWNoaW5lLmlkTWFwW3Jlc29sdmVkU3RhdGVJZF07XG5cbiAgICBpZiAoIXN0YXRlTm9kZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGQgc3RhdGUgbm9kZSAnI1wiLmNvbmNhdChyZXNvbHZlZFN0YXRlSWQsIFwiJyBkb2VzIG5vdCBleGlzdCBvbiBtYWNoaW5lICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJ1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlTm9kZTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgcmVsYXRpdmUgc3RhdGUgbm9kZSBmcm9tIHRoZSBnaXZlbiBgc3RhdGVQYXRoYCwgb3IgdGhyb3dzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlUGF0aCBUaGUgc3RyaW5nIG9yIHN0cmluZyBhcnJheSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBzdGF0ZSBub2RlLlxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRTdGF0ZU5vZGVCeVBhdGggPSBmdW5jdGlvbiAoc3RhdGVQYXRoKSB7XG4gICAgaWYgKHR5cGVvZiBzdGF0ZVBhdGggPT09ICdzdHJpbmcnICYmIGlzU3RhdGVJZChzdGF0ZVBhdGgpKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZU5vZGVCeUlkKHN0YXRlUGF0aC5zbGljZSgxKSk7XG4gICAgICB9IGNhdGNoIChlKSB7Ly8gdHJ5IGluZGl2aWR1YWwgcGF0aHNcbiAgICAgICAgLy8gdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYXJyYXlTdGF0ZVBhdGggPSB0b1N0YXRlUGF0aChzdGF0ZVBhdGgsIHRoaXMuZGVsaW1pdGVyKS5zbGljZSgpO1xuICAgIHZhciBjdXJyZW50U3RhdGVOb2RlID0gdGhpcztcblxuICAgIHdoaWxlIChhcnJheVN0YXRlUGF0aC5sZW5ndGgpIHtcbiAgICAgIHZhciBrZXkgPSBhcnJheVN0YXRlUGF0aC5zaGlmdCgpO1xuXG4gICAgICBpZiAoIWtleS5sZW5ndGgpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGN1cnJlbnRTdGF0ZU5vZGUgPSBjdXJyZW50U3RhdGVOb2RlLmdldFN0YXRlTm9kZShrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiBjdXJyZW50U3RhdGVOb2RlO1xuICB9O1xuICAvKipcclxuICAgKiBSZXNvbHZlcyBhIHBhcnRpYWwgc3RhdGUgdmFsdWUgd2l0aCBpdHMgZnVsbCByZXByZXNlbnRhdGlvbiBpbiB0aGlzIG1hY2hpbmUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGVWYWx1ZSBUaGUgcGFydGlhbCBzdGF0ZSB2YWx1ZSB0byByZXNvbHZlLlxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCFzdGF0ZVZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbml0aWFsU3RhdGVWYWx1ZSB8fCBFTVBUWV9PQkpFQ1Q7IC8vIFRPRE86IHR5cGUtc3BlY2lmaWMgcHJvcGVydGllc1xuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlICdwYXJhbGxlbCc6XG4gICAgICAgIHJldHVybiBtYXBWYWx1ZXModGhpcy5pbml0aWFsU3RhdGVWYWx1ZSwgZnVuY3Rpb24gKHN1YlN0YXRlVmFsdWUsIHN1YlN0YXRlS2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHN1YlN0YXRlVmFsdWUgPyBfdGhpcy5nZXRTdGF0ZU5vZGUoc3ViU3RhdGVLZXkpLnJlc29sdmUoc3RhdGVWYWx1ZVtzdWJTdGF0ZUtleV0gfHwgc3ViU3RhdGVWYWx1ZSkgOiBFTVBUWV9PQkpFQ1Q7XG4gICAgICAgIH0pO1xuXG4gICAgICBjYXNlICdjb21wb3VuZCc6XG4gICAgICAgIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgICAgICAgIHZhciBzdWJTdGF0ZU5vZGUgPSB0aGlzLmdldFN0YXRlTm9kZShzdGF0ZVZhbHVlKTtcblxuICAgICAgICAgIGlmIChzdWJTdGF0ZU5vZGUudHlwZSA9PT0gJ3BhcmFsbGVsJyB8fCBzdWJTdGF0ZU5vZGUudHlwZSA9PT0gJ2NvbXBvdW5kJykge1xuICAgICAgICAgICAgcmV0dXJuIF9hID0ge30sIF9hW3N0YXRlVmFsdWVdID0gc3ViU3RhdGVOb2RlLmluaXRpYWxTdGF0ZVZhbHVlLCBfYTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc3RhdGVWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSkubGVuZ3RoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbFN0YXRlVmFsdWUgfHwge307XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWFwVmFsdWVzKHN0YXRlVmFsdWUsIGZ1bmN0aW9uIChzdWJTdGF0ZVZhbHVlLCBzdWJTdGF0ZUtleSkge1xuICAgICAgICAgIHJldHVybiBzdWJTdGF0ZVZhbHVlID8gX3RoaXMuZ2V0U3RhdGVOb2RlKHN1YlN0YXRlS2V5KS5yZXNvbHZlKHN1YlN0YXRlVmFsdWUpIDogRU1QVFlfT0JKRUNUO1xuICAgICAgICB9KTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHN0YXRlVmFsdWUgfHwgRU1QVFlfT0JKRUNUO1xuICAgIH1cbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFJlc29sdmVkUGF0aCA9IGZ1bmN0aW9uIChzdGF0ZUlkZW50aWZpZXIpIHtcbiAgICBpZiAoaXNTdGF0ZUlkKHN0YXRlSWRlbnRpZmllcikpIHtcbiAgICAgIHZhciBzdGF0ZU5vZGUgPSB0aGlzLm1hY2hpbmUuaWRNYXBbc3RhdGVJZGVudGlmaWVyLnNsaWNlKFNUQVRFX0lERU5USUZJRVIubGVuZ3RoKV07XG5cbiAgICAgIGlmICghc3RhdGVOb2RlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBmaW5kIHN0YXRlIG5vZGUgJ1wiLmNvbmNhdChzdGF0ZUlkZW50aWZpZXIsIFwiJ1wiKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGF0ZU5vZGUucGF0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9TdGF0ZVBhdGgoc3RhdGVJZGVudGlmaWVyLCB0aGlzLmRlbGltaXRlcik7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiaW5pdGlhbFN0YXRlVmFsdWVcIiwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF9hO1xuXG4gICAgICBpZiAodGhpcy5fX2NhY2hlLmluaXRpYWxTdGF0ZVZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuaW5pdGlhbFN0YXRlVmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbml0aWFsU3RhdGVWYWx1ZTtcblxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ3BhcmFsbGVsJykge1xuICAgICAgICBpbml0aWFsU3RhdGVWYWx1ZSA9IG1hcEZpbHRlclZhbHVlcyh0aGlzLnN0YXRlcywgZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlLmluaXRpYWxTdGF0ZVZhbHVlIHx8IEVNUFRZX09CSkVDVDtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgICAgIHJldHVybiAhKHN0YXRlTm9kZS50eXBlID09PSAnaGlzdG9yeScpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbml0aWFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlc1t0aGlzLmluaXRpYWxdKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5pdGlhbCBzdGF0ZSAnXCIuY29uY2F0KHRoaXMuaW5pdGlhbCwgXCInIG5vdCBmb3VuZCBvbiAnXCIpLmNvbmNhdCh0aGlzLmtleSwgXCInXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRpYWxTdGF0ZVZhbHVlID0gaXNMZWFmTm9kZSh0aGlzLnN0YXRlc1t0aGlzLmluaXRpYWxdKSA/IHRoaXMuaW5pdGlhbCA6IChfYSA9IHt9LCBfYVt0aGlzLmluaXRpYWxdID0gdGhpcy5zdGF0ZXNbdGhpcy5pbml0aWFsXS5pbml0aWFsU3RhdGVWYWx1ZSwgX2EpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhlIGZpbml0ZSBzdGF0ZSB2YWx1ZSBvZiBhIG1hY2hpbmUgd2l0aG91dCBjaGlsZCBzdGF0ZXMgaXMganVzdCBhbiBlbXB0eSBvYmplY3RcbiAgICAgICAgaW5pdGlhbFN0YXRlVmFsdWUgPSB7fTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fX2NhY2hlLmluaXRpYWxTdGF0ZVZhbHVlID0gaW5pdGlhbFN0YXRlVmFsdWU7XG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmluaXRpYWxTdGF0ZVZhbHVlO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0SW5pdGlhbFN0YXRlID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIGNvbnRleHQpIHtcbiAgICB0aGlzLl9pbml0KCk7IC8vIFRPRE86IHRoaXMgc2hvdWxkIGJlIGluIHRoZSBjb25zdHJ1Y3RvciAoc2VlIG5vdGUgaW4gY29uc3RydWN0b3IpXG5cblxuICAgIHZhciBjb25maWd1cmF0aW9uID0gdGhpcy5nZXRTdGF0ZU5vZGVzKHN0YXRlVmFsdWUpO1xuICAgIHJldHVybiB0aGlzLnJlc29sdmVUcmFuc2l0aW9uKHtcbiAgICAgIGNvbmZpZ3VyYXRpb246IGNvbmZpZ3VyYXRpb24sXG4gICAgICBleGl0U2V0OiBbXSxcbiAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgIHNvdXJjZTogdW5kZWZpbmVkLFxuICAgICAgYWN0aW9uczogW11cbiAgICB9LCB1bmRlZmluZWQsIGNvbnRleHQgIT09IG51bGwgJiYgY29udGV4dCAhPT0gdm9pZCAwID8gY29udGV4dCA6IHRoaXMubWFjaGluZS5jb250ZXh0LCB1bmRlZmluZWQpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImluaXRpYWxTdGF0ZVwiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBUaGUgaW5pdGlhbCBTdGF0ZSBpbnN0YW5jZSwgd2hpY2ggaW5jbHVkZXMgYWxsIGFjdGlvbnMgdG8gYmUgZXhlY3V0ZWQgZnJvbVxyXG4gICAgICogZW50ZXJpbmcgdGhlIGluaXRpYWwgc3RhdGUuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpbml0aWFsU3RhdGVWYWx1ZSA9IHRoaXMuaW5pdGlhbFN0YXRlVmFsdWU7XG5cbiAgICAgIGlmICghaW5pdGlhbFN0YXRlVmFsdWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJldHJpZXZlIGluaXRpYWwgc3RhdGUgZnJvbSBzaW1wbGUgc3RhdGUgJ1wiLmNvbmNhdCh0aGlzLmlkLCBcIicuXCIpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0SW5pdGlhbFN0YXRlKGluaXRpYWxTdGF0ZVZhbHVlKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwidGFyZ2V0XCIsIHtcbiAgICAvKipcclxuICAgICAqIFRoZSB0YXJnZXQgc3RhdGUgdmFsdWUgb2YgdGhlIGhpc3Rvcnkgc3RhdGUgbm9kZSwgaWYgaXQgZXhpc3RzLiBUaGlzIHJlcHJlc2VudHMgdGhlXHJcbiAgICAgKiBkZWZhdWx0IHN0YXRlIHZhbHVlIHRvIHRyYW5zaXRpb24gdG8gaWYgbm8gaGlzdG9yeSB2YWx1ZSBleGlzdHMgeWV0LlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGFyZ2V0O1xuXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnaGlzdG9yeScpIHtcbiAgICAgICAgdmFyIGhpc3RvcnlDb25maWcgPSB0aGlzLmNvbmZpZztcblxuICAgICAgICBpZiAoaXNTdHJpbmcoaGlzdG9yeUNvbmZpZy50YXJnZXQpKSB7XG4gICAgICAgICAgdGFyZ2V0ID0gaXNTdGF0ZUlkKGhpc3RvcnlDb25maWcudGFyZ2V0KSA/IHBhdGhUb1N0YXRlVmFsdWUodGhpcy5tYWNoaW5lLmdldFN0YXRlTm9kZUJ5SWQoaGlzdG9yeUNvbmZpZy50YXJnZXQpLnBhdGguc2xpY2UodGhpcy5wYXRoLmxlbmd0aCAtIDEpKSA6IGhpc3RvcnlDb25maWcudGFyZ2V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldCA9IGhpc3RvcnlDb25maWcudGFyZ2V0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGxlYWYgbm9kZXMgZnJvbSBhIHN0YXRlIHBhdGggcmVsYXRpdmUgdG8gdGhpcyBzdGF0ZSBub2RlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlbGF0aXZlU3RhdGVJZCBUaGUgcmVsYXRpdmUgc3RhdGUgcGF0aCB0byByZXRyaWV2ZSB0aGUgc3RhdGUgbm9kZXNcclxuICAgKiBAcGFyYW0gaGlzdG9yeSBUaGUgcHJldmlvdXMgc3RhdGUgdG8gcmV0cmlldmUgaGlzdG9yeVxyXG4gICAqIEBwYXJhbSByZXNvbHZlIFdoZXRoZXIgc3RhdGUgbm9kZXMgc2hvdWxkIHJlc29sdmUgdG8gaW5pdGlhbCBjaGlsZCBzdGF0ZSBub2Rlc1xyXG4gICAqL1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0UmVsYXRpdmVTdGF0ZU5vZGVzID0gZnVuY3Rpb24gKHJlbGF0aXZlU3RhdGVJZCwgaGlzdG9yeVZhbHVlLCByZXNvbHZlKSB7XG4gICAgaWYgKHJlc29sdmUgPT09IHZvaWQgMCkge1xuICAgICAgcmVzb2x2ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc29sdmUgPyByZWxhdGl2ZVN0YXRlSWQudHlwZSA9PT0gJ2hpc3RvcnknID8gcmVsYXRpdmVTdGF0ZUlkLnJlc29sdmVIaXN0b3J5KGhpc3RvcnlWYWx1ZSkgOiByZWxhdGl2ZVN0YXRlSWQuaW5pdGlhbFN0YXRlTm9kZXMgOiBbcmVsYXRpdmVTdGF0ZUlkXTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJpbml0aWFsU3RhdGVOb2Rlc1wiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICBpZiAoaXNMZWFmTm9kZSh0aGlzKSkge1xuICAgICAgICByZXR1cm4gW3RoaXNdO1xuICAgICAgfSAvLyBDYXNlIHdoZW4gc3RhdGUgbm9kZSBpcyBjb21wb3VuZCBidXQgbm8gaW5pdGlhbCBzdGF0ZSBpcyBkZWZpbmVkXG5cblxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2NvbXBvdW5kJyAmJiAhdGhpcy5pbml0aWFsKSB7XG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgIHdhcm4oZmFsc2UsIFwiQ29tcG91bmQgc3RhdGUgbm9kZSAnXCIuY29uY2F0KHRoaXMuaWQsIFwiJyBoYXMgbm8gaW5pdGlhbCBzdGF0ZS5cIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICAgIH1cblxuICAgICAgdmFyIGluaXRpYWxTdGF0ZU5vZGVQYXRocyA9IHRvU3RhdGVQYXRocyh0aGlzLmluaXRpYWxTdGF0ZVZhbHVlKTtcbiAgICAgIHJldHVybiBmbGF0dGVuKGluaXRpYWxTdGF0ZU5vZGVQYXRocy5tYXAoZnVuY3Rpb24gKGluaXRpYWxQYXRoKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5nZXRGcm9tUmVsYXRpdmVQYXRoKGluaXRpYWxQYXRoKTtcbiAgICAgIH0pKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIHN0YXRlIG5vZGVzIGZyb20gYSByZWxhdGl2ZSBwYXRoIHRvIHRoaXMgc3RhdGUgbm9kZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZWxhdGl2ZVBhdGggVGhlIHJlbGF0aXZlIHBhdGggZnJvbSB0aGlzIHN0YXRlIG5vZGVcclxuICAgKiBAcGFyYW0gaGlzdG9yeVZhbHVlXHJcbiAgICovXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRGcm9tUmVsYXRpdmVQYXRoID0gZnVuY3Rpb24gKHJlbGF0aXZlUGF0aCkge1xuICAgIGlmICghcmVsYXRpdmVQYXRoLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICB9XG5cbiAgICB2YXIgX2EgPSBfX3JlYWQocmVsYXRpdmVQYXRoKSxcbiAgICAgICAgc3RhdGVLZXkgPSBfYVswXSxcbiAgICAgICAgY2hpbGRTdGF0ZVBhdGggPSBfYS5zbGljZSgxKTtcblxuICAgIGlmICghdGhpcy5zdGF0ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXRyaWV2ZSBzdWJQYXRoICdcIi5jb25jYXQoc3RhdGVLZXksIFwiJyBmcm9tIG5vZGUgd2l0aCBubyBzdGF0ZXNcIikpO1xuICAgIH1cblxuICAgIHZhciBjaGlsZFN0YXRlTm9kZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN0YXRlS2V5KTtcblxuICAgIGlmIChjaGlsZFN0YXRlTm9kZS50eXBlID09PSAnaGlzdG9yeScpIHtcbiAgICAgIHJldHVybiBjaGlsZFN0YXRlTm9kZS5yZXNvbHZlSGlzdG9yeSgpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZXNbc3RhdGVLZXldKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZCBzdGF0ZSAnXCIuY29uY2F0KHN0YXRlS2V5LCBcIicgZG9lcyBub3QgZXhpc3Qgb24gJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zdGF0ZXNbc3RhdGVLZXldLmdldEZyb21SZWxhdGl2ZVBhdGgoY2hpbGRTdGF0ZVBhdGgpO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuaGlzdG9yeVZhbHVlID0gZnVuY3Rpb24gKHJlbGF0aXZlU3RhdGVWYWx1ZSkge1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudDogcmVsYXRpdmVTdGF0ZVZhbHVlIHx8IHRoaXMuaW5pdGlhbFN0YXRlVmFsdWUsXG4gICAgICBzdGF0ZXM6IG1hcEZpbHRlclZhbHVlcyh0aGlzLnN0YXRlcywgZnVuY3Rpb24gKHN0YXRlTm9kZSwga2V5KSB7XG4gICAgICAgIGlmICghcmVsYXRpdmVTdGF0ZVZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlTm9kZS5oaXN0b3J5VmFsdWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdWJTdGF0ZVZhbHVlID0gaXNTdHJpbmcocmVsYXRpdmVTdGF0ZVZhbHVlKSA/IHVuZGVmaW5lZCA6IHJlbGF0aXZlU3RhdGVWYWx1ZVtrZXldO1xuICAgICAgICByZXR1cm4gc3RhdGVOb2RlLmhpc3RvcnlWYWx1ZShzdWJTdGF0ZVZhbHVlIHx8IHN0YXRlTm9kZS5pbml0aWFsU3RhdGVWYWx1ZSk7XG4gICAgICB9LCBmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICAgIHJldHVybiAhc3RhdGVOb2RlLmhpc3Rvcnk7XG4gICAgICB9KVxuICAgIH07XG4gIH07XG4gIC8qKlxyXG4gICAqIFJlc29sdmVzIHRvIHRoZSBoaXN0b3JpY2FsIHZhbHVlKHMpIG9mIHRoZSBwYXJlbnQgc3RhdGUgbm9kZSxcclxuICAgKiByZXByZXNlbnRlZCBieSBzdGF0ZSBub2Rlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBoaXN0b3J5VmFsdWVcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZUhpc3RvcnkgPSBmdW5jdGlvbiAoaGlzdG9yeVZhbHVlKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh0aGlzLnR5cGUgIT09ICdoaXN0b3J5Jykge1xuICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICB9XG5cbiAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XG5cbiAgICBpZiAoIWhpc3RvcnlWYWx1ZSkge1xuICAgICAgdmFyIGhpc3RvcnlUYXJnZXQgPSB0aGlzLnRhcmdldDtcbiAgICAgIHJldHVybiBoaXN0b3J5VGFyZ2V0ID8gZmxhdHRlbih0b1N0YXRlUGF0aHMoaGlzdG9yeVRhcmdldCkubWFwKGZ1bmN0aW9uIChyZWxhdGl2ZUNoaWxkUGF0aCkge1xuICAgICAgICByZXR1cm4gcGFyZW50LmdldEZyb21SZWxhdGl2ZVBhdGgocmVsYXRpdmVDaGlsZFBhdGgpO1xuICAgICAgfSkpIDogcGFyZW50LmluaXRpYWxTdGF0ZU5vZGVzO1xuICAgIH1cblxuICAgIHZhciBzdWJIaXN0b3J5VmFsdWUgPSBuZXN0ZWRQYXRoKHBhcmVudC5wYXRoLCAnc3RhdGVzJykoaGlzdG9yeVZhbHVlKS5jdXJyZW50O1xuXG4gICAgaWYgKGlzU3RyaW5nKHN1Ykhpc3RvcnlWYWx1ZSkpIHtcbiAgICAgIHJldHVybiBbcGFyZW50LmdldFN0YXRlTm9kZShzdWJIaXN0b3J5VmFsdWUpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmxhdHRlbih0b1N0YXRlUGF0aHMoc3ViSGlzdG9yeVZhbHVlKS5tYXAoZnVuY3Rpb24gKHN1YlN0YXRlUGF0aCkge1xuICAgICAgcmV0dXJuIF90aGlzLmhpc3RvcnkgPT09ICdkZWVwJyA/IHBhcmVudC5nZXRGcm9tUmVsYXRpdmVQYXRoKHN1YlN0YXRlUGF0aCkgOiBbcGFyZW50LnN0YXRlc1tzdWJTdGF0ZVBhdGhbMF1dXTtcbiAgICB9KSk7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwic3RhdGVJZHNcIiwge1xuICAgIC8qKlxyXG4gICAgICogQWxsIHRoZSBzdGF0ZSBub2RlIElEcyBvZiB0aGlzIHN0YXRlIG5vZGUgYW5kIGl0cyBkZXNjZW5kYW50IHN0YXRlIG5vZGVzLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgY2hpbGRTdGF0ZUlkcyA9IGZsYXR0ZW4oT2JqZWN0LmtleXModGhpcy5zdGF0ZXMpLm1hcChmdW5jdGlvbiAoc3RhdGVLZXkpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnN0YXRlc1tzdGF0ZUtleV0uc3RhdGVJZHM7XG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gW3RoaXMuaWRdLmNvbmNhdChjaGlsZFN0YXRlSWRzKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiZXZlbnRzXCIsIHtcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgZXZlbnQgdHlwZXMgYWNjZXB0ZWQgYnkgdGhpcyBzdGF0ZSBub2RlIGFuZCBpdHMgZGVzY2VuZGFudHMuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlXzgsIF9hLCBlXzksIF9iO1xuXG4gICAgICBpZiAodGhpcy5fX2NhY2hlLmV2ZW50cykge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmV2ZW50cztcbiAgICAgIH1cblxuICAgICAgdmFyIHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xuICAgICAgdmFyIGV2ZW50cyA9IG5ldyBTZXQodGhpcy5vd25FdmVudHMpO1xuXG4gICAgICBpZiAoc3RhdGVzKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZm9yICh2YXIgX2MgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhzdGF0ZXMpKSwgX2QgPSBfYy5uZXh0KCk7ICFfZC5kb25lOyBfZCA9IF9jLm5leHQoKSkge1xuICAgICAgICAgICAgdmFyIHN0YXRlSWQgPSBfZC52YWx1ZTtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHN0YXRlc1tzdGF0ZUlkXTtcblxuICAgICAgICAgICAgaWYgKHN0YXRlLnN0YXRlcykge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIF9lID0gKGVfOSA9IHZvaWQgMCwgX192YWx1ZXMoc3RhdGUuZXZlbnRzKSksIF9mID0gX2UubmV4dCgpOyAhX2YuZG9uZTsgX2YgPSBfZS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBldmVudF8xID0gX2YudmFsdWU7XG4gICAgICAgICAgICAgICAgICBldmVudHMuYWRkKFwiXCIuY29uY2F0KGV2ZW50XzEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGVfOV8xKSB7XG4gICAgICAgICAgICAgICAgZV85ID0ge1xuICAgICAgICAgICAgICAgICAgZXJyb3I6IGVfOV8xXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgaWYgKF9mICYmICFfZi5kb25lICYmIChfYiA9IF9lLnJldHVybikpIF9iLmNhbGwoX2UpO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICBpZiAoZV85KSB0aHJvdyBlXzkuZXJyb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlXzhfMSkge1xuICAgICAgICAgIGVfOCA9IHtcbiAgICAgICAgICAgIGVycm9yOiBlXzhfMVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChfZCAmJiAhX2QuZG9uZSAmJiAoX2EgPSBfYy5yZXR1cm4pKSBfYS5jYWxsKF9jKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgaWYgKGVfOCkgdGhyb3cgZV84LmVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmV2ZW50cyA9IEFycmF5LmZyb20oZXZlbnRzKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwib3duRXZlbnRzXCIsIHtcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgZXZlbnRzIHRoYXQgaGF2ZSB0cmFuc2l0aW9ucyBkaXJlY3RseSBmcm9tIHRoaXMgc3RhdGUgbm9kZS5cclxuICAgICAqXHJcbiAgICAgKiBFeGNsdWRlcyBhbnkgaW5lcnQgZXZlbnRzLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZXZlbnRzID0gbmV3IFNldCh0aGlzLnRyYW5zaXRpb25zLmZpbHRlcihmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gISghdHJhbnNpdGlvbi50YXJnZXQgJiYgIXRyYW5zaXRpb24uYWN0aW9ucy5sZW5ndGggJiYgdHJhbnNpdGlvbi5pbnRlcm5hbCk7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb24uZXZlbnRUeXBlO1xuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20oZXZlbnRzKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmVUYXJnZXQgPSBmdW5jdGlvbiAoX3RhcmdldCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoX3RhcmdldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBhbiB1bmRlZmluZWQgdGFyZ2V0IHNpZ25hbHMgdGhhdCB0aGUgc3RhdGUgbm9kZSBzaG91bGQgbm90IHRyYW5zaXRpb24gZnJvbSB0aGF0IHN0YXRlIHdoZW4gcmVjZWl2aW5nIHRoYXQgZXZlbnRcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIF90YXJnZXQubWFwKGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgIGlmICghaXNTdHJpbmcodGFyZ2V0KSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgfVxuXG4gICAgICB2YXIgaXNJbnRlcm5hbFRhcmdldCA9IHRhcmdldFswXSA9PT0gX3RoaXMuZGVsaW1pdGVyOyAvLyBJZiBpbnRlcm5hbCB0YXJnZXQgaXMgZGVmaW5lZCBvbiBtYWNoaW5lLFxuICAgICAgLy8gZG8gbm90IGluY2x1ZGUgbWFjaGluZSBrZXkgb24gdGFyZ2V0XG5cbiAgICAgIGlmIChpc0ludGVybmFsVGFyZ2V0ICYmICFfdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmdldFN0YXRlTm9kZUJ5UGF0aCh0YXJnZXQuc2xpY2UoMSkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVzb2x2ZWRUYXJnZXQgPSBpc0ludGVybmFsVGFyZ2V0ID8gX3RoaXMua2V5ICsgdGFyZ2V0IDogdGFyZ2V0O1xuXG4gICAgICBpZiAoX3RoaXMucGFyZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIHRhcmdldFN0YXRlTm9kZSA9IF90aGlzLnBhcmVudC5nZXRTdGF0ZU5vZGVCeVBhdGgocmVzb2x2ZWRUYXJnZXQpO1xuXG4gICAgICAgICAgcmV0dXJuIHRhcmdldFN0YXRlTm9kZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0cmFuc2l0aW9uIGRlZmluaXRpb24gZm9yIHN0YXRlIG5vZGUgJ1wiLmNvbmNhdChfdGhpcy5pZCwgXCInOlxcblwiKS5jb25jYXQoZXJyLm1lc3NhZ2UpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmdldFN0YXRlTm9kZUJ5UGF0aChyZXNvbHZlZFRhcmdldCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5mb3JtYXRUcmFuc2l0aW9uID0gZnVuY3Rpb24gKHRyYW5zaXRpb25Db25maWcpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIG5vcm1hbGl6ZWRUYXJnZXQgPSBub3JtYWxpemVUYXJnZXQodHJhbnNpdGlvbkNvbmZpZy50YXJnZXQpO1xuICAgIHZhciBpbnRlcm5hbCA9ICdpbnRlcm5hbCcgaW4gdHJhbnNpdGlvbkNvbmZpZyA/IHRyYW5zaXRpb25Db25maWcuaW50ZXJuYWwgOiBub3JtYWxpemVkVGFyZ2V0ID8gbm9ybWFsaXplZFRhcmdldC5zb21lKGZ1bmN0aW9uIChfdGFyZ2V0KSB7XG4gICAgICByZXR1cm4gaXNTdHJpbmcoX3RhcmdldCkgJiYgX3RhcmdldFswXSA9PT0gX3RoaXMuZGVsaW1pdGVyO1xuICAgIH0pIDogdHJ1ZTtcbiAgICB2YXIgZ3VhcmRzID0gdGhpcy5tYWNoaW5lLm9wdGlvbnMuZ3VhcmRzO1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLnJlc29sdmVUYXJnZXQobm9ybWFsaXplZFRhcmdldCk7XG5cbiAgICB2YXIgdHJhbnNpdGlvbiA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCB0cmFuc2l0aW9uQ29uZmlnKSwge1xuICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKHRvQXJyYXkodHJhbnNpdGlvbkNvbmZpZy5hY3Rpb25zKSksXG4gICAgICBjb25kOiB0b0d1YXJkKHRyYW5zaXRpb25Db25maWcuY29uZCwgZ3VhcmRzKSxcbiAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgc291cmNlOiB0aGlzLFxuICAgICAgaW50ZXJuYWw6IGludGVybmFsLFxuICAgICAgZXZlbnRUeXBlOiB0cmFuc2l0aW9uQ29uZmlnLmV2ZW50LFxuICAgICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdHJhbnNpdGlvbiksIHtcbiAgICAgICAgICB0YXJnZXQ6IHRyYW5zaXRpb24udGFyZ2V0ID8gdHJhbnNpdGlvbi50YXJnZXQubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gXCIjXCIuY29uY2F0KHQuaWQpO1xuICAgICAgICAgIH0pIDogdW5kZWZpbmVkLFxuICAgICAgICAgIHNvdXJjZTogXCIjXCIuY29uY2F0KF90aGlzLmlkKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cmFuc2l0aW9uO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZm9ybWF0VHJhbnNpdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVfMTAsIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBvbkNvbmZpZztcblxuICAgIGlmICghdGhpcy5jb25maWcub24pIHtcbiAgICAgIG9uQ29uZmlnID0gW107XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRoaXMuY29uZmlnLm9uKSkge1xuICAgICAgb25Db25maWcgPSB0aGlzLmNvbmZpZy5vbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIF9iID0gdGhpcy5jb25maWcub24sXG4gICAgICAgICAgX2MgPSBXSUxEQ0FSRCxcbiAgICAgICAgICBfZCA9IF9iW19jXSxcbiAgICAgICAgICB3aWxkY2FyZENvbmZpZ3MgPSBfZCA9PT0gdm9pZCAwID8gW10gOiBfZCxcbiAgICAgICAgICBzdHJpY3RUcmFuc2l0aW9uQ29uZmlnc18xID0gX19yZXN0KF9iLCBbdHlwZW9mIF9jID09PSBcInN5bWJvbFwiID8gX2MgOiBfYyArIFwiXCJdKTtcblxuICAgICAgb25Db25maWcgPSBmbGF0dGVuKE9iamVjdC5rZXlzKHN0cmljdFRyYW5zaXRpb25Db25maWdzXzEpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTiAmJiBrZXkgPT09IE5VTExfRVZFTlQpIHtcbiAgICAgICAgICB3YXJuKGZhbHNlLCBcIkVtcHR5IHN0cmluZyB0cmFuc2l0aW9uIGNvbmZpZ3MgKGUuZy4sIGB7IG9uOiB7ICcnOiAuLi4gfX1gKSBmb3IgdHJhbnNpZW50IHRyYW5zaXRpb25zIGFyZSBkZXByZWNhdGVkLiBTcGVjaWZ5IHRoZSB0cmFuc2l0aW9uIGluIHRoZSBgeyBhbHdheXM6IC4uLiB9YCBwcm9wZXJ0eSBpbnN0ZWFkLiBcIiArIFwiUGxlYXNlIGNoZWNrIHRoZSBgb25gIGNvbmZpZ3VyYXRpb24gZm9yIFxcXCIjXCIuY29uY2F0KF90aGlzLmlkLCBcIlxcXCIuXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0cmFuc2l0aW9uQ29uZmlnQXJyYXkgPSB0b1RyYW5zaXRpb25Db25maWdBcnJheShrZXksIHN0cmljdFRyYW5zaXRpb25Db25maWdzXzFba2V5XSk7XG5cbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgdmFsaWRhdGVBcnJheWlmaWVkVHJhbnNpdGlvbnMoX3RoaXMsIGtleSwgdHJhbnNpdGlvbkNvbmZpZ0FycmF5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uQ29uZmlnQXJyYXk7XG4gICAgICB9KS5jb25jYXQodG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoV0lMRENBUkQsIHdpbGRjYXJkQ29uZmlncykpKTtcbiAgICB9XG5cbiAgICB2YXIgZXZlbnRsZXNzQ29uZmlnID0gdGhpcy5jb25maWcuYWx3YXlzID8gdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoJycsIHRoaXMuY29uZmlnLmFsd2F5cykgOiBbXTtcbiAgICB2YXIgZG9uZUNvbmZpZyA9IHRoaXMuY29uZmlnLm9uRG9uZSA/IHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KFN0cmluZyhkb25lKHRoaXMuaWQpKSwgdGhpcy5jb25maWcub25Eb25lKSA6IFtdO1xuXG4gICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICB3YXJuKCEodGhpcy5jb25maWcub25Eb25lICYmICF0aGlzLnBhcmVudCksIFwiUm9vdCBub2RlcyBjYW5ub3QgaGF2ZSBhbiBcXFwiLm9uRG9uZVxcXCIgdHJhbnNpdGlvbi4gUGxlYXNlIGNoZWNrIHRoZSBjb25maWcgb2YgXFxcIlwiLmNvbmNhdCh0aGlzLmlkLCBcIlxcXCIuXCIpKTtcbiAgICB9XG5cbiAgICB2YXIgaW52b2tlQ29uZmlnID0gZmxhdHRlbih0aGlzLmludm9rZS5tYXAoZnVuY3Rpb24gKGludm9rZURlZikge1xuICAgICAgdmFyIHNldHRsZVRyYW5zaXRpb25zID0gW107XG5cbiAgICAgIGlmIChpbnZva2VEZWYub25Eb25lKSB7XG4gICAgICAgIHNldHRsZVRyYW5zaXRpb25zLnB1c2guYXBwbHkoc2V0dGxlVHJhbnNpdGlvbnMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZCh0b1RyYW5zaXRpb25Db25maWdBcnJheShTdHJpbmcoZG9uZUludm9rZShpbnZva2VEZWYuaWQpKSwgaW52b2tlRGVmLm9uRG9uZSkpLCBmYWxzZSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW52b2tlRGVmLm9uRXJyb3IpIHtcbiAgICAgICAgc2V0dGxlVHJhbnNpdGlvbnMucHVzaC5hcHBseShzZXR0bGVUcmFuc2l0aW9ucywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KFN0cmluZyhlcnJvcihpbnZva2VEZWYuaWQpKSwgaW52b2tlRGVmLm9uRXJyb3IpKSwgZmFsc2UpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNldHRsZVRyYW5zaXRpb25zO1xuICAgIH0pKTtcbiAgICB2YXIgZGVsYXllZFRyYW5zaXRpb25zID0gdGhpcy5hZnRlcjtcbiAgICB2YXIgZm9ybWF0dGVkVHJhbnNpdGlvbnMgPSBmbGF0dGVuKF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChkb25lQ29uZmlnKSwgZmFsc2UpLCBfX3JlYWQoaW52b2tlQ29uZmlnKSwgZmFsc2UpLCBfX3JlYWQob25Db25maWcpLCBmYWxzZSksIF9fcmVhZChldmVudGxlc3NDb25maWcpLCBmYWxzZSkubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uQ29uZmlnKSB7XG4gICAgICByZXR1cm4gdG9BcnJheSh0cmFuc2l0aW9uQ29uZmlnKS5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmZvcm1hdFRyYW5zaXRpb24odHJhbnNpdGlvbik7XG4gICAgICB9KTtcbiAgICB9KSk7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgZGVsYXllZFRyYW5zaXRpb25zXzEgPSBfX3ZhbHVlcyhkZWxheWVkVHJhbnNpdGlvbnMpLCBkZWxheWVkVHJhbnNpdGlvbnNfMV8xID0gZGVsYXllZFRyYW5zaXRpb25zXzEubmV4dCgpOyAhZGVsYXllZFRyYW5zaXRpb25zXzFfMS5kb25lOyBkZWxheWVkVHJhbnNpdGlvbnNfMV8xID0gZGVsYXllZFRyYW5zaXRpb25zXzEubmV4dCgpKSB7XG4gICAgICAgIHZhciBkZWxheWVkVHJhbnNpdGlvbiA9IGRlbGF5ZWRUcmFuc2l0aW9uc18xXzEudmFsdWU7XG4gICAgICAgIGZvcm1hdHRlZFRyYW5zaXRpb25zLnB1c2goZGVsYXllZFRyYW5zaXRpb24pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMTBfMSkge1xuICAgICAgZV8xMCA9IHtcbiAgICAgICAgZXJyb3I6IGVfMTBfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGRlbGF5ZWRUcmFuc2l0aW9uc18xXzEgJiYgIWRlbGF5ZWRUcmFuc2l0aW9uc18xXzEuZG9uZSAmJiAoX2EgPSBkZWxheWVkVHJhbnNpdGlvbnNfMS5yZXR1cm4pKSBfYS5jYWxsKGRlbGF5ZWRUcmFuc2l0aW9uc18xKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzEwKSB0aHJvdyBlXzEwLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmb3JtYXR0ZWRUcmFuc2l0aW9ucztcbiAgfTtcblxuICByZXR1cm4gU3RhdGVOb2RlO1xufSgpO1xuXG5leHBvcnQgeyBTdGF0ZU5vZGUgfTtcbiIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcblxyXG52YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxuXG5leHBvcnQgeyBfX2Fzc2lnbiwgX19yZWFkLCBfX3Jlc3QsIF9fc3ByZWFkQXJyYXksIF9fdmFsdWVzIH07XG4iLCJpbXBvcnQgeyBBY3Rpb25UeXBlcyB9IGZyb20gJy4vdHlwZXMuanMnO1xuXG52YXIgc3RhcnQgPSBBY3Rpb25UeXBlcy5TdGFydDtcbnZhciBzdG9wID0gQWN0aW9uVHlwZXMuU3RvcDtcbnZhciByYWlzZSA9IEFjdGlvblR5cGVzLlJhaXNlO1xudmFyIHNlbmQgPSBBY3Rpb25UeXBlcy5TZW5kO1xudmFyIGNhbmNlbCA9IEFjdGlvblR5cGVzLkNhbmNlbDtcbnZhciBudWxsRXZlbnQgPSBBY3Rpb25UeXBlcy5OdWxsRXZlbnQ7XG52YXIgYXNzaWduID0gQWN0aW9uVHlwZXMuQXNzaWduO1xudmFyIGFmdGVyID0gQWN0aW9uVHlwZXMuQWZ0ZXI7XG52YXIgZG9uZVN0YXRlID0gQWN0aW9uVHlwZXMuRG9uZVN0YXRlO1xudmFyIGxvZyA9IEFjdGlvblR5cGVzLkxvZztcbnZhciBpbml0ID0gQWN0aW9uVHlwZXMuSW5pdDtcbnZhciBpbnZva2UgPSBBY3Rpb25UeXBlcy5JbnZva2U7XG52YXIgZXJyb3JFeGVjdXRpb24gPSBBY3Rpb25UeXBlcy5FcnJvckV4ZWN1dGlvbjtcbnZhciBlcnJvclBsYXRmb3JtID0gQWN0aW9uVHlwZXMuRXJyb3JQbGF0Zm9ybTtcbnZhciBlcnJvciA9IEFjdGlvblR5cGVzLkVycm9yQ3VzdG9tO1xudmFyIHVwZGF0ZSA9IEFjdGlvblR5cGVzLlVwZGF0ZTtcbnZhciBjaG9vc2UgPSBBY3Rpb25UeXBlcy5DaG9vc2U7XG52YXIgcHVyZSA9IEFjdGlvblR5cGVzLlB1cmU7XG5cbmV4cG9ydCB7IGFmdGVyLCBhc3NpZ24sIGNhbmNlbCwgY2hvb3NlLCBkb25lU3RhdGUsIGVycm9yLCBlcnJvckV4ZWN1dGlvbiwgZXJyb3JQbGF0Zm9ybSwgaW5pdCwgaW52b2tlLCBsb2csIG51bGxFdmVudCwgcHVyZSwgcmFpc2UsIHNlbmQsIHN0YXJ0LCBzdG9wLCB1cGRhdGUgfTtcbiIsImltcG9ydCB7IF9fYXNzaWduLCBfX3NwcmVhZEFycmF5LCBfX3JlYWQsIF9fdmFsdWVzIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgU3BlY2lhbFRhcmdldHMsIEFjdGlvblR5cGVzIH0gZnJvbSAnLi90eXBlcy5qcyc7XG5pbXBvcnQgeyBpbml0LCByYWlzZSBhcyByYWlzZSQxLCBzZW5kIGFzIHNlbmQkMSwgdXBkYXRlLCBsb2cgYXMgbG9nJDEsIGNhbmNlbCBhcyBjYW5jZWwkMSwgYXNzaWduIGFzIGFzc2lnbiQxLCBlcnJvciBhcyBlcnJvciQxLCBzdG9wIGFzIHN0b3AkMSwgcHVyZSBhcyBwdXJlJDEsIGNob29zZSBhcyBjaG9vc2UkMSB9IGZyb20gJy4vYWN0aW9uVHlwZXMuanMnO1xuaW1wb3J0ICogYXMgYWN0aW9uVHlwZXMgZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5leHBvcnQgeyBhY3Rpb25UeXBlcyB9O1xuaW1wb3J0IHsgdG9TQ1hNTEV2ZW50LCBpc1N0cmluZywgaXNGdW5jdGlvbiwgdG9FdmVudE9iamVjdCwgZ2V0RXZlbnRUeXBlLCB1cGRhdGVDb250ZXh0LCBmbGF0dGVuLCBpc0FycmF5LCB0b0FycmF5LCB0b0d1YXJkLCBldmFsdWF0ZUd1YXJkLCB3YXJuIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbnZhciBpbml0RXZlbnQgPSAvKiNfX1BVUkVfXyovdG9TQ1hNTEV2ZW50KHtcbiAgdHlwZTogaW5pdFxufSk7XG5mdW5jdGlvbiBnZXRBY3Rpb25GdW5jdGlvbihhY3Rpb25UeXBlLCBhY3Rpb25GdW5jdGlvbk1hcCkge1xuICByZXR1cm4gYWN0aW9uRnVuY3Rpb25NYXAgPyBhY3Rpb25GdW5jdGlvbk1hcFthY3Rpb25UeXBlXSB8fCB1bmRlZmluZWQgOiB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiB0b0FjdGlvbk9iamVjdChhY3Rpb24sIGFjdGlvbkZ1bmN0aW9uTWFwKSB7XG4gIHZhciBhY3Rpb25PYmplY3Q7XG5cbiAgaWYgKGlzU3RyaW5nKGFjdGlvbikgfHwgdHlwZW9mIGFjdGlvbiA9PT0gJ251bWJlcicpIHtcbiAgICB2YXIgZXhlYyA9IGdldEFjdGlvbkZ1bmN0aW9uKGFjdGlvbiwgYWN0aW9uRnVuY3Rpb25NYXApO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXhlYykpIHtcbiAgICAgIGFjdGlvbk9iamVjdCA9IHtcbiAgICAgICAgdHlwZTogYWN0aW9uLFxuICAgICAgICBleGVjOiBleGVjXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZXhlYykge1xuICAgICAgYWN0aW9uT2JqZWN0ID0gZXhlYztcbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aW9uT2JqZWN0ID0ge1xuICAgICAgICB0eXBlOiBhY3Rpb24sXG4gICAgICAgIGV4ZWM6IHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihhY3Rpb24pKSB7XG4gICAgYWN0aW9uT2JqZWN0ID0ge1xuICAgICAgLy8gQ29udmVydCBhY3Rpb24gdG8gc3RyaW5nIGlmIHVubmFtZWRcbiAgICAgIHR5cGU6IGFjdGlvbi5uYW1lIHx8IGFjdGlvbi50b1N0cmluZygpLFxuICAgICAgZXhlYzogYWN0aW9uXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZXhlYyA9IGdldEFjdGlvbkZ1bmN0aW9uKGFjdGlvbi50eXBlLCBhY3Rpb25GdW5jdGlvbk1hcCk7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihleGVjKSkge1xuICAgICAgYWN0aW9uT2JqZWN0ID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbiksIHtcbiAgICAgICAgZXhlYzogZXhlY1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChleGVjKSB7XG4gICAgICB2YXIgYWN0aW9uVHlwZSA9IGV4ZWMudHlwZSB8fCBhY3Rpb24udHlwZTtcbiAgICAgIGFjdGlvbk9iamVjdCA9IF9fYXNzaWduKF9fYXNzaWduKF9fYXNzaWduKHt9LCBleGVjKSwgYWN0aW9uKSwge1xuICAgICAgICB0eXBlOiBhY3Rpb25UeXBlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWN0aW9uT2JqZWN0ID0gYWN0aW9uO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhY3Rpb25PYmplY3Q7XG59XG52YXIgdG9BY3Rpb25PYmplY3RzID0gZnVuY3Rpb24gKGFjdGlvbiwgYWN0aW9uRnVuY3Rpb25NYXApIHtcbiAgaWYgKCFhY3Rpb24pIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICB2YXIgYWN0aW9ucyA9IGlzQXJyYXkoYWN0aW9uKSA/IGFjdGlvbiA6IFthY3Rpb25dO1xuICByZXR1cm4gYWN0aW9ucy5tYXAoZnVuY3Rpb24gKHN1YkFjdGlvbikge1xuICAgIHJldHVybiB0b0FjdGlvbk9iamVjdChzdWJBY3Rpb24sIGFjdGlvbkZ1bmN0aW9uTWFwKTtcbiAgfSk7XG59O1xuZnVuY3Rpb24gdG9BY3Rpdml0eURlZmluaXRpb24oYWN0aW9uKSB7XG4gIHZhciBhY3Rpb25PYmplY3QgPSB0b0FjdGlvbk9iamVjdChhY3Rpb24pO1xuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe1xuICAgIGlkOiBpc1N0cmluZyhhY3Rpb24pID8gYWN0aW9uIDogYWN0aW9uT2JqZWN0LmlkXG4gIH0sIGFjdGlvbk9iamVjdCksIHtcbiAgICB0eXBlOiBhY3Rpb25PYmplY3QudHlwZVxuICB9KTtcbn1cbi8qKlxyXG4gKiBSYWlzZXMgYW4gZXZlbnQuIFRoaXMgcGxhY2VzIHRoZSBldmVudCBpbiB0aGUgaW50ZXJuYWwgZXZlbnQgcXVldWUsIHNvIHRoYXRcclxuICogdGhlIGV2ZW50IGlzIGltbWVkaWF0ZWx5IGNvbnN1bWVkIGJ5IHRoZSBtYWNoaW5lIGluIHRoZSBjdXJyZW50IHN0ZXAuXHJcbiAqXHJcbiAqIEBwYXJhbSBldmVudFR5cGUgVGhlIGV2ZW50IHRvIHJhaXNlLlxyXG4gKi9cblxuZnVuY3Rpb24gcmFpc2UoZXZlbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiByYWlzZSQxLFxuICAgIGV2ZW50OiB0eXBlb2YgZXZlbnQgPT09ICdmdW5jdGlvbicgPyBldmVudCA6IHRvRXZlbnRPYmplY3QoZXZlbnQpLFxuICAgIGRlbGF5OiBvcHRpb25zID8gb3B0aW9ucy5kZWxheSA6IHVuZGVmaW5lZCxcbiAgICBpZDogb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmlkXG4gIH07XG59XG5mdW5jdGlvbiByZXNvbHZlUmFpc2UoYWN0aW9uLCBjdHgsIF9ldmVudCwgZGVsYXlzTWFwKSB7XG4gIHZhciBtZXRhID0ge1xuICAgIF9ldmVudDogX2V2ZW50XG4gIH07XG4gIHZhciByZXNvbHZlZEV2ZW50ID0gdG9TQ1hNTEV2ZW50KGlzRnVuY3Rpb24oYWN0aW9uLmV2ZW50KSA/IGFjdGlvbi5ldmVudChjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi5ldmVudCk7XG4gIHZhciByZXNvbHZlZERlbGF5O1xuXG4gIGlmIChpc1N0cmluZyhhY3Rpb24uZGVsYXkpKSB7XG4gICAgdmFyIGNvbmZpZ0RlbGF5ID0gZGVsYXlzTWFwICYmIGRlbGF5c01hcFthY3Rpb24uZGVsYXldO1xuICAgIHJlc29sdmVkRGVsYXkgPSBpc0Z1bmN0aW9uKGNvbmZpZ0RlbGF5KSA/IGNvbmZpZ0RlbGF5KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogY29uZmlnRGVsYXk7XG4gIH0gZWxzZSB7XG4gICAgcmVzb2x2ZWREZWxheSA9IGlzRnVuY3Rpb24oYWN0aW9uLmRlbGF5KSA/IGFjdGlvbi5kZWxheShjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi5kZWxheTtcbiAgfVxuXG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9uKSwge1xuICAgIHR5cGU6IHJhaXNlJDEsXG4gICAgX2V2ZW50OiByZXNvbHZlZEV2ZW50LFxuICAgIGRlbGF5OiByZXNvbHZlZERlbGF5XG4gIH0pO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIGV2ZW50LiBUaGlzIHJldHVybnMgYW4gYWN0aW9uIHRoYXQgd2lsbCBiZSByZWFkIGJ5IGFuIGludGVycHJldGVyIHRvXHJcbiAqIHNlbmQgdGhlIGV2ZW50IGluIHRoZSBuZXh0IHN0ZXAsIGFmdGVyIHRoZSBjdXJyZW50IHN0ZXAgaXMgZmluaXNoZWQgZXhlY3V0aW5nLlxyXG4gKlxyXG4gKiBAZGVwcmVjYXRlZCBVc2UgdGhlIGBzZW5kVG8oLi4uKWAgYWN0aW9uIGNyZWF0b3IgaW5zdGVhZC5cclxuICpcclxuICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBzZW5kLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHBhc3MgaW50byB0aGUgc2VuZCBldmVudDpcclxuICogIC0gYGlkYCAtIFRoZSB1bmlxdWUgc2VuZCBldmVudCBpZGVudGlmaWVyICh1c2VkIHdpdGggYGNhbmNlbCgpYCkuXHJcbiAqICAtIGBkZWxheWAgLSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheSB0aGUgc2VuZGluZyBvZiB0aGUgZXZlbnQuXHJcbiAqICAtIGB0b2AgLSBUaGUgdGFyZ2V0IG9mIHRoaXMgZXZlbnQgKGJ5IGRlZmF1bHQsIHRoZSBtYWNoaW5lIHRoZSBldmVudCB3YXMgc2VudCBmcm9tKS5cclxuICovXG5cbmZ1bmN0aW9uIHNlbmQoZXZlbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICB0bzogb3B0aW9ucyA/IG9wdGlvbnMudG8gOiB1bmRlZmluZWQsXG4gICAgdHlwZTogc2VuZCQxLFxuICAgIGV2ZW50OiBpc0Z1bmN0aW9uKGV2ZW50KSA/IGV2ZW50IDogdG9FdmVudE9iamVjdChldmVudCksXG4gICAgZGVsYXk6IG9wdGlvbnMgPyBvcHRpb25zLmRlbGF5IDogdW5kZWZpbmVkLFxuICAgIC8vIFRPRE86IGRvbid0IGF1dG8tZ2VuZXJhdGUgSURzIGhlcmUgbGlrZSB0aGF0XG4gICAgLy8gdGhlcmUgaXMgdG9vIGJpZyBjaGFuY2Ugb2YgdGhlIElEIGNvbGxpc2lvblxuICAgIGlkOiBvcHRpb25zICYmIG9wdGlvbnMuaWQgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuaWQgOiBpc0Z1bmN0aW9uKGV2ZW50KSA/IGV2ZW50Lm5hbWUgOiBnZXRFdmVudFR5cGUoZXZlbnQpXG4gIH07XG59XG5mdW5jdGlvbiByZXNvbHZlU2VuZChhY3Rpb24sIGN0eCwgX2V2ZW50LCBkZWxheXNNYXApIHtcbiAgdmFyIG1ldGEgPSB7XG4gICAgX2V2ZW50OiBfZXZlbnRcbiAgfTsgLy8gVE9ETzogaGVscGVyIGZ1bmN0aW9uIGZvciByZXNvbHZpbmcgRXhwclxuXG4gIHZhciByZXNvbHZlZEV2ZW50ID0gdG9TQ1hNTEV2ZW50KGlzRnVuY3Rpb24oYWN0aW9uLmV2ZW50KSA/IGFjdGlvbi5ldmVudChjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi5ldmVudCk7XG4gIHZhciByZXNvbHZlZERlbGF5O1xuXG4gIGlmIChpc1N0cmluZyhhY3Rpb24uZGVsYXkpKSB7XG4gICAgdmFyIGNvbmZpZ0RlbGF5ID0gZGVsYXlzTWFwICYmIGRlbGF5c01hcFthY3Rpb24uZGVsYXldO1xuICAgIHJlc29sdmVkRGVsYXkgPSBpc0Z1bmN0aW9uKGNvbmZpZ0RlbGF5KSA/IGNvbmZpZ0RlbGF5KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogY29uZmlnRGVsYXk7XG4gIH0gZWxzZSB7XG4gICAgcmVzb2x2ZWREZWxheSA9IGlzRnVuY3Rpb24oYWN0aW9uLmRlbGF5KSA/IGFjdGlvbi5kZWxheShjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi5kZWxheTtcbiAgfVxuXG4gIHZhciByZXNvbHZlZFRhcmdldCA9IGlzRnVuY3Rpb24oYWN0aW9uLnRvKSA/IGFjdGlvbi50byhjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGFjdGlvbi50bztcbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb24pLCB7XG4gICAgdG86IHJlc29sdmVkVGFyZ2V0LFxuICAgIF9ldmVudDogcmVzb2x2ZWRFdmVudCxcbiAgICBldmVudDogcmVzb2x2ZWRFdmVudC5kYXRhLFxuICAgIGRlbGF5OiByZXNvbHZlZERlbGF5XG4gIH0pO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIGV2ZW50IHRvIHRoaXMgbWFjaGluZSdzIHBhcmVudC5cclxuICpcclxuICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBzZW5kIHRvIHRoZSBwYXJlbnQgbWFjaGluZS5cclxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBwYXNzIGludG8gdGhlIHNlbmQgZXZlbnQuXHJcbiAqL1xuXG5mdW5jdGlvbiBzZW5kUGFyZW50KGV2ZW50LCBvcHRpb25zKSB7XG4gIHJldHVybiBzZW5kKGV2ZW50LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICB0bzogU3BlY2lhbFRhcmdldHMuUGFyZW50XG4gIH0pKTtcbn1cbi8qKlxyXG4gKiBTZW5kcyBhbiBldmVudCB0byBhbiBhY3Rvci5cclxuICpcclxuICogQHBhcmFtIGFjdG9yIFRoZSBgQWN0b3JSZWZgIHRvIHNlbmQgdGhlIGV2ZW50IHRvLlxyXG4gKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIHNlbmQsIG9yIGFuIGV4cHJlc3Npb24gdGhhdCBldmFsdWF0ZXMgdG8gdGhlIGV2ZW50IHRvIHNlbmRcclxuICogQHBhcmFtIG9wdGlvbnMgU2VuZCBhY3Rpb24gb3B0aW9uc1xyXG4gKiBAcmV0dXJucyBBbiBYU3RhdGUgc2VuZCBhY3Rpb24gb2JqZWN0XHJcbiAqL1xuXG5mdW5jdGlvbiBzZW5kVG8oYWN0b3IsIGV2ZW50LCBvcHRpb25zKSB7XG4gIHJldHVybiBzZW5kKGV2ZW50LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICB0bzogYWN0b3JcbiAgfSkpO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIHVwZGF0ZSBldmVudCB0byB0aGlzIG1hY2hpbmUncyBwYXJlbnQuXHJcbiAqL1xuXG5mdW5jdGlvbiBzZW5kVXBkYXRlKCkge1xuICByZXR1cm4gc2VuZFBhcmVudCh1cGRhdGUpO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIGV2ZW50IGJhY2sgdG8gdGhlIHNlbmRlciBvZiB0aGUgb3JpZ2luYWwgZXZlbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gc2VuZCBiYWNrIHRvIHRoZSBzZW5kZXJcclxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBwYXNzIGludG8gdGhlIHNlbmQgZXZlbnRcclxuICovXG5cbmZ1bmN0aW9uIHJlc3BvbmQoZXZlbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHNlbmQoZXZlbnQsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgIHRvOiBmdW5jdGlvbiAoXywgX18sIF9hKSB7XG4gICAgICB2YXIgX2V2ZW50ID0gX2EuX2V2ZW50O1xuICAgICAgcmV0dXJuIF9ldmVudC5vcmlnaW47IC8vIFRPRE86IGhhbmRsZSB3aGVuIF9ldmVudC5vcmlnaW4gaXMgdW5kZWZpbmVkXG4gICAgfVxuICB9KSk7XG59XG5cbnZhciBkZWZhdWx0TG9nRXhwciA9IGZ1bmN0aW9uIChjb250ZXh0LCBldmVudCkge1xuICByZXR1cm4ge1xuICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgZXZlbnQ6IGV2ZW50XG4gIH07XG59O1xuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBleHByIFRoZSBleHByZXNzaW9uIGZ1bmN0aW9uIHRvIGV2YWx1YXRlIHdoaWNoIHdpbGwgYmUgbG9nZ2VkLlxyXG4gKiAgVGFrZXMgaW4gMiBhcmd1bWVudHM6XHJcbiAqICAtIGBjdHhgIC0gdGhlIGN1cnJlbnQgc3RhdGUgY29udGV4dFxyXG4gKiAgLSBgZXZlbnRgIC0gdGhlIGV2ZW50IHRoYXQgY2F1c2VkIHRoaXMgYWN0aW9uIHRvIGJlIGV4ZWN1dGVkLlxyXG4gKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIHRvIGdpdmUgdG8gdGhlIGxvZ2dlZCBleHByZXNzaW9uLlxyXG4gKi9cblxuXG5mdW5jdGlvbiBsb2coZXhwciwgbGFiZWwpIHtcbiAgaWYgKGV4cHIgPT09IHZvaWQgMCkge1xuICAgIGV4cHIgPSBkZWZhdWx0TG9nRXhwcjtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHlwZTogbG9nJDEsXG4gICAgbGFiZWw6IGxhYmVsLFxuICAgIGV4cHI6IGV4cHJcbiAgfTtcbn1cbnZhciByZXNvbHZlTG9nID0gZnVuY3Rpb24gKGFjdGlvbiwgY3R4LCBfZXZlbnQpIHtcbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb24pLCB7XG4gICAgdmFsdWU6IGlzU3RyaW5nKGFjdGlvbi5leHByKSA/IGFjdGlvbi5leHByIDogYWN0aW9uLmV4cHIoY3R4LCBfZXZlbnQuZGF0YSwge1xuICAgICAgX2V2ZW50OiBfZXZlbnRcbiAgICB9KVxuICB9KTtcbn07XG4vKipcclxuICogQ2FuY2VscyBhbiBpbi1mbGlnaHQgYHNlbmQoLi4uKWAgYWN0aW9uLiBBIGNhbmNlbGVkIHNlbnQgYWN0aW9uIHdpbGwgbm90XHJcbiAqIGJlIGV4ZWN1dGVkLCBub3Igd2lsbCBpdHMgZXZlbnQgYmUgc2VudCwgdW5sZXNzIGl0IGhhcyBhbHJlYWR5IGJlZW4gc2VudFxyXG4gKiAoZS5nLiwgaWYgYGNhbmNlbCguLi4pYCBpcyBjYWxsZWQgYWZ0ZXIgdGhlIGBzZW5kKC4uLilgIGFjdGlvbidzIGBkZWxheWApLlxyXG4gKlxyXG4gKiBAcGFyYW0gc2VuZElkIFRoZSBgaWRgIG9mIHRoZSBgc2VuZCguLi4pYCBhY3Rpb24gdG8gY2FuY2VsLlxyXG4gKi9cblxudmFyIGNhbmNlbCA9IGZ1bmN0aW9uIChzZW5kSWQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBjYW5jZWwkMSxcbiAgICBzZW5kSWQ6IHNlbmRJZFxuICB9O1xufTtcbi8qKlxyXG4gKiBTdGFydHMgYW4gYWN0aXZpdHkuXHJcbiAqXHJcbiAqIEBwYXJhbSBhY3Rpdml0eSBUaGUgYWN0aXZpdHkgdG8gc3RhcnQuXHJcbiAqL1xuXG5mdW5jdGlvbiBzdGFydChhY3Rpdml0eSkge1xuICB2YXIgYWN0aXZpdHlEZWYgPSB0b0FjdGl2aXR5RGVmaW5pdGlvbihhY3Rpdml0eSk7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU3RhcnQsXG4gICAgYWN0aXZpdHk6IGFjdGl2aXR5RGVmLFxuICAgIGV4ZWM6IHVuZGVmaW5lZFxuICB9O1xufVxuLyoqXHJcbiAqIFN0b3BzIGFuIGFjdGl2aXR5LlxyXG4gKlxyXG4gKiBAcGFyYW0gYWN0b3JSZWYgVGhlIGFjdGl2aXR5IHRvIHN0b3AuXHJcbiAqL1xuXG5mdW5jdGlvbiBzdG9wKGFjdG9yUmVmKSB7XG4gIHZhciBhY3Rpdml0eSA9IGlzRnVuY3Rpb24oYWN0b3JSZWYpID8gYWN0b3JSZWYgOiB0b0FjdGl2aXR5RGVmaW5pdGlvbihhY3RvclJlZik7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU3RvcCxcbiAgICBhY3Rpdml0eTogYWN0aXZpdHksXG4gICAgZXhlYzogdW5kZWZpbmVkXG4gIH07XG59XG5mdW5jdGlvbiByZXNvbHZlU3RvcChhY3Rpb24sIGNvbnRleHQsIF9ldmVudCkge1xuICB2YXIgYWN0b3JSZWZPclN0cmluZyA9IGlzRnVuY3Rpb24oYWN0aW9uLmFjdGl2aXR5KSA/IGFjdGlvbi5hY3Rpdml0eShjb250ZXh0LCBfZXZlbnQuZGF0YSkgOiBhY3Rpb24uYWN0aXZpdHk7XG4gIHZhciByZXNvbHZlZEFjdG9yUmVmID0gdHlwZW9mIGFjdG9yUmVmT3JTdHJpbmcgPT09ICdzdHJpbmcnID8ge1xuICAgIGlkOiBhY3RvclJlZk9yU3RyaW5nXG4gIH0gOiBhY3RvclJlZk9yU3RyaW5nO1xuICB2YXIgYWN0aW9uT2JqZWN0ID0ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlN0b3AsXG4gICAgYWN0aXZpdHk6IHJlc29sdmVkQWN0b3JSZWZcbiAgfTtcbiAgcmV0dXJuIGFjdGlvbk9iamVjdDtcbn1cbi8qKlxyXG4gKiBVcGRhdGVzIHRoZSBjdXJyZW50IGNvbnRleHQgb2YgdGhlIG1hY2hpbmUuXHJcbiAqXHJcbiAqIEBwYXJhbSBhc3NpZ25tZW50IEFuIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIHBhcnRpYWwgY29udGV4dCB0byB1cGRhdGUuXHJcbiAqL1xuXG52YXIgYXNzaWduID0gZnVuY3Rpb24gKGFzc2lnbm1lbnQpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBhc3NpZ24kMSxcbiAgICBhc3NpZ25tZW50OiBhc3NpZ25tZW50XG4gIH07XG59O1xuZnVuY3Rpb24gaXNBY3Rpb25PYmplY3QoYWN0aW9uKSB7XG4gIHJldHVybiB0eXBlb2YgYWN0aW9uID09PSAnb2JqZWN0JyAmJiAndHlwZScgaW4gYWN0aW9uO1xufVxuLyoqXHJcbiAqIFJldHVybnMgYW4gZXZlbnQgdHlwZSB0aGF0IHJlcHJlc2VudHMgYW4gaW1wbGljaXQgZXZlbnQgdGhhdFxyXG4gKiBpcyBzZW50IGFmdGVyIHRoZSBzcGVjaWZpZWQgYGRlbGF5YC5cclxuICpcclxuICogQHBhcmFtIGRlbGF5UmVmIFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHNcclxuICogQHBhcmFtIGlkIFRoZSBzdGF0ZSBub2RlIElEIHdoZXJlIHRoaXMgZXZlbnQgaXMgaGFuZGxlZFxyXG4gKi9cblxuZnVuY3Rpb24gYWZ0ZXIoZGVsYXlSZWYsIGlkKSB7XG4gIHZhciBpZFN1ZmZpeCA9IGlkID8gXCIjXCIuY29uY2F0KGlkKSA6ICcnO1xuICByZXR1cm4gXCJcIi5jb25jYXQoQWN0aW9uVHlwZXMuQWZ0ZXIsIFwiKFwiKS5jb25jYXQoZGVsYXlSZWYsIFwiKVwiKS5jb25jYXQoaWRTdWZmaXgpO1xufVxuLyoqXHJcbiAqIFJldHVybnMgYW4gZXZlbnQgdGhhdCByZXByZXNlbnRzIHRoYXQgYSBmaW5hbCBzdGF0ZSBub2RlXHJcbiAqIGhhcyBiZWVuIHJlYWNoZWQgaW4gdGhlIHBhcmVudCBzdGF0ZSBub2RlLlxyXG4gKlxyXG4gKiBAcGFyYW0gaWQgVGhlIGZpbmFsIHN0YXRlIG5vZGUncyBwYXJlbnQgc3RhdGUgbm9kZSBgaWRgXHJcbiAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIHRvIHBhc3MgaW50byB0aGUgZXZlbnRcclxuICovXG5cbmZ1bmN0aW9uIGRvbmUoaWQsIGRhdGEpIHtcbiAgdmFyIHR5cGUgPSBcIlwiLmNvbmNhdChBY3Rpb25UeXBlcy5Eb25lU3RhdGUsIFwiLlwiKS5jb25jYXQoaWQpO1xuICB2YXIgZXZlbnRPYmplY3QgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBkYXRhXG4gIH07XG5cbiAgZXZlbnRPYmplY3QudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50T2JqZWN0O1xufVxuLyoqXHJcbiAqIFJldHVybnMgYW4gZXZlbnQgdGhhdCByZXByZXNlbnRzIHRoYXQgYW4gaW52b2tlZCBzZXJ2aWNlIGhhcyB0ZXJtaW5hdGVkLlxyXG4gKlxyXG4gKiBBbiBpbnZva2VkIHNlcnZpY2UgaXMgdGVybWluYXRlZCB3aGVuIGl0IGhhcyByZWFjaGVkIGEgdG9wLWxldmVsIGZpbmFsIHN0YXRlIG5vZGUsXHJcbiAqIGJ1dCBub3Qgd2hlbiBpdCBpcyBjYW5jZWxlZC5cclxuICpcclxuICogQHBhcmFtIGlkIFRoZSBmaW5hbCBzdGF0ZSBub2RlIElEXHJcbiAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIHRvIHBhc3MgaW50byB0aGUgZXZlbnRcclxuICovXG5cbmZ1bmN0aW9uIGRvbmVJbnZva2UoaWQsIGRhdGEpIHtcbiAgdmFyIHR5cGUgPSBcIlwiLmNvbmNhdChBY3Rpb25UeXBlcy5Eb25lSW52b2tlLCBcIi5cIikuY29uY2F0KGlkKTtcbiAgdmFyIGV2ZW50T2JqZWN0ID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0YTogZGF0YVxuICB9O1xuXG4gIGV2ZW50T2JqZWN0LnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0eXBlO1xuICB9O1xuXG4gIHJldHVybiBldmVudE9iamVjdDtcbn1cbmZ1bmN0aW9uIGVycm9yKGlkLCBkYXRhKSB7XG4gIHZhciB0eXBlID0gXCJcIi5jb25jYXQoQWN0aW9uVHlwZXMuRXJyb3JQbGF0Zm9ybSwgXCIuXCIpLmNvbmNhdChpZCk7XG4gIHZhciBldmVudE9iamVjdCA9IHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IGRhdGFcbiAgfTtcblxuICBldmVudE9iamVjdC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfTtcblxuICByZXR1cm4gZXZlbnRPYmplY3Q7XG59XG5mdW5jdGlvbiBwdXJlKGdldEFjdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5QdXJlLFxuICAgIGdldDogZ2V0QWN0aW9uc1xuICB9O1xufVxuLyoqXHJcbiAqIEZvcndhcmRzIChzZW5kcykgYW4gZXZlbnQgdG8gYSBzcGVjaWZpZWQgc2VydmljZS5cclxuICpcclxuICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IHNlcnZpY2UgdG8gZm9yd2FyZCB0aGUgZXZlbnQgdG8uXHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcGFzcyBpbnRvIHRoZSBzZW5kIGFjdGlvbiBjcmVhdG9yLlxyXG4gKi9cblxuZnVuY3Rpb24gZm9yd2FyZFRvKHRhcmdldCwgb3B0aW9ucykge1xuICBpZiAoIUlTX1BST0RVQ1RJT04gJiYgKCF0YXJnZXQgfHwgdHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB2YXIgb3JpZ2luYWxUYXJnZXRfMSA9IHRhcmdldDtcblxuICAgIHRhcmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhcmdzID0gW107XG5cbiAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlc29sdmVkVGFyZ2V0ID0gdHlwZW9mIG9yaWdpbmFsVGFyZ2V0XzEgPT09ICdmdW5jdGlvbicgPyBvcmlnaW5hbFRhcmdldF8xLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGFyZ3MpLCBmYWxzZSkpIDogb3JpZ2luYWxUYXJnZXRfMTtcblxuICAgICAgaWYgKCFyZXNvbHZlZFRhcmdldCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBdHRlbXB0ZWQgdG8gZm9yd2FyZCBldmVudCB0byB1bmRlZmluZWQgYWN0b3IuIFRoaXMgcmlza3MgYW4gaW5maW5pdGUgbG9vcCBpbiB0aGUgc2VuZGVyLlwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc29sdmVkVGFyZ2V0O1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gc2VuZChmdW5jdGlvbiAoXywgZXZlbnQpIHtcbiAgICByZXR1cm4gZXZlbnQ7XG4gIH0sIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgIHRvOiB0YXJnZXRcbiAgfSkpO1xufVxuLyoqXHJcbiAqIEVzY2FsYXRlcyBhbiBlcnJvciBieSBzZW5kaW5nIGl0IGFzIGFuIGV2ZW50IHRvIHRoaXMgbWFjaGluZSdzIHBhcmVudC5cclxuICpcclxuICogQHBhcmFtIGVycm9yRGF0YSBUaGUgZXJyb3IgZGF0YSB0byBzZW5kLCBvciB0aGUgZXhwcmVzc2lvbiBmdW5jdGlvbiB0aGF0XHJcbiAqIHRha2VzIGluIHRoZSBgY29udGV4dGAsIGBldmVudGAsIGFuZCBgbWV0YWAsIGFuZCByZXR1cm5zIHRoZSBlcnJvciBkYXRhIHRvIHNlbmQuXHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcGFzcyBpbnRvIHRoZSBzZW5kIGFjdGlvbiBjcmVhdG9yLlxyXG4gKi9cblxuZnVuY3Rpb24gZXNjYWxhdGUoZXJyb3JEYXRhLCBvcHRpb25zKSB7XG4gIHJldHVybiBzZW5kUGFyZW50KGZ1bmN0aW9uIChjb250ZXh0LCBldmVudCwgbWV0YSkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBlcnJvciQxLFxuICAgICAgZGF0YTogaXNGdW5jdGlvbihlcnJvckRhdGEpID8gZXJyb3JEYXRhKGNvbnRleHQsIGV2ZW50LCBtZXRhKSA6IGVycm9yRGF0YVxuICAgIH07XG4gIH0sIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgIHRvOiBTcGVjaWFsVGFyZ2V0cy5QYXJlbnRcbiAgfSkpO1xufVxuZnVuY3Rpb24gY2hvb3NlKGNvbmRzKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuQ2hvb3NlLFxuICAgIGNvbmRzOiBjb25kc1xuICB9O1xufVxuXG52YXIgcGx1Y2tBc3NpZ25zID0gZnVuY3Rpb24gKGFjdGlvbkJsb2Nrcykge1xuICB2YXIgZV8xLCBfYTtcblxuICB2YXIgYXNzaWduQWN0aW9ucyA9IFtdO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgYWN0aW9uQmxvY2tzXzEgPSBfX3ZhbHVlcyhhY3Rpb25CbG9ja3MpLCBhY3Rpb25CbG9ja3NfMV8xID0gYWN0aW9uQmxvY2tzXzEubmV4dCgpOyAhYWN0aW9uQmxvY2tzXzFfMS5kb25lOyBhY3Rpb25CbG9ja3NfMV8xID0gYWN0aW9uQmxvY2tzXzEubmV4dCgpKSB7XG4gICAgICB2YXIgYmxvY2sgPSBhY3Rpb25CbG9ja3NfMV8xLnZhbHVlO1xuICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICB3aGlsZSAoaSA8IGJsb2NrLmFjdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIGlmIChibG9jay5hY3Rpb25zW2ldLnR5cGUgPT09IGFzc2lnbiQxKSB7XG4gICAgICAgICAgYXNzaWduQWN0aW9ucy5wdXNoKGJsb2NrLmFjdGlvbnNbaV0pO1xuICAgICAgICAgIGJsb2NrLmFjdGlvbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICBlXzEgPSB7XG4gICAgICBlcnJvcjogZV8xXzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoYWN0aW9uQmxvY2tzXzFfMSAmJiAhYWN0aW9uQmxvY2tzXzFfMS5kb25lICYmIChfYSA9IGFjdGlvbkJsb2Nrc18xLnJldHVybikpIF9hLmNhbGwoYWN0aW9uQmxvY2tzXzEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFzc2lnbkFjdGlvbnM7XG59O1xuXG5mdW5jdGlvbiByZXNvbHZlQWN0aW9ucyhtYWNoaW5lLCBjdXJyZW50U3RhdGUsIGN1cnJlbnRDb250ZXh0LCBfZXZlbnQsIGFjdGlvbkJsb2NrcywgcHJlZGljdGFibGVFeGVjLCBwcmVzZXJ2ZUFjdGlvbk9yZGVyKSB7XG4gIGlmIChwcmVzZXJ2ZUFjdGlvbk9yZGVyID09PSB2b2lkIDApIHtcbiAgICBwcmVzZXJ2ZUFjdGlvbk9yZGVyID0gZmFsc2U7XG4gIH1cblxuICB2YXIgYXNzaWduQWN0aW9ucyA9IHByZXNlcnZlQWN0aW9uT3JkZXIgPyBbXSA6IHBsdWNrQXNzaWducyhhY3Rpb25CbG9ja3MpO1xuICB2YXIgdXBkYXRlZENvbnRleHQgPSBhc3NpZ25BY3Rpb25zLmxlbmd0aCA/IHVwZGF0ZUNvbnRleHQoY3VycmVudENvbnRleHQsIF9ldmVudCwgYXNzaWduQWN0aW9ucywgY3VycmVudFN0YXRlKSA6IGN1cnJlbnRDb250ZXh0O1xuICB2YXIgcHJlc2VydmVkQ29udGV4dHMgPSBwcmVzZXJ2ZUFjdGlvbk9yZGVyID8gW2N1cnJlbnRDb250ZXh0XSA6IHVuZGVmaW5lZDtcbiAgdmFyIGRlZmVycmVkVG9CbG9ja0VuZCA9IFtdO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUFjdGlvbihibG9ja1R5cGUsIGFjdGlvbk9iamVjdCkge1xuICAgIHZhciBfYTtcblxuICAgIHN3aXRjaCAoYWN0aW9uT2JqZWN0LnR5cGUpIHtcbiAgICAgIGNhc2UgcmFpc2UkMTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciByYWlzZWRBY3Rpb24gPSByZXNvbHZlUmFpc2UoYWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCBtYWNoaW5lLm9wdGlvbnMuZGVsYXlzKTtcblxuICAgICAgICAgIGlmIChwcmVkaWN0YWJsZUV4ZWMgJiYgdHlwZW9mIHJhaXNlZEFjdGlvbi5kZWxheSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHByZWRpY3RhYmxlRXhlYyhyYWlzZWRBY3Rpb24sIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiByYWlzZWRBY3Rpb247XG4gICAgICAgIH1cblxuICAgICAgY2FzZSBzZW5kJDE6XG4gICAgICAgIHZhciBzZW5kQWN0aW9uID0gcmVzb2x2ZVNlbmQoYWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCBtYWNoaW5lLm9wdGlvbnMuZGVsYXlzKTsgLy8gVE9ETzogZml4IEFjdGlvblR5cGVzLkluaXRcblxuICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICB2YXIgY29uZmlndXJlZERlbGF5ID0gYWN0aW9uT2JqZWN0LmRlbGF5OyAvLyB3YXJuIGFmdGVyIHJlc29sdmluZyBhcyB3ZSBjYW4gY3JlYXRlIGJldHRlciBjb250ZXh0dWFsIG1lc3NhZ2UgaGVyZVxuXG4gICAgICAgICAgd2FybighaXNTdHJpbmcoY29uZmlndXJlZERlbGF5KSB8fCB0eXBlb2Ygc2VuZEFjdGlvbi5kZWxheSA9PT0gJ251bWJlcicsIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICBcIk5vIGRlbGF5IHJlZmVyZW5jZSBmb3IgZGVsYXkgZXhwcmVzc2lvbiAnXCIuY29uY2F0KGNvbmZpZ3VyZWREZWxheSwgXCInIHdhcyBmb3VuZCBvbiBtYWNoaW5lICdcIikuY29uY2F0KG1hY2hpbmUuaWQsIFwiJ1wiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJlZGljdGFibGVFeGVjICYmIHNlbmRBY3Rpb24udG8gIT09IFNwZWNpYWxUYXJnZXRzLkludGVybmFsKSB7XG4gICAgICAgICAgaWYgKGJsb2NrVHlwZSA9PT0gJ2VudHJ5Jykge1xuICAgICAgICAgICAgZGVmZXJyZWRUb0Jsb2NrRW5kLnB1c2goc2VuZEFjdGlvbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZWRpY3RhYmxlRXhlYyhzZW5kQWN0aW9uLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VuZEFjdGlvbjtcblxuICAgICAgY2FzZSBsb2ckMTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciByZXNvbHZlZCA9IHJlc29sdmVMb2coYWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICBwcmVkaWN0YWJsZUV4ZWMgPT09IG51bGwgfHwgcHJlZGljdGFibGVFeGVjID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmVkaWN0YWJsZUV4ZWMocmVzb2x2ZWQsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlZDtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIGNob29zZSQxOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIGNob29zZUFjdGlvbiA9IGFjdGlvbk9iamVjdDtcbiAgICAgICAgICB2YXIgbWF0Y2hlZEFjdGlvbnMgPSAoX2EgPSBjaG9vc2VBY3Rpb24uY29uZHMuZmluZChmdW5jdGlvbiAoY29uZGl0aW9uKSB7XG4gICAgICAgICAgICB2YXIgZ3VhcmQgPSB0b0d1YXJkKGNvbmRpdGlvbi5jb25kLCBtYWNoaW5lLm9wdGlvbnMuZ3VhcmRzKTtcbiAgICAgICAgICAgIHJldHVybiAhZ3VhcmQgfHwgZXZhbHVhdGVHdWFyZChtYWNoaW5lLCBndWFyZCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCwgIXByZWRpY3RhYmxlRXhlYyA/IGN1cnJlbnRTdGF0ZSA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgfSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hY3Rpb25zO1xuXG4gICAgICAgICAgaWYgKCFtYXRjaGVkQWN0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfYiA9IF9fcmVhZChyZXNvbHZlQWN0aW9ucyhtYWNoaW5lLCBjdXJyZW50U3RhdGUsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsIFt7XG4gICAgICAgICAgICB0eXBlOiBibG9ja1R5cGUsXG4gICAgICAgICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHModG9BcnJheShtYXRjaGVkQWN0aW9ucyksIG1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgICAgICAgIH1dLCBwcmVkaWN0YWJsZUV4ZWMsIHByZXNlcnZlQWN0aW9uT3JkZXIpLCAyKSxcbiAgICAgICAgICAgICAgcmVzb2x2ZWRBY3Rpb25zRnJvbUNob29zZSA9IF9iWzBdLFxuICAgICAgICAgICAgICByZXNvbHZlZENvbnRleHRGcm9tQ2hvb3NlID0gX2JbMV07XG5cbiAgICAgICAgICB1cGRhdGVkQ29udGV4dCA9IHJlc29sdmVkQ29udGV4dEZyb21DaG9vc2U7XG4gICAgICAgICAgcHJlc2VydmVkQ29udGV4dHMgPT09IG51bGwgfHwgcHJlc2VydmVkQ29udGV4dHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByZXNlcnZlZENvbnRleHRzLnB1c2godXBkYXRlZENvbnRleHQpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlZEFjdGlvbnNGcm9tQ2hvb3NlO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2UgcHVyZSQxOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIG1hdGNoZWRBY3Rpb25zID0gYWN0aW9uT2JqZWN0LmdldCh1cGRhdGVkQ29udGV4dCwgX2V2ZW50LmRhdGEpO1xuXG4gICAgICAgICAgaWYgKCFtYXRjaGVkQWN0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBfYyA9IF9fcmVhZChyZXNvbHZlQWN0aW9ucyhtYWNoaW5lLCBjdXJyZW50U3RhdGUsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsIFt7XG4gICAgICAgICAgICB0eXBlOiBibG9ja1R5cGUsXG4gICAgICAgICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHModG9BcnJheShtYXRjaGVkQWN0aW9ucyksIG1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgICAgICAgIH1dLCBwcmVkaWN0YWJsZUV4ZWMsIHByZXNlcnZlQWN0aW9uT3JkZXIpLCAyKSxcbiAgICAgICAgICAgICAgcmVzb2x2ZWRBY3Rpb25zRnJvbVB1cmUgPSBfY1swXSxcbiAgICAgICAgICAgICAgcmVzb2x2ZWRDb250ZXh0ID0gX2NbMV07XG5cbiAgICAgICAgICB1cGRhdGVkQ29udGV4dCA9IHJlc29sdmVkQ29udGV4dDtcbiAgICAgICAgICBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gbnVsbCB8fCBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJlc2VydmVkQ29udGV4dHMucHVzaCh1cGRhdGVkQ29udGV4dCk7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVkQWN0aW9uc0Zyb21QdXJlO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2Ugc3RvcCQxOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIHJlc29sdmVkID0gcmVzb2x2ZVN0b3AoYWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICBwcmVkaWN0YWJsZUV4ZWMgPT09IG51bGwgfHwgcHJlZGljdGFibGVFeGVjID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmVkaWN0YWJsZUV4ZWMocmVzb2x2ZWQsIGN1cnJlbnRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlZDtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIGFzc2lnbiQxOlxuICAgICAgICB7XG4gICAgICAgICAgdXBkYXRlZENvbnRleHQgPSB1cGRhdGVDb250ZXh0KHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsIFthY3Rpb25PYmplY3RdLCAhcHJlZGljdGFibGVFeGVjID8gY3VycmVudFN0YXRlIDogdW5kZWZpbmVkKTtcbiAgICAgICAgICBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gbnVsbCB8fCBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJlc2VydmVkQ29udGV4dHMucHVzaCh1cGRhdGVkQ29udGV4dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFyIHJlc29sdmVkQWN0aW9uT2JqZWN0ID0gdG9BY3Rpb25PYmplY3QoYWN0aW9uT2JqZWN0LCBtYWNoaW5lLm9wdGlvbnMuYWN0aW9ucyk7XG4gICAgICAgIHZhciBleGVjXzEgPSByZXNvbHZlZEFjdGlvbk9iamVjdC5leGVjO1xuXG4gICAgICAgIGlmIChwcmVkaWN0YWJsZUV4ZWMpIHtcbiAgICAgICAgICBwcmVkaWN0YWJsZUV4ZWMocmVzb2x2ZWRBY3Rpb25PYmplY3QsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGV4ZWNfMSAmJiBwcmVzZXJ2ZWRDb250ZXh0cykge1xuICAgICAgICAgIHZhciBjb250ZXh0SW5kZXhfMSA9IHByZXNlcnZlZENvbnRleHRzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICB2YXIgd3JhcHBlZCA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCByZXNvbHZlZEFjdGlvbk9iamVjdCksIHtcbiAgICAgICAgICAgIGV4ZWM6IGZ1bmN0aW9uIChfY3R4KSB7XG4gICAgICAgICAgICAgIHZhciBhcmdzID0gW107XG5cbiAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBhcmdzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgZXhlY18xLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheShbcHJlc2VydmVkQ29udGV4dHNbY29udGV4dEluZGV4XzFdXSwgX19yZWFkKGFyZ3MpLCBmYWxzZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgcmVzb2x2ZWRBY3Rpb25PYmplY3QgPSB3cmFwcGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc29sdmVkQWN0aW9uT2JqZWN0O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHByb2Nlc3NCbG9jayhibG9jaykge1xuICAgIHZhciBlXzIsIF9hO1xuXG4gICAgdmFyIHJlc29sdmVkQWN0aW9ucyA9IFtdO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoYmxvY2suYWN0aW9ucyksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IF9jLnZhbHVlO1xuICAgICAgICB2YXIgcmVzb2x2ZWQgPSBoYW5kbGVBY3Rpb24oYmxvY2sudHlwZSwgYWN0aW9uKTtcblxuICAgICAgICBpZiAocmVzb2x2ZWQpIHtcbiAgICAgICAgICByZXNvbHZlZEFjdGlvbnMgPSByZXNvbHZlZEFjdGlvbnMuY29uY2F0KHJlc29sdmVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMl8xKSB7XG4gICAgICBlXzIgPSB7XG4gICAgICAgIGVycm9yOiBlXzJfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlZmVycmVkVG9CbG9ja0VuZC5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHByZWRpY3RhYmxlRXhlYyhhY3Rpb24sIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgIH0pO1xuICAgIGRlZmVycmVkVG9CbG9ja0VuZC5sZW5ndGggPSAwO1xuICAgIHJldHVybiByZXNvbHZlZEFjdGlvbnM7XG4gIH1cblxuICB2YXIgcmVzb2x2ZWRBY3Rpb25zID0gZmxhdHRlbihhY3Rpb25CbG9ja3MubWFwKHByb2Nlc3NCbG9jaykpO1xuICByZXR1cm4gW3Jlc29sdmVkQWN0aW9ucywgdXBkYXRlZENvbnRleHRdO1xufVxuXG5leHBvcnQgeyBhZnRlciwgYXNzaWduLCBjYW5jZWwsIGNob29zZSwgZG9uZSwgZG9uZUludm9rZSwgZXJyb3IsIGVzY2FsYXRlLCBmb3J3YXJkVG8sIGdldEFjdGlvbkZ1bmN0aW9uLCBpbml0RXZlbnQsIGlzQWN0aW9uT2JqZWN0LCBsb2csIHB1cmUsIHJhaXNlLCByZXNvbHZlQWN0aW9ucywgcmVzb2x2ZUxvZywgcmVzb2x2ZVJhaXNlLCByZXNvbHZlU2VuZCwgcmVzb2x2ZVN0b3AsIHJlc3BvbmQsIHNlbmQsIHNlbmRQYXJlbnQsIHNlbmRUbywgc2VuZFVwZGF0ZSwgc3RhcnQsIHN0b3AsIHRvQWN0aW9uT2JqZWN0LCB0b0FjdGlvbk9iamVjdHMsIHRvQWN0aXZpdHlEZWZpbml0aW9uIH07XG4iLCJpbXBvcnQgeyBlcnJvciwgZG9uZUludm9rZSB9IGZyb20gJy4vYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyB0b0FjdG9yUmVmIH0gZnJvbSAnLi9BY3Rvci5qcyc7XG5pbXBvcnQgeyB0b09ic2VydmVyIH0gZnJvbSAnLi91dGlscy5qcyc7XG5cbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGFjdG9yIGJlaGF2aW9yIGZyb20gYSByZWR1Y2VyIGFuZCBpdHMgaW5pdGlhbCBzdGF0ZS5cclxuICpcclxuICogQHBhcmFtIHRyYW5zaXRpb24gVGhlIHB1cmUgcmVkdWNlciB0aGF0IHJldHVybnMgdGhlIG5leHQgc3RhdGUgZ2l2ZW4gdGhlIGN1cnJlbnQgc3RhdGUgYW5kIGV2ZW50LlxyXG4gKiBAcGFyYW0gaW5pdGlhbFN0YXRlIFRoZSBpbml0aWFsIHN0YXRlIG9mIHRoZSByZWR1Y2VyLlxyXG4gKiBAcmV0dXJucyBBbiBhY3RvciBiZWhhdmlvclxyXG4gKi9cblxuZnVuY3Rpb24gZnJvbVJlZHVjZXIodHJhbnNpdGlvbiwgaW5pdGlhbFN0YXRlKSB7XG4gIHJldHVybiB7XG4gICAgdHJhbnNpdGlvbjogdHJhbnNpdGlvbixcbiAgICBpbml0aWFsU3RhdGU6IGluaXRpYWxTdGF0ZVxuICB9O1xufVxuZnVuY3Rpb24gZnJvbVByb21pc2UocHJvbWlzZUZuKSB7XG4gIHZhciBpbml0aWFsU3RhdGUgPSB7XG4gICAgZXJyb3I6IHVuZGVmaW5lZCxcbiAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgc3RhdHVzOiAncGVuZGluZydcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICB0cmFuc2l0aW9uOiBmdW5jdGlvbiAoc3RhdGUsIGV2ZW50LCBfYSkge1xuICAgICAgdmFyIHBhcmVudCA9IF9hLnBhcmVudCxcbiAgICAgICAgICBpZCA9IF9hLmlkLFxuICAgICAgICAgIG9ic2VydmVycyA9IF9hLm9ic2VydmVycztcblxuICAgICAgc3dpdGNoIChldmVudC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2Z1bGZpbGwnOlxuICAgICAgICAgIHBhcmVudCA9PT0gbnVsbCB8fCBwYXJlbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmVudC5zZW5kKGRvbmVJbnZva2UoaWQsIGV2ZW50LmRhdGEpKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZXJyb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGRhdGE6IGV2ZW50LmRhdGEsXG4gICAgICAgICAgICBzdGF0dXM6ICdmdWxmaWxsZWQnXG4gICAgICAgICAgfTtcblxuICAgICAgICBjYXNlICdyZWplY3QnOlxuICAgICAgICAgIHBhcmVudCA9PT0gbnVsbCB8fCBwYXJlbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhcmVudC5zZW5kKGVycm9yKGlkLCBldmVudC5lcnJvcikpO1xuICAgICAgICAgIG9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXZlbnQuZXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlcnJvcjogZXZlbnQuZXJyb3IsXG4gICAgICAgICAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBzdGF0dXM6ICdyZWplY3RlZCdcbiAgICAgICAgICB9O1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW5pdGlhbFN0YXRlOiBpbml0aWFsU3RhdGUsXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIChfYSkge1xuICAgICAgdmFyIHNlbGYgPSBfYS5zZWxmO1xuICAgICAgcHJvbWlzZUZuKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBzZWxmLnNlbmQoe1xuICAgICAgICAgIHR5cGU6ICdmdWxmaWxsJyxcbiAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICBzZWxmLnNlbmQoe1xuICAgICAgICAgIHR5cGU6ICdyZWplY3QnLFxuICAgICAgICAgIGVycm9yOiByZWFzb25cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpbml0aWFsU3RhdGU7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gc3Bhd25CZWhhdmlvcihiZWhhdmlvciwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIHN0YXRlID0gYmVoYXZpb3IuaW5pdGlhbFN0YXRlO1xuICB2YXIgb2JzZXJ2ZXJzID0gbmV3IFNldCgpO1xuICB2YXIgbWFpbGJveCA9IFtdO1xuICB2YXIgZmx1c2hpbmcgPSBmYWxzZTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGZsdXNoaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZmx1c2hpbmcgPSB0cnVlO1xuXG4gICAgd2hpbGUgKG1haWxib3gubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGV2ZW50XzEgPSBtYWlsYm94LnNoaWZ0KCk7XG4gICAgICBzdGF0ZSA9IGJlaGF2aW9yLnRyYW5zaXRpb24oc3RhdGUsIGV2ZW50XzEsIGFjdG9yQ3R4KTtcbiAgICAgIG9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgICByZXR1cm4gb2JzZXJ2ZXIubmV4dChzdGF0ZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmbHVzaGluZyA9IGZhbHNlO1xuICB9O1xuXG4gIHZhciBhY3RvciA9IHRvQWN0b3JSZWYoe1xuICAgIGlkOiBvcHRpb25zLmlkLFxuICAgIHNlbmQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgbWFpbGJveC5wdXNoKGV2ZW50KTtcbiAgICAgIGZsdXNoKCk7XG4gICAgfSxcbiAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH0sXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgICB2YXIgb2JzZXJ2ZXIgPSB0b09ic2VydmVyKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSk7XG4gICAgICBvYnNlcnZlcnMuYWRkKG9ic2VydmVyKTtcbiAgICAgIG9ic2VydmVyLm5leHQoc3RhdGUpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBvYnNlcnZlcnMuZGVsZXRlKG9ic2VydmVyKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuICB2YXIgYWN0b3JDdHggPSB7XG4gICAgcGFyZW50OiBvcHRpb25zLnBhcmVudCxcbiAgICBzZWxmOiBhY3RvcixcbiAgICBpZDogb3B0aW9ucy5pZCB8fCAnYW5vbnltb3VzJyxcbiAgICBvYnNlcnZlcnM6IG9ic2VydmVyc1xuICB9O1xuICBzdGF0ZSA9IGJlaGF2aW9yLnN0YXJ0ID8gYmVoYXZpb3Iuc3RhcnQoYWN0b3JDdHgpIDogc3RhdGU7XG4gIHJldHVybiBhY3Rvcjtcbn1cblxuZXhwb3J0IHsgZnJvbVByb21pc2UsIGZyb21SZWR1Y2VyLCBzcGF3bkJlaGF2aW9yIH07XG4iLCJ2YXIgU1RBVEVfREVMSU1JVEVSID0gJy4nO1xudmFyIEVNUFRZX0FDVElWSVRZX01BUCA9IHt9O1xudmFyIERFRkFVTFRfR1VBUkRfVFlQRSA9ICd4c3RhdGUuZ3VhcmQnO1xudmFyIFRBUkdFVExFU1NfS0VZID0gJyc7XG5cbmV4cG9ydCB7IERFRkFVTFRfR1VBUkRfVFlQRSwgRU1QVFlfQUNUSVZJVFlfTUFQLCBTVEFURV9ERUxJTUlURVIsIFRBUkdFVExFU1NfS0VZIH07XG4iLCJpbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbmZ1bmN0aW9uIGdldEdsb2JhbCgpIHtcbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBnbG9iYWxUaGlzO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBzZWxmO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHdpbmRvdztcbiAgfVxuXG4gIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBnbG9iYWw7XG4gIH1cblxuICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICBjb25zb2xlLndhcm4oJ1hTdGF0ZSBjb3VsZCBub3QgZmluZCBhIGdsb2JhbCBvYmplY3QgaW4gdGhpcyBlbnZpcm9ubWVudC4gUGxlYXNlIGxldCB0aGUgbWFpbnRhaW5lcnMga25vdyBhbmQgcmFpc2UgYW4gaXNzdWUgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL3N0YXRlbHlhaS94c3RhdGUvaXNzdWVzJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGV2VG9vbHMoKSB7XG4gIHZhciBnbG9iYWwgPSBnZXRHbG9iYWwoKTtcblxuICBpZiAoZ2xvYmFsICYmICdfX3hzdGF0ZV9fJyBpbiBnbG9iYWwpIHtcbiAgICByZXR1cm4gZ2xvYmFsLl9feHN0YXRlX187XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiByZWdpc3RlclNlcnZpY2Uoc2VydmljZSkge1xuICBpZiAoIWdldEdsb2JhbCgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGRldlRvb2xzID0gZ2V0RGV2VG9vbHMoKTtcblxuICBpZiAoZGV2VG9vbHMpIHtcbiAgICBkZXZUb29scy5yZWdpc3RlcihzZXJ2aWNlKTtcbiAgfVxufVxuXG5leHBvcnQgeyBnZXRHbG9iYWwsIHJlZ2lzdGVyU2VydmljZSB9O1xuIiwidmFyIElTX1BST0RVQ1RJT04gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nO1xuXG5leHBvcnQgeyBJU19QUk9EVUNUSU9OIH07XG4iLCJpbXBvcnQgeyBhc3NpZ24gYXMgYXNzaWduJDEsIGNhbmNlbCBhcyBjYW5jZWwkMSwgc2VuZCBhcyBzZW5kJDEsIHNlbmRUbyBhcyBzZW5kVG8kMSwgc2VuZFBhcmVudCBhcyBzZW5kUGFyZW50JDEsIHNlbmRVcGRhdGUgYXMgc2VuZFVwZGF0ZSQxLCBmb3J3YXJkVG8gYXMgZm9yd2FyZFRvJDEsIGRvbmVJbnZva2UgYXMgZG9uZUludm9rZSQxLCByYWlzZSBhcyByYWlzZSQxLCBsb2cgYXMgbG9nJDEsIHB1cmUgYXMgcHVyZSQxLCBjaG9vc2UgYXMgY2hvb3NlJDEsIHN0b3AgYXMgc3RvcCQxIH0gZnJvbSAnLi9hY3Rpb25zLmpzJztcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zLmpzJztcbmV4cG9ydCB7IGFjdGlvbnMgfTtcbmV4cG9ydCB7IHRvQWN0b3JSZWYgfSBmcm9tICcuL0FjdG9yLmpzJztcbmV4cG9ydCB7IEludGVycHJldGVyLCBJbnRlcnByZXRlclN0YXR1cywgaW50ZXJwcmV0LCBzcGF3biB9IGZyb20gJy4vaW50ZXJwcmV0ZXIuanMnO1xuZXhwb3J0IHsgTWFjaGluZSwgY3JlYXRlTWFjaGluZSB9IGZyb20gJy4vTWFjaGluZS5qcyc7XG5leHBvcnQgeyBtYXBTdGF0ZSB9IGZyb20gJy4vbWFwU3RhdGUuanMnO1xuZXhwb3J0IHsgbWF0Y2hTdGF0ZSB9IGZyb20gJy4vbWF0Y2guanMnO1xuZXhwb3J0IHsgY3JlYXRlU2NoZW1hLCB0IH0gZnJvbSAnLi9zY2hlbWEuanMnO1xuZXhwb3J0IHsgU3RhdGUgfSBmcm9tICcuL1N0YXRlLmpzJztcbmV4cG9ydCB7IFN0YXRlTm9kZSB9IGZyb20gJy4vU3RhdGVOb2RlLmpzJztcbmV4cG9ydCB7IHNwYXduQmVoYXZpb3IgfSBmcm9tICcuL2JlaGF2aW9ycy5qcyc7XG5leHBvcnQgeyBBY3Rpb25UeXBlcywgU3BlY2lhbFRhcmdldHMgfSBmcm9tICcuL3R5cGVzLmpzJztcbmV4cG9ydCB7IG1hdGNoZXNTdGF0ZSwgdG9FdmVudE9iamVjdCwgdG9PYnNlcnZlciwgdG9TQ1hNTEV2ZW50IH0gZnJvbSAnLi91dGlscy5qcyc7XG5cbnZhciBhc3NpZ24gPSBhc3NpZ24kMSxcbiAgICBjYW5jZWwgPSBjYW5jZWwkMSxcbiAgICBzZW5kID0gc2VuZCQxLFxuICAgIHNlbmRUbyA9IHNlbmRUbyQxLFxuICAgIHNlbmRQYXJlbnQgPSBzZW5kUGFyZW50JDEsXG4gICAgc2VuZFVwZGF0ZSA9IHNlbmRVcGRhdGUkMSxcbiAgICBmb3J3YXJkVG8gPSBmb3J3YXJkVG8kMSxcbiAgICBkb25lSW52b2tlID0gZG9uZUludm9rZSQxLFxuICAgIHJhaXNlID0gcmFpc2UkMSxcbiAgICBsb2cgPSBsb2ckMSxcbiAgICBwdXJlID0gcHVyZSQxLFxuICAgIGNob29zZSA9IGNob29zZSQxLFxuICAgIHN0b3AgPSBzdG9wJDE7XG5cbmV4cG9ydCB7IGFzc2lnbiwgY2FuY2VsLCBjaG9vc2UsIGRvbmVJbnZva2UsIGZvcndhcmRUbywgbG9nLCBwdXJlLCByYWlzZSwgc2VuZCwgc2VuZFBhcmVudCwgc2VuZFRvLCBzZW5kVXBkYXRlLCBzdG9wIH07XG4iLCJpbXBvcnQgeyBfX3ZhbHVlcywgX19zcHJlYWRBcnJheSwgX19yZWFkLCBfX2Fzc2lnbiB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IFNwZWNpYWxUYXJnZXRzLCBBY3Rpb25UeXBlcyB9IGZyb20gJy4vdHlwZXMuanMnO1xuaW1wb3J0IHsgaXNTdGF0ZUNvbmZpZywgU3RhdGUsIGJpbmRBY3Rpb25Ub1N0YXRlIH0gZnJvbSAnLi9TdGF0ZS5qcyc7XG5pbXBvcnQgeyBlcnJvclBsYXRmb3JtLCB1cGRhdGUsIGVycm9yIGFzIGVycm9yJDEsIGxvZywgc3RvcCwgc3RhcnQsIGNhbmNlbCwgc2VuZCwgcmFpc2UgfSBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmltcG9ydCB7IGluaXRFdmVudCwgZG9uZUludm9rZSwgdG9BY3Rpb25PYmplY3RzLCByZXNvbHZlQWN0aW9ucywgZXJyb3IsIGdldEFjdGlvbkZ1bmN0aW9uIH0gZnJvbSAnLi9hY3Rpb25zLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcbmltcG9ydCB7IHdhcm4sIG1hcENvbnRleHQsIHRvT2JzZXJ2ZXIsIGlzRnVuY3Rpb24sIHRvU0NYTUxFdmVudCwgZmxhdHRlbiwgaXNSYWlzYWJsZUFjdGlvbiwgaXNQcm9taXNlTGlrZSwgaXNPYnNlcnZhYmxlLCBpc01hY2hpbmUsIGlzQmVoYXZpb3IsIHJlcG9ydFVuaGFuZGxlZEV4Y2VwdGlvbk9uSW52b2NhdGlvbiwgc3ltYm9sT2JzZXJ2YWJsZSwgaXNBcnJheSwgdG9FdmVudE9iamVjdCwgaXNTdHJpbmcsIGlzQWN0b3IsIHRvSW52b2tlU291cmNlLCB1bmlxdWVJZCB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSAnLi9zY2hlZHVsZXIuanMnO1xuaW1wb3J0IHsgY3JlYXRlRGVmZXJyZWRBY3RvciwgaXNTcGF3bmVkQWN0b3IgfSBmcm9tICcuL0FjdG9yLmpzJztcbmltcG9ydCB7IHJlZ2lzdHJ5IH0gZnJvbSAnLi9yZWdpc3RyeS5qcyc7XG5pbXBvcnQgeyBnZXRHbG9iYWwsIHJlZ2lzdGVyU2VydmljZSB9IGZyb20gJy4vZGV2VG9vbHMuanMnO1xuaW1wb3J0IHsgcHJvdmlkZSwgY29uc3VtZSB9IGZyb20gJy4vc2VydmljZVNjb3BlLmpzJztcbmltcG9ydCB7IHNwYXduQmVoYXZpb3IgfSBmcm9tICcuL2JlaGF2aW9ycy5qcyc7XG5cbnZhciBERUZBVUxUX1NQQVdOX09QVElPTlMgPSB7XG4gIHN5bmM6IGZhbHNlLFxuICBhdXRvRm9yd2FyZDogZmFsc2Vcbn07XG52YXIgSW50ZXJwcmV0ZXJTdGF0dXM7XG5cbihmdW5jdGlvbiAoSW50ZXJwcmV0ZXJTdGF0dXMpIHtcbiAgSW50ZXJwcmV0ZXJTdGF0dXNbSW50ZXJwcmV0ZXJTdGF0dXNbXCJOb3RTdGFydGVkXCJdID0gMF0gPSBcIk5vdFN0YXJ0ZWRcIjtcbiAgSW50ZXJwcmV0ZXJTdGF0dXNbSW50ZXJwcmV0ZXJTdGF0dXNbXCJSdW5uaW5nXCJdID0gMV0gPSBcIlJ1bm5pbmdcIjtcbiAgSW50ZXJwcmV0ZXJTdGF0dXNbSW50ZXJwcmV0ZXJTdGF0dXNbXCJTdG9wcGVkXCJdID0gMl0gPSBcIlN0b3BwZWRcIjtcbn0pKEludGVycHJldGVyU3RhdHVzIHx8IChJbnRlcnByZXRlclN0YXR1cyA9IHt9KSk7XG5cbnZhciBJbnRlcnByZXRlciA9XG4vKiNfX1BVUkVfXyovXG5cbi8qKiBAY2xhc3MgKi9cbmZ1bmN0aW9uICgpIHtcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBJbnRlcnByZXRlciBpbnN0YW5jZSAoaS5lLiwgc2VydmljZSkgZm9yIHRoZSBnaXZlbiBtYWNoaW5lIHdpdGggdGhlIHByb3ZpZGVkIG9wdGlvbnMsIGlmIGFueS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBtYWNoaW5lIFRoZSBtYWNoaW5lIHRvIGJlIGludGVycHJldGVkXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgSW50ZXJwcmV0ZXIgb3B0aW9uc1xyXG4gICAqL1xuICBmdW5jdGlvbiBJbnRlcnByZXRlcihtYWNoaW5lLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9ucyA9IEludGVycHJldGVyLmRlZmF1bHRPcHRpb25zO1xuICAgIH1cblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLm1hY2hpbmUgPSBtYWNoaW5lO1xuICAgIHRoaXMuZGVsYXllZEV2ZW50c01hcCA9IHt9O1xuICAgIHRoaXMubGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuY29udGV4dExpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLnN0b3BMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5kb25lTGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5zZW5kTGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0aGUgc2VydmljZSBpcyBzdGFydGVkLlxyXG4gICAgICovXG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5zdGF0dXMgPSBJbnRlcnByZXRlclN0YXR1cy5Ob3RTdGFydGVkO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5mb3J3YXJkVG8gPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fb3V0Z29pbmdRdWV1ZSA9IFtdO1xuICAgIC8qKlxyXG4gICAgICogQWxpYXMgZm9yIEludGVycHJldGVyLnByb3RvdHlwZS5zdGFydFxyXG4gICAgICovXG5cbiAgICB0aGlzLmluaXQgPSB0aGlzLnN0YXJ0O1xuICAgIC8qKlxyXG4gICAgICogU2VuZHMgYW4gZXZlbnQgdG8gdGhlIHJ1bm5pbmcgaW50ZXJwcmV0ZXIgdG8gdHJpZ2dlciBhIHRyYW5zaXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQW4gYXJyYXkgb2YgZXZlbnRzIChiYXRjaGVkKSBjYW4gYmUgc2VudCBhcyB3ZWxsLCB3aGljaCB3aWxsIHNlbmQgYWxsXHJcbiAgICAgKiBiYXRjaGVkIGV2ZW50cyB0byB0aGUgcnVubmluZyBpbnRlcnByZXRlci4gVGhlIGxpc3RlbmVycyB3aWxsIGJlXHJcbiAgICAgKiBub3RpZmllZCBvbmx5ICoqb25jZSoqIHdoZW4gYWxsIGV2ZW50cyBhcmUgcHJvY2Vzc2VkLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQocykgdG8gc2VuZFxyXG4gICAgICovXG5cbiAgICB0aGlzLnNlbmQgPSBmdW5jdGlvbiAoZXZlbnQsIHBheWxvYWQpIHtcbiAgICAgIGlmIChpc0FycmF5KGV2ZW50KSkge1xuICAgICAgICBfdGhpcy5iYXRjaChldmVudCk7XG5cbiAgICAgICAgcmV0dXJuIF90aGlzLnN0YXRlO1xuICAgICAgfVxuXG4gICAgICB2YXIgX2V2ZW50ID0gdG9TQ1hNTEV2ZW50KHRvRXZlbnRPYmplY3QoZXZlbnQsIHBheWxvYWQpKTtcblxuICAgICAgaWYgKF90aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuU3RvcHBlZCkge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgIHdhcm4oZmFsc2UsIFwiRXZlbnQgXFxcIlwiLmNvbmNhdChfZXZlbnQubmFtZSwgXCJcXFwiIHdhcyBzZW50IHRvIHN0b3BwZWQgc2VydmljZSBcXFwiXCIpLmNvbmNhdChfdGhpcy5tYWNoaW5lLmlkLCBcIlxcXCIuIFRoaXMgc2VydmljZSBoYXMgYWxyZWFkeSByZWFjaGVkIGl0cyBmaW5hbCBzdGF0ZSwgYW5kIHdpbGwgbm90IHRyYW5zaXRpb24uXFxuRXZlbnQ6IFwiKS5jb25jYXQoSlNPTi5zdHJpbmdpZnkoX2V2ZW50LmRhdGEpKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX3RoaXMuc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChfdGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcgJiYgIV90aGlzLm9wdGlvbnMuZGVmZXJFdmVudHMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXZlbnQgXFxcIlwiLmNvbmNhdChfZXZlbnQubmFtZSwgXCJcXFwiIHdhcyBzZW50IHRvIHVuaW5pdGlhbGl6ZWQgc2VydmljZSBcXFwiXCIpLmNvbmNhdChfdGhpcy5tYWNoaW5lLmlkIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgLCBcIlxcXCIuIE1ha2Ugc3VyZSAuc3RhcnQoKSBpcyBjYWxsZWQgZm9yIHRoaXMgc2VydmljZSwgb3Igc2V0IHsgZGVmZXJFdmVudHM6IHRydWUgfSBpbiB0aGUgc2VydmljZSBvcHRpb25zLlxcbkV2ZW50OiBcIikuY29uY2F0KEpTT04uc3RyaW5naWZ5KF9ldmVudC5kYXRhKSkpO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBGb3J3YXJkIGNvcHkgb2YgZXZlbnQgdG8gY2hpbGQgYWN0b3JzXG4gICAgICAgIF90aGlzLmZvcndhcmQoX2V2ZW50KTtcblxuICAgICAgICB2YXIgbmV4dFN0YXRlID0gX3RoaXMuX25leHRTdGF0ZShfZXZlbnQpO1xuXG4gICAgICAgIF90aGlzLnVwZGF0ZShuZXh0U3RhdGUsIF9ldmVudCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIF90aGlzLl9zdGF0ZTsgLy8gVE9ETzogZGVwcmVjYXRlIChzaG91bGQgcmV0dXJuIHZvaWQpXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6c2VtaWNvbG9uXG4gICAgfTtcblxuICAgIHRoaXMuc2VuZFRvID0gZnVuY3Rpb24gKGV2ZW50LCB0bywgaW1tZWRpYXRlKSB7XG4gICAgICB2YXIgaXNQYXJlbnQgPSBfdGhpcy5wYXJlbnQgJiYgKHRvID09PSBTcGVjaWFsVGFyZ2V0cy5QYXJlbnQgfHwgX3RoaXMucGFyZW50LmlkID09PSB0byk7XG4gICAgICB2YXIgdGFyZ2V0ID0gaXNQYXJlbnQgPyBfdGhpcy5wYXJlbnQgOiBpc1N0cmluZyh0bykgPyB0byA9PT0gU3BlY2lhbFRhcmdldHMuSW50ZXJuYWwgPyBfdGhpcyA6IF90aGlzLmNoaWxkcmVuLmdldCh0bykgfHwgcmVnaXN0cnkuZ2V0KHRvKSA6IGlzQWN0b3IodG8pID8gdG8gOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgIGlmICghaXNQYXJlbnQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gc2VuZCBldmVudCB0byBjaGlsZCAnXCIuY29uY2F0KHRvLCBcIicgZnJvbSBzZXJ2aWNlICdcIikuY29uY2F0KF90aGlzLmlkLCBcIicuXCIpKTtcbiAgICAgICAgfSAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuXG5cbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgd2FybihmYWxzZSwgXCJTZXJ2aWNlICdcIi5jb25jYXQoX3RoaXMuaWQsIFwiJyBoYXMgbm8gcGFyZW50OiB1bmFibGUgdG8gc2VuZCBldmVudCBcIikuY29uY2F0KGV2ZW50LnR5cGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCdtYWNoaW5lJyBpbiB0YXJnZXQpIHtcbiAgICAgICAgLy8gcGVyaGFwcyB0aG9zZSBldmVudHMgc2hvdWxkIGJlIHJlamVjdGVkIGluIHRoZSBwYXJlbnRcbiAgICAgICAgLy8gYnV0IGF0bSBpdCBkb2Vzbid0IGhhdmUgZWFzeSBhY2Nlc3MgdG8gYWxsIG9mIHRoZSBpbmZvcm1hdGlvbiB0aGF0IGlzIHJlcXVpcmVkIHRvIGRvIGl0IHJlbGlhYmx5XG4gICAgICAgIGlmIChfdGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlN0b3BwZWQgfHwgX3RoaXMucGFyZW50ICE9PSB0YXJnZXQgfHwgLy8gd2UgbmVlZCB0byBzZW5kIGV2ZW50cyB0byB0aGUgcGFyZW50IGZyb20gZXhpdCBoYW5kbGVycyBvZiBhIG1hY2hpbmUgdGhhdCByZWFjaGVkIGl0cyBmaW5hbCBzdGF0ZVxuICAgICAgICBfdGhpcy5zdGF0ZS5kb25lKSB7XG4gICAgICAgICAgLy8gU2VuZCBTQ1hNTCBldmVudHMgdG8gbWFjaGluZXNcbiAgICAgICAgICB2YXIgc2N4bWxFdmVudCA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBldmVudCksIHtcbiAgICAgICAgICAgIG5hbWU6IGV2ZW50Lm5hbWUgPT09IGVycm9yJDEgPyBcIlwiLmNvbmNhdChlcnJvcihfdGhpcy5pZCkpIDogZXZlbnQubmFtZSxcbiAgICAgICAgICAgIG9yaWdpbjogX3RoaXMuc2Vzc2lvbklkXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiAoIWltbWVkaWF0ZSAmJiBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cykge1xuICAgICAgICAgICAgX3RoaXMuX291dGdvaW5nUXVldWUucHVzaChbdGFyZ2V0LCBzY3htbEV2ZW50XSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldC5zZW5kKHNjeG1sRXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gU2VuZCBub3JtYWwgZXZlbnRzIHRvIG90aGVyIHRhcmdldHNcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUgJiYgX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMpIHtcbiAgICAgICAgICBfdGhpcy5fb3V0Z29pbmdRdWV1ZS5wdXNoKFt0YXJnZXQsIGV2ZW50LmRhdGFdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXQuc2VuZChldmVudC5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLl9leGVjID0gZnVuY3Rpb24gKGFjdGlvbiwgY29udGV4dCwgX2V2ZW50LCBhY3Rpb25GdW5jdGlvbk1hcCkge1xuICAgICAgaWYgKGFjdGlvbkZ1bmN0aW9uTWFwID09PSB2b2lkIDApIHtcbiAgICAgICAgYWN0aW9uRnVuY3Rpb25NYXAgPSBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucztcbiAgICAgIH1cblxuICAgICAgdmFyIGFjdGlvbk9yRXhlYyA9IGFjdGlvbi5leGVjIHx8IGdldEFjdGlvbkZ1bmN0aW9uKGFjdGlvbi50eXBlLCBhY3Rpb25GdW5jdGlvbk1hcCk7XG4gICAgICB2YXIgZXhlYyA9IGlzRnVuY3Rpb24oYWN0aW9uT3JFeGVjKSA/IGFjdGlvbk9yRXhlYyA6IGFjdGlvbk9yRXhlYyA/IGFjdGlvbk9yRXhlYy5leGVjIDogYWN0aW9uLmV4ZWM7XG5cbiAgICAgIGlmIChleGVjKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGV4ZWMoY29udGV4dCwgX2V2ZW50LmRhdGEsICFfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyA/IHtcbiAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgICAgc3RhdGU6IF90aGlzLnN0YXRlLFxuICAgICAgICAgICAgX2V2ZW50OiBfZXZlbnRcbiAgICAgICAgICB9IDoge1xuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgICBfZXZlbnQ6IF9ldmVudFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBpZiAoX3RoaXMucGFyZW50KSB7XG4gICAgICAgICAgICBfdGhpcy5wYXJlbnQuc2VuZCh7XG4gICAgICAgICAgICAgIHR5cGU6ICd4c3RhdGUuZXJyb3InLFxuICAgICAgICAgICAgICBkYXRhOiBlcnJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgcmFpc2U6XG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gaWYgcmFpc2UgYWN0aW9uIHJlYWNoZWQgdGhlIGludGVycHJldGVyIHRoZW4gaXQncyBhIGRlbGF5ZWQgb25lXG4gICAgICAgICAgICB2YXIgc2VuZEFjdGlvbl8xID0gYWN0aW9uO1xuXG4gICAgICAgICAgICBfdGhpcy5kZWZlcihzZW5kQWN0aW9uXzEpO1xuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBzZW5kOlxuICAgICAgICAgIHZhciBzZW5kQWN0aW9uID0gYWN0aW9uO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBzZW5kQWN0aW9uLmRlbGF5ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgX3RoaXMuZGVmZXIoc2VuZEFjdGlvbik7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNlbmRBY3Rpb24udG8pIHtcbiAgICAgICAgICAgICAgX3RoaXMuc2VuZFRvKHNlbmRBY3Rpb24uX2V2ZW50LCBzZW5kQWN0aW9uLnRvLCBfZXZlbnQgPT09IGluaXRFdmVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfdGhpcy5zZW5kKHNlbmRBY3Rpb24uX2V2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIGNhbmNlbDpcbiAgICAgICAgICBfdGhpcy5jYW5jZWwoYWN0aW9uLnNlbmRJZCk7XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIHN0YXJ0OlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWN0aXZpdHkgPSBhY3Rpb24uYWN0aXZpdHk7IC8vIElmIHRoZSBhY3Rpdml0eSB3aWxsIGJlIHN0b3BwZWQgcmlnaHQgYWZ0ZXIgaXQncyBzdGFydGVkXG4gICAgICAgICAgICAvLyAoc3VjaCBhcyBpbiB0cmFuc2llbnQgc3RhdGVzKVxuICAgICAgICAgICAgLy8gZG9uJ3QgYm90aGVyIHN0YXJ0aW5nIHRoZSBhY3Rpdml0eS5cblxuICAgICAgICAgICAgaWYgKCAvLyBpbiB2NCB3aXRoIGBwcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50c2AgaW52b2tlcyBhcmUgY2FsbGVkIGVhZ2VybHkgd2hlbiB0aGUgYHRoaXMuc3RhdGVgIHN0aWxsIHBvaW50cyB0byB0aGUgcHJldmlvdXMgc3RhdGVcbiAgICAgICAgICAgICFfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyAmJiAhX3RoaXMuc3RhdGUuYWN0aXZpdGllc1thY3Rpdml0eS5pZCB8fCBhY3Rpdml0eS50eXBlXSkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gLy8gSW52b2tlZCBzZXJ2aWNlc1xuXG5cbiAgICAgICAgICAgIGlmIChhY3Rpdml0eS50eXBlID09PSBBY3Rpb25UeXBlcy5JbnZva2UpIHtcbiAgICAgICAgICAgICAgdmFyIGludm9rZVNvdXJjZSA9IHRvSW52b2tlU291cmNlKGFjdGl2aXR5LnNyYyk7XG4gICAgICAgICAgICAgIHZhciBzZXJ2aWNlQ3JlYXRvciA9IF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcyA/IF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlc1tpbnZva2VTb3VyY2UudHlwZV0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIHZhciBpZCA9IGFjdGl2aXR5LmlkLFxuICAgICAgICAgICAgICAgICAgZGF0YSA9IGFjdGl2aXR5LmRhdGE7XG5cbiAgICAgICAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgICAgICAgd2FybighKCdmb3J3YXJkJyBpbiBhY3Rpdml0eSksIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAgICAgICBcImBmb3J3YXJkYCBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkIChmb3VuZCBpbiBpbnZvY2F0aW9uIG9mICdcIi5jb25jYXQoYWN0aXZpdHkuc3JjLCBcIicgaW4gaW4gbWFjaGluZSAnXCIpLmNvbmNhdChfdGhpcy5tYWNoaW5lLmlkLCBcIicpLiBcIikgKyBcIlBsZWFzZSB1c2UgYGF1dG9Gb3J3YXJkYCBpbnN0ZWFkLlwiKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBhdXRvRm9yd2FyZCA9ICdhdXRvRm9yd2FyZCcgaW4gYWN0aXZpdHkgPyBhY3Rpdml0eS5hdXRvRm9yd2FyZCA6ICEhYWN0aXZpdHkuZm9yd2FyZDtcblxuICAgICAgICAgICAgICBpZiAoIXNlcnZpY2VDcmVhdG9yKSB7XG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgICAgICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICAgICAgICAgIHdhcm4oZmFsc2UsIFwiTm8gc2VydmljZSBmb3VuZCBmb3IgaW52b2NhdGlvbiAnXCIuY29uY2F0KGFjdGl2aXR5LnNyYywgXCInIGluIG1hY2hpbmUgJ1wiKS5jb25jYXQoX3RoaXMubWFjaGluZS5pZCwgXCInLlwiKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHJlc29sdmVkRGF0YSA9IGRhdGEgPyBtYXBDb250ZXh0KGRhdGEsIGNvbnRleHQsIF9ldmVudCkgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzZXJ2aWNlQ3JlYXRvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiB3YXJuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGlzRnVuY3Rpb24oc2VydmljZUNyZWF0b3IpID8gc2VydmljZUNyZWF0b3IoY29udGV4dCwgX2V2ZW50LmRhdGEsIHtcbiAgICAgICAgICAgICAgICBkYXRhOiByZXNvbHZlZERhdGEsXG4gICAgICAgICAgICAgICAgc3JjOiBpbnZva2VTb3VyY2UsXG4gICAgICAgICAgICAgICAgbWV0YTogYWN0aXZpdHkubWV0YVxuICAgICAgICAgICAgICB9KSA6IHNlcnZpY2VDcmVhdG9yO1xuXG4gICAgICAgICAgICAgIGlmICghc291cmNlKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogd2Fybj9cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHZvaWQgMDtcblxuICAgICAgICAgICAgICBpZiAoaXNNYWNoaW5lKHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSByZXNvbHZlZERhdGEgPyBzb3VyY2Uud2l0aENvbnRleHQocmVzb2x2ZWREYXRhKSA6IHNvdXJjZTtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgYXV0b0ZvcndhcmQ6IGF1dG9Gb3J3YXJkXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF90aGlzLnNwYXduKHNvdXJjZSwgaWQsIG9wdGlvbnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3RoaXMuc3Bhd25BY3Rpdml0eShhY3Rpdml0eSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICBjYXNlIHN0b3A6XG4gICAgICAgICAge1xuICAgICAgICAgICAgX3RoaXMuc3RvcENoaWxkKGFjdGlvbi5hY3Rpdml0eS5pZCk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICBjYXNlIGxvZzpcbiAgICAgICAgICB2YXIgX2EgPSBhY3Rpb24sXG4gICAgICAgICAgICAgIGxhYmVsID0gX2EubGFiZWwsXG4gICAgICAgICAgICAgIHZhbHVlID0gX2EudmFsdWU7XG5cbiAgICAgICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgICAgIF90aGlzLmxvZ2dlcihsYWJlbCwgdmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfdGhpcy5sb2dnZXIodmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgICB3YXJuKGZhbHNlLCBcIk5vIGltcGxlbWVudGF0aW9uIGZvdW5kIGZvciBhY3Rpb24gdHlwZSAnXCIuY29uY2F0KGFjdGlvbi50eXBlLCBcIidcIikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgcmVzb2x2ZWRPcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIEludGVycHJldGVyLmRlZmF1bHRPcHRpb25zKSwgb3B0aW9ucyk7XG5cbiAgICB2YXIgY2xvY2sgPSByZXNvbHZlZE9wdGlvbnMuY2xvY2ssXG4gICAgICAgIGxvZ2dlciA9IHJlc29sdmVkT3B0aW9ucy5sb2dnZXIsXG4gICAgICAgIHBhcmVudCA9IHJlc29sdmVkT3B0aW9ucy5wYXJlbnQsXG4gICAgICAgIGlkID0gcmVzb2x2ZWRPcHRpb25zLmlkO1xuICAgIHZhciByZXNvbHZlZElkID0gaWQgIT09IHVuZGVmaW5lZCA/IGlkIDogbWFjaGluZS5pZDtcbiAgICB0aGlzLmlkID0gcmVzb2x2ZWRJZDtcbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgICB0aGlzLmNsb2NrID0gY2xvY2s7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gcmVzb2x2ZWRPcHRpb25zO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcih7XG4gICAgICBkZWZlckV2ZW50czogdGhpcy5vcHRpb25zLmRlZmVyRXZlbnRzXG4gICAgfSk7XG4gICAgdGhpcy5zZXNzaW9uSWQgPSByZWdpc3RyeS5ib29rSWQoKTtcbiAgfVxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShJbnRlcnByZXRlci5wcm90b3R5cGUsIFwiaW5pdGlhbFN0YXRlXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGlmICh0aGlzLl9pbml0aWFsU3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luaXRpYWxTdGF0ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3ZpZGUodGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5faW5pdGlhbFN0YXRlID0gX3RoaXMubWFjaGluZS5pbml0aWFsU3RhdGU7XG4gICAgICAgIHJldHVybiBfdGhpcy5faW5pdGlhbFN0YXRlO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShJbnRlcnByZXRlci5wcm90b3R5cGUsIFwic3RhdGVcIiwge1xuICAgIC8qKlxyXG4gICAgICogQGRlcHJlY2F0ZWQgVXNlIGAuZ2V0U25hcHNob3QoKWAgaW5zdGVhZC5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgIHdhcm4odGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLk5vdFN0YXJ0ZWQsIFwiQXR0ZW1wdGVkIHRvIHJlYWQgc3RhdGUgZnJvbSB1bmluaXRpYWxpemVkIHNlcnZpY2UgJ1wiLmNvbmNhdCh0aGlzLmlkLCBcIicuIE1ha2Ugc3VyZSB0aGUgc2VydmljZSBpcyBzdGFydGVkIGZpcnN0LlwiKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgLyoqXHJcbiAgICogRXhlY3V0ZXMgdGhlIGFjdGlvbnMgb2YgdGhlIGdpdmVuIHN0YXRlLCB3aXRoIHRoYXQgc3RhdGUncyBgY29udGV4dGAgYW5kIGBldmVudGAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIHN0YXRlIHdob3NlIGFjdGlvbnMgd2lsbCBiZSBleGVjdXRlZFxyXG4gICAqIEBwYXJhbSBhY3Rpb25zQ29uZmlnIFRoZSBhY3Rpb24gaW1wbGVtZW50YXRpb25zIHRvIHVzZVxyXG4gICAqL1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb25zQ29uZmlnKSB7XG4gICAgdmFyIGVfMSwgX2E7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhzdGF0ZS5hY3Rpb25zKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICB2YXIgYWN0aW9uID0gX2MudmFsdWU7XG4gICAgICAgIHRoaXMuZXhlYyhhY3Rpb24sIHN0YXRlLCBhY3Rpb25zQ29uZmlnKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzFfMSkge1xuICAgICAgZV8xID0ge1xuICAgICAgICBlcnJvcjogZV8xXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSwgX2V2ZW50KSB7XG4gICAgdmFyIGVfMiwgX2EsIGVfMywgX2IsIGVfNCwgX2MsIGVfNSwgX2Q7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzOyAvLyBBdHRhY2ggc2Vzc2lvbiBJRCB0byBzdGF0ZVxuXG5cbiAgICBzdGF0ZS5fc2Vzc2lvbmlkID0gdGhpcy5zZXNzaW9uSWQ7IC8vIFVwZGF0ZSBzdGF0ZVxuXG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTsgLy8gRXhlY3V0ZSBhY3Rpb25zXG5cbiAgICBpZiAoKCF0aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzIHx8IC8vIHRoaXMgaXMgY3VycmVudGx5IHJlcXVpcmVkIHRvIGV4ZWN1dGUgaW5pdGlhbCBhY3Rpb25zIGFzIHRoZSBgaW5pdGlhbFN0YXRlYCBnZXRzIGNhY2hlZFxuICAgIC8vIHdlIGNhbid0IGp1c3QgcmVjb21wdXRlIGl0IChhbmQgZXhlY3V0ZSBhY3Rpb25zIHdoaWxlIGRvaW5nIHNvKSBiZWNhdXNlIHdlIHRyeSB0byBwcmVzZXJ2ZSBpZGVudGl0eSBvZiBhY3RvcnMgY3JlYXRlZCB3aXRoaW4gaW5pdGlhbCBhc3NpZ25zXG4gICAgX2V2ZW50ID09PSBpbml0RXZlbnQpICYmIHRoaXMub3B0aW9ucy5leGVjdXRlKSB7XG4gICAgICB0aGlzLmV4ZWN1dGUodGhpcy5zdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBpdGVtID0gdm9pZCAwO1xuXG4gICAgICB3aGlsZSAoaXRlbSA9IHRoaXMuX291dGdvaW5nUXVldWUuc2hpZnQoKSkge1xuICAgICAgICBpdGVtWzBdLnNlbmQoaXRlbVsxXSk7XG4gICAgICB9XG4gICAgfSAvLyBVcGRhdGUgY2hpbGRyZW5cblxuXG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgX3RoaXMuc3RhdGUuY2hpbGRyZW5bY2hpbGQuaWRdID0gY2hpbGQ7XG4gICAgfSk7IC8vIERldiB0b29sc1xuXG4gICAgaWYgKHRoaXMuZGV2VG9vbHMpIHtcbiAgICAgIHRoaXMuZGV2VG9vbHMuc2VuZChfZXZlbnQuZGF0YSwgc3RhdGUpO1xuICAgIH0gLy8gRXhlY3V0ZSBsaXN0ZW5lcnNcblxuXG4gICAgaWYgKHN0YXRlLmV2ZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBfZSA9IF9fdmFsdWVzKHRoaXMuZXZlbnRMaXN0ZW5lcnMpLCBfZiA9IF9lLm5leHQoKTsgIV9mLmRvbmU7IF9mID0gX2UubmV4dCgpKSB7XG4gICAgICAgICAgdmFyIGxpc3RlbmVyID0gX2YudmFsdWU7XG4gICAgICAgICAgbGlzdGVuZXIoc3RhdGUuZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlXzJfMSkge1xuICAgICAgICBlXzIgPSB7XG4gICAgICAgICAgZXJyb3I6IGVfMl8xXG4gICAgICAgIH07XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfZiAmJiAhX2YuZG9uZSAmJiAoX2EgPSBfZS5yZXR1cm4pKSBfYS5jYWxsKF9lKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2cgPSBfX3ZhbHVlcyh0aGlzLmxpc3RlbmVycyksIF9oID0gX2cubmV4dCgpOyAhX2guZG9uZTsgX2ggPSBfZy5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gX2gudmFsdWU7XG4gICAgICAgIGxpc3RlbmVyKHN0YXRlLCBzdGF0ZS5ldmVudCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8zXzEpIHtcbiAgICAgIGVfMyA9IHtcbiAgICAgICAgZXJyb3I6IGVfM18xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2ggJiYgIV9oLmRvbmUgJiYgKF9iID0gX2cucmV0dXJuKSkgX2IuY2FsbChfZyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8zKSB0aHJvdyBlXzMuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9qID0gX192YWx1ZXModGhpcy5jb250ZXh0TGlzdGVuZXJzKSwgX2sgPSBfai5uZXh0KCk7ICFfay5kb25lOyBfayA9IF9qLm5leHQoKSkge1xuICAgICAgICB2YXIgY29udGV4dExpc3RlbmVyID0gX2sudmFsdWU7XG4gICAgICAgIGNvbnRleHRMaXN0ZW5lcih0aGlzLnN0YXRlLmNvbnRleHQsIHRoaXMuc3RhdGUuaGlzdG9yeSA/IHRoaXMuc3RhdGUuaGlzdG9yeS5jb250ZXh0IDogdW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzRfMSkge1xuICAgICAgZV80ID0ge1xuICAgICAgICBlcnJvcjogZV80XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfayAmJiAhX2suZG9uZSAmJiAoX2MgPSBfai5yZXR1cm4pKSBfYy5jYWxsKF9qKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzQpIHRocm93IGVfNC5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5kb25lKSB7XG4gICAgICAvLyBnZXQgZmluYWwgY2hpbGQgc3RhdGUgbm9kZVxuICAgICAgdmFyIGZpbmFsQ2hpbGRTdGF0ZU5vZGUgPSBzdGF0ZS5jb25maWd1cmF0aW9uLmZpbmQoZnVuY3Rpb24gKHNuKSB7XG4gICAgICAgIHJldHVybiBzbi50eXBlID09PSAnZmluYWwnICYmIHNuLnBhcmVudCA9PT0gX3RoaXMubWFjaGluZTtcbiAgICAgIH0pO1xuICAgICAgdmFyIGRvbmVEYXRhID0gZmluYWxDaGlsZFN0YXRlTm9kZSAmJiBmaW5hbENoaWxkU3RhdGVOb2RlLmRvbmVEYXRhID8gbWFwQ29udGV4dChmaW5hbENoaWxkU3RhdGVOb2RlLmRvbmVEYXRhLCBzdGF0ZS5jb250ZXh0LCBfZXZlbnQpIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fZG9uZUV2ZW50ID0gZG9uZUludm9rZSh0aGlzLmlkLCBkb25lRGF0YSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIF9sID0gX192YWx1ZXModGhpcy5kb25lTGlzdGVuZXJzKSwgX20gPSBfbC5uZXh0KCk7ICFfbS5kb25lOyBfbSA9IF9sLm5leHQoKSkge1xuICAgICAgICAgIHZhciBsaXN0ZW5lciA9IF9tLnZhbHVlO1xuICAgICAgICAgIGxpc3RlbmVyKHRoaXMuX2RvbmVFdmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVfNV8xKSB7XG4gICAgICAgIGVfNSA9IHtcbiAgICAgICAgICBlcnJvcjogZV81XzFcbiAgICAgICAgfTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF9tICYmICFfbS5kb25lICYmIChfZCA9IF9sLnJldHVybikpIF9kLmNhbGwoX2wpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmIChlXzUpIHRocm93IGVfNS5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9zdG9wKCk7XG5cbiAgICAgIHRoaXMuX3N0b3BDaGlsZHJlbigpO1xuXG4gICAgICByZWdpc3RyeS5mcmVlKHRoaXMuc2Vzc2lvbklkKTtcbiAgICB9XG4gIH07XG4gIC8qXHJcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbmV2ZXIgYSBzdGF0ZSB0cmFuc2l0aW9uIGhhcHBlbnMuIFRoZSBsaXN0ZW5lciBpcyBjYWxsZWQgd2l0aFxyXG4gICAqIHRoZSBuZXh0IHN0YXRlIGFuZCB0aGUgZXZlbnQgb2JqZWN0IHRoYXQgY2F1c2VkIHRoZSBzdGF0ZSB0cmFuc2l0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBzdGF0ZSBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uVHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMubGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7IC8vIFNlbmQgY3VycmVudCBzdGF0ZSB0byBsaXN0ZW5lclxuXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nKSB7XG4gICAgICBsaXN0ZW5lcih0aGlzLnN0YXRlLCB0aGlzLnN0YXRlLmV2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gKG5leHRMaXN0ZW5lck9yT2JzZXJ2ZXIsIF8sIC8vIFRPRE86IGVycm9yIGxpc3RlbmVyXG4gIGNvbXBsZXRlTGlzdGVuZXIpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIG9ic2VydmVyID0gdG9PYnNlcnZlcihuZXh0TGlzdGVuZXJPck9ic2VydmVyLCBfLCBjb21wbGV0ZUxpc3RlbmVyKTtcbiAgICB0aGlzLmxpc3RlbmVycy5hZGQob2JzZXJ2ZXIubmV4dCk7IC8vIFNlbmQgY3VycmVudCBzdGF0ZSB0byBsaXN0ZW5lclxuXG4gICAgaWYgKHRoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5Ob3RTdGFydGVkKSB7XG4gICAgICBvYnNlcnZlci5uZXh0KHRoaXMuc3RhdGUpO1xuICAgIH1cblxuICAgIHZhciBjb21wbGV0ZU9uY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5kb25lTGlzdGVuZXJzLmRlbGV0ZShjb21wbGV0ZU9uY2UpO1xuXG4gICAgICBfdGhpcy5zdG9wTGlzdGVuZXJzLmRlbGV0ZShjb21wbGV0ZU9uY2UpO1xuXG4gICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgIH07XG5cbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLlN0b3BwZWQpIHtcbiAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25Eb25lKGNvbXBsZXRlT25jZSk7XG4gICAgICB0aGlzLm9uU3RvcChjb21wbGV0ZU9uY2UpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5saXN0ZW5lcnMuZGVsZXRlKG9ic2VydmVyLm5leHQpO1xuXG4gICAgICAgIF90aGlzLmRvbmVMaXN0ZW5lcnMuZGVsZXRlKGNvbXBsZXRlT25jZSk7XG5cbiAgICAgICAgX3RoaXMuc3RvcExpc3RlbmVycy5kZWxldGUoY29tcGxldGVPbmNlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuICAvKipcclxuICAgKiBBZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbmV2ZXIgYW4gZXZlbnQgaXMgc2VudCB0byB0aGUgcnVubmluZyBpbnRlcnByZXRlci5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGV2ZW50IGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25FdmVudCA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXHJcbiAgICogQWRkcyBhbiBldmVudCBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIHdoZW5ldmVyIGEgYHNlbmRgIGV2ZW50IG9jY3Vycy5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGV2ZW50IGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25TZW5kID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5zZW5kTGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIEFkZHMgYSBjb250ZXh0IGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbmV2ZXIgdGhlIHN0YXRlIGNvbnRleHQgY2hhbmdlcy5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGNvbnRleHQgbGlzdGVuZXJcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vbkNoYW5nZSA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMuY29udGV4dExpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBtYWNoaW5lIGlzIHN0b3BwZWQuXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uU3RvcCA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMuc3RvcExpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBBZGRzIGEgc3RhdGUgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuIHRoZSBzdGF0ZWNoYXJ0IGhhcyByZWFjaGVkIGl0cyBmaW5hbCBzdGF0ZS5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIHN0YXRlIGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25Eb25lID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5TdG9wcGVkICYmIHRoaXMuX2RvbmVFdmVudCkge1xuICAgICAgbGlzdGVuZXIodGhpcy5fZG9uZUV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb25lTGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgYSBsaXN0ZW5lci5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGxpc3RlbmVyIHRvIHJlbW92ZVxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgdGhpcy5ldmVudExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuc2VuZExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuc3RvcExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuZG9uZUxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuY29udGV4dExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBTdGFydHMgdGhlIGludGVycHJldGVyIGZyb20gdGhlIGdpdmVuIHN0YXRlLCBvciB0aGUgaW5pdGlhbCBzdGF0ZS5cclxuICAgKiBAcGFyYW0gaW5pdGlhbFN0YXRlIFRoZSBzdGF0ZSB0byBzdGFydCB0aGUgc3RhdGVjaGFydCBmcm9tXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoaW5pdGlhbFN0YXRlKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZykge1xuICAgICAgLy8gRG8gbm90IHJlc3RhcnQgdGhlIHNlcnZpY2UgaWYgaXQgaXMgYWxyZWFkeSBzdGFydGVkXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IC8vIHllcywgaXQncyBhIGhhY2sgYnV0IHdlIG5lZWQgdGhlIHJlbGF0ZWQgY2FjaGUgdG8gYmUgcG9wdWxhdGVkIGZvciBzb21lIHRoaW5ncyB0byB3b3JrIChsaWtlIGRlbGF5ZWQgdHJhbnNpdGlvbnMpXG4gICAgLy8gdGhpcyBpcyB1c3VhbGx5IGNhbGxlZCBieSBgbWFjaGluZS5nZXRJbml0aWFsU3RhdGVgIGJ1dCBpZiB3ZSByZWh5ZHJhdGUgZnJvbSBhIHN0YXRlIHdlIG1pZ2h0IGJ5cGFzcyB0aGlzIGNhbGxcbiAgICAvLyB3ZSBhbHNvIGRvbid0IHdhbnQgdG8gY2FsbCB0aGlzIG1ldGhvZCBoZXJlIGFzIGl0IHJlc29sdmVzIHRoZSBmdWxsIGluaXRpYWwgc3RhdGUgd2hpY2ggbWlnaHQgaW52b2x2ZSBjYWxsaW5nIGFzc2lnbiBhY3Rpb25zXG4gICAgLy8gYW5kIHRoYXQgY291bGQgcG90ZW50aWFsbHkgbGVhZCB0byBzb21lIHVud2FudGVkIHNpZGUtZWZmZWN0cyAoZXZlbiBzdWNoIGFzIGNyZWF0aW5nIHNvbWUgcm9ndWUgYWN0b3JzKVxuXG5cbiAgICB0aGlzLm1hY2hpbmUuX2luaXQoKTtcblxuICAgIHJlZ2lzdHJ5LnJlZ2lzdGVyKHRoaXMuc2Vzc2lvbklkLCB0aGlzKTtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB0aGlzLnN0YXR1cyA9IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmc7XG4gICAgdmFyIHJlc29sdmVkU3RhdGUgPSBpbml0aWFsU3RhdGUgPT09IHVuZGVmaW5lZCA/IHRoaXMuaW5pdGlhbFN0YXRlIDogcHJvdmlkZSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaXNTdGF0ZUNvbmZpZyhpbml0aWFsU3RhdGUpID8gX3RoaXMubWFjaGluZS5yZXNvbHZlU3RhdGUoaW5pdGlhbFN0YXRlKSA6IF90aGlzLm1hY2hpbmUucmVzb2x2ZVN0YXRlKFN0YXRlLmZyb20oaW5pdGlhbFN0YXRlLCBfdGhpcy5tYWNoaW5lLmNvbnRleHQpKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGV2VG9vbHMpIHtcbiAgICAgIHRoaXMuYXR0YWNoRGV2KCk7XG4gICAgfVxuXG4gICAgdGhpcy5zY2hlZHVsZXIuaW5pdGlhbGl6ZShmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy51cGRhdGUocmVzb2x2ZWRTdGF0ZSwgaW5pdEV2ZW50KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuX3N0b3BDaGlsZHJlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPOiB0aGluayBhYm91dCBjb252ZXJ0aW5nIHRob3NlIHRvIGFjdGlvbnNcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICBpZiAoaXNGdW5jdGlvbihjaGlsZC5zdG9wKSkge1xuICAgICAgICBjaGlsZC5zdG9wKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5jaGlsZHJlbi5jbGVhcigpO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5fc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZV82LCBfYSwgZV83LCBfYiwgZV84LCBfYywgZV85LCBfZCwgZV8xMCwgX2U7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2YgPSBfX3ZhbHVlcyh0aGlzLmxpc3RlbmVycyksIF9nID0gX2YubmV4dCgpOyAhX2cuZG9uZTsgX2cgPSBfZi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gX2cudmFsdWU7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV82XzEpIHtcbiAgICAgIGVfNiA9IHtcbiAgICAgICAgZXJyb3I6IGVfNl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2cgJiYgIV9nLmRvbmUgJiYgKF9hID0gX2YucmV0dXJuKSkgX2EuY2FsbChfZik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV82KSB0aHJvdyBlXzYuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9oID0gX192YWx1ZXModGhpcy5zdG9wTGlzdGVuZXJzKSwgX2ogPSBfaC5uZXh0KCk7ICFfai5kb25lOyBfaiA9IF9oLm5leHQoKSkge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBfai52YWx1ZTsgLy8gY2FsbCBsaXN0ZW5lciwgdGhlbiByZW1vdmVcblxuICAgICAgICBsaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnN0b3BMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzdfMSkge1xuICAgICAgZV83ID0ge1xuICAgICAgICBlcnJvcjogZV83XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfaiAmJiAhX2ouZG9uZSAmJiAoX2IgPSBfaC5yZXR1cm4pKSBfYi5jYWxsKF9oKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzcpIHRocm93IGVfNy5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2sgPSBfX3ZhbHVlcyh0aGlzLmNvbnRleHRMaXN0ZW5lcnMpLCBfbCA9IF9rLm5leHQoKTsgIV9sLmRvbmU7IF9sID0gX2submV4dCgpKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IF9sLnZhbHVlO1xuICAgICAgICB0aGlzLmNvbnRleHRMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzhfMSkge1xuICAgICAgZV84ID0ge1xuICAgICAgICBlcnJvcjogZV84XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfbCAmJiAhX2wuZG9uZSAmJiAoX2MgPSBfay5yZXR1cm4pKSBfYy5jYWxsKF9rKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzgpIHRocm93IGVfOC5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX20gPSBfX3ZhbHVlcyh0aGlzLmRvbmVMaXN0ZW5lcnMpLCBfbyA9IF9tLm5leHQoKTsgIV9vLmRvbmU7IF9vID0gX20ubmV4dCgpKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IF9vLnZhbHVlO1xuICAgICAgICB0aGlzLmRvbmVMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzlfMSkge1xuICAgICAgZV85ID0ge1xuICAgICAgICBlcnJvcjogZV85XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfbyAmJiAhX28uZG9uZSAmJiAoX2QgPSBfbS5yZXR1cm4pKSBfZC5jYWxsKF9tKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzkpIHRocm93IGVfOS5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIC8vIEludGVycHJldGVyIGFscmVhZHkgc3RvcHBlZDsgZG8gbm90aGluZ1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMuc3RhdHVzID0gSW50ZXJwcmV0ZXJTdGF0dXMuU3RvcHBlZDtcbiAgICB0aGlzLl9pbml0aWFsU3RhdGUgPSB1bmRlZmluZWQ7XG5cbiAgICB0cnkge1xuICAgICAgLy8gd2UgYXJlIGdvaW5nIHRvIHN0b3Agd2l0aGluIHRoZSBjdXJyZW50IHN5bmMgZnJhbWVcbiAgICAgIC8vIHNvIHdlIGNhbiBzYWZlbHkganVzdCBjYW5jZWwgdGhpcyBoZXJlIGFzIG5vdGhpbmcgYXN5bmMgc2hvdWxkIGJlIGZpcmVkIGFueXdheVxuICAgICAgZm9yICh2YXIgX3AgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyh0aGlzLmRlbGF5ZWRFdmVudHNNYXApKSwgX3EgPSBfcC5uZXh0KCk7ICFfcS5kb25lOyBfcSA9IF9wLm5leHQoKSkge1xuICAgICAgICB2YXIga2V5ID0gX3EudmFsdWU7XG4gICAgICAgIHRoaXMuY2xvY2suY2xlYXJUaW1lb3V0KHRoaXMuZGVsYXllZEV2ZW50c01hcFtrZXldKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzEwXzEpIHtcbiAgICAgIGVfMTAgPSB7XG4gICAgICAgIGVycm9yOiBlXzEwXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfcSAmJiAhX3EuZG9uZSAmJiAoX2UgPSBfcC5yZXR1cm4pKSBfZS5jYWxsKF9wKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzEwKSB0aHJvdyBlXzEwLmVycm9yO1xuICAgICAgfVxuICAgIH0gLy8gY2xlYXIgZXZlcnl0aGluZyB0aGF0IG1pZ2h0IGJlIGVucXVldWVkXG5cblxuICAgIHRoaXMuc2NoZWR1bGVyLmNsZWFyKCk7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKHtcbiAgICAgIGRlZmVyRXZlbnRzOiB0aGlzLm9wdGlvbnMuZGVmZXJFdmVudHNcbiAgICB9KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogU3RvcHMgdGhlIGludGVycHJldGVyIGFuZCB1bnN1YnNjcmliZSBhbGwgbGlzdGVuZXJzLlxyXG4gICAqXHJcbiAgICogVGhpcyB3aWxsIGFsc28gbm90aWZ5IHRoZSBgb25TdG9wYCBsaXN0ZW5lcnMuXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPOiBhZGQgd2FybmluZyBmb3Igc3RvcHBpbmcgbm9uLXJvb3QgaW50ZXJwcmV0ZXJzXG4gICAgdmFyIF90aGlzID0gdGhpczsgLy8gZ3JhYiB0aGUgY3VycmVudCBzY2hlZHVsZXIgYXMgaXQgd2lsbCBiZSByZXBsYWNlZCBpbiBfc3RvcFxuXG5cbiAgICB2YXIgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG5cbiAgICB0aGlzLl9zdG9wKCk7IC8vIGxldCB3aGF0IGlzIGN1cnJlbnRseSBwcm9jZXNzZWQgdG8gYmUgZmluaXNoZWRcblxuXG4gICAgc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGl0IGZlZWxzIHdlaXJkIHRvIGhhbmRsZSB0aGlzIGhlcmUgYnV0IHdlIG5lZWQgdG8gaGFuZGxlIHRoaXMgZXZlbiBzbGlnaHRseSBcIm91dCBvZiBiYW5kXCJcbiAgICAgIHZhciBfZXZlbnQgPSB0b1NDWE1MRXZlbnQoe1xuICAgICAgICB0eXBlOiAneHN0YXRlLnN0b3AnXG4gICAgICB9KTtcblxuICAgICAgdmFyIG5leHRTdGF0ZSA9IHByb3ZpZGUoX3RoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV4aXRBY3Rpb25zID0gZmxhdHRlbihfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoX3RoaXMuc3RhdGUuY29uZmlndXJhdGlvbiksIGZhbHNlKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGIub3JkZXIgLSBhLm9yZGVyO1xuICAgICAgICB9KS5tYXAoZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgICAgIHJldHVybiB0b0FjdGlvbk9iamVjdHMoc3RhdGVOb2RlLm9uRXhpdCwgX3RoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnMpO1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgdmFyIF9hID0gX19yZWFkKHJlc29sdmVBY3Rpb25zKF90aGlzLm1hY2hpbmUsIF90aGlzLnN0YXRlLCBfdGhpcy5zdGF0ZS5jb250ZXh0LCBfZXZlbnQsIFt7XG4gICAgICAgICAgdHlwZTogJ2V4aXQnLFxuICAgICAgICAgIGFjdGlvbnM6IGV4aXRBY3Rpb25zXG4gICAgICAgIH1dLCBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyA/IF90aGlzLl9leGVjIDogdW5kZWZpbmVkLCBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyB8fCBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVzZXJ2ZUFjdGlvbk9yZGVyKSwgMiksXG4gICAgICAgICAgICByZXNvbHZlZEFjdGlvbnMgPSBfYVswXSxcbiAgICAgICAgICAgIHVwZGF0ZWRDb250ZXh0ID0gX2FbMV07XG5cbiAgICAgICAgdmFyIG5ld1N0YXRlID0gbmV3IFN0YXRlKHtcbiAgICAgICAgICB2YWx1ZTogX3RoaXMuc3RhdGUudmFsdWUsXG4gICAgICAgICAgY29udGV4dDogdXBkYXRlZENvbnRleHQsXG4gICAgICAgICAgX2V2ZW50OiBfZXZlbnQsXG4gICAgICAgICAgX3Nlc3Npb25pZDogX3RoaXMuc2Vzc2lvbklkLFxuICAgICAgICAgIGhpc3RvcnlWYWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgIGhpc3Rvcnk6IF90aGlzLnN0YXRlLFxuICAgICAgICAgIGFjdGlvbnM6IHJlc29sdmVkQWN0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuICFpc1JhaXNhYmxlQWN0aW9uKGFjdGlvbik7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgYWN0aXZpdGllczoge30sXG4gICAgICAgICAgZXZlbnRzOiBbXSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBbXSxcbiAgICAgICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICAgICAgY2hpbGRyZW46IHt9LFxuICAgICAgICAgIGRvbmU6IF90aGlzLnN0YXRlLmRvbmUsXG4gICAgICAgICAgdGFnczogX3RoaXMuc3RhdGUudGFncyxcbiAgICAgICAgICBtYWNoaW5lOiBfdGhpcy5tYWNoaW5lXG4gICAgICAgIH0pO1xuICAgICAgICBuZXdTdGF0ZS5jaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG5ld1N0YXRlO1xuICAgICAgfSk7XG5cbiAgICAgIF90aGlzLnVwZGF0ZShuZXh0U3RhdGUsIF9ldmVudCk7XG5cbiAgICAgIF90aGlzLl9zdG9wQ2hpbGRyZW4oKTtcblxuICAgICAgcmVnaXN0cnkuZnJlZShfdGhpcy5zZXNzaW9uSWQpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5iYXRjaCA9IGZ1bmN0aW9uIChldmVudHMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5Ob3RTdGFydGVkICYmIHRoaXMub3B0aW9ucy5kZWZlckV2ZW50cykge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICB3YXJuKGZhbHNlLCBcIlwiLmNvbmNhdChldmVudHMubGVuZ3RoLCBcIiBldmVudChzKSB3ZXJlIHNlbnQgdG8gdW5pbml0aWFsaXplZCBzZXJ2aWNlIFxcXCJcIikuY29uY2F0KHRoaXMubWFjaGluZS5pZCwgXCJcXFwiIGFuZCBhcmUgZGVmZXJyZWQuIE1ha2Ugc3VyZSAuc3RhcnQoKSBpcyBjYWxsZWQgZm9yIHRoaXMgc2VydmljZS5cXG5FdmVudDogXCIpLmNvbmNhdChKU09OLnN0cmluZ2lmeShldmVudCkpKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgIFwiXCIuY29uY2F0KGV2ZW50cy5sZW5ndGgsIFwiIGV2ZW50KHMpIHdlcmUgc2VudCB0byB1bmluaXRpYWxpemVkIHNlcnZpY2UgXFxcIlwiKS5jb25jYXQodGhpcy5tYWNoaW5lLmlkLCBcIlxcXCIuIE1ha2Ugc3VyZSAuc3RhcnQoKSBpcyBjYWxsZWQgZm9yIHRoaXMgc2VydmljZSwgb3Igc2V0IHsgZGVmZXJFdmVudHM6IHRydWUgfSBpbiB0aGUgc2VydmljZSBvcHRpb25zLlwiKSk7XG4gICAgfVxuXG4gICAgaWYgKCFldmVudHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGV4ZWMgPSAhIXRoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgJiYgdGhpcy5fZXhlYztcbiAgICB0aGlzLnNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZV8xMSwgX2E7XG5cbiAgICAgIHZhciBuZXh0U3RhdGUgPSBfdGhpcy5zdGF0ZTtcbiAgICAgIHZhciBiYXRjaENoYW5nZWQgPSBmYWxzZTtcbiAgICAgIHZhciBiYXRjaGVkQWN0aW9ucyA9IFtdO1xuXG4gICAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChldmVudF8xKSB7XG4gICAgICAgIHZhciBfZXZlbnQgPSB0b1NDWE1MRXZlbnQoZXZlbnRfMSk7XG5cbiAgICAgICAgX3RoaXMuZm9yd2FyZChfZXZlbnQpO1xuXG4gICAgICAgIG5leHRTdGF0ZSA9IHByb3ZpZGUoX3RoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMubWFjaGluZS50cmFuc2l0aW9uKG5leHRTdGF0ZSwgX2V2ZW50LCB1bmRlZmluZWQsIGV4ZWMgfHwgdW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJhdGNoZWRBY3Rpb25zLnB1c2guYXBwbHkoYmF0Y2hlZEFjdGlvbnMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyA/IG5leHRTdGF0ZS5hY3Rpb25zIDogbmV4dFN0YXRlLmFjdGlvbnMubWFwKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgcmV0dXJuIGJpbmRBY3Rpb25Ub1N0YXRlKGEsIG5leHRTdGF0ZSk7XG4gICAgICAgIH0pKSwgZmFsc2UpKTtcbiAgICAgICAgYmF0Y2hDaGFuZ2VkID0gYmF0Y2hDaGFuZ2VkIHx8ICEhbmV4dFN0YXRlLmNoYW5nZWQ7XG4gICAgICB9O1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBldmVudHNfMSA9IF9fdmFsdWVzKGV2ZW50cyksIGV2ZW50c18xXzEgPSBldmVudHNfMS5uZXh0KCk7ICFldmVudHNfMV8xLmRvbmU7IGV2ZW50c18xXzEgPSBldmVudHNfMS5uZXh0KCkpIHtcbiAgICAgICAgICB2YXIgZXZlbnRfMSA9IGV2ZW50c18xXzEudmFsdWU7XG5cbiAgICAgICAgICBfbG9vcF8xKGV2ZW50XzEpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlXzExXzEpIHtcbiAgICAgICAgZV8xMSA9IHtcbiAgICAgICAgICBlcnJvcjogZV8xMV8xXG4gICAgICAgIH07XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChldmVudHNfMV8xICYmICFldmVudHNfMV8xLmRvbmUgJiYgKF9hID0gZXZlbnRzXzEucmV0dXJuKSkgX2EuY2FsbChldmVudHNfMSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKGVfMTEpIHRocm93IGVfMTEuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbmV4dFN0YXRlLmNoYW5nZWQgPSBiYXRjaENoYW5nZWQ7XG4gICAgICBuZXh0U3RhdGUuYWN0aW9ucyA9IGJhdGNoZWRBY3Rpb25zO1xuXG4gICAgICBfdGhpcy51cGRhdGUobmV4dFN0YXRlLCB0b1NDWE1MRXZlbnQoZXZlbnRzW2V2ZW50cy5sZW5ndGggLSAxXSkpO1xuICAgIH0pO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIGEgc2VuZCBmdW5jdGlvbiBib3VuZCB0byB0aGlzIGludGVycHJldGVyIGluc3RhbmNlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBiZSBzZW50IGJ5IHRoZSBzZW5kZXIuXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc2VuZGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuc2VuZC5iaW5kKHRoaXMsIGV2ZW50KTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuX25leHRTdGF0ZSA9IGZ1bmN0aW9uIChldmVudCwgZXhlYykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoZXhlYyA9PT0gdm9pZCAwKSB7XG4gICAgICBleGVjID0gISF0aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzICYmIHRoaXMuX2V4ZWM7XG4gICAgfVxuXG4gICAgdmFyIF9ldmVudCA9IHRvU0NYTUxFdmVudChldmVudCk7XG5cbiAgICBpZiAoX2V2ZW50Lm5hbWUuaW5kZXhPZihlcnJvclBsYXRmb3JtKSA9PT0gMCAmJiAhdGhpcy5zdGF0ZS5uZXh0RXZlbnRzLnNvbWUoZnVuY3Rpb24gKG5leHRFdmVudCkge1xuICAgICAgcmV0dXJuIG5leHRFdmVudC5pbmRleE9mKGVycm9yUGxhdGZvcm0pID09PSAwO1xuICAgIH0pKSB7XG4gICAgICB0aHJvdyBfZXZlbnQuZGF0YS5kYXRhO1xuICAgIH1cblxuICAgIHZhciBuZXh0U3RhdGUgPSBwcm92aWRlKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBfdGhpcy5tYWNoaW5lLnRyYW5zaXRpb24oX3RoaXMuc3RhdGUsIF9ldmVudCwgdW5kZWZpbmVkLCBleGVjIHx8IHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgbmV4dCBzdGF0ZSBnaXZlbiB0aGUgaW50ZXJwcmV0ZXIncyBjdXJyZW50IHN0YXRlIGFuZCB0aGUgZXZlbnQuXHJcbiAgICpcclxuICAgKiBUaGlzIGlzIGEgcHVyZSBtZXRob2QgdGhhdCBkb2VzIF9ub3RfIHVwZGF0ZSB0aGUgaW50ZXJwcmV0ZXIncyBzdGF0ZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gZGV0ZXJtaW5lIHRoZSBuZXh0IHN0YXRlXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUubmV4dFN0YXRlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX25leHRTdGF0ZShldmVudCwgZmFsc2UpO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5mb3J3YXJkID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGVfMTIsIF9hO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXModGhpcy5mb3J3YXJkVG8pLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgIHZhciBpZCA9IF9jLnZhbHVlO1xuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkcmVuLmdldChpZCk7XG5cbiAgICAgICAgaWYgKCFjaGlsZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBmb3J3YXJkIGV2ZW50ICdcIi5jb25jYXQoZXZlbnQsIFwiJyBmcm9tIGludGVycHJldGVyICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJyB0byBub25leGlzdGFudCBjaGlsZCAnXCIpLmNvbmNhdChpZCwgXCInLlwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBjaGlsZC5zZW5kKGV2ZW50KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzEyXzEpIHtcbiAgICAgIGVfMTIgPSB7XG4gICAgICAgIGVycm9yOiBlXzEyXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzEyKSB0aHJvdyBlXzEyLmVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuZGVmZXIgPSBmdW5jdGlvbiAoc2VuZEFjdGlvbikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgdGltZXJJZCA9IHRoaXMuY2xvY2suc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoJ3RvJyBpbiBzZW5kQWN0aW9uICYmIHNlbmRBY3Rpb24udG8pIHtcbiAgICAgICAgX3RoaXMuc2VuZFRvKHNlbmRBY3Rpb24uX2V2ZW50LCBzZW5kQWN0aW9uLnRvLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzLnNlbmQoc2VuZEFjdGlvbi5fZXZlbnQpO1xuICAgICAgfVxuICAgIH0sIHNlbmRBY3Rpb24uZGVsYXkpO1xuXG4gICAgaWYgKHNlbmRBY3Rpb24uaWQpIHtcbiAgICAgIHRoaXMuZGVsYXllZEV2ZW50c01hcFtzZW5kQWN0aW9uLmlkXSA9IHRpbWVySWQ7XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5jYW5jZWwgPSBmdW5jdGlvbiAoc2VuZElkKSB7XG4gICAgdGhpcy5jbG9jay5jbGVhclRpbWVvdXQodGhpcy5kZWxheWVkRXZlbnRzTWFwW3NlbmRJZF0pO1xuICAgIGRlbGV0ZSB0aGlzLmRlbGF5ZWRFdmVudHNNYXBbc2VuZElkXTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuZXhlYyA9IGZ1bmN0aW9uIChhY3Rpb24sIHN0YXRlLCBhY3Rpb25GdW5jdGlvbk1hcCkge1xuICAgIGlmIChhY3Rpb25GdW5jdGlvbk1hcCA9PT0gdm9pZCAwKSB7XG4gICAgICBhY3Rpb25GdW5jdGlvbk1hcCA9IHRoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnM7XG4gICAgfVxuXG4gICAgdGhpcy5fZXhlYyhhY3Rpb24sIHN0YXRlLmNvbnRleHQsIHN0YXRlLl9ldmVudCwgYWN0aW9uRnVuY3Rpb25NYXApO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5yZW1vdmVDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZElkKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5kZWxldGUoY2hpbGRJZCk7XG4gICAgdGhpcy5mb3J3YXJkVG8uZGVsZXRlKGNoaWxkSWQpOyAvLyB0aGlzLnN0YXRlIG1pZ2h0IG5vdCBleGlzdCBhdCB0aGUgdGltZSB0aGlzIGlzIGNhbGxlZCxcbiAgICAvLyBzdWNoIGFzIHdoZW4gYSBjaGlsZCBpcyBhZGRlZCB0aGVuIHJlbW92ZWQgd2hpbGUgaW5pdGlhbGl6aW5nIHRoZSBzdGF0ZVxuXG4gICAgKF9hID0gdGhpcy5zdGF0ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHRydWUgOiBkZWxldGUgX2EuY2hpbGRyZW5bY2hpbGRJZF07XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnN0b3BDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZElkKSB7XG4gICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbi5nZXQoY2hpbGRJZCk7XG5cbiAgICBpZiAoIWNoaWxkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5yZW1vdmVDaGlsZChjaGlsZElkKTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGNoaWxkLnN0b3ApKSB7XG4gICAgICBjaGlsZC5zdG9wKCk7XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3biA9IGZ1bmN0aW9uIChlbnRpdHksIG5hbWUsIG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcpIHtcbiAgICAgIHJldHVybiBjcmVhdGVEZWZlcnJlZEFjdG9yKGVudGl0eSwgbmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKGlzUHJvbWlzZUxpa2UoZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25Qcm9taXNlKFByb21pc2UucmVzb2x2ZShlbnRpdHkpLCBuYW1lKTtcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24oZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25DYWxsYmFjayhlbnRpdHksIG5hbWUpO1xuICAgIH0gZWxzZSBpZiAoaXNTcGF3bmVkQWN0b3IoZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25BY3RvcihlbnRpdHksIG5hbWUpO1xuICAgIH0gZWxzZSBpZiAoaXNPYnNlcnZhYmxlKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduT2JzZXJ2YWJsZShlbnRpdHksIG5hbWUpO1xuICAgIH0gZWxzZSBpZiAoaXNNYWNoaW5lKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduTWFjaGluZShlbnRpdHksIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgICAgICBpZDogbmFtZVxuICAgICAgfSkpO1xuICAgIH0gZWxzZSBpZiAoaXNCZWhhdmlvcihlbnRpdHkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGF3bkJlaGF2aW9yKGVudGl0eSwgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBzcGF3biBlbnRpdHkgXFxcIlwiLmNvbmNhdChuYW1lLCBcIlxcXCIgb2YgdHlwZSBcXFwiXCIpLmNvbmNhdCh0eXBlb2YgZW50aXR5LCBcIlxcXCIuXCIpKTtcbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduTWFjaGluZSA9IGZ1bmN0aW9uIChtYWNoaW5lLCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgY2hpbGRTZXJ2aWNlID0gbmV3IEludGVycHJldGVyKG1hY2hpbmUsIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpLCB7XG4gICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICBpZDogb3B0aW9ucy5pZCB8fCBtYWNoaW5lLmlkXG4gICAgfSkpO1xuXG4gICAgdmFyIHJlc29sdmVkT3B0aW9ucyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBERUZBVUxUX1NQQVdOX09QVElPTlMpLCBvcHRpb25zKTtcblxuICAgIGlmIChyZXNvbHZlZE9wdGlvbnMuc3luYykge1xuICAgICAgY2hpbGRTZXJ2aWNlLm9uVHJhbnNpdGlvbihmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgX3RoaXMuc2VuZCh1cGRhdGUsIHtcbiAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgaWQ6IGNoaWxkU2VydmljZS5pZFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBhY3RvciA9IGNoaWxkU2VydmljZTtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChjaGlsZFNlcnZpY2UuaWQsIGFjdG9yKTtcblxuICAgIGlmIChyZXNvbHZlZE9wdGlvbnMuYXV0b0ZvcndhcmQpIHtcbiAgICAgIHRoaXMuZm9yd2FyZFRvLmFkZChjaGlsZFNlcnZpY2UuaWQpO1xuICAgIH1cblxuICAgIGNoaWxkU2VydmljZS5vbkRvbmUoZnVuY3Rpb24gKGRvbmVFdmVudCkge1xuICAgICAgX3RoaXMucmVtb3ZlQ2hpbGQoY2hpbGRTZXJ2aWNlLmlkKTtcblxuICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZG9uZUV2ZW50LCB7XG4gICAgICAgIG9yaWdpbjogY2hpbGRTZXJ2aWNlLmlkXG4gICAgICB9KSk7XG4gICAgfSkuc3RhcnQoKTtcbiAgICByZXR1cm4gYWN0b3I7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduQmVoYXZpb3IgPSBmdW5jdGlvbiAoYmVoYXZpb3IsIGlkKSB7XG4gICAgdmFyIGFjdG9yUmVmID0gc3Bhd25CZWhhdmlvcihiZWhhdmlvciwge1xuICAgICAgaWQ6IGlkLFxuICAgICAgcGFyZW50OiB0aGlzXG4gICAgfSk7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoaWQsIGFjdG9yUmVmKTtcbiAgICByZXR1cm4gYWN0b3JSZWY7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduUHJvbWlzZSA9IGZ1bmN0aW9uIChwcm9taXNlLCBpZCkge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgY2FuY2VsZWQgPSBmYWxzZTtcbiAgICB2YXIgcmVzb2x2ZWREYXRhO1xuICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmICghY2FuY2VsZWQpIHtcbiAgICAgICAgcmVzb2x2ZWREYXRhID0gcmVzcG9uc2U7XG5cbiAgICAgICAgX3RoaXMucmVtb3ZlQ2hpbGQoaWQpO1xuXG4gICAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGRvbmVJbnZva2UoaWQsIHJlc3BvbnNlKSwge1xuICAgICAgICAgIG9yaWdpbjogaWRcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIChlcnJvckRhdGEpIHtcbiAgICAgIGlmICghY2FuY2VsZWQpIHtcbiAgICAgICAgX3RoaXMucmVtb3ZlQ2hpbGQoaWQpO1xuXG4gICAgICAgIHZhciBlcnJvckV2ZW50ID0gZXJyb3IoaWQsIGVycm9yRGF0YSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBTZW5kIFwiZXJyb3IucGxhdGZvcm0uaWRcIiB0byB0aGlzIChwYXJlbnQpLlxuICAgICAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGVycm9yRXZlbnQsIHtcbiAgICAgICAgICAgIG9yaWdpbjogaWRcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmVwb3J0VW5oYW5kbGVkRXhjZXB0aW9uT25JbnZvY2F0aW9uKGVycm9yRGF0YSwgZXJyb3IsIGlkKTtcblxuICAgICAgICAgIGlmIChfdGhpcy5kZXZUb29scykge1xuICAgICAgICAgICAgX3RoaXMuZGV2VG9vbHMuc2VuZChlcnJvckV2ZW50LCBfdGhpcy5zdGF0ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKF90aGlzLm1hY2hpbmUuc3RyaWN0KSB7XG4gICAgICAgICAgICAvLyBpdCB3b3VsZCBiZSBiZXR0ZXIgdG8gYWx3YXlzIHN0b3AgdGhlIHN0YXRlIG1hY2hpbmUgaWYgdW5oYW5kbGVkXG4gICAgICAgICAgICAvLyBleGNlcHRpb24vcHJvbWlzZSByZWplY3Rpb24gaGFwcGVucyBidXQgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgICAgICAvLyBicmVhayBleGlzdGluZyBjb2RlIHNvIGVuZm9yY2UgaXQgb24gc3RyaWN0IG1vZGUgb25seSBlc3BlY2lhbGx5IHNvXG4gICAgICAgICAgICAvLyBiZWNhdXNlIGRvY3VtZW50YXRpb24gc2F5cyB0aGF0IG9uRXJyb3IgaXMgb3B0aW9uYWxcbiAgICAgICAgICAgIF90aGlzLnN0b3AoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgYWN0b3IgPSAoX2EgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICBzZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9LFxuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgICAgIHZhciBvYnNlcnZlciA9IHRvT2JzZXJ2ZXIobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKTtcbiAgICAgICAgdmFyIHVuc3Vic2NyaWJlZCA9IGZhbHNlO1xuICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgaWYgKHVuc3Vic2NyaWJlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9ic2VydmVyLm5leHQocmVzcG9uc2UpO1xuXG4gICAgICAgICAgaWYgKHVuc3Vic2NyaWJlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBpZiAodW5zdWJzY3JpYmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bnN1YnNjcmliZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhbmNlbGVkID0gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZWREYXRhO1xuICAgICAgfVxuICAgIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgX2EpO1xuICAgIHRoaXMuY2hpbGRyZW4uc2V0KGlkLCBhY3Rvcik7XG4gICAgcmV0dXJuIGFjdG9yO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bkNhbGxiYWNrID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBpZCkge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgY2FuY2VsZWQgPSBmYWxzZTtcbiAgICB2YXIgcmVjZWl2ZXJzID0gbmV3IFNldCgpO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdmFyIGVtaXR0ZWQ7XG5cbiAgICB2YXIgcmVjZWl2ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlbWl0dGVkID0gZTtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gbGlzdGVuZXIoZSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNhbmNlbGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZSwge1xuICAgICAgICBvcmlnaW46IGlkXG4gICAgICB9KSk7XG4gICAgfTtcblxuICAgIHZhciBjYWxsYmFja1N0b3A7XG5cbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2tTdG9wID0gY2FsbGJhY2socmVjZWl2ZSwgZnVuY3Rpb24gKG5ld0xpc3RlbmVyKSB7XG4gICAgICAgIHJlY2VpdmVycy5hZGQobmV3TGlzdGVuZXIpO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLnNlbmQoZXJyb3IoaWQsIGVycikpO1xuICAgIH1cblxuICAgIGlmIChpc1Byb21pc2VMaWtlKGNhbGxiYWNrU3RvcCkpIHtcbiAgICAgIC8vIGl0IHR1cm5lZCBvdXQgdG8gYmUgYW4gYXN5bmMgZnVuY3Rpb24sIGNhbid0IHJlbGlhYmx5IGNoZWNrIHRoaXMgYmVmb3JlIGNhbGxpbmcgYGNhbGxiYWNrYFxuICAgICAgLy8gYmVjYXVzZSB0cmFuc3BpbGVkIGFzeW5jIGZ1bmN0aW9ucyBhcmUgbm90IHJlY29nbml6YWJsZVxuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25Qcm9taXNlKGNhbGxiYWNrU3RvcCwgaWQpO1xuICAgIH1cblxuICAgIHZhciBhY3RvciA9IChfYSA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHNlbmQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICByZXR1cm4gcmVjZWl2ZXJzLmZvckVhY2goZnVuY3Rpb24gKHJlY2VpdmVyKSB7XG4gICAgICAgICAgcmV0dXJuIHJlY2VpdmVyKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSB0b09ic2VydmVyKG5leHQpO1xuICAgICAgICBsaXN0ZW5lcnMuYWRkKG9ic2VydmVyLm5leHQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMuZGVsZXRlKG9ic2VydmVyLm5leHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNhbmNlbGVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoaXNGdW5jdGlvbihjYWxsYmFja1N0b3ApKSB7XG4gICAgICAgICAgY2FsbGJhY2tTdG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZW1pdHRlZDtcbiAgICAgIH1cbiAgICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sIF9hKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChpZCwgYWN0b3IpO1xuICAgIHJldHVybiBhY3RvcjtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25PYnNlcnZhYmxlID0gZnVuY3Rpb24gKHNvdXJjZSwgaWQpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGVtaXR0ZWQ7XG4gICAgdmFyIHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBlbWl0dGVkID0gdmFsdWU7XG5cbiAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KHZhbHVlLCB7XG4gICAgICAgIG9yaWdpbjogaWRcbiAgICAgIH0pKTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBfdGhpcy5yZW1vdmVDaGlsZChpZCk7XG5cbiAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGVycm9yKGlkLCBlcnIpLCB7XG4gICAgICAgIG9yaWdpbjogaWRcbiAgICAgIH0pKTtcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5yZW1vdmVDaGlsZChpZCk7XG5cbiAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGRvbmVJbnZva2UoaWQpLCB7XG4gICAgICAgIG9yaWdpbjogaWRcbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgICB2YXIgYWN0b3IgPSAoX2EgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICBzZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9LFxuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSk7XG4gICAgICB9LFxuICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9LFxuICAgICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGVtaXR0ZWQ7XG4gICAgICB9LFxuICAgICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LCBfYSk7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoaWQsIGFjdG9yKTtcbiAgICByZXR1cm4gYWN0b3I7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduQWN0b3IgPSBmdW5jdGlvbiAoYWN0b3IsIG5hbWUpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChuYW1lLCBhY3Rvcik7XG4gICAgcmV0dXJuIGFjdG9yO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bkFjdGl2aXR5ID0gZnVuY3Rpb24gKGFjdGl2aXR5KSB7XG4gICAgdmFyIGltcGxlbWVudGF0aW9uID0gdGhpcy5tYWNoaW5lLm9wdGlvbnMgJiYgdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aXZpdGllcyA/IHRoaXMubWFjaGluZS5vcHRpb25zLmFjdGl2aXRpZXNbYWN0aXZpdHkudHlwZV0gOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIWltcGxlbWVudGF0aW9uKSB7XG4gICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgd2FybihmYWxzZSwgXCJObyBpbXBsZW1lbnRhdGlvbiBmb3VuZCBmb3IgYWN0aXZpdHkgJ1wiLmNvbmNhdChhY3Rpdml0eS50eXBlLCBcIidcIikpO1xuICAgICAgfSAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuXG5cbiAgICAgIHJldHVybjtcbiAgICB9IC8vIFN0YXJ0IGltcGxlbWVudGF0aW9uXG5cblxuICAgIHZhciBkaXNwb3NlID0gaW1wbGVtZW50YXRpb24odGhpcy5zdGF0ZS5jb250ZXh0LCBhY3Rpdml0eSk7XG4gICAgdGhpcy5zcGF3bkVmZmVjdChhY3Rpdml0eS5pZCwgZGlzcG9zZSk7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduRWZmZWN0ID0gZnVuY3Rpb24gKGlkLCBkaXNwb3NlKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoaWQsIChfYSA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHNlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH0sXG4gICAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgc3RvcDogZGlzcG9zZSB8fCB1bmRlZmluZWQsXG4gICAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSxcbiAgICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgX2EpKTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuYXR0YWNoRGV2ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBnbG9iYWwgPSBnZXRHbG9iYWwoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGV2VG9vbHMgJiYgZ2xvYmFsKSB7XG4gICAgICBpZiAoZ2xvYmFsLl9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18pIHtcbiAgICAgICAgdmFyIGRldlRvb2xzT3B0aW9ucyA9IHR5cGVvZiB0aGlzLm9wdGlvbnMuZGV2VG9vbHMgPT09ICdvYmplY3QnID8gdGhpcy5vcHRpb25zLmRldlRvb2xzIDogdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmRldlRvb2xzID0gZ2xvYmFsLl9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX18uY29ubmVjdChfX2Fzc2lnbihfX2Fzc2lnbih7XG4gICAgICAgICAgbmFtZTogdGhpcy5pZCxcbiAgICAgICAgICBhdXRvUGF1c2U6IHRydWUsXG4gICAgICAgICAgc3RhdGVTYW5pdGl6ZXI6IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdmFsdWU6IHN0YXRlLnZhbHVlLFxuICAgICAgICAgICAgICBjb250ZXh0OiBzdGF0ZS5jb250ZXh0LFxuICAgICAgICAgICAgICBhY3Rpb25zOiBzdGF0ZS5hY3Rpb25zXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgZGV2VG9vbHNPcHRpb25zKSwge1xuICAgICAgICAgIGZlYXR1cmVzOiBfX2Fzc2lnbih7XG4gICAgICAgICAgICBqdW1wOiBmYWxzZSxcbiAgICAgICAgICAgIHNraXA6IGZhbHNlXG4gICAgICAgICAgfSwgZGV2VG9vbHNPcHRpb25zID8gZGV2VG9vbHNPcHRpb25zLmZlYXR1cmVzIDogdW5kZWZpbmVkKVxuICAgICAgICB9KSwgdGhpcy5tYWNoaW5lKTtcbiAgICAgICAgdGhpcy5kZXZUb29scy5pbml0KHRoaXMuc3RhdGUpO1xuICAgICAgfSAvLyBhZGQgWFN0YXRlLXNwZWNpZmljIGRldiB0b29saW5nIGhvb2tcblxuXG4gICAgICByZWdpc3RlclNlcnZpY2UodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLmlkXG4gICAgfTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGVbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmdldFNuYXBzaG90ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuTm90U3RhcnRlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbFN0YXRlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfTtcbiAgLyoqXHJcbiAgICogVGhlIGRlZmF1bHQgaW50ZXJwcmV0ZXIgb3B0aW9uczpcclxuICAgKlxyXG4gICAqIC0gYGNsb2NrYCB1c2VzIHRoZSBnbG9iYWwgYHNldFRpbWVvdXRgIGFuZCBgY2xlYXJUaW1lb3V0YCBmdW5jdGlvbnNcclxuICAgKiAtIGBsb2dnZXJgIHVzZXMgdGhlIGdsb2JhbCBgY29uc29sZS5sb2coKWAgbWV0aG9kXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBleGVjdXRlOiB0cnVlLFxuICAgIGRlZmVyRXZlbnRzOiB0cnVlLFxuICAgIGNsb2NrOiB7XG4gICAgICBzZXRUaW1lb3V0OiBmdW5jdGlvbiAoZm4sIG1zKSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZuLCBtcyk7XG4gICAgICB9LFxuICAgICAgY2xlYXJUaW1lb3V0OiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChpZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBsb2dnZXI6IC8qI19fUFVSRV9fKi9jb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpLFxuICAgIGRldlRvb2xzOiBmYWxzZVxuICB9O1xuICBJbnRlcnByZXRlci5pbnRlcnByZXQgPSBpbnRlcnByZXQ7XG4gIHJldHVybiBJbnRlcnByZXRlcjtcbn0oKTtcblxudmFyIHJlc29sdmVTcGF3bk9wdGlvbnMgPSBmdW5jdGlvbiAobmFtZU9yT3B0aW9ucykge1xuICBpZiAoaXNTdHJpbmcobmFtZU9yT3B0aW9ucykpIHtcbiAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIERFRkFVTFRfU1BBV05fT1BUSU9OUyksIHtcbiAgICAgIG5hbWU6IG5hbWVPck9wdGlvbnNcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbihfX2Fzc2lnbih7fSwgREVGQVVMVF9TUEFXTl9PUFRJT05TKSwge1xuICAgIG5hbWU6IHVuaXF1ZUlkKClcbiAgfSksIG5hbWVPck9wdGlvbnMpO1xufTtcblxuZnVuY3Rpb24gc3Bhd24oZW50aXR5LCBuYW1lT3JPcHRpb25zKSB7XG4gIHZhciByZXNvbHZlZE9wdGlvbnMgPSByZXNvbHZlU3Bhd25PcHRpb25zKG5hbWVPck9wdGlvbnMpO1xuICByZXR1cm4gY29uc3VtZShmdW5jdGlvbiAoc2VydmljZSkge1xuICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgdmFyIGlzTGF6eUVudGl0eSA9IGlzTWFjaGluZShlbnRpdHkpIHx8IGlzRnVuY3Rpb24oZW50aXR5KTtcbiAgICAgIHdhcm4oISFzZXJ2aWNlIHx8IGlzTGF6eUVudGl0eSwgXCJBdHRlbXB0ZWQgdG8gc3Bhd24gYW4gQWN0b3IgKElEOiBcXFwiXCIuY29uY2F0KGlzTWFjaGluZShlbnRpdHkpID8gZW50aXR5LmlkIDogJ3VuZGVmaW5lZCcsIFwiXFxcIikgb3V0c2lkZSBvZiBhIHNlcnZpY2UuIFRoaXMgd2lsbCBoYXZlIG5vIGVmZmVjdC5cIikpO1xuICAgIH1cblxuICAgIGlmIChzZXJ2aWNlKSB7XG4gICAgICByZXR1cm4gc2VydmljZS5zcGF3bihlbnRpdHksIHJlc29sdmVkT3B0aW9ucy5uYW1lLCByZXNvbHZlZE9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3JlYXRlRGVmZXJyZWRBY3RvcihlbnRpdHksIHJlc29sdmVkT3B0aW9ucy5uYW1lKTtcbiAgICB9XG4gIH0pO1xufVxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgSW50ZXJwcmV0ZXIgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBtYWNoaW5lIHdpdGggdGhlIHByb3ZpZGVkIG9wdGlvbnMsIGlmIGFueS5cclxuICpcclxuICogQHBhcmFtIG1hY2hpbmUgVGhlIG1hY2hpbmUgdG8gaW50ZXJwcmV0XHJcbiAqIEBwYXJhbSBvcHRpb25zIEludGVycHJldGVyIG9wdGlvbnNcclxuICovXG5cbmZ1bmN0aW9uIGludGVycHJldChtYWNoaW5lLCBvcHRpb25zKSB7XG4gIHZhciBpbnRlcnByZXRlciA9IG5ldyBJbnRlcnByZXRlcihtYWNoaW5lLCBvcHRpb25zKTtcbiAgcmV0dXJuIGludGVycHJldGVyO1xufVxuXG5leHBvcnQgeyBJbnRlcnByZXRlciwgSW50ZXJwcmV0ZXJTdGF0dXMsIGludGVycHJldCwgc3Bhd24gfTtcbiIsImltcG9ydCB7IF9fYXNzaWduLCBfX3Jlc3QgfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgJy4vdHlwZXMuanMnO1xuaW1wb3J0IHsgaW52b2tlIH0gZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5pbXBvcnQgJy4vdXRpbHMuanMnO1xuaW1wb3J0ICcuL2Vudmlyb25tZW50LmpzJztcblxuZnVuY3Rpb24gdG9JbnZva2VTb3VyY2Uoc3JjKSB7XG4gIGlmICh0eXBlb2Ygc3JjID09PSAnc3RyaW5nJykge1xuICAgIHZhciBzaW1wbGVTcmMgPSB7XG4gICAgICB0eXBlOiBzcmNcbiAgICB9O1xuXG4gICAgc2ltcGxlU3JjLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHNyYztcbiAgICB9OyAvLyB2NCBjb21wYXQgLSBUT0RPOiByZW1vdmUgaW4gdjVcblxuXG4gICAgcmV0dXJuIHNpbXBsZVNyYztcbiAgfVxuXG4gIHJldHVybiBzcmM7XG59XG5mdW5jdGlvbiB0b0ludm9rZURlZmluaXRpb24oaW52b2tlQ29uZmlnKSB7XG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7XG4gICAgdHlwZTogaW52b2tlXG4gIH0sIGludm9rZUNvbmZpZyksIHtcbiAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgIGludm9rZUNvbmZpZy5vbkRvbmU7XG4gICAgICAgICAgaW52b2tlQ29uZmlnLm9uRXJyb3I7XG4gICAgICAgICAgdmFyIGludm9rZURlZiA9IF9fcmVzdChpbnZva2VDb25maWcsIFtcIm9uRG9uZVwiLCBcIm9uRXJyb3JcIl0pO1xuXG4gICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGludm9rZURlZiksIHtcbiAgICAgICAgdHlwZTogaW52b2tlLFxuICAgICAgICBzcmM6IHRvSW52b2tlU291cmNlKGludm9rZUNvbmZpZy5zcmMpXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgeyB0b0ludm9rZURlZmluaXRpb24sIHRvSW52b2tlU291cmNlIH07XG4iLCJpbXBvcnQgeyBfX3ZhbHVlcyB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IG1hdGNoZXNTdGF0ZSB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG5mdW5jdGlvbiBtYXBTdGF0ZShzdGF0ZU1hcCwgc3RhdGVJZCkge1xuICB2YXIgZV8xLCBfYTtcblxuICB2YXIgZm91bmRTdGF0ZUlkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhPYmplY3Qua2V5cyhzdGF0ZU1hcCkpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICB2YXIgbWFwcGVkU3RhdGVJZCA9IF9jLnZhbHVlO1xuXG4gICAgICBpZiAobWF0Y2hlc1N0YXRlKG1hcHBlZFN0YXRlSWQsIHN0YXRlSWQpICYmICghZm91bmRTdGF0ZUlkIHx8IHN0YXRlSWQubGVuZ3RoID4gZm91bmRTdGF0ZUlkLmxlbmd0aCkpIHtcbiAgICAgICAgZm91bmRTdGF0ZUlkID0gbWFwcGVkU3RhdGVJZDtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfMV8xKSB7XG4gICAgZV8xID0ge1xuICAgICAgZXJyb3I6IGVfMV8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN0YXRlTWFwW2ZvdW5kU3RhdGVJZF07XG59XG5cbmV4cG9ydCB7IG1hcFN0YXRlIH07XG4iLCJpbXBvcnQgeyBfX3ZhbHVlcywgX19yZWFkIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuL1N0YXRlLmpzJztcblxuZnVuY3Rpb24gbWF0Y2hTdGF0ZShzdGF0ZSwgcGF0dGVybnMsIGRlZmF1bHRWYWx1ZSkge1xuICB2YXIgZV8xLCBfYTtcblxuICB2YXIgcmVzb2x2ZWRTdGF0ZSA9IFN0YXRlLmZyb20oc3RhdGUsIHN0YXRlIGluc3RhbmNlb2YgU3RhdGUgPyBzdGF0ZS5jb250ZXh0IDogdW5kZWZpbmVkKTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIHBhdHRlcm5zXzEgPSBfX3ZhbHVlcyhwYXR0ZXJucyksIHBhdHRlcm5zXzFfMSA9IHBhdHRlcm5zXzEubmV4dCgpOyAhcGF0dGVybnNfMV8xLmRvbmU7IHBhdHRlcm5zXzFfMSA9IHBhdHRlcm5zXzEubmV4dCgpKSB7XG4gICAgICB2YXIgX2IgPSBfX3JlYWQocGF0dGVybnNfMV8xLnZhbHVlLCAyKSxcbiAgICAgICAgICBzdGF0ZVZhbHVlID0gX2JbMF0sXG4gICAgICAgICAgZ2V0VmFsdWUgPSBfYlsxXTtcblxuICAgICAgaWYgKHJlc29sdmVkU3RhdGUubWF0Y2hlcyhzdGF0ZVZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZ2V0VmFsdWUocmVzb2x2ZWRTdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzFfMSkge1xuICAgIGVfMSA9IHtcbiAgICAgIGVycm9yOiBlXzFfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChwYXR0ZXJuc18xXzEgJiYgIXBhdHRlcm5zXzFfMS5kb25lICYmIChfYSA9IHBhdHRlcm5zXzEucmV0dXJuKSkgX2EuY2FsbChwYXR0ZXJuc18xKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZWZhdWx0VmFsdWUocmVzb2x2ZWRTdGF0ZSk7XG59XG5cbmV4cG9ydCB7IG1hdGNoU3RhdGUgfTtcbiIsInZhciBjaGlsZHJlbiA9IC8qI19fUFVSRV9fKi9uZXcgTWFwKCk7XG52YXIgc2Vzc2lvbklkSW5kZXggPSAwO1xudmFyIHJlZ2lzdHJ5ID0ge1xuICBib29rSWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gXCJ4OlwiLmNvbmNhdChzZXNzaW9uSWRJbmRleCsrKTtcbiAgfSxcbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uIChpZCwgYWN0b3IpIHtcbiAgICBjaGlsZHJlbi5zZXQoaWQsIGFjdG9yKTtcbiAgICByZXR1cm4gaWQ7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuLmdldChpZCk7XG4gIH0sXG4gIGZyZWU6IGZ1bmN0aW9uIChpZCkge1xuICAgIGNoaWxkcmVuLmRlbGV0ZShpZCk7XG4gIH1cbn07XG5cbmV4cG9ydCB7IHJlZ2lzdHJ5IH07XG4iLCJpbXBvcnQgeyBfX2Fzc2lnbiB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcblxudmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICBkZWZlckV2ZW50czogZmFsc2Vcbn07XG5cbnZhciBTY2hlZHVsZXIgPVxuLyojX19QVVJFX18qL1xuXG4vKiogQGNsYXNzICovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNjaGVkdWxlcihvcHRpb25zKSB7XG4gICAgdGhpcy5wcm9jZXNzaW5nRXZlbnQgPSBmYWxzZTtcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMub3B0aW9ucyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucyksIG9wdGlvbnMpO1xuICB9XG5cbiAgU2NoZWR1bGVyLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmRlZmVyRXZlbnRzKSB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGUoY2FsbGJhY2spO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvY2VzcyhjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgdGhpcy5mbHVzaEV2ZW50cygpO1xuICB9O1xuXG4gIFNjaGVkdWxlci5wcm90b3R5cGUuc2NoZWR1bGUgPSBmdW5jdGlvbiAodGFzaykge1xuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCB8fCB0aGlzLnByb2Nlc3NpbmdFdmVudCkge1xuICAgICAgdGhpcy5xdWV1ZS5wdXNoKHRhc2spO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudCBxdWV1ZSBzaG91bGQgYmUgZW1wdHkgd2hlbiBpdCBpcyBub3QgcHJvY2Vzc2luZyBldmVudHMnKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb2Nlc3ModGFzayk7XG4gICAgdGhpcy5mbHVzaEV2ZW50cygpO1xuICB9O1xuXG4gIFNjaGVkdWxlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICB9O1xuXG4gIFNjaGVkdWxlci5wcm90b3R5cGUuZmx1c2hFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5leHRDYWxsYmFjayA9IHRoaXMucXVldWUuc2hpZnQoKTtcblxuICAgIHdoaWxlIChuZXh0Q2FsbGJhY2spIHtcbiAgICAgIHRoaXMucHJvY2VzcyhuZXh0Q2FsbGJhY2spO1xuICAgICAgbmV4dENhbGxiYWNrID0gdGhpcy5xdWV1ZS5zaGlmdCgpO1xuICAgIH1cbiAgfTtcblxuICBTY2hlZHVsZXIucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB0aGlzLnByb2Nlc3NpbmdFdmVudCA9IHRydWU7XG5cbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyB0aGVyZSBpcyBubyB1c2UgdG8ga2VlcCB0aGUgZnV0dXJlIGV2ZW50c1xuICAgICAgLy8gYXMgdGhlIHNpdHVhdGlvbiBpcyBub3QgYW55bW9yZSB0aGUgc2FtZVxuICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgdGhyb3cgZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5wcm9jZXNzaW5nRXZlbnQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFNjaGVkdWxlcjtcbn0oKTtcblxuZXhwb3J0IHsgU2NoZWR1bGVyIH07XG4iLCJmdW5jdGlvbiBjcmVhdGVTY2hlbWEoc2NoZW1hKSB7XG4gIHJldHVybiBzY2hlbWE7XG59XG52YXIgdCA9IGNyZWF0ZVNjaGVtYTtcblxuZXhwb3J0IHsgY3JlYXRlU2NoZW1hLCB0IH07XG4iLCIvKipcclxuICogTWFpbnRhaW5zIGEgc3RhY2sgb2YgdGhlIGN1cnJlbnQgc2VydmljZSBpbiBzY29wZS5cclxuICogVGhpcyBpcyB1c2VkIHRvIHByb3ZpZGUgdGhlIGNvcnJlY3Qgc2VydmljZSB0byBzcGF3bigpLlxyXG4gKi9cbnZhciBzZXJ2aWNlU3RhY2sgPSBbXTtcbnZhciBwcm92aWRlID0gZnVuY3Rpb24gKHNlcnZpY2UsIGZuKSB7XG4gIHNlcnZpY2VTdGFjay5wdXNoKHNlcnZpY2UpO1xuICB2YXIgcmVzdWx0ID0gZm4oc2VydmljZSk7XG4gIHNlcnZpY2VTdGFjay5wb3AoKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgY29uc3VtZSA9IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gZm4oc2VydmljZVN0YWNrW3NlcnZpY2VTdGFjay5sZW5ndGggLSAxXSk7XG59O1xuXG5leHBvcnQgeyBjb25zdW1lLCBwcm92aWRlIH07XG4iLCJpbXBvcnQgeyBfX3ZhbHVlcywgX19zcHJlYWRBcnJheSwgX19yZWFkIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgZmxhdHRlbiB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG52YXIgaXNMZWFmTm9kZSA9IGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgcmV0dXJuIHN0YXRlTm9kZS50eXBlID09PSAnYXRvbWljJyB8fCBzdGF0ZU5vZGUudHlwZSA9PT0gJ2ZpbmFsJztcbn07XG5mdW5jdGlvbiBnZXRBbGxDaGlsZHJlbihzdGF0ZU5vZGUpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHN0YXRlTm9kZS5zdGF0ZXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHN0YXRlTm9kZS5zdGF0ZXNba2V5XTtcbiAgfSk7XG59XG5mdW5jdGlvbiBnZXRDaGlsZHJlbihzdGF0ZU5vZGUpIHtcbiAgcmV0dXJuIGdldEFsbENoaWxkcmVuKHN0YXRlTm9kZSkuZmlsdGVyKGZ1bmN0aW9uIChzbikge1xuICAgIHJldHVybiBzbi50eXBlICE9PSAnaGlzdG9yeSc7XG4gIH0pO1xufVxuZnVuY3Rpb24gZ2V0QWxsU3RhdGVOb2RlcyhzdGF0ZU5vZGUpIHtcbiAgdmFyIHN0YXRlTm9kZXMgPSBbc3RhdGVOb2RlXTtcblxuICBpZiAoaXNMZWFmTm9kZShzdGF0ZU5vZGUpKSB7XG4gICAgcmV0dXJuIHN0YXRlTm9kZXM7XG4gIH1cblxuICByZXR1cm4gc3RhdGVOb2Rlcy5jb25jYXQoZmxhdHRlbihnZXRDaGlsZHJlbihzdGF0ZU5vZGUpLm1hcChnZXRBbGxTdGF0ZU5vZGVzKSkpO1xufVxuZnVuY3Rpb24gZ2V0Q29uZmlndXJhdGlvbihwcmV2U3RhdGVOb2Rlcywgc3RhdGVOb2Rlcykge1xuICB2YXIgZV8xLCBfYSwgZV8yLCBfYiwgZV8zLCBfYywgZV80LCBfZDtcblxuICB2YXIgcHJldkNvbmZpZ3VyYXRpb24gPSBuZXcgU2V0KHByZXZTdGF0ZU5vZGVzKTtcbiAgdmFyIHByZXZBZGpMaXN0ID0gZ2V0QWRqTGlzdChwcmV2Q29uZmlndXJhdGlvbik7XG4gIHZhciBjb25maWd1cmF0aW9uID0gbmV3IFNldChzdGF0ZU5vZGVzKTtcblxuICB0cnkge1xuICAgIC8vIGFkZCBhbGwgYW5jZXN0b3JzXG4gICAgZm9yICh2YXIgY29uZmlndXJhdGlvbl8xID0gX192YWx1ZXMoY29uZmlndXJhdGlvbiksIGNvbmZpZ3VyYXRpb25fMV8xID0gY29uZmlndXJhdGlvbl8xLm5leHQoKTsgIWNvbmZpZ3VyYXRpb25fMV8xLmRvbmU7IGNvbmZpZ3VyYXRpb25fMV8xID0gY29uZmlndXJhdGlvbl8xLm5leHQoKSkge1xuICAgICAgdmFyIHMgPSBjb25maWd1cmF0aW9uXzFfMS52YWx1ZTtcbiAgICAgIHZhciBtID0gcy5wYXJlbnQ7XG5cbiAgICAgIHdoaWxlIChtICYmICFjb25maWd1cmF0aW9uLmhhcyhtKSkge1xuICAgICAgICBjb25maWd1cmF0aW9uLmFkZChtKTtcbiAgICAgICAgbSA9IG0ucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICBlXzEgPSB7XG4gICAgICBlcnJvcjogZV8xXzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoY29uZmlndXJhdGlvbl8xXzEgJiYgIWNvbmZpZ3VyYXRpb25fMV8xLmRvbmUgJiYgKF9hID0gY29uZmlndXJhdGlvbl8xLnJldHVybikpIF9hLmNhbGwoY29uZmlndXJhdGlvbl8xKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHZhciBhZGpMaXN0ID0gZ2V0QWRqTGlzdChjb25maWd1cmF0aW9uKTtcblxuICB0cnkge1xuICAgIC8vIGFkZCBkZXNjZW5kYW50c1xuICAgIGZvciAodmFyIGNvbmZpZ3VyYXRpb25fMiA9IF9fdmFsdWVzKGNvbmZpZ3VyYXRpb24pLCBjb25maWd1cmF0aW9uXzJfMSA9IGNvbmZpZ3VyYXRpb25fMi5uZXh0KCk7ICFjb25maWd1cmF0aW9uXzJfMS5kb25lOyBjb25maWd1cmF0aW9uXzJfMSA9IGNvbmZpZ3VyYXRpb25fMi5uZXh0KCkpIHtcbiAgICAgIHZhciBzID0gY29uZmlndXJhdGlvbl8yXzEudmFsdWU7IC8vIGlmIHByZXZpb3VzbHkgYWN0aXZlLCBhZGQgZXhpc3RpbmcgY2hpbGQgbm9kZXNcblxuICAgICAgaWYgKHMudHlwZSA9PT0gJ2NvbXBvdW5kJyAmJiAoIWFkakxpc3QuZ2V0KHMpIHx8ICFhZGpMaXN0LmdldChzKS5sZW5ndGgpKSB7XG4gICAgICAgIGlmIChwcmV2QWRqTGlzdC5nZXQocykpIHtcbiAgICAgICAgICBwcmV2QWRqTGlzdC5nZXQocykuZm9yRWFjaChmdW5jdGlvbiAoc24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWd1cmF0aW9uLmFkZChzbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcy5pbml0aWFsU3RhdGVOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChzbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb24uYWRkKHNuKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHMudHlwZSA9PT0gJ3BhcmFsbGVsJykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfZSA9IChlXzMgPSB2b2lkIDAsIF9fdmFsdWVzKGdldENoaWxkcmVuKHMpKSksIF9mID0gX2UubmV4dCgpOyAhX2YuZG9uZTsgX2YgPSBfZS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgdmFyIGNoaWxkID0gX2YudmFsdWU7XG5cbiAgICAgICAgICAgICAgaWYgKCFjb25maWd1cmF0aW9uLmhhcyhjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uLmFkZChjaGlsZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJldkFkakxpc3QuZ2V0KGNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgcHJldkFkakxpc3QuZ2V0KGNoaWxkKS5mb3JFYWNoKGZ1bmN0aW9uIChzbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlndXJhdGlvbi5hZGQoc24pO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGNoaWxkLmluaXRpYWxTdGF0ZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKHNuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWd1cmF0aW9uLmFkZChzbik7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlXzNfMSkge1xuICAgICAgICAgICAgZV8zID0ge1xuICAgICAgICAgICAgICBlcnJvcjogZV8zXzFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmIChfZiAmJiAhX2YuZG9uZSAmJiAoX2MgPSBfZS5yZXR1cm4pKSBfYy5jYWxsKF9lKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIGlmIChlXzMpIHRocm93IGVfMy5lcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfMl8xKSB7XG4gICAgZV8yID0ge1xuICAgICAgZXJyb3I6IGVfMl8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGNvbmZpZ3VyYXRpb25fMl8xICYmICFjb25maWd1cmF0aW9uXzJfMS5kb25lICYmIChfYiA9IGNvbmZpZ3VyYXRpb25fMi5yZXR1cm4pKSBfYi5jYWxsKGNvbmZpZ3VyYXRpb25fMik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjtcbiAgICB9XG4gIH1cblxuICB0cnkge1xuICAgIC8vIGFkZCBhbGwgYW5jZXN0b3JzXG4gICAgZm9yICh2YXIgY29uZmlndXJhdGlvbl8zID0gX192YWx1ZXMoY29uZmlndXJhdGlvbiksIGNvbmZpZ3VyYXRpb25fM18xID0gY29uZmlndXJhdGlvbl8zLm5leHQoKTsgIWNvbmZpZ3VyYXRpb25fM18xLmRvbmU7IGNvbmZpZ3VyYXRpb25fM18xID0gY29uZmlndXJhdGlvbl8zLm5leHQoKSkge1xuICAgICAgdmFyIHMgPSBjb25maWd1cmF0aW9uXzNfMS52YWx1ZTtcbiAgICAgIHZhciBtID0gcy5wYXJlbnQ7XG5cbiAgICAgIHdoaWxlIChtICYmICFjb25maWd1cmF0aW9uLmhhcyhtKSkge1xuICAgICAgICBjb25maWd1cmF0aW9uLmFkZChtKTtcbiAgICAgICAgbSA9IG0ucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV80XzEpIHtcbiAgICBlXzQgPSB7XG4gICAgICBlcnJvcjogZV80XzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoY29uZmlndXJhdGlvbl8zXzEgJiYgIWNvbmZpZ3VyYXRpb25fM18xLmRvbmUgJiYgKF9kID0gY29uZmlndXJhdGlvbl8zLnJldHVybikpIF9kLmNhbGwoY29uZmlndXJhdGlvbl8zKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNCkgdGhyb3cgZV80LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb25maWd1cmF0aW9uO1xufVxuXG5mdW5jdGlvbiBnZXRWYWx1ZUZyb21BZGooYmFzZU5vZGUsIGFkakxpc3QpIHtcbiAgdmFyIGNoaWxkU3RhdGVOb2RlcyA9IGFkakxpc3QuZ2V0KGJhc2VOb2RlKTtcblxuICBpZiAoIWNoaWxkU3RhdGVOb2Rlcykge1xuICAgIHJldHVybiB7fTsgLy8gdG9kbzogZml4P1xuICB9XG5cbiAgaWYgKGJhc2VOb2RlLnR5cGUgPT09ICdjb21wb3VuZCcpIHtcbiAgICB2YXIgY2hpbGRTdGF0ZU5vZGUgPSBjaGlsZFN0YXRlTm9kZXNbMF07XG5cbiAgICBpZiAoY2hpbGRTdGF0ZU5vZGUpIHtcbiAgICAgIGlmIChpc0xlYWZOb2RlKGNoaWxkU3RhdGVOb2RlKSkge1xuICAgICAgICByZXR1cm4gY2hpbGRTdGF0ZU5vZGUua2V5O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9XG5cbiAgdmFyIHN0YXRlVmFsdWUgPSB7fTtcbiAgY2hpbGRTdGF0ZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGNzbikge1xuICAgIHN0YXRlVmFsdWVbY3NuLmtleV0gPSBnZXRWYWx1ZUZyb21BZGooY3NuLCBhZGpMaXN0KTtcbiAgfSk7XG4gIHJldHVybiBzdGF0ZVZhbHVlO1xufVxuXG5mdW5jdGlvbiBnZXRBZGpMaXN0KGNvbmZpZ3VyYXRpb24pIHtcbiAgdmFyIGVfNSwgX2E7XG5cbiAgdmFyIGFkakxpc3QgPSBuZXcgTWFwKCk7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBjb25maWd1cmF0aW9uXzQgPSBfX3ZhbHVlcyhjb25maWd1cmF0aW9uKSwgY29uZmlndXJhdGlvbl80XzEgPSBjb25maWd1cmF0aW9uXzQubmV4dCgpOyAhY29uZmlndXJhdGlvbl80XzEuZG9uZTsgY29uZmlndXJhdGlvbl80XzEgPSBjb25maWd1cmF0aW9uXzQubmV4dCgpKSB7XG4gICAgICB2YXIgcyA9IGNvbmZpZ3VyYXRpb25fNF8xLnZhbHVlO1xuXG4gICAgICBpZiAoIWFkakxpc3QuaGFzKHMpKSB7XG4gICAgICAgIGFkakxpc3Quc2V0KHMsIFtdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHMucGFyZW50KSB7XG4gICAgICAgIGlmICghYWRqTGlzdC5oYXMocy5wYXJlbnQpKSB7XG4gICAgICAgICAgYWRqTGlzdC5zZXQocy5wYXJlbnQsIFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkakxpc3QuZ2V0KHMucGFyZW50KS5wdXNoKHMpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV81XzEpIHtcbiAgICBlXzUgPSB7XG4gICAgICBlcnJvcjogZV81XzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoY29uZmlndXJhdGlvbl80XzEgJiYgIWNvbmZpZ3VyYXRpb25fNF8xLmRvbmUgJiYgKF9hID0gY29uZmlndXJhdGlvbl80LnJldHVybikpIF9hLmNhbGwoY29uZmlndXJhdGlvbl80KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNSkgdGhyb3cgZV81LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhZGpMaXN0O1xufVxuZnVuY3Rpb24gZ2V0VmFsdWUocm9vdE5vZGUsIGNvbmZpZ3VyYXRpb24pIHtcbiAgdmFyIGNvbmZpZyA9IGdldENvbmZpZ3VyYXRpb24oW3Jvb3ROb2RlXSwgY29uZmlndXJhdGlvbik7XG4gIHJldHVybiBnZXRWYWx1ZUZyb21BZGoocm9vdE5vZGUsIGdldEFkakxpc3QoY29uZmlnKSk7XG59XG5mdW5jdGlvbiBoYXMoaXRlcmFibGUsIGl0ZW0pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoaXRlcmFibGUpKSB7XG4gICAgcmV0dXJuIGl0ZXJhYmxlLnNvbWUoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgICAgcmV0dXJuIG1lbWJlciA9PT0gaXRlbTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChpdGVyYWJsZSBpbnN0YW5jZW9mIFNldCkge1xuICAgIHJldHVybiBpdGVyYWJsZS5oYXMoaXRlbSk7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7IC8vIFRPRE86IGZpeFxufVxuZnVuY3Rpb24gbmV4dEV2ZW50cyhjb25maWd1cmF0aW9uKSB7XG4gIHJldHVybiBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQobmV3IFNldChmbGF0dGVuKF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChjb25maWd1cmF0aW9uLm1hcChmdW5jdGlvbiAoc24pIHtcbiAgICByZXR1cm4gc24ub3duRXZlbnRzO1xuICB9KSksIGZhbHNlKSkpKSwgZmFsc2UpO1xufVxuZnVuY3Rpb24gaXNJbkZpbmFsU3RhdGUoY29uZmlndXJhdGlvbiwgc3RhdGVOb2RlKSB7XG4gIGlmIChzdGF0ZU5vZGUudHlwZSA9PT0gJ2NvbXBvdW5kJykge1xuICAgIHJldHVybiBnZXRDaGlsZHJlbihzdGF0ZU5vZGUpLnNvbWUoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBzLnR5cGUgPT09ICdmaW5hbCcgJiYgaGFzKGNvbmZpZ3VyYXRpb24sIHMpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHN0YXRlTm9kZS50eXBlID09PSAncGFyYWxsZWwnKSB7XG4gICAgcmV0dXJuIGdldENoaWxkcmVuKHN0YXRlTm9kZSkuZXZlcnkoZnVuY3Rpb24gKHNuKSB7XG4gICAgICByZXR1cm4gaXNJbkZpbmFsU3RhdGUoY29uZmlndXJhdGlvbiwgc24pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gZ2V0TWV0YShjb25maWd1cmF0aW9uKSB7XG4gIGlmIChjb25maWd1cmF0aW9uID09PSB2b2lkIDApIHtcbiAgICBjb25maWd1cmF0aW9uID0gW107XG4gIH1cblxuICByZXR1cm4gY29uZmlndXJhdGlvbi5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgc3RhdGVOb2RlKSB7XG4gICAgaWYgKHN0YXRlTm9kZS5tZXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFjY1tzdGF0ZU5vZGUuaWRdID0gc3RhdGVOb2RlLm1ldGE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xufVxuZnVuY3Rpb24gZ2V0VGFnc0Zyb21Db25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHtcbiAgcmV0dXJuIG5ldyBTZXQoZmxhdHRlbihjb25maWd1cmF0aW9uLm1hcChmdW5jdGlvbiAoc24pIHtcbiAgICByZXR1cm4gc24udGFncztcbiAgfSkpKTtcbn1cblxuZXhwb3J0IHsgZ2V0QWRqTGlzdCwgZ2V0QWxsQ2hpbGRyZW4sIGdldEFsbFN0YXRlTm9kZXMsIGdldENoaWxkcmVuLCBnZXRDb25maWd1cmF0aW9uLCBnZXRNZXRhLCBnZXRUYWdzRnJvbUNvbmZpZ3VyYXRpb24sIGdldFZhbHVlLCBoYXMsIGlzSW5GaW5hbFN0YXRlLCBpc0xlYWZOb2RlLCBuZXh0RXZlbnRzIH07XG4iLCJ2YXIgQWN0aW9uVHlwZXM7XG5cbihmdW5jdGlvbiAoQWN0aW9uVHlwZXMpIHtcbiAgQWN0aW9uVHlwZXNbXCJTdGFydFwiXSA9IFwieHN0YXRlLnN0YXJ0XCI7XG4gIEFjdGlvblR5cGVzW1wiU3RvcFwiXSA9IFwieHN0YXRlLnN0b3BcIjtcbiAgQWN0aW9uVHlwZXNbXCJSYWlzZVwiXSA9IFwieHN0YXRlLnJhaXNlXCI7XG4gIEFjdGlvblR5cGVzW1wiU2VuZFwiXSA9IFwieHN0YXRlLnNlbmRcIjtcbiAgQWN0aW9uVHlwZXNbXCJDYW5jZWxcIl0gPSBcInhzdGF0ZS5jYW5jZWxcIjtcbiAgQWN0aW9uVHlwZXNbXCJOdWxsRXZlbnRcIl0gPSBcIlwiO1xuICBBY3Rpb25UeXBlc1tcIkFzc2lnblwiXSA9IFwieHN0YXRlLmFzc2lnblwiO1xuICBBY3Rpb25UeXBlc1tcIkFmdGVyXCJdID0gXCJ4c3RhdGUuYWZ0ZXJcIjtcbiAgQWN0aW9uVHlwZXNbXCJEb25lU3RhdGVcIl0gPSBcImRvbmUuc3RhdGVcIjtcbiAgQWN0aW9uVHlwZXNbXCJEb25lSW52b2tlXCJdID0gXCJkb25lLmludm9rZVwiO1xuICBBY3Rpb25UeXBlc1tcIkxvZ1wiXSA9IFwieHN0YXRlLmxvZ1wiO1xuICBBY3Rpb25UeXBlc1tcIkluaXRcIl0gPSBcInhzdGF0ZS5pbml0XCI7XG4gIEFjdGlvblR5cGVzW1wiSW52b2tlXCJdID0gXCJ4c3RhdGUuaW52b2tlXCI7XG4gIEFjdGlvblR5cGVzW1wiRXJyb3JFeGVjdXRpb25cIl0gPSBcImVycm9yLmV4ZWN1dGlvblwiO1xuICBBY3Rpb25UeXBlc1tcIkVycm9yQ29tbXVuaWNhdGlvblwiXSA9IFwiZXJyb3IuY29tbXVuaWNhdGlvblwiO1xuICBBY3Rpb25UeXBlc1tcIkVycm9yUGxhdGZvcm1cIl0gPSBcImVycm9yLnBsYXRmb3JtXCI7XG4gIEFjdGlvblR5cGVzW1wiRXJyb3JDdXN0b21cIl0gPSBcInhzdGF0ZS5lcnJvclwiO1xuICBBY3Rpb25UeXBlc1tcIlVwZGF0ZVwiXSA9IFwieHN0YXRlLnVwZGF0ZVwiO1xuICBBY3Rpb25UeXBlc1tcIlB1cmVcIl0gPSBcInhzdGF0ZS5wdXJlXCI7XG4gIEFjdGlvblR5cGVzW1wiQ2hvb3NlXCJdID0gXCJ4c3RhdGUuY2hvb3NlXCI7XG59KShBY3Rpb25UeXBlcyB8fCAoQWN0aW9uVHlwZXMgPSB7fSkpO1xuXG52YXIgU3BlY2lhbFRhcmdldHM7XG5cbihmdW5jdGlvbiAoU3BlY2lhbFRhcmdldHMpIHtcbiAgU3BlY2lhbFRhcmdldHNbXCJQYXJlbnRcIl0gPSBcIiNfcGFyZW50XCI7XG4gIFNwZWNpYWxUYXJnZXRzW1wiSW50ZXJuYWxcIl0gPSBcIiNfaW50ZXJuYWxcIjtcbn0pKFNwZWNpYWxUYXJnZXRzIHx8IChTcGVjaWFsVGFyZ2V0cyA9IHt9KSk7XG5cbmV4cG9ydCB7IEFjdGlvblR5cGVzLCBTcGVjaWFsVGFyZ2V0cyB9O1xuIiwiaW1wb3J0IHsgX192YWx1ZXMsIF9fc3ByZWFkQXJyYXksIF9fcmVhZCwgX19hc3NpZ24gfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBTcGVjaWFsVGFyZ2V0cyB9IGZyb20gJy4vdHlwZXMuanMnO1xuaW1wb3J0IHsgcmFpc2UsIHNlbmQgfSBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmltcG9ydCB7IERFRkFVTFRfR1VBUkRfVFlQRSwgVEFSR0VUTEVTU19LRVksIFNUQVRFX0RFTElNSVRFUiB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcblxudmFyIF9hO1xuZnVuY3Rpb24ga2V5cyh2YWx1ZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXModmFsdWUpO1xufVxuZnVuY3Rpb24gbWF0Y2hlc1N0YXRlKHBhcmVudFN0YXRlSWQsIGNoaWxkU3RhdGVJZCwgZGVsaW1pdGVyKSB7XG4gIGlmIChkZWxpbWl0ZXIgPT09IHZvaWQgMCkge1xuICAgIGRlbGltaXRlciA9IFNUQVRFX0RFTElNSVRFUjtcbiAgfVxuXG4gIHZhciBwYXJlbnRTdGF0ZVZhbHVlID0gdG9TdGF0ZVZhbHVlKHBhcmVudFN0YXRlSWQsIGRlbGltaXRlcik7XG4gIHZhciBjaGlsZFN0YXRlVmFsdWUgPSB0b1N0YXRlVmFsdWUoY2hpbGRTdGF0ZUlkLCBkZWxpbWl0ZXIpO1xuXG4gIGlmIChpc1N0cmluZyhjaGlsZFN0YXRlVmFsdWUpKSB7XG4gICAgaWYgKGlzU3RyaW5nKHBhcmVudFN0YXRlVmFsdWUpKSB7XG4gICAgICByZXR1cm4gY2hpbGRTdGF0ZVZhbHVlID09PSBwYXJlbnRTdGF0ZVZhbHVlO1xuICAgIH0gLy8gUGFyZW50IG1vcmUgc3BlY2lmaWMgdGhhbiBjaGlsZFxuXG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoaXNTdHJpbmcocGFyZW50U3RhdGVWYWx1ZSkpIHtcbiAgICByZXR1cm4gcGFyZW50U3RhdGVWYWx1ZSBpbiBjaGlsZFN0YXRlVmFsdWU7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMocGFyZW50U3RhdGVWYWx1ZSkuZXZlcnkoZnVuY3Rpb24gKGtleSkge1xuICAgIGlmICghKGtleSBpbiBjaGlsZFN0YXRlVmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoZXNTdGF0ZShwYXJlbnRTdGF0ZVZhbHVlW2tleV0sIGNoaWxkU3RhdGVWYWx1ZVtrZXldKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBnZXRFdmVudFR5cGUoZXZlbnQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXNTdHJpbmcoZXZlbnQpIHx8IHR5cGVvZiBldmVudCA9PT0gJ251bWJlcicgPyBcIlwiLmNvbmNhdChldmVudCkgOiBldmVudC50eXBlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudHMgbXVzdCBiZSBzdHJpbmdzIG9yIG9iamVjdHMgd2l0aCBhIHN0cmluZyBldmVudC50eXBlIHByb3BlcnR5LicpO1xuICB9XG59XG5mdW5jdGlvbiBnZXRBY3Rpb25UeXBlKGFjdGlvbikge1xuICB0cnkge1xuICAgIHJldHVybiBpc1N0cmluZyhhY3Rpb24pIHx8IHR5cGVvZiBhY3Rpb24gPT09ICdudW1iZXInID8gXCJcIi5jb25jYXQoYWN0aW9uKSA6IGlzRnVuY3Rpb24oYWN0aW9uKSA/IGFjdGlvbi5uYW1lIDogYWN0aW9uLnR5cGU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FjdGlvbnMgbXVzdCBiZSBzdHJpbmdzIG9yIG9iamVjdHMgd2l0aCBhIHN0cmluZyBhY3Rpb24udHlwZSBwcm9wZXJ0eS4nKTtcbiAgfVxufVxuZnVuY3Rpb24gdG9TdGF0ZVBhdGgoc3RhdGVJZCwgZGVsaW1pdGVyKSB7XG4gIHRyeSB7XG4gICAgaWYgKGlzQXJyYXkoc3RhdGVJZCkpIHtcbiAgICAgIHJldHVybiBzdGF0ZUlkO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZUlkLnRvU3RyaW5nKCkuc3BsaXQoZGVsaW1pdGVyKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIidcIi5jb25jYXQoc3RhdGVJZCwgXCInIGlzIG5vdCBhIHZhbGlkIHN0YXRlIHBhdGguXCIpKTtcbiAgfVxufVxuZnVuY3Rpb24gaXNTdGF0ZUxpa2Uoc3RhdGUpIHtcbiAgcmV0dXJuIHR5cGVvZiBzdGF0ZSA9PT0gJ29iamVjdCcgJiYgJ3ZhbHVlJyBpbiBzdGF0ZSAmJiAnY29udGV4dCcgaW4gc3RhdGUgJiYgJ2V2ZW50JyBpbiBzdGF0ZSAmJiAnX2V2ZW50JyBpbiBzdGF0ZTtcbn1cbmZ1bmN0aW9uIHRvU3RhdGVWYWx1ZShzdGF0ZVZhbHVlLCBkZWxpbWl0ZXIpIHtcbiAgaWYgKGlzU3RhdGVMaWtlKHN0YXRlVmFsdWUpKSB7XG4gICAgcmV0dXJuIHN0YXRlVmFsdWUudmFsdWU7XG4gIH1cblxuICBpZiAoaXNBcnJheShzdGF0ZVZhbHVlKSkge1xuICAgIHJldHVybiBwYXRoVG9TdGF0ZVZhbHVlKHN0YXRlVmFsdWUpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBzdGF0ZVZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBzdGF0ZVZhbHVlO1xuICB9XG5cbiAgdmFyIHN0YXRlUGF0aCA9IHRvU3RhdGVQYXRoKHN0YXRlVmFsdWUsIGRlbGltaXRlcik7XG4gIHJldHVybiBwYXRoVG9TdGF0ZVZhbHVlKHN0YXRlUGF0aCk7XG59XG5mdW5jdGlvbiBwYXRoVG9TdGF0ZVZhbHVlKHN0YXRlUGF0aCkge1xuICBpZiAoc3RhdGVQYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBzdGF0ZVBhdGhbMF07XG4gIH1cblxuICB2YXIgdmFsdWUgPSB7fTtcbiAgdmFyIG1hcmtlciA9IHZhbHVlO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVQYXRoLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIGlmIChpID09PSBzdGF0ZVBhdGgubGVuZ3RoIC0gMikge1xuICAgICAgbWFya2VyW3N0YXRlUGF0aFtpXV0gPSBzdGF0ZVBhdGhbaSArIDFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYXJrZXJbc3RhdGVQYXRoW2ldXSA9IHt9O1xuICAgICAgbWFya2VyID0gbWFya2VyW3N0YXRlUGF0aFtpXV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gbWFwVmFsdWVzKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgdmFyIGNvbGxlY3Rpb25LZXlzID0gT2JqZWN0LmtleXMoY29sbGVjdGlvbik7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xsZWN0aW9uS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBjb2xsZWN0aW9uS2V5c1tpXTtcbiAgICByZXN1bHRba2V5XSA9IGl0ZXJhdGVlKGNvbGxlY3Rpb25ba2V5XSwga2V5LCBjb2xsZWN0aW9uLCBpKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtYXBGaWx0ZXJWYWx1ZXMoY29sbGVjdGlvbiwgaXRlcmF0ZWUsIHByZWRpY2F0ZSkge1xuICB2YXIgZV8xLCBfYTtcblxuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKGNvbGxlY3Rpb24pKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgdmFyIGtleSA9IF9jLnZhbHVlO1xuICAgICAgdmFyIGl0ZW0gPSBjb2xsZWN0aW9uW2tleV07XG5cbiAgICAgIGlmICghcHJlZGljYXRlKGl0ZW0pKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICByZXN1bHRba2V5XSA9IGl0ZXJhdGVlKGl0ZW0sIGtleSwgY29sbGVjdGlvbik7XG4gICAgfVxuICB9IGNhdGNoIChlXzFfMSkge1xuICAgIGVfMSA9IHtcbiAgICAgIGVycm9yOiBlXzFfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcclxuICogUmV0cmlldmVzIGEgdmFsdWUgYXQgdGhlIGdpdmVuIHBhdGguXHJcbiAqIEBwYXJhbSBwcm9wcyBUaGUgZGVlcCBwYXRoIHRvIHRoZSBwcm9wIG9mIHRoZSBkZXNpcmVkIHZhbHVlXHJcbiAqL1xuXG52YXIgcGF0aCA9IGZ1bmN0aW9uIChwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHZhciBlXzIsIF9hO1xuXG4gICAgdmFyIHJlc3VsdCA9IG9iamVjdDtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBwcm9wc18xID0gX192YWx1ZXMocHJvcHMpLCBwcm9wc18xXzEgPSBwcm9wc18xLm5leHQoKTsgIXByb3BzXzFfMS5kb25lOyBwcm9wc18xXzEgPSBwcm9wc18xLm5leHQoKSkge1xuICAgICAgICB2YXIgcHJvcCA9IHByb3BzXzFfMS52YWx1ZTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0W3Byb3BdO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMl8xKSB7XG4gICAgICBlXzIgPSB7XG4gICAgICAgIGVycm9yOiBlXzJfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHByb3BzXzFfMSAmJiAhcHJvcHNfMV8xLmRvbmUgJiYgKF9hID0gcHJvcHNfMS5yZXR1cm4pKSBfYS5jYWxsKHByb3BzXzEpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuLyoqXHJcbiAqIFJldHJpZXZlcyBhIHZhbHVlIGF0IHRoZSBnaXZlbiBwYXRoIHZpYSB0aGUgbmVzdGVkIGFjY2Vzc29yIHByb3AuXHJcbiAqIEBwYXJhbSBwcm9wcyBUaGUgZGVlcCBwYXRoIHRvIHRoZSBwcm9wIG9mIHRoZSBkZXNpcmVkIHZhbHVlXHJcbiAqL1xuXG5mdW5jdGlvbiBuZXN0ZWRQYXRoKHByb3BzLCBhY2Nlc3NvclByb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICB2YXIgZV8zLCBfYTtcblxuICAgIHZhciByZXN1bHQgPSBvYmplY3Q7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgcHJvcHNfMiA9IF9fdmFsdWVzKHByb3BzKSwgcHJvcHNfMl8xID0gcHJvcHNfMi5uZXh0KCk7ICFwcm9wc18yXzEuZG9uZTsgcHJvcHNfMl8xID0gcHJvcHNfMi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIHByb3AgPSBwcm9wc18yXzEudmFsdWU7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdFthY2Nlc3NvclByb3BdW3Byb3BdO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfM18xKSB7XG4gICAgICBlXzMgPSB7XG4gICAgICAgIGVycm9yOiBlXzNfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHByb3BzXzJfMSAmJiAhcHJvcHNfMl8xLmRvbmUgJiYgKF9hID0gcHJvcHNfMi5yZXR1cm4pKSBfYS5jYWxsKHByb3BzXzIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5mdW5jdGlvbiB0b1N0YXRlUGF0aHMoc3RhdGVWYWx1ZSkge1xuICBpZiAoIXN0YXRlVmFsdWUpIHtcbiAgICByZXR1cm4gW1tdXTtcbiAgfVxuXG4gIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgIHJldHVybiBbW3N0YXRlVmFsdWVdXTtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBmbGF0dGVuKE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIHN1YlN0YXRlVmFsdWUgPSBzdGF0ZVZhbHVlW2tleV07XG5cbiAgICBpZiAodHlwZW9mIHN1YlN0YXRlVmFsdWUgIT09ICdzdHJpbmcnICYmICghc3ViU3RhdGVWYWx1ZSB8fCAhT2JqZWN0LmtleXMoc3ViU3RhdGVWYWx1ZSkubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIFtba2V5XV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvU3RhdGVQYXRocyhzdGF0ZVZhbHVlW2tleV0pLm1hcChmdW5jdGlvbiAoc3ViUGF0aCkge1xuICAgICAgcmV0dXJuIFtrZXldLmNvbmNhdChzdWJQYXRoKTtcbiAgICB9KTtcbiAgfSkpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gcGF0aHNUb1N0YXRlVmFsdWUocGF0aHMpIHtcbiAgdmFyIGVfNCwgX2E7XG5cbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGlmIChwYXRocyAmJiBwYXRocy5sZW5ndGggPT09IDEgJiYgcGF0aHNbMF0ubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIHBhdGhzWzBdWzBdO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBwYXRoc18xID0gX192YWx1ZXMocGF0aHMpLCBwYXRoc18xXzEgPSBwYXRoc18xLm5leHQoKTsgIXBhdGhzXzFfMS5kb25lOyBwYXRoc18xXzEgPSBwYXRoc18xLm5leHQoKSkge1xuICAgICAgdmFyIGN1cnJlbnRQYXRoID0gcGF0aHNfMV8xLnZhbHVlO1xuICAgICAgdmFyIG1hcmtlciA9IHJlc3VsdDsgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci1mb3Itb2ZcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50UGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc3ViUGF0aCA9IGN1cnJlbnRQYXRoW2ldO1xuXG4gICAgICAgIGlmIChpID09PSBjdXJyZW50UGF0aC5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgbWFya2VyW3N1YlBhdGhdID0gY3VycmVudFBhdGhbaSArIDFdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFya2VyW3N1YlBhdGhdID0gbWFya2VyW3N1YlBhdGhdIHx8IHt9O1xuICAgICAgICBtYXJrZXIgPSBtYXJrZXJbc3ViUGF0aF07XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzRfMSkge1xuICAgIGVfNCA9IHtcbiAgICAgIGVycm9yOiBlXzRfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChwYXRoc18xXzEgJiYgIXBhdGhzXzFfMS5kb25lICYmIChfYSA9IHBhdGhzXzEucmV0dXJuKSkgX2EuY2FsbChwYXRoc18xKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNCkgdGhyb3cgZV80LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBmbGF0dGVuKGFycmF5KSB7XG4gIHZhciBfYTtcblxuICByZXR1cm4gKF9hID0gW10pLmNvbmNhdC5hcHBseShfYSwgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGFycmF5KSwgZmFsc2UpKTtcbn1cbmZ1bmN0aW9uIHRvQXJyYXlTdHJpY3QodmFsdWUpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIFt2YWx1ZV07XG59XG5mdW5jdGlvbiB0b0FycmF5KHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcmV0dXJuIHRvQXJyYXlTdHJpY3QodmFsdWUpO1xufVxuZnVuY3Rpb24gbWFwQ29udGV4dChtYXBwZXIsIGNvbnRleHQsIF9ldmVudCkge1xuICB2YXIgZV81LCBfYTtcblxuICBpZiAoaXNGdW5jdGlvbihtYXBwZXIpKSB7XG4gICAgcmV0dXJuIG1hcHBlcihjb250ZXh0LCBfZXZlbnQuZGF0YSk7XG4gIH1cblxuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKG1hcHBlcikpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICB2YXIga2V5ID0gX2MudmFsdWU7XG4gICAgICB2YXIgc3ViTWFwcGVyID0gbWFwcGVyW2tleV07XG5cbiAgICAgIGlmIChpc0Z1bmN0aW9uKHN1Yk1hcHBlcikpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBzdWJNYXBwZXIoY29udGV4dCwgX2V2ZW50LmRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBzdWJNYXBwZXI7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzVfMSkge1xuICAgIGVfNSA9IHtcbiAgICAgIGVycm9yOiBlXzVfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNSkgdGhyb3cgZV81LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBpc0J1aWx0SW5FdmVudChldmVudFR5cGUpIHtcbiAgcmV0dXJuIC9eKGRvbmV8ZXJyb3IpXFwuLy50ZXN0KGV2ZW50VHlwZSk7XG59XG5mdW5jdGlvbiBpc1Byb21pc2VMaWtlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSAvLyBDaGVjayBpZiBzaGFwZSBtYXRjaGVzIHRoZSBQcm9taXNlL0ErIHNwZWNpZmljYXRpb24gZm9yIGEgXCJ0aGVuYWJsZVwiLlxuXG5cbiAgaWYgKHZhbHVlICE9PSBudWxsICYmIChpc0Z1bmN0aW9uKHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSAmJiBpc0Z1bmN0aW9uKHZhbHVlLnRoZW4pKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBpc0JlaGF2aW9yKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICd0cmFuc2l0aW9uJyBpbiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudHJhbnNpdGlvbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIHBhcnRpdGlvbihpdGVtcywgcHJlZGljYXRlKSB7XG4gIHZhciBlXzYsIF9hO1xuXG4gIHZhciBfYiA9IF9fcmVhZChbW10sIFtdXSwgMiksXG4gICAgICB0cnV0aHkgPSBfYlswXSxcbiAgICAgIGZhbHN5ID0gX2JbMV07XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpdGVtc18xID0gX192YWx1ZXMoaXRlbXMpLCBpdGVtc18xXzEgPSBpdGVtc18xLm5leHQoKTsgIWl0ZW1zXzFfMS5kb25lOyBpdGVtc18xXzEgPSBpdGVtc18xLm5leHQoKSkge1xuICAgICAgdmFyIGl0ZW0gPSBpdGVtc18xXzEudmFsdWU7XG5cbiAgICAgIGlmIChwcmVkaWNhdGUoaXRlbSkpIHtcbiAgICAgICAgdHJ1dGh5LnB1c2goaXRlbSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmYWxzeS5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV82XzEpIHtcbiAgICBlXzYgPSB7XG4gICAgICBlcnJvcjogZV82XzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoaXRlbXNfMV8xICYmICFpdGVtc18xXzEuZG9uZSAmJiAoX2EgPSBpdGVtc18xLnJldHVybikpIF9hLmNhbGwoaXRlbXNfMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzYpIHRocm93IGVfNi5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gW3RydXRoeSwgZmFsc3ldO1xufVxuZnVuY3Rpb24gdXBkYXRlSGlzdG9yeVN0YXRlcyhoaXN0LCBzdGF0ZVZhbHVlKSB7XG4gIHJldHVybiBtYXBWYWx1ZXMoaGlzdC5zdGF0ZXMsIGZ1bmN0aW9uIChzdWJIaXN0LCBrZXkpIHtcbiAgICBpZiAoIXN1Ykhpc3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIHN1YlN0YXRlVmFsdWUgPSAoaXNTdHJpbmcoc3RhdGVWYWx1ZSkgPyB1bmRlZmluZWQgOiBzdGF0ZVZhbHVlW2tleV0pIHx8IChzdWJIaXN0ID8gc3ViSGlzdC5jdXJyZW50IDogdW5kZWZpbmVkKTtcblxuICAgIGlmICghc3ViU3RhdGVWYWx1ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudDogc3ViU3RhdGVWYWx1ZSxcbiAgICAgIHN0YXRlczogdXBkYXRlSGlzdG9yeVN0YXRlcyhzdWJIaXN0LCBzdWJTdGF0ZVZhbHVlKVxuICAgIH07XG4gIH0pO1xufVxuZnVuY3Rpb24gdXBkYXRlSGlzdG9yeVZhbHVlKGhpc3QsIHN0YXRlVmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBjdXJyZW50OiBzdGF0ZVZhbHVlLFxuICAgIHN0YXRlczogdXBkYXRlSGlzdG9yeVN0YXRlcyhoaXN0LCBzdGF0ZVZhbHVlKVxuICB9O1xufVxuZnVuY3Rpb24gdXBkYXRlQ29udGV4dChjb250ZXh0LCBfZXZlbnQsIGFzc2lnbkFjdGlvbnMsIHN0YXRlKSB7XG4gIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgIHdhcm4oISFjb250ZXh0LCAnQXR0ZW1wdGluZyB0byB1cGRhdGUgdW5kZWZpbmVkIGNvbnRleHQnKTtcbiAgfVxuXG4gIHZhciB1cGRhdGVkQ29udGV4dCA9IGNvbnRleHQgPyBhc3NpZ25BY3Rpb25zLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBhc3NpZ25BY3Rpb24pIHtcbiAgICB2YXIgZV83LCBfYTtcblxuICAgIHZhciBhc3NpZ25tZW50ID0gYXNzaWduQWN0aW9uLmFzc2lnbm1lbnQ7XG4gICAgdmFyIG1ldGEgPSB7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBhY3Rpb246IGFzc2lnbkFjdGlvbixcbiAgICAgIF9ldmVudDogX2V2ZW50XG4gICAgfTtcbiAgICB2YXIgcGFydGlhbFVwZGF0ZSA9IHt9O1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oYXNzaWdubWVudCkpIHtcbiAgICAgIHBhcnRpYWxVcGRhdGUgPSBhc3NpZ25tZW50KGFjYywgX2V2ZW50LmRhdGEsIG1ldGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKGFzc2lnbm1lbnQpKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICAgIHZhciBrZXkgPSBfYy52YWx1ZTtcbiAgICAgICAgICB2YXIgcHJvcEFzc2lnbm1lbnQgPSBhc3NpZ25tZW50W2tleV07XG4gICAgICAgICAgcGFydGlhbFVwZGF0ZVtrZXldID0gaXNGdW5jdGlvbihwcm9wQXNzaWdubWVudCkgPyBwcm9wQXNzaWdubWVudChhY2MsIF9ldmVudC5kYXRhLCBtZXRhKSA6IHByb3BBc3NpZ25tZW50O1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlXzdfMSkge1xuICAgICAgICBlXzcgPSB7XG4gICAgICAgICAgZXJyb3I6IGVfN18xXG4gICAgICAgIH07XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoZV83KSB0aHJvdyBlXzcuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYWNjLCBwYXJ0aWFsVXBkYXRlKTtcbiAgfSwgY29udGV4dCkgOiBjb250ZXh0O1xuICByZXR1cm4gdXBkYXRlZENvbnRleHQ7XG59IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1lbXB0eVxuXG52YXIgd2FybiA9IGZ1bmN0aW9uICgpIHt9O1xuXG5pZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgd2FybiA9IGZ1bmN0aW9uIChjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgICB2YXIgZXJyb3IgPSBjb25kaXRpb24gaW5zdGFuY2VvZiBFcnJvciA/IGNvbmRpdGlvbiA6IHVuZGVmaW5lZDtcblxuICAgIGlmICghZXJyb3IgJiYgY29uZGl0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbnNvbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXCJXYXJuaW5nOiBcIi5jb25jYXQobWVzc2FnZSldO1xuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgYXJncy5wdXNoKGVycm9yKTtcbiAgICAgIH0gLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcblxuXG4gICAgICBjb25zb2xlLndhcm4uYXBwbHkoY29uc29sZSwgYXJncyk7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gaXNBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG59IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpiYW4tdHlwZXNcblxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG59XG5mdW5jdGlvbiB0b0d1YXJkKGNvbmRpdGlvbiwgZ3VhcmRNYXApIHtcbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKGlzU3RyaW5nKGNvbmRpdGlvbikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogREVGQVVMVF9HVUFSRF9UWVBFLFxuICAgICAgbmFtZTogY29uZGl0aW9uLFxuICAgICAgcHJlZGljYXRlOiBndWFyZE1hcCA/IGd1YXJkTWFwW2NvbmRpdGlvbl0gOiB1bmRlZmluZWRcbiAgICB9O1xuICB9XG5cbiAgaWYgKGlzRnVuY3Rpb24oY29uZGl0aW9uKSkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBERUZBVUxUX0dVQVJEX1RZUEUsXG4gICAgICBuYW1lOiBjb25kaXRpb24ubmFtZSxcbiAgICAgIHByZWRpY2F0ZTogY29uZGl0aW9uXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBjb25kaXRpb247XG59XG5mdW5jdGlvbiBpc09ic2VydmFibGUodmFsdWUpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gJ3N1YnNjcmliZScgaW4gdmFsdWUgJiYgaXNGdW5jdGlvbih2YWx1ZS5zdWJzY3JpYmUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG52YXIgc3ltYm9sT2JzZXJ2YWJsZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5vYnNlcnZhYmxlIHx8ICdAQG9ic2VydmFibGUnO1xufSgpOyAvLyBUT0RPOiB0byBiZSByZW1vdmVkIGluIHY1LCBsZWZ0IGl0IG91dCBqdXN0IHRvIG1pbmltaXplIHRoZSBzY29wZSBvZiB0aGUgY2hhbmdlIGFuZCBtYWludGFpbiBjb21wYXRpYmlsaXR5IHdpdGggb2xkZXIgdmVyc2lvbnMgb2YgaW50ZWdyYXRpb24gcGFhY2thZ2VzXG5cbnZhciBpbnRlcm9wU3ltYm9scyA9IChfYSA9IHt9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59LCBfYVtTeW1ib2wub2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufSwgX2EpO1xuZnVuY3Rpb24gaXNNYWNoaW5lKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmICdfX3hzdGF0ZW5vZGUnIGluIHZhbHVlO1xufVxuZnVuY3Rpb24gaXNBY3Rvcih2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUuc2VuZCA9PT0gJ2Z1bmN0aW9uJztcbn1cbnZhciB1bmlxdWVJZCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIHZhciBjdXJyZW50SWQgPSAwO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGN1cnJlbnRJZCsrO1xuICAgIHJldHVybiBjdXJyZW50SWQudG9TdHJpbmcoMTYpO1xuICB9O1xufSgpO1xuZnVuY3Rpb24gdG9FdmVudE9iamVjdChldmVudCwgcGF5bG9hZCAvLyBpZD86IFRFdmVudFsndHlwZSddXG4pIHtcbiAgaWYgKGlzU3RyaW5nKGV2ZW50KSB8fCB0eXBlb2YgZXZlbnQgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIF9fYXNzaWduKHtcbiAgICAgIHR5cGU6IGV2ZW50XG4gICAgfSwgcGF5bG9hZCk7XG4gIH1cblxuICByZXR1cm4gZXZlbnQ7XG59XG5mdW5jdGlvbiB0b1NDWE1MRXZlbnQoZXZlbnQsIHNjeG1sRXZlbnQpIHtcbiAgaWYgKCFpc1N0cmluZyhldmVudCkgJiYgJyQkdHlwZScgaW4gZXZlbnQgJiYgZXZlbnQuJCR0eXBlID09PSAnc2N4bWwnKSB7XG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgdmFyIGV2ZW50T2JqZWN0ID0gdG9FdmVudE9iamVjdChldmVudCk7XG4gIHJldHVybiBfX2Fzc2lnbih7XG4gICAgbmFtZTogZXZlbnRPYmplY3QudHlwZSxcbiAgICBkYXRhOiBldmVudE9iamVjdCxcbiAgICAkJHR5cGU6ICdzY3htbCcsXG4gICAgdHlwZTogJ2V4dGVybmFsJ1xuICB9LCBzY3htbEV2ZW50KTtcbn1cbmZ1bmN0aW9uIHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KGV2ZW50LCBjb25maWdMaWtlKSB7XG4gIHZhciB0cmFuc2l0aW9ucyA9IHRvQXJyYXlTdHJpY3QoY29uZmlnTGlrZSkubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uTGlrZSkge1xuICAgIGlmICh0eXBlb2YgdHJhbnNpdGlvbkxpa2UgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB0cmFuc2l0aW9uTGlrZSA9PT0gJ3N0cmluZycgfHwgaXNNYWNoaW5lKHRyYW5zaXRpb25MaWtlKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGFyZ2V0OiB0cmFuc2l0aW9uTGlrZSxcbiAgICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdHJhbnNpdGlvbkxpa2UpLCB7XG4gICAgICBldmVudDogZXZlbnRcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiB0cmFuc2l0aW9ucztcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gVEFSR0VUTEVTU19LRVkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHRvQXJyYXkodGFyZ2V0KTtcbn1cbmZ1bmN0aW9uIHJlcG9ydFVuaGFuZGxlZEV4Y2VwdGlvbk9uSW52b2NhdGlvbihvcmlnaW5hbEVycm9yLCBjdXJyZW50RXJyb3IsIGlkKSB7XG4gIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgIHZhciBvcmlnaW5hbFN0YWNrVHJhY2UgPSBvcmlnaW5hbEVycm9yLnN0YWNrID8gXCIgU3RhY2t0cmFjZSB3YXMgJ1wiLmNvbmNhdChvcmlnaW5hbEVycm9yLnN0YWNrLCBcIidcIikgOiAnJztcblxuICAgIGlmIChvcmlnaW5hbEVycm9yID09PSBjdXJyZW50RXJyb3IpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmVycm9yKFwiTWlzc2luZyBvbkVycm9yIGhhbmRsZXIgZm9yIGludm9jYXRpb24gJ1wiLmNvbmNhdChpZCwgXCInLCBlcnJvciB3YXMgJ1wiKS5jb25jYXQob3JpZ2luYWxFcnJvciwgXCInLlwiKS5jb25jYXQob3JpZ2luYWxTdGFja1RyYWNlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFja1RyYWNlID0gY3VycmVudEVycm9yLnN0YWNrID8gXCIgU3RhY2t0cmFjZSB3YXMgJ1wiLmNvbmNhdChjdXJyZW50RXJyb3Iuc3RhY2ssIFwiJ1wiKSA6ICcnOyAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuXG4gICAgICBjb25zb2xlLmVycm9yKFwiTWlzc2luZyBvbkVycm9yIGhhbmRsZXIgYW5kL29yIHVuaGFuZGxlZCBleGNlcHRpb24vcHJvbWlzZSByZWplY3Rpb24gZm9yIGludm9jYXRpb24gJ1wiLmNvbmNhdChpZCwgXCInLiBcIikgKyBcIk9yaWdpbmFsIGVycm9yOiAnXCIuY29uY2F0KG9yaWdpbmFsRXJyb3IsIFwiJy4gXCIpLmNvbmNhdChvcmlnaW5hbFN0YWNrVHJhY2UsIFwiIEN1cnJlbnQgZXJyb3IgaXMgJ1wiKS5jb25jYXQoY3VycmVudEVycm9yLCBcIicuXCIpLmNvbmNhdChzdGFja1RyYWNlKSk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBldmFsdWF0ZUd1YXJkKG1hY2hpbmUsIGd1YXJkLCBjb250ZXh0LCBfZXZlbnQsIHN0YXRlKSB7XG4gIHZhciBndWFyZHMgPSBtYWNoaW5lLm9wdGlvbnMuZ3VhcmRzO1xuICB2YXIgZ3VhcmRNZXRhID0ge1xuICAgIHN0YXRlOiBzdGF0ZSxcbiAgICBjb25kOiBndWFyZCxcbiAgICBfZXZlbnQ6IF9ldmVudFxuICB9OyAvLyBUT0RPOiBkbyBub3QgaGFyZGNvZGUhXG5cbiAgaWYgKGd1YXJkLnR5cGUgPT09IERFRkFVTFRfR1VBUkRfVFlQRSkge1xuICAgIHJldHVybiAoKGd1YXJkcyA9PT0gbnVsbCB8fCBndWFyZHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGd1YXJkc1tndWFyZC5uYW1lXSkgfHwgZ3VhcmQucHJlZGljYXRlKShjb250ZXh0LCBfZXZlbnQuZGF0YSwgZ3VhcmRNZXRhKTtcbiAgfVxuXG4gIHZhciBjb25kRm4gPSBndWFyZHMgPT09IG51bGwgfHwgZ3VhcmRzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBndWFyZHNbZ3VhcmQudHlwZV07XG5cbiAgaWYgKCFjb25kRm4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJHdWFyZCAnXCIuY29uY2F0KGd1YXJkLnR5cGUsIFwiJyBpcyBub3QgaW1wbGVtZW50ZWQgb24gbWFjaGluZSAnXCIpLmNvbmNhdChtYWNoaW5lLmlkLCBcIicuXCIpKTtcbiAgfVxuXG4gIHJldHVybiBjb25kRm4oY29udGV4dCwgX2V2ZW50LmRhdGEsIGd1YXJkTWV0YSk7XG59XG5mdW5jdGlvbiB0b0ludm9rZVNvdXJjZShzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHNyY1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gc3JjO1xufVxuZnVuY3Rpb24gdG9PYnNlcnZlcihuZXh0SGFuZGxlciwgZXJyb3JIYW5kbGVyLCBjb21wbGV0aW9uSGFuZGxlcikge1xuICB2YXIgbm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gIHZhciBpc09ic2VydmVyID0gdHlwZW9mIG5leHRIYW5kbGVyID09PSAnb2JqZWN0JztcbiAgdmFyIHNlbGYgPSBpc09ic2VydmVyID8gbmV4dEhhbmRsZXIgOiBudWxsO1xuICByZXR1cm4ge1xuICAgIG5leHQ6ICgoaXNPYnNlcnZlciA/IG5leHRIYW5kbGVyLm5leHQgOiBuZXh0SGFuZGxlcikgfHwgbm9vcCkuYmluZChzZWxmKSxcbiAgICBlcnJvcjogKChpc09ic2VydmVyID8gbmV4dEhhbmRsZXIuZXJyb3IgOiBlcnJvckhhbmRsZXIpIHx8IG5vb3ApLmJpbmQoc2VsZiksXG4gICAgY29tcGxldGU6ICgoaXNPYnNlcnZlciA/IG5leHRIYW5kbGVyLmNvbXBsZXRlIDogY29tcGxldGlvbkhhbmRsZXIpIHx8IG5vb3ApLmJpbmQoc2VsZilcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUludm9rZUlkKHN0YXRlTm9kZUlkLCBpbmRleCkge1xuICByZXR1cm4gXCJcIi5jb25jYXQoc3RhdGVOb2RlSWQsIFwiOmludm9jYXRpb25bXCIpLmNvbmNhdChpbmRleCwgXCJdXCIpO1xufVxuZnVuY3Rpb24gaXNSYWlzYWJsZUFjdGlvbihhY3Rpb24pIHtcbiAgcmV0dXJuIChhY3Rpb24udHlwZSA9PT0gcmFpc2UgfHwgYWN0aW9uLnR5cGUgPT09IHNlbmQgJiYgYWN0aW9uLnRvID09PSBTcGVjaWFsVGFyZ2V0cy5JbnRlcm5hbCkgJiYgdHlwZW9mIGFjdGlvbi5kZWxheSAhPT0gJ251bWJlcic7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZUludm9rZUlkLCBldmFsdWF0ZUd1YXJkLCBmbGF0dGVuLCBnZXRBY3Rpb25UeXBlLCBnZXRFdmVudFR5cGUsIGludGVyb3BTeW1ib2xzLCBpc0FjdG9yLCBpc0FycmF5LCBpc0JlaGF2aW9yLCBpc0J1aWx0SW5FdmVudCwgaXNGdW5jdGlvbiwgaXNNYWNoaW5lLCBpc09ic2VydmFibGUsIGlzUHJvbWlzZUxpa2UsIGlzUmFpc2FibGVBY3Rpb24sIGlzU3RhdGVMaWtlLCBpc1N0cmluZywga2V5cywgbWFwQ29udGV4dCwgbWFwRmlsdGVyVmFsdWVzLCBtYXBWYWx1ZXMsIG1hdGNoZXNTdGF0ZSwgbmVzdGVkUGF0aCwgbm9ybWFsaXplVGFyZ2V0LCBwYXJ0aXRpb24sIHBhdGgsIHBhdGhUb1N0YXRlVmFsdWUsIHBhdGhzVG9TdGF0ZVZhbHVlLCByZXBvcnRVbmhhbmRsZWRFeGNlcHRpb25Pbkludm9jYXRpb24sIHN5bWJvbE9ic2VydmFibGUsIHRvQXJyYXksIHRvQXJyYXlTdHJpY3QsIHRvRXZlbnRPYmplY3QsIHRvR3VhcmQsIHRvSW52b2tlU291cmNlLCB0b09ic2VydmVyLCB0b1NDWE1MRXZlbnQsIHRvU3RhdGVQYXRoLCB0b1N0YXRlUGF0aHMsIHRvU3RhdGVWYWx1ZSwgdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXksIHVuaXF1ZUlkLCB1cGRhdGVDb250ZXh0LCB1cGRhdGVIaXN0b3J5U3RhdGVzLCB1cGRhdGVIaXN0b3J5VmFsdWUsIHdhcm4gfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBpbXBvcnQgc3RhdGUgbWFjaGluZXMgZm9yIGF1ZGlvIGlucHV0IGFuZCBvdXRwdXRcbmNvbnN0IHsgaW50ZXJwcmV0IH0gPSByZXF1aXJlKFwieHN0YXRlXCIpO1xuLy9jb25zdCBhdWRpb0lucHV0TWFjaGluZSA9IHJlcXVpcmUoXCIuL3N0YXRlLW1hY2hpbmVzL0F1ZGlvSW5wdXRNYWNoaW5lXCIpO1xuY29uc3QgeyBhdWRpb091dHB1dE1hY2hpbmUgfSA9IHJlcXVpcmUoXCIuL3N0YXRlLW1hY2hpbmVzL0F1ZGlvT3V0cHV0TWFjaGluZVwiKTtcblxuLy8gZGVwZW5kcyBvbiB0aGUgaW5qZWN0aW5nIHNjcmlwdCAoc2F5cGkuaW5kZXguanMpIGRlY2xhcmluZyB0aGUgRXZlbnRCdXMgYXMgYSBnbG9iYWwgdmFyaWFibGVcbmNvbnN0IEV2ZW50QnVzID0gd2luZG93LkV2ZW50QnVzO1xuXG4vLyBhdWRpbyBvdXRwdXQgKFBpKVxuY29uc3QgYXVkaW9FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImF1ZGlvXCIpO1xuaWYgKCFhdWRpb0VsZW1lbnQpIHtcbiAgY29uc29sZS5lcnJvcihcIkF1ZGlvIGVsZW1lbnQgbm90IGZvdW5kIVwiKTtcbn0gZWxzZSB7XG4gIGF1ZGlvRWxlbWVudC5wcmVsb2FkID0gXCJhdXRvXCI7IC8vIGVuYWJsZSBhZ2dyZXNzaXZlIHByZWxvYWRpbmcgb2YgYXVkaW9cbn1cblxuLy8gZGVidWcgYXVkaW8gb3V0cHV0IG1hY2hpbmVcbmNvbnNvbGUubG9nKFwiQXVkaW8gT3V0cHV0IE1hY2hpbmVcIiwgYXVkaW9PdXRwdXRNYWNoaW5lKTtcblxuY29uc3QgYXVkaW9PdXRwdXRBY3RvciA9IGludGVycHJldChhdWRpb091dHB1dE1hY2hpbmUpXG4gIC5vblRyYW5zaXRpb24oKHN0YXRlKSA9PiBjb25zb2xlLmxvZyhzdGF0ZS52YWx1ZSkpXG4gIC5zdGFydCgpO1xuXG5mdW5jdGlvbiByZWdpc3RlckF1ZGlvUGxheWJhY2tFdmVudHMoYXVkaW8sIGFjdG9yKSB7XG4gIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2Fkc3RhcnRcIiwgZnVuY3Rpb24gKCkge1xuICAgIGFjdG9yLnNlbmQoXCJsb2FkU3RhcnRcIik7XG4gIH0pO1xuXG4gIC8vIEludGVyY2VwdCBBdXRvcGxheSBFdmVudHMgKGNhbid0IGF1dG9wbGF5IGZ1bGwgYXVkaW8gb24gU2FmYXJpKVxuICBhdWRpby5hZGRFdmVudExpc3RlbmVyKFwicGxheVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgYWN0b3Iuc2VuZChcInBsYXlcIik7XG4gIH0pO1xuXG4gIC8vIEV2ZW50IGxpc3RlbmVycyBmb3IgZGV0ZWN0aW5nIHdoZW4gUGkgaXMgc3BlYWtpbmdcbiAgYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcihcInBsYXlpbmdcIiwgKCkgPT4ge1xuICAgIGFjdG9yLnNlbmQoXCJwbGF5XCIpO1xuICB9KTtcblxuICBhdWRpby5hZGRFdmVudExpc3RlbmVyKFwicGF1c2VcIiwgKCkgPT4ge1xuICAgIGFjdG9yLnNlbmQoXCJwYXVzZVwiKTtcbiAgfSk7XG5cbiAgYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcihcImVuZGVkXCIsICgpID0+IHtcbiAgICBhY3Rvci5zZW5kKFwiZW5kZWRcIik7XG4gIH0pO1xufVxucmVnaXN0ZXJBdWRpb1BsYXliYWNrRXZlbnRzKGF1ZGlvRWxlbWVudCwgYXVkaW9PdXRwdXRBY3Rvcik7XG5cbi8vIGF1ZGlvIGlucHV0ICh1c2VyKVxudmFyIGF1ZGlvRGF0YUNodW5rcyA9IFtdO1xudmFyIGF1ZGlvTWltZVR5cGUgPSBcImF1ZGlvL3dlYm07Y29kZWNzPW9wdXNcIjtcblxuLy8gRGVjbGFyZSBhIGdsb2JhbCB2YXJpYWJsZSBmb3IgdGhlIG1lZGlhUmVjb3JkZXJcbnZhciBtZWRpYVJlY29yZGVyO1xuY29uc3QgdGhyZXNob2xkID0gMTAwMDsgLy8gMTAwMCBtcyA9IDEgc2Vjb25kLCBhYm91dCB0aGUgbGVuZ3RoIG9mIFwiSGV5LCBQaVwiXG5cbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgJ2RhdGFhdmFpbGFibGUnIGV2ZW50IGZpcmVzXG5mdW5jdGlvbiBoYW5kbGVEYXRhQXZhaWxhYmxlKGUpIHtcbiAgLy8gQWRkIHRoZSBhdWRpbyBkYXRhIGNodW5rIHRvIHRoZSBhcnJheVxuICBhdWRpb0RhdGFDaHVua3MucHVzaChlLmRhdGEpO1xufVxuXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdzdG9wJyBldmVudCBmaXJlc1xuZnVuY3Rpb24gaGFuZGxlU3RvcCgpIHtcbiAgLy8gQ3JlYXRlIGEgQmxvYiBmcm9tIHRoZSBhdWRpbyBkYXRhIGNodW5rc1xuICB2YXIgYXVkaW9CbG9iID0gbmV3IEJsb2IoYXVkaW9EYXRhQ2h1bmtzLCB7IHR5cGU6IGF1ZGlvTWltZVR5cGUgfSk7XG5cbiAgLy8gR2V0IHRoZSBzdG9wIHRpbWUgYW5kIGNhbGN1bGF0ZSB0aGUgZHVyYXRpb25cbiAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcbiAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xuXG4gIC8vIElmIHRoZSBkdXJhdGlvbiBpcyBncmVhdGVyIHRoYW4gdGhlIHRocmVzaG9sZCwgdXBsb2FkIHRoZSBhdWRpbyBmb3IgdHJhbnNjcmlwdGlvblxuICBpZiAoZHVyYXRpb24gPj0gdGhyZXNob2xkKSB7XG4gICAgLy8gVXBsb2FkIHRoZSBhdWRpbyB0byB0aGUgc2VydmVyIGZvciB0cmFuc2NyaXB0aW9uXG4gICAgRXZlbnRCdXMuZW1pdChcInNheXBpOnVzZXJGaW5pc2hlZFNwZWFraW5nXCIsIHtcbiAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgIGJsb2I6IGF1ZGlvQmxvYixcbiAgICB9KTtcbiAgfVxuXG4gIC8vIENsZWFyIHRoZSBhcnJheSBmb3IgdGhlIG5leHQgcmVjb3JkaW5nXG4gIGF1ZGlvRGF0YUNodW5rcyA9IFtdO1xufVxuXG5mdW5jdGlvbiBzZXR1cFJlY29yZGluZyhjYWxsYmFjaykge1xuICBpZiAobWVkaWFSZWNvcmRlcikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEdldCBhIHN0cmVhbSBmcm9tIHRoZSB1c2VyJ3MgbWljcm9waG9uZVxuICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24gKHN0cmVhbSkge1xuICAgICAgaWYgKCFNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZChhdWRpb01pbWVUeXBlKSkge1xuICAgICAgICAvLyB1c2UgTVA0IGZvciBTYWZhcmlcbiAgICAgICAgYXVkaW9NaW1lVHlwZSA9IFwiYXVkaW8vbXA0XCI7XG4gICAgICB9XG4gICAgICAvLyBDcmVhdGUgYSBuZXcgTWVkaWFSZWNvcmRlciBvYmplY3QgdXNpbmcgdGhlIHN0cmVhbSBhbmQgc3BlY2lmeWluZyB0aGUgTUlNRSB0eXBlXG4gICAgICB2YXIgb3B0aW9ucyA9IHsgbWltZVR5cGU6IGF1ZGlvTWltZVR5cGUgfTtcbiAgICAgIG1lZGlhUmVjb3JkZXIgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0sIG9wdGlvbnMpO1xuXG4gICAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnRcbiAgICAgIG1lZGlhUmVjb3JkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImRhdGFhdmFpbGFibGVcIiwgaGFuZGxlRGF0YUF2YWlsYWJsZSk7XG5cbiAgICAgIC8vIExpc3RlbiBmb3IgdGhlICdzdG9wJyBldmVudFxuICAgICAgbWVkaWFSZWNvcmRlci5hZGRFdmVudExpc3RlbmVyKFwic3RvcFwiLCBoYW5kbGVTdG9wKTtcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIEludm9rZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBnZXR0aW5nIGF1ZGlvIHN0cmVhbTogXCIgKyBlcnIpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiB0ZWFyRG93blJlY29yZGluZygpIHtcbiAgLy8gQ2hlY2sgaWYgdGhlIE1lZGlhUmVjb3JkZXIgaXMgc2V0IHVwXG4gIGlmICghbWVkaWFSZWNvcmRlcikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFN0b3AgYW55IG9uZ29pbmcgcmVjb3JkaW5nXG4gIGlmIChtZWRpYVJlY29yZGVyLnN0YXRlID09PSBcInJlY29yZGluZ1wiKSB7XG4gICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XG4gIH1cblxuICAvLyBSZW1vdmUgdGhlIE1lZGlhUmVjb3JkZXIncyBldmVudCBsaXN0ZW5lcnNcbiAgbWVkaWFSZWNvcmRlci5yZW1vdmVFdmVudExpc3RlbmVyKFwiZGF0YWF2YWlsYWJsZVwiLCBoYW5kbGVEYXRhQXZhaWxhYmxlKTtcbiAgbWVkaWFSZWNvcmRlci5yZW1vdmVFdmVudExpc3RlbmVyKFwic3RvcFwiLCBoYW5kbGVTdG9wKTtcblxuICAvLyBDbGVhciB0aGUgTWVkaWFSZWNvcmRlciB2YXJpYWJsZVxuICBtZWRpYVJlY29yZGVyID0gbnVsbDtcbn1cblxuLy8gVG8gcmVxdWVzdCByZWNvcmRpbmcsIG90aGVyIG1vZHVsZXMgY2FuIGRpc3BhdGNoIGEgY3VzdG9tIGV2ZW50IGF1ZGlvOnN0YXJ0UmVjb3JkaW5nXG5mdW5jdGlvbiBzdGFydFJlY29yZGluZygpIHtcbiAgLy8gQ2hlY2sgaWYgdGhlIE1lZGlhUmVjb3JkZXIgaXMgc2V0IHVwXG4gIGlmICghbWVkaWFSZWNvcmRlcikge1xuICAgIHNldHVwUmVjb3JkaW5nKHN0YXJ0UmVjb3JkaW5nKTtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gQ2hlY2sgaWYgUGkgaXMgY3VycmVudGx5IHNwZWFraW5nIGFuZCBzdG9wIGhlciBhdWRpb1xuICBhdWRpb091dHB1dEFjdG9yLnNlbmQoXCJwYXVzZVwiKTtcblxuICAvLyBTdGFydCByZWNvcmRpbmdcbiAgbWVkaWFSZWNvcmRlci5zdGFydCgpO1xuXG4gIC8vIFJlY29yZCB0aGUgc3RhcnQgdGltZVxuICB3aW5kb3cuc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcblxuICBFdmVudEJ1cy5lbWl0KFwic2F5cGk6dXNlclNwZWFraW5nXCIpO1xufVxuXG4vLyBUbyBzdG9wIHJlY29yZGluZywgb3RoZXIgbW9kdWxlcyBjYW4gZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgYXVkaW86c3RvcFJlY29yZGluZ1xuZnVuY3Rpb24gc3RvcFJlY29yZGluZygpIHtcbiAgaWYgKG1lZGlhUmVjb3JkZXIgJiYgbWVkaWFSZWNvcmRlci5zdGF0ZSA9PT0gXCJyZWNvcmRpbmdcIikge1xuICAgIC8vIFN0b3AgcmVjb3JkaW5nXG4gICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XG5cbiAgICAvLyBSZWNvcmQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxuICAgIHZhciBzdG9wVGltZSA9IERhdGUubm93KCk7XG4gICAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xuXG4gICAgLy8gSWYgdGhlIGR1cmF0aW9uIGlzIGxlc3MgdGhhbiB0aGUgdGhyZXNob2xkLCBkb24ndCB1cGxvYWQgdGhlIGF1ZGlvIGZvciB0cmFuc2NyaXB0aW9uXG4gICAgaWYgKGR1cmF0aW9uIDwgdGhyZXNob2xkKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlJlY29yZGluZyB3YXMgdG9vIHNob3J0LCBub3QgdXBsb2FkaW5nIGZvciB0cmFuc2NyaXB0aW9uXCIpO1xuICAgICAgRXZlbnRCdXMuZW1pdChcInNheXBpOnVzZXJTdG9wcGVkU3BlYWtpbmdcIiwgeyBkdXJhdGlvbjogZHVyYXRpb24gfSk7XG4gICAgICBhdWRpb091dHB1dEFjdG9yLnNlbmQoXCJwbGF5XCIpOyAvLyByZXN1bWUgUGkncyBhdWRpb1xuICAgIH0gZWxzZSB7XG4gICAgICBhdWRpb091dHB1dEFjdG9yLnNlbmQoXCJzdG9wXCIpOyAvLyBjYW5jZWwgUGkncyBhdWRpb1xuICAgIH1cbiAgfVxufVxuXG4vKiBUaGVzZSBldmVudHMgYXJlIHVzZWQgdG8gY29udHJvbC9wYXNzIHJlcXVlc3RzIHRvIHRoZSBhdWRpbyBtb2R1bGUgZnJvbSBvdGhlciBtb2R1bGVzICovXG5mdW5jdGlvbiByZWdpc3RlckF1ZGlvQ29tbWFuZHMoKSB7XG4gIEV2ZW50QnVzLm9uKFwiYXVkaW86c2V0dXBSZWNvcmRpbmdcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICBzZXR1cFJlY29yZGluZygpO1xuICB9KTtcblxuICBFdmVudEJ1cy5vbihcImF1ZGlvOnRlYXJEb3duUmVjb3JkaW5nXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgdGVhckRvd25SZWNvcmRpbmcoKTtcbiAgfSk7XG5cbiAgRXZlbnRCdXMub24oXCJhdWRpbzpzdGFydFJlY29yZGluZ1wiLCBmdW5jdGlvbiAoZSkge1xuICAgIHN0YXJ0UmVjb3JkaW5nKCk7XG4gIH0pO1xuICBFdmVudEJ1cy5vbihcImF1ZGlvOnN0b3BSZWNvcmRpbmdcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICBzdG9wUmVjb3JkaW5nKCk7XG4gIH0pO1xuICBFdmVudEJ1cy5vbihcImF1ZGlvOnJlbG9hZFwiLCBmdW5jdGlvbiAoZSkge1xuICAgIGF1ZGlvT3V0cHV0QWN0b3Iuc2VuZChcInJlbG9hZFwiKTtcbiAgfSk7XG59XG5yZWdpc3RlckF1ZGlvQ29tbWFuZHMoKTtcbiJdLCJuYW1lcyI6WyJpc1NhZmFyaSIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJpc01vYmlsZURldmljZSIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwiaXNNb2JpbGVWaWV3IiwidXNlclZpZXdQcmVmZXJlbmNlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImV4aXRNb2JpbGVNb2RlIiwic2V0SXRlbSIsImVsZW1lbnQiLCJkb2N1bWVudCIsImRvY3VtZW50RWxlbWVudCIsImNsYXNzTGlzdCIsInJlbW92ZSIsImFkZCIsImVudGVyTW9iaWxlTW9kZSIsImFkZFVzZXJBZ2VudEZsYWdzIiwiaXNGaXJlZm94QW5kcm9pZCIsImFkZERldmljZUZsYWdzIiwiYWRkVmlld0ZsYWdzIiwiY3JlYXRlTWFjaGluZSIsImFzc2lnbiIsInJhaXNlIiwiRXZlbnRCdXMiLCJhdWRpb0VsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY29uc29sZSIsImVycm9yIiwiYXVkaW9PdXRwdXRNYWNoaW5lIiwiaWQiLCJjb250ZXh0IiwidXNlclN0YXJ0ZWQiLCJpbml0aWFsIiwic3RhdGVzIiwiaWRsZSIsIm9uIiwibG9hZFN0YXJ0IiwibG9hZGluZyIsInBsYXkiLCJwYXVzZSIsInN0b3AiLCJlbnRyeSIsInR5cGUiLCJwYXJhbXMiLCJldmVudE5hbWUiLCJwbGF5aW5nIiwiZW5kZWQiLCJwYXVzZWQiLCJyZWxvYWQiLCJ0YXJnZXQiLCJkZXNjcmlwdGlvbiIsImFjdGlvbiIsImV2ZW50IiwibG9hZCIsImNvbmQiLCJzdG9wcGVkIiwicHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMiLCJwcmVzZXJ2ZUFjdGlvbk9yZGVyIiwiYWN0aW9ucyIsImVtaXRFdmVudCIsIl9yZWYiLCJlbWl0IiwiYXV0b1BhdXNlU2FmYXJpIiwic2Vla1RvRW5kIiwiYXVkaW8iLCJkdXJhdGlvbiIsImN1cnJlbnRUaW1lIiwiZ3VhcmRzIiwiaXNTYWZhcmlNb2JpbGUiLCJfcmVxdWlyZSIsInJlcXVpcmUiLCJpbnRlcnByZXQiLCJfcmVxdWlyZTIiLCJwcmVsb2FkIiwibG9nIiwiYXVkaW9PdXRwdXRBY3RvciIsIm9uVHJhbnNpdGlvbiIsInN0YXRlIiwidmFsdWUiLCJzdGFydCIsInJlZ2lzdGVyQXVkaW9QbGF5YmFja0V2ZW50cyIsImFjdG9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNlbmQiLCJhdWRpb0RhdGFDaHVua3MiLCJhdWRpb01pbWVUeXBlIiwibWVkaWFSZWNvcmRlciIsInRocmVzaG9sZCIsImhhbmRsZURhdGFBdmFpbGFibGUiLCJlIiwicHVzaCIsImRhdGEiLCJoYW5kbGVTdG9wIiwiYXVkaW9CbG9iIiwiQmxvYiIsInN0b3BUaW1lIiwiRGF0ZSIsIm5vdyIsInN0YXJ0VGltZSIsImJsb2IiLCJzZXR1cFJlY29yZGluZyIsImNhbGxiYWNrIiwibWVkaWFEZXZpY2VzIiwiZ2V0VXNlck1lZGlhIiwidGhlbiIsInN0cmVhbSIsIk1lZGlhUmVjb3JkZXIiLCJpc1R5cGVTdXBwb3J0ZWQiLCJvcHRpb25zIiwibWltZVR5cGUiLCJlcnIiLCJ0ZWFyRG93blJlY29yZGluZyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJzdGFydFJlY29yZGluZyIsInN0b3BSZWNvcmRpbmciLCJyZWdpc3RlckF1ZGlvQ29tbWFuZHMiXSwic291cmNlUm9vdCI6IiJ9