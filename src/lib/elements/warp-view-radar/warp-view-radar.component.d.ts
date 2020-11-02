import { ElementRef, NgZone, OnInit, Renderer2 } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { DataModel } from '../../model/dataModel';
import { SizeService } from '../../services/resize.service';
export declare class WarpViewRadarComponent extends WarpViewComponent implements OnInit {
    el: ElementRef;
    renderer: Renderer2;
    sizeService: SizeService;
    ngZone: NgZone;
    layout: Partial<any>;
    update(options: any, refresh: any): void;
    constructor(el: ElementRef, renderer: Renderer2, sizeService: SizeService, ngZone: NgZone);
    ngOnInit(): void;
    private drawChart;
    protected convert(data: DataModel): any[];
}
