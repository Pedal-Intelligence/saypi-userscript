// The wake lock sentinel.
let wakeLock: WakeLockSentinel | null = null; 

// Function that attempts to request a screen wake lock.
import { logger } from "./LoggingModule";

export const requestWakeLock = async () => {
    if (!('wakeLock' in navigator)) {
        logger.debug('Screen Wake Lock API not supported by this browser.');
        return;
    }
    if (wakeLock === null || wakeLock.released) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock?.addEventListener('release', () => {
                logger.debug('Screen Wake Lock released');
            });
            logger.debug('Screen Wake Lock acquired.');
        }
        catch (err: DOMException | any) {
            if (err instanceof DOMException && err.name === 'NotAllowedError') {
                // Handle NotAllowedError - consider sending the state machine a battery-level error event
                logger.error(`Not allowed to keep screen awake. Check battery level? ${err.name}, ${err.message}`);
            } else {
                logger.error(`${err.name}, ${err.message}`);
            }
        }
    }
};

export const releaseWakeLock = async () => {
    if (wakeLock !== null) {
        await wakeLock.release();
        wakeLock = null;
    }
}
