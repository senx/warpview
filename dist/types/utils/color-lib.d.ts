export declare class ColorLib {
    static color: string[];
    /**
     * Get a color from index
     * @param i
     * @returns {string}
     */
    static getColor(i: any): string;
    /**
     * Convert hex to RGB
     * @param hex
     * @returns {number[]}
     */
    static hexToRgb(hex: any): number[];
    /**
     * Add an alpha channel
     * @param color
     * @returns {string}
     */
    static transparentize(color: any): string;
    /**
     *
     * @param num
     */
    static generateColors(num: any): any[];
    /**
     *
     * @param num
     */
    static generateTransparentColors(num: any): any[];
    static hsvGradientFromRgbColors(c1: any, c2: any, steps: any): any[];
    private static rgb2hsv;
    private static hsvGradient;
    private static hsv2rgb;
    static rgb2hex(r: any, g: any, b: any): string;
}
