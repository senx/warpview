import { AfterViewInit, ElementRef, EventEmitter, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Param } from '../../../model/param';
import { Observable } from 'rxjs';
/**
 *
 */
export declare class WarpViewChipComponent implements OnInit, AfterViewInit, OnDestroy {
    private renderer;
    private eventsSubscription;
    chip: ElementRef;
    node: any;
    param: Param;
    options: Param;
    events: Observable<boolean>;
    set debug(debug: boolean);
    get debug(): boolean;
    set hiddenData(hiddenData: number[]);
    get hiddenData(): number[];
    set gtsFilter(gtsFilter: string);
    get gtsFilter(): string;
    warpViewSelectedGTS: EventEmitter<any>;
    private LOG;
    private _gtsFilter;
    private _debug;
    private _hiddenData;
    _node: any;
    constructor(renderer: Renderer2);
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
    private colorizeChip;
    toArray(obj: any): {
        name: string;
        value: any;
    }[];
    switchPlotState(event: UIEvent): boolean;
    private setState;
    identify(index: any, item: any): any;
}
