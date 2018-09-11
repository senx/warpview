export class Logger {

  className: string;

  /**
   *
   * @param className
   */
  constructor(className: any) {
    this.className = className.name;
  }

  /**
   *
   * @param {string[]} message message
   * @param {LEVEL} level level
   * @param {string[]} methods methods
   */
  log(level: LEVEL, methods: string[], message: any) {
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
  debug(methods: string[], message: any) {
    this.log(LEVEL.DEBUG, methods, message);
  }

  /**
   *
   * @param message
   * @param methods
   */
  error(methods: string[], message: any) {
    this.log(LEVEL.ERROR, methods, message);
  }

  /**
   *
   * @param message
   * @param methods
   */
  warn(methods: string[], message: any) {
    this.log(LEVEL.WARN, methods, message);
  }

  /**
   *
   * @param message
   * @param methods
   */
  info(methods: string[], message: any) {
    this.log(LEVEL.INFO, methods, message);
  }
}

/**
 *
 */
export enum LEVEL {
  DEBUG, ERROR, WARN, INFO
}
