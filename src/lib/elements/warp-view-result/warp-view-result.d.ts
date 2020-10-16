import { GTSLib } from '../../model/gts.lib';
export declare class WarpViewResult {
    private gtsLib;
    theme: string;
    config: object;
    loading: boolean;
    _res: string;
    _result: any[];
    _resultStr: any[];
    get result(): string;
    set result(res: string);
    constructor(gtsLib: GTSLib);
    isArray(arr: any): boolean;
}
