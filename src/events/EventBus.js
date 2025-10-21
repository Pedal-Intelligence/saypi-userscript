class EventBus {
  constructor() {
    this.listeners = new Map();
    this.maxListeners = Infinity;
  }

  listeners;
  maxListeners;

  addListener(event, listener) {
    return this.on(event, listener);
  }

  on(event, listener) {
    const entry = this.listeners.get(event) ?? new Set();
    entry.add(listener);
    this.listeners.set(event, entry);
    this.warnIfListenerLeak(event, entry.size);
    return this;
  }

  once(event, listener) {
    const wrapped = (...args) => {
      this.off(event, wrapped);
      listener(...args);
    };
    return this.on(event, wrapped);
  }

  off(event, listener) {
    const entry = this.listeners.get(event);
    if (!entry) {
      return this;
    }
    entry.delete(listener);
    if (entry.size === 0) {
      this.listeners.delete(event);
    }
    return this;
  }

  removeListener(event, listener) {
    return this.off(event, listener);
  }

  removeAllListeners(event) {
    if (typeof event === "undefined") {
      this.listeners.clear();
    } else {
      this.listeners.delete(event);
    }
    return this;
  }

  emit(event, ...args) {
    const entry = this.listeners.get(event);
    if (!entry || entry.size === 0) {
      return false;
    }
    for (const listener of Array.from(entry)) {
      listener(...args);
    }
    return true;
  }

  listenerCount(event) {
    const entry = this.listeners.get(event);
    return entry ? entry.size : 0;
  }

  listenersFor(event) {
    const entry = this.listeners.get(event);
    return entry ? Array.from(entry) : [];
  }

  setMaxListeners(limit) {
    if (Number.isFinite(limit) && limit >= 0) {
      this.maxListeners = limit;
    } else {
      this.maxListeners = Infinity;
    }
    return this;
  }

  warnIfListenerLeak(event, count) {
    if (this.maxListeners !== Infinity && count > this.maxListeners) {
      console.warn(
        `EventBus listener leak detected: ${count} listeners added for "${event}" (max: ${this.maxListeners}).`,
      );
    }
  }
}

const eventBus = new EventBus();
eventBus.setMaxListeners(50);

export default eventBus;
