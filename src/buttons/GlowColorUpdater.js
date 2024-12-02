class GlowHelper {

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
  
      this.diffRed   = peakRed - this.baseRed;
      this.diffGreen = peakGreen - this.baseGreen;
      this.diffBlue  = peakBlue - this.baseBlue;
  
      this.intensityMap = new Array();
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
      intensity = this.limitBetweenZeroAndOne(intensity).toFixed(3);
      const color = this.getSavedColor(intensity);
      return typeof color === 'undefined' ? this.createAndSaveColor(intensity) : color;
    }

    limitBetweenZeroAndOne(intensity) {
        return (Math.max(0, Math.min(1, intensity)));
    }
  
    createAndSaveColor(intensity) {
      let color = this.createColorInterpolationFrom(intensity);
      this.intensityMap[this.getKey(intensity)] = color;
      return color;
    }
  
    getSavedColor(intensity) { 
      return this.intensityMap[this.getKey(intensity)];
    }
  
    getKey(intensity) {
      return '' + intensity;
    }
  
    createColorInterpolationFrom(intensity) {
      // Interpolate each colour component
      let r = this.interpolateComponent(this.baseRed, this.diffRed, intensity);
      let g = this.interpolateComponent(this.baseGreen, this.diffGreen, intensity);
      let b = this.interpolateComponent(this.baseBlue, this.diffBlue, intensity);
      
      // Convert the interpolated RGB back to hexadecimal
      return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }
  
    interpolateComponent(base, diff, intensity) {
      return Math.round(base + diff * intensity);
    }
  
    parseColor(baseColor, firstIndex, lastIndex) {
      return parseInt(baseColor.substring(firstIndex, lastIndex), 16);
    }
  }
  
  
  class GlowColorUpdater {
  
      constructor() {
          this.glowHelper = new GlowHelper();
      }
  
      updateGlowColor(probabilityOfSpeech) {
        const callButton = document.getElementById("saypi-callButton");
        if (callButton) {
          const color = this.glowHelper.interpolateColor(probabilityOfSpeech);
          callButton.style.setProperty("--glow-color", color);
        }
      }
  }
  
  export { GlowColorUpdater };