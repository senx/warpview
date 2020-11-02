import { OnInit } from '@angular/core';
import { Param } from '../../../model/param';
export declare class WarpViewPaginableComponent implements OnInit {
    constructor();
    set debug(debug: boolean);
    get debug(): boolean;
    set options(options: Param);
    set data(data: {
        name: string;
        values: any[];
        headers: string[];
    });
    elemsCount: number;
    windowed: number;
    page: number;
    pages: number[];
    _data: {
        name: string;
        values: any[];
        headers: string[];
    };
    displayedValues: any[];
    private LOG;
    private _debug;
    private _options;
    goto(page: number): void;
    next(): void;
    prev(): void;
    private drawGridData;
    decodeURIComponent(str: string): string;
    ngOnInit(): void;
    formatLabel(name: string): string;
}
