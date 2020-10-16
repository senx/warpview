export declare class Logger {
    className: string;
    isDebug: boolean;
    constructor(className: any, isDebug?: boolean);
    setDebug(debug: boolean): void;
    log(level: LEVEL, methods: any[], args: any[]): void;
    debug(methods: any[], ...args: any[]): void;
    error(methods: any[], ...args: any[]): void;
    warn(methods: any[], ...args: any[]): void;
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
