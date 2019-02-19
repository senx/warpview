export declare class MapLib {
    static BASE_RADIUS: number;
    private static LOG;
    /**
     *
     * @param {any} data
     * @param {number[]} hiddenData
     * @param {number} divider
     * @returns {any[]}
     */
    static toLeafletMapPaths(data: {
        gts: any[];
        params: any[];
    }, hiddenData: number[], divider?: number): any[];
    /**
     *
     * @param {any} data
     * @param {number[]} hiddenData
     * @param {number} divider
     * @returns {any[]}
     */
    static annotationsToLeafletPositions(data: {
        gts: any[];
        params: any[];
    }, hiddenData: number[], divider?: number): any[];
    /**
     *
     * @param obj
     * @param params
     * @param index
     */
    private static extractCommonParameters;
    /**
     *
     * @param posArray
     * @param params
     * @returns {boolean}
     */
    private static validateWeightedDotsPositionArray;
    /**
     *
     * @param {any} data
     * @param {number[]} hiddenData
     * @returns {any[]}
     */
    static toLeafletMapPositionArray(data: {
        gts: any[];
        params: any[];
    }, hiddenData: number[]): any[];
    /**
     *
     * @param posArray
     * @param params
     */
    private static validateWeightedColoredDotsPositionArray;
    /**
     *
     * @param paths
     * @param positionsData
     * @param annotationsData
     * @param geoJson
     * @returns {any}
     */
    static getBoundsArray(paths: any, positionsData: any, annotationsData: any, geoJson: any): any[];
    /**
     *
     * @param pathData
     * @param options
     * @returns {any[]}
     */
    static pathDataToLeaflet(pathData: any, options: any): any[];
    static toGeoJSON(data: {
        gts: any[];
        params: any[];
    }): any[];
}
