import EventEmitter from "events";

const eventBus = new EventEmitter();
eventBus.setMaxListeners(50);

export default eventBus;
