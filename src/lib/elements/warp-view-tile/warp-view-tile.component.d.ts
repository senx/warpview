import { AfterViewInit, ElementRef, EventEmitter, NgZone, OnInit, Renderer2 } from '@angular/core';
import { Param } from '../../model/param';
import { DataModel } from '../../model/dataModel';
import { WarpViewComponent } from '../warp-view-component';
import { SizeService } from '../../services/resize.service';
import { Warp10Service } from '../../services/warp10.service';
import { WarpViewResultTileComponent } from '../warp-view-result-tile/warp-view-result-tile.component';
export declare class WarpViewTileComponent extends WarpViewComponent implements OnInit, AfterViewInit {
    el: ElementRef;
    sizeService: SizeService;
    renderer: Renderer2;
    ngZone: NgZone;
    private warp10Service;
    warpRef: ElementRef;
    resultTile: WarpViewResultTileComponent;
    warpscriptResult: EventEmitter<any>;
    execStatus: EventEmitter<any>;
    execError: EventEmitter<any>;
    type: string;
    chartTitle: any;
    url: string;
    isAlone: boolean;
    set gtsFilter(gtsFilter: string);
    set warpscript(warpScript: string);
    get warpscript(): string;
    loaderMessage: string;
    error: any;
    status: string;
    loading: boolean;
    execResult: string;
    private timer;
    private _autoRefresh;
    private _gtsFilter;
    private _warpScript;
    private execUrl;
    private timeUnit;
    constructor(el: ElementRef, sizeService: SizeService, renderer: Renderer2, ngZone: NgZone, warp10Service: Warp10Service);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    update(options: Param): void;
    handleKeyDown(event: KeyboardEvent): void;
    /** detect some VSCode special modifiers in the beginnig of the code:
     * @endpoint xxxURLxxx
     * @timeUnit ns
     * warning : the first line is empty (to confirm with other browsers)
     */
    private detectWarpScriptSpecialComments;
    private execute;
    protected convert(data: DataModel): any[];
    chartDrawn(event: any): void;
    onWarpViewNewOptions(opts: any): void;
}
