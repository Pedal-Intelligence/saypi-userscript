import { createMachine } from "xstate";
import { AudibleNotificationsModule } from "../NotificationsModule";
import { enterFullscreen } from "../FullscreenModule";

const notificationsModule = new AudibleNotificationsModule();

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QGUDGAnMYB2ACAMgPaoDWAdAKrYA2xJkAxLaQNoAMAuoqAA6GwBLAC4DC2biAAeiACxsZZAJwB2AGzrlARhkAOeW2UAaEAE9EAJgCsAZiU3N5+Q8ttFmnQF8PxtJhwE6MiJSRgBXGjp2LiQQPkERMQlpBDkFFXVVLV19I1NEB1UyNmK2K0VXNk0tTS9vEGxCCDgJXyw8YJIJOOFRcRjkgFpVYzMEIa8fDDaA0koIkIgu-h7E-tlzEfzLSyU1Sx0qxXMdNwMJkFb-DqC6SCX43qTESxUyS2U2F01rVWtNFU0mwQ2h2Mj2yhOej2ilUtQ8QA */
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
        document.body.classList.add("locked"); // add class to body so that other descendants can style themselves accordingly
        lockPanel?.classList.add("locked");
        unlockButton?.classList.add("glow");
        document.body.classList.remove("unlocked");
        lockPanel?.classList.remove("unlocked");
        notificationsModule.lockScreen();
        console.log("Screen locked");
      },
      unlockScreen: () => {
        const lockPanel = document.getElementById("saypi-lock-panel");
        const unlockButton = document.getElementById("saypi-unlockButton");
        document.body.classList.remove("locked");
        lockPanel?.classList.remove("locked");
        unlockButton?.classList.remove("glow");
        document.body.classList.add("unlocked");
        lockPanel?.classList.add("unlocked");
        notificationsModule.unlockScreen();
        console.log("Screen unlocked");
      },
      fullscreen: () => {
        enterFullscreen();
      },
    },
    services: {},
    guards: {},
    delays: {},
  }
);
