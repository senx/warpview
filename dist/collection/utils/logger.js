export class Logger {
    /**
     *
     * @param className
     */
    constructor(className) {
        this.className = className.name;
    }
    /**
     *
     * @param {string[]} message message
     * @param {LEVEL} level level
     * @param {string[]} methods methods
     */
    log(level, methods, message) {
        const display = `[${this.className}] ${methods.join(' - ')}`;
        switch (level) {
            case LEVEL.DEBUG: {
                console.debug(display, message);
                break;
            }
            case LEVEL.ERROR: {
                console.error(display, message);
                break;
            }
            case LEVEL.INFO: {
                console.log(display, message);
                break;
            }
            case LEVEL.WARN: {
                console.warn(display, message);
                break;
            }
            default: {
                console.log(display, message);
            }
        }
    }
    /**
     *
     * @param message
     * @param methods
     */
    debug(methods, message) {
        this.log(LEVEL.DEBUG, methods, message);
    }
    /**
     *
     * @param message
     * @param methods
     */
    error(methods, message) {
        this.log(LEVEL.ERROR, methods, message);
    }
    /**
     *
     * @param message
     * @param methods
     */
    warn(methods, message) {
        this.log(LEVEL.WARN, methods, message);
    }
    /**
     *
     * @param message
     * @param methods
     */
    info(methods, message) {
        this.log(LEVEL.INFO, methods, message);
    }
}
/**
 *
 */
export var LEVEL;
(function (LEVEL) {
    LEVEL[LEVEL["DEBUG"] = 0] = "DEBUG";
    LEVEL[LEVEL["ERROR"] = 1] = "ERROR";
    LEVEL[LEVEL["WARN"] = 2] = "WARN";
    LEVEL[LEVEL["INFO"] = 3] = "INFO";
})(LEVEL || (LEVEL = {}));
