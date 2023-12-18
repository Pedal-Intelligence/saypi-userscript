export function enterFullscreen() {
    // Check if the API is available
    if (document.fullscreenEnabled) {
      // Request full-screen mode
      document.documentElement.requestFullscreen().catch((err) => {
        console.info(
          `Unable to enter full-screen mode. Maybe starting in mobile view?: ${err.message} (${err.name})`
        );
      });
    } else {
      console.log("Fullscreen API is not enabled.");
    }
  }
  
  export function exitFullscreen() {
    // Check if the API is available
    if (document.fullscreenEnabled) {
      // Request full-screen mode
      document.exitFullscreen().catch((err) => {
        console.info(
          `Unable to exit full-screen mode. Maybe starting in desktop view?: ${err.message} (${err.name})`
        );
      });
    } else {
      console.log("Fullscreen API is not enabled.");
    }
  }