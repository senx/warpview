import { ElementRef, NgZone, OnInit, Renderer2 } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { DataModel } from '../../model/dataModel';
import { SizeService } from '../../services/resize.service';
export declare class WarpViewGaugeComponent extends WarpViewComponent implements OnInit {
    el: ElementRef;
    renderer: Renderer2;
    sizeService: SizeService;
    ngZone: NgZone;
    set type(type: string);
    private CHART_MARGIN;
    private lineHeight;
    private _type;
    layout: Partial<any>;
    constructor(el: ElementRef, renderer: Renderer2, sizeService: SizeService, ngZone: NgZone);
    ngOnInit(): void;
    update(options: any, refresh: any): void;
    drawChart(): void;
    protected convert(data: DataModel): any[];
}
