import { ElementRef, EventEmitter, NgZone, OnInit, Renderer2 } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { DataModel } from '../../model/dataModel';
import { SizeService } from '../../services/resize.service';
export declare class WarpViewPieComponent extends WarpViewComponent implements OnInit {
    el: ElementRef;
    renderer: Renderer2;
    sizeService: SizeService;
    ngZone: NgZone;
    set type(type: string);
    chartDraw: EventEmitter<any>;
    private _type;
    layout: Partial<any>;
    update(options: any, refresh: any): void;
    constructor(el: ElementRef, renderer: Renderer2, sizeService: SizeService, ngZone: NgZone);
    ngOnInit(): void;
    drawChart(): void;
    protected convert(data: DataModel): Partial<any>[];
}
