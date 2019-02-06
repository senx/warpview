import { DataModel } from "../model/dataModel";
export declare class GTSLib {
    private static LOG;
    /**
     *
     * @param actual
     */
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
    /**
     *
     * @param data
     * @returns {boolean}
     */
    static isValidResponse(data: any): boolean;
    /**
     *
     * @param item
     * @returns {boolean}
     */
    static isEmbeddedImage(item: any): boolean;
    /**
     *
     * @param item
     * @returns {boolean}
     */
    static isEmbeddedImageObject(item: any): boolean;
    /**
     *
     * @param item
     * @returns {boolean}
     */
    static isPositionArray(item: any): boolean;
    /**
     *
     * @param item
     * @returns {boolean}
     */
    static isPositionsArrayWithValues(item: any): boolean;
    static isPositionsArrayWithTwoValues(item: any): boolean;
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
     * @param {any[]} arr1
     * @returns {any[]}
     */
    static flatDeep(arr1: any[]): any[];
    /**
     *
     * @param {any[]} a
     * @param {number} r
     * @returns {{res: any[]; r: number}}
     */
    static flattenGtsIdArray(a: any[], r: number): {
        res: any[];
        r: number;
    };
    /**
     *
     * @param gts
     * @returns {string}
     */
    static serializeGtsMetadata(gts: any): string;
    /**
     *
     * @param gts
     * @param {number} divider
     * @returns {any[]}
     */
    static gtsToPath(gts: any, divider?: number): any[];
    /**
     *
     * @param a
     * @param b
     * @returns {boolean}
     */
    static equalMetadata(a: any, b: any): boolean;
    /**
     *
     * @param item
     * @returns {boolean}
     */
    static isGts(item: any): boolean;
    /**
     *
     * @param gts
     * @returns {boolean}
     */
    static isGtsToPlot(gts: any): boolean;
    /**
     *
     * @param gts
     * @returns {boolean}
     */
    static isGtsToAnnotate(gts: any): boolean;
    /**
     *
     * @param gts
     */
    static gtsSort(gts: any): void;
    /**
     *
     * @param data
     * @returns {DataModel}
     */
    static getData(data: any): DataModel;
    /**
     *
     * @param {string} timeUnit
     * @returns {number}
     */
    static getDivider(timeUnit: string): number;
    /**
     *
     * @param {string} data
     * @returns {string}
     */
    static formatLabel: (data: string) => string;
}
