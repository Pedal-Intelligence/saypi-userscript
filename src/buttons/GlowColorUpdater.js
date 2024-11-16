class GlowColorUpdater{

    constructor() {
        let baseColor = "#ffd1dc"; // sunset-peach
        let peakColor = "#FF7F50"; // coral

        // Convert the base and peak colours from hexadecimal to RGB
        this.baseRed   = this.parseColor(baseColor, 1, 3);
        this.baseGreen = this.parseColor(baseColor, 3, 5);
        this.baseBlue  = this.parseColor(baseColor, 5, 7);

        let peakRed    = this.parseColor(peakColor, 1, 3);
        let peakGreen  = this.parseColor(peakColor, 3, 5);
        let peakBlue   = this.parseColor(peakColor, 5, 7);

        this.diffR = peakRed - this.baseRed;
        this.diffG = peakGreen - this.baseGreen;
        this.diffB = peakBlue - this.baseBlue;

        this.counter = 0;
    }

    parseColor(baseColor, firstIndex, lastIndex){
        return parseInt(baseColor.substring(firstIndex, lastIndex), 16);
    }

    updateGlowColor(probabilityOfSpeech) {
        const updatedColor = this.interpolateColor(probabilityOfSpeech);
        this.updateCallButtonGlowColor(updatedColor);
    }

    updateCallButtonGlowColor(color) {
        // set the `--glow-color` CSS variable on the call button
        const callButton = document.getElementById("saypi-callButton");
        if (callButton) {
          callButton.style.setProperty("--glow-color", color);
        }
      }

      /**
       * Interpolates between a base colour and a peak colour based on intensity.
       *
       * @param {string} baseColor - The base colour in hexadecimal format.
       * @param {string} peakColor - The peak colour in hexadecimal format.
       * @param {number} intensity - The intensity factor (0.0 to 1.0).
       * @returns {string} The interpolated colour in hexadecimal format.
       */
      interpolateColor(intensity) {
        // Ensure intensity is within the range of 0.0 to 1.0
        intensity = Math.max(0, Math.min(1, intensity));
    
        // Interpolate each colour component
        let r = this.interpolateComponent(this.baseRed, this.diffR, intensity);
        let g = this.interpolateComponent(this.baseGreen, this.diffG, intensity);
        let b = this.interpolateComponent(this.baseBlue, this.diffB, intensity);

        this.counter+=1;
        if(this.counter > 10){
            this.counter = 0;
            console.log("baseRed, diffR: " + this.baseRed + ", " + this.diffR + " intensity: " + intensity);
            console.log ("components: " + r + "," + g + "," + b);
        }
    
        // Convert the interpolated RGB back to hexadecimal
        return `#${r.toString(16).padStart(2, "0")}${g
          .toString(16)
          .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      }

      interpolateComponent(base, diff, intensity) {
        return Math.round(base + diff * intensity);
      }
}

export { GlowColorUpdater };