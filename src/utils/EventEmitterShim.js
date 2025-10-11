const DEFAULT_MAX_LISTENERS = 10;

class EventEmitterShim {
  constructor() {
    this._events = new Map();
    this._maxListeners = DEFAULT_MAX_LISTENERS;
  }

  _events;
  _maxListeners;

  static get defaultMaxListeners() {
    return DEFAULT_MAX_LISTENERS;
  }

  static once(emitter, eventName) {
    return new Promise((resolve, reject) => {
      const handler = (...args) => {
        cleanup();
        resolve(args.length <= 1 ? args[0] : args);
      };

      const errorHandler = (error) => {
        cleanup();
        reject(error);
      };

      const cleanup = () => {
        emitter.removeListener(eventName, handler);
        emitter.removeListener("error", errorHandler);
      };

      emitter.on(eventName, handler);
      emitter.on("error", errorHandler);
    });
  }

  setMaxListeners(limit) {
    if (!Number.isFinite(limit) || limit < 0) {
      throw new RangeError(
        `The value of "n" is out of range. It must be a non-negative number. Received ${limit}.`,
      );
    }
    this._maxListeners = limit;
    return this;
  }

  getMaxListeners() {
    return this._maxListeners;
  }

  addListener(event, listener) {
    return this.on(event, listener);
  }

  on(event, listener) {
    if (typeof listener !== "function") {
      throw new TypeError(`The "listener" argument must be of type Function. Received type ${typeof listener}`);
    }
    const listeners = this._events.get(event) ?? new Set();
    listeners.add(listener);
    this._events.set(event, listeners);
    this._warnIfListenerLeak(event, listeners.size);
    return this;
  }

  once(event, listener) {
    const wrapped = (...args) => {
      this.removeListener(event, wrapped);
      listener(...args);
    };
    return this.on(event, wrapped);
  }

  removeListener(event, listener) {
    const listeners = this._events.get(event);
    if (!listeners) {
      return this;
    }
    listeners.delete(listener);
    if (listeners.size === 0) {
      this._events.delete(event);
    }
    return this;
  }

  off(event, listener) {
    return this.removeListener(event, listener);
  }

  removeAllListeners(event) {
    if (typeof event === "undefined") {
      this._events.clear();
    } else {
      this._events.delete(event);
    }
    return this;
  }

  listeners(event) {
    const listeners = this._events.get(event);
    return listeners ? Array.from(listeners) : [];
  }

  rawListeners(event) {
    return this.listeners(event);
  }

  listenerCount(event) {
    const listeners = this._events.get(event);
    return listeners ? listeners.size : 0;
  }

  emit(event, ...args) {
    const listeners = this._events.get(event);
    if (!listeners || listeners.size === 0) {
      if (event === "error" && args[0] instanceof Error) {
        throw args[0];
      }
      return false;
    }
    for (const listener of Array.from(listeners)) {
      listener(...args);
    }
    return true;
  }

  _warnIfListenerLeak(event, count) {
    const limit = this._maxListeners;
    if (Number.isFinite(limit) && limit > 0 && count > limit) {
      console.warn(
        `Possible EventEmitter memory leak detected. ${count} "${event}" listeners added. ` +
          "Use emitter.setMaxListeners() to increase limit.",
      );
    }
  }
}

EventEmitterShim.EventEmitter = EventEmitterShim;

export { EventEmitterShim };
export default EventEmitterShim;

// Provide CommonJS compatibility for any legacy bundles that still rely on it.
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = EventEmitterShim;
  module.exports.EventEmitter = EventEmitterShim;
  module.exports.default = EventEmitterShim;
  module.exports.once = EventEmitterShim.once;
}
