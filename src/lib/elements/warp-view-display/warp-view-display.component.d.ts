import { ElementRef, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { Param } from '../../model/param';
import { DataModel } from '../../model/dataModel';
import { SizeService } from '../../services/resize.service';
/**
 *
 */
export declare class WarpViewDisplayComponent extends WarpViewComponent implements OnInit, OnDestroy {
    el: ElementRef;
    renderer: Renderer2;
    sizeService: SizeService;
    ngZone: NgZone;
    wrapper: ElementRef;
    toDisplay: string;
    defOptions: Param;
    private fitties;
    private timer;
    constructor(el: ElementRef, renderer: Renderer2, sizeService: SizeService, ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    update(options: Param, refresh: boolean): void;
    private drawChart;
    protected convert(data: DataModel): any[];
    getStyle(): any;
    flexFont(): void;
    private displayDuration;
}
