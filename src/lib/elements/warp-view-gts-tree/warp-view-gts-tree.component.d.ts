import { AfterViewInit, ElementRef, EventEmitter, NgZone, Renderer2 } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { Param } from '../../model/param';
import { DataModel } from '../../model/dataModel';
import { SizeService } from '../../services/resize.service';
import { Subject } from 'rxjs';
/**
 *
 */
export declare class WarpViewGtsTreeComponent extends WarpViewComponent implements AfterViewInit {
    el: ElementRef;
    renderer: Renderer2;
    sizeService: SizeService;
    ngZone: NgZone;
    root: ElementRef;
    kbdLastKeyPressed: string[];
    set gtsFilter(gtsFilter: string);
    get gtsFilter(): string;
    warpViewSelectedGTS: EventEmitter<any>;
    private _gtsFilter;
    gtsList: any[];
    params: Param[];
    expand: boolean;
    initOpen: Subject<void>;
    constructor(el: ElementRef, renderer: Renderer2, sizeService: SizeService, ngZone: NgZone);
    ngAfterViewInit(): void;
    update(options: Param, refresh: boolean): void;
    private doRender;
    private foldAll;
    toggleVisibility(): void;
    protected convert(data: DataModel): any[];
    warpViewSelectedGTSHandler(event: any): void;
}
