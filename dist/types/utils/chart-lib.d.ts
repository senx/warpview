export declare class ChartLib {
    /**
     * Generate a guid
     * @returns {string}
     */
    static guid(): string;
    /**
     *
     * @param target
     * @param sources
     * @returns {any}
     */
    static mergeDeep(target: any, ...sources: any[]): any;
    /**
     *
     * @param item
     */
    static isObject(item: any): boolean;
    /**
     *
     * @param theme
     */
    static getGridColor(theme: string): string;
    static getTooltipCallbacks(): {
        title: (tooltipItem: any) => any;
        label: (tooltipItem: any, data: any) => any;
    };
    static buildImage(w: number, h: number, color: string): HTMLImageElement;
}
