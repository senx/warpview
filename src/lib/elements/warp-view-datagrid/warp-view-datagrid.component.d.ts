import { ElementRef, NgZone, OnInit, Renderer2 } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { Param } from '../../model/param';
import { DataModel } from '../../model/dataModel';
import { SizeService } from '../../services/resize.service';
export declare class WarpViewDatagridComponent extends WarpViewComponent implements OnInit {
    el: ElementRef;
    renderer: Renderer2;
    sizeService: SizeService;
    ngZone: NgZone;
    elemsCount: number;
    _tabularData: {
        name: string;
        values: any[];
        headers: string[];
    }[];
    constructor(el: ElementRef, renderer: Renderer2, sizeService: SizeService, ngZone: NgZone);
    ngOnInit(): void;
    update(options: Param): void;
    private drawChart;
    private getHeaderParam;
    protected convert(data: DataModel): any[];
    private parseCustomData;
    protected parseData(data: any[]): {
        name: string;
        values: any[];
        headers: string[];
    }[];
    formatDate(date: number): string;
}
