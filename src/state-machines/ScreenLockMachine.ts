import { createMachine } from "xstate";
import { AudibleNotificationsModule } from "../NotificationsModule";
import { enterFullscreen } from "../FullscreenModule";

const notificationsModule = new AudibleNotificationsModule();

export const machine = createMachine(
  {
    id: "Screen Lock",
    description: "Prevents unintentional touch interactions while locked.",
    initial: "Unlocked",
    states: {
      Unlocked: {
        description: "The button is in an unlocked state. User can lock it.",
        on: {
          lock: {
            target: "Locked",
            actions: ["lockScreen", "fullscreen"],
          },
        },
      },
      Locked: {
        description:
          "The button is in a locked state.\\\nTouch interactions are absorbed silently,\\\nexcept for the unlock button.",
        on: {
          unlock: {
            target: "Unlocked",
            description: "Long press to unlock.",
            actions: ["unlockScreen"],
          },
        },
      },
    },
    schema: { events: {} as { type: "unlock" } | { type: "lock" } },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
        lockScreen: () => {
            const lockPanel = document.getElementById("saypi-lock-panel");
            const unlockButton = document.getElementById("saypi-unlockButton");
            lockPanel?.classList.add("locked");
            unlockButton?.classList.add("glow");
            lockPanel?.classList.remove("unlocked");
            notificationsModule.lockScreen();
            console.log("Screen locked");
        },
        unlockScreen: () => {
            const lockPanel = document.getElementById("saypi-lock-panel");
            const unlockButton = document.getElementById("saypi-unlockButton");
            lockPanel?.classList.remove("locked");
            unlockButton?.classList.remove("glow");
            lockPanel?.classList.add("unlocked");
            notificationsModule.unlockScreen();
            console.log("Screen unlocked");
        },
        fullscreen: () => {
            enterFullscreen();
        }
    },
    services: {},
    guards: {},
    delays: {},
  },
);