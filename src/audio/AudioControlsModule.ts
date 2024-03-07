import EventBus from "../events/EventBus";
export default class AudioControlsModule {
  activateAudioInput(enable: boolean): void {
    if (enable) {
      const callButton = document.getElementById("saypi-callButton");
      if (callButton) {
        callButton.click();
      }
    }
  }

  activateAudioOutput(enable: boolean): void {
    if (enable && !this.isAudioOutputEnabled()) {
      const audioOutputButton = document.getElementById(
        "saypi-audio-output-button"
      );
      if (audioOutputButton) {
        EventBus.emit("audio:skipNext");
        audioOutputButton.click();
      }
    }
  }

  isAudioOutputEnabled(): boolean {
    const svgPathElement = document.querySelector(
      "#saypi-audio-output-button svg path"
    );
    const svgPath = svgPathElement ? svgPathElement.getAttribute("d") : null;
    const activePath =
      "M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z";
    return svgPath === activePath;
  }
}
