export declare class ChartLib {
    /**
     * Generate a guid
     * @returns {string}
     */
    static guid(): string;
    /**
     *
     * @param sources
     * @returns {any}
     */
    static mergeDeep(...sources: any[]): {};
    /**
     *
     * @param obj
     * @param extended
     * @param deep
     */
    static merge(obj: any, extended: any, deep: any): void;
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
