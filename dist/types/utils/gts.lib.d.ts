import { DataModel } from "../model/dataModel";
export declare class GTSLib {
    private static LOG;
    static cleanArray(actual: any[]): any[];
    /**
     * Return a Set
     * @param arr
     * @returns {any[]}
     */
    static unique(arr: any): any[];
    /**
     * Test if value is an array
     * @param value
     * @returns {any | boolean}
     */
    static isArray(value: any): boolean;
    static isValidResponse(data: any): boolean;
    static isEmbeddedImage(item: any): boolean;
    static isEmbeddedImageObject(item: any): boolean;
    static isPositionArray(item: any): boolean;
    static isPositionsArrayWithValues(item: any): boolean;
    static isPositionsArrayWithTwoValues(item: any): boolean;
    static metricFromJSON(json: any): {
        ts: any;
        value: any;
        alt: any;
        lon: any;
        lat: any;
    };
    static gtsFromJSON(json: any, id: any): {
        gts: {
            c: any;
            l: any;
            a: any;
            v: any;
            id: any;
        };
    };
    /**
     *
     * @param jsonList
     * @param prefixId
     * @returns {{content: any[]}}
     */
    static gtsFromJSONList(jsonList: any, prefixId: any): {
        content: any[];
    };
    /**
     *
     * @param arr1
     * @returns {any}
     */
    static flatDeep(arr1: any[]): any;
    /**
     *
     * @param a
     * @param r
     * @returns {any}
     */
    static flattenGtsIdArray(a: any, r: any): any;
    static serializeGtsMetadata(gts: any): string;
    static gtsToPath(gts: any): any[];
    static equalMetadata(a: any, b: any): boolean;
    static isGts(item: any): boolean;
    static isGtsToPlot(gts: any): boolean;
    static isBooleanGts(gts: any): boolean;
    static isGtsToAnnotate(gts: any): boolean;
    static gtsSort(gts: any): void;
    static gtsTimeRange(gts: any): any[];
    /**
     *
     * @param data
     */
    static getData(data: any): DataModel;
}
