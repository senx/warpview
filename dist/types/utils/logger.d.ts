export declare class Logger {
    className: string;
    isDebug: boolean;
    /**
     *
     * @param className
     * @param {boolean} isDebug
     */
    constructor(className: any, isDebug?: boolean);
    /**
     *
     * @param {LEVEL} level
     * @param {any[]} methods
     * @param {any[]} args
     */
    log(level: LEVEL, methods: any[], args: any[]): void;
    /**
     *
     * @param {any[]} methods
     * @param args
     */
    debug(methods: any[], ...args: any[]): void;
    /**
     *
     * @param {any[]} methods
     * @param args
     */
    error(methods: any[], ...args: any[]): void;
    /**
     *
     * @param {any[]} methods
     * @param args
     */
    warn(methods: any[], ...args: any[]): void;
    /**
     *
     * @param {any[]} methods
     * @param args
     */
    info(methods: any[], ...args: any[]): void;
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
