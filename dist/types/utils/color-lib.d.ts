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
     * @param {number} alpha
     * @returns {string}
     */
    static transparentize(color: any, alpha: number): string;
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
}
