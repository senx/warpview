import { DataModel } from '../model/dataModel';
export declare class GTSLib {
    private static LOG;
    static cleanArray(actual: any[]): any[];
    static unique(arr: any): any[];
    static isArray(value: any): boolean;
    static formatElapsedTime(elapsed: number): string;
    static isValidResponse(data: any): boolean;
    static isEmbeddedImage(item: any): boolean;
    static isEmbeddedImageObject(item: any): boolean;
    static isPositionArray(item: any): boolean;
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
    static gtsFromJSONList(jsonList: any, prefixId: any): {
        content: any[];
    };
    static flatDeep(arr1: any[]): any[];
    static flattenGtsIdArray(a: any[], r: number): {
        res: any[];
        r: number;
    };
    static sanitizeNames(input: string): string;
    static serializeGtsMetadata(gts: any): string;
    static isGts(item: any): boolean;
    static isGtsToPlot(gts: any): any;
    static isGtsToPlotOnMap(gts: any): any;
    static isSingletonGTS(gts: any): boolean;
    static isGtsToAnnotate(gts: any): any;
    static gtsSort(gts: any): void;
    static getData(data: any): DataModel;
    static getDivider(timeUnit: string): number;
    static formatLabel: (data: string) => string;
    static toISOString(timestamp: number, divider: number, timeZone: string): string;
}
