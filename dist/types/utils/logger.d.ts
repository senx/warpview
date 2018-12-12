export declare class Logger {
    className: string;
    /**
     *
     * @param className
     */
    constructor(className: any);
    /**
     *
     * @param {string[]} message message
     * @param {LEVEL} level level
     * @param {string[]} methods methods
     */
    log(level: LEVEL, methods: string[], message: any): void;
    /**
     *
     * @param {string[]} methods
     * @param message
     */
    debug(methods: string[], message: any): void;
    /**
     *
     * @param {string[]} methods
     * @param message
     */
    error(methods: string[], message: any): void;
    /**
     *
     * @param {string[]} methods
     * @param message
     */
    warn(methods: string[], message: any): void;
    /**
     *
     * @param {string[]} methods
     * @param message
     */
    info(methods: string[], message: any): void;
}
/**
 *
 */
export declare enum LEVEL {
    DEBUG = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 3
}
