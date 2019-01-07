import '../../../stencil.core';
import { Param } from "../../../model/param";
export declare class WarpViewPaginable {
    data: {
        name: string;
        values: any[];
        headers: string[];
    };
    options: Param;
    elemsCount: number;
    debug: boolean;
    page: number;
    private pages;
    private _data;
    private displayedValues;
    private LOG;
    private _options;
    private windowed;
    private formatDate;
    private goto;
    private next;
    private prev;
    private drawGridData;
    componentWillLoad(): void;
    render(): JSX.Element;
}
