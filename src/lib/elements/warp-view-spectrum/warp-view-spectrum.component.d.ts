import { ElementRef, NgZone, Renderer2 } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { DataModel } from '../../model/dataModel';
import { Param } from '../../model/param';
import { SizeService } from '../../services/resize.service';
export declare class WarpViewSpectrumComponent extends WarpViewComponent {
    el: ElementRef;
    renderer: Renderer2;
    sizeService: SizeService;
    ngZone: NgZone;
    set type(type: string);
    layout: Partial<any>;
    private _type;
    private visibility;
    private visibilityStatus;
    private maxTick;
    private minTick;
    private visibleGtsId;
    constructor(el: ElementRef, renderer: Renderer2, sizeService: SizeService, ngZone: NgZone);
    update(options: Param): void;
    private drawChart;
    protected convert(data: DataModel): Partial<any>[];
    private buildGraph;
}
