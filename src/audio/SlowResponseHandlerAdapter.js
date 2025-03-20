// Adapter to make SlowResponseHandler work with the XState actor interface
export class SlowResponseHandlerAdapter {
  constructor(handler) {
    this.handler = handler;
  }
  
  send(eventType, detail = {}) {
    if (eventType === 'error') {
      // Create a synthetic event that mimics what SlowResponseHandler expects
      const syntheticEvent = {
        target: { 
          currentSrc: detail.source,
          // Don't try to create a MediaError directly
          error: detail.error || { 
            code: 4, // MEDIA_ERR_SRC_NOT_SUPPORTED
            message: detail.detail || "Error loading audio" 
          }
        }
      };
      this.handler.handleAudioError(syntheticEvent);
    }
    // Other event types can be mapped here if needed
  }
}

export default SlowResponseHandlerAdapter; 