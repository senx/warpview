import { AfterViewInit, EventEmitter } from '@angular/core';
import { DataModel } from '../../model/dataModel';
import { WarpViewModalComponent } from '../warp-view-modal/warp-view-modal.component';
import { Param } from '../../model/param';
/**
 *
 */
export declare class WarpViewGtsPopupComponent implements AfterViewInit {
    modal: WarpViewModalComponent;
    set options(options: Param | string);
    set gtsList(gtsList: DataModel);
    get gtslist(): DataModel;
    set debug(debug: boolean);
    get debug(): boolean;
    set data(data: DataModel);
    get data(): DataModel;
    set hiddenData(hiddenData: number[]);
    get hiddenData(): number[];
    maxToShow: number;
    set kbdLastKeyPressed(kbdLastKeyPressed: string[]);
    get kbdLastKeyPressed(): string[];
    warpViewSelectedGTS: EventEmitter<any>;
    warpViewModalOpen: EventEmitter<any>;
    warpViewModalClose: EventEmitter<any>;
    current: number;
    _gts: any[];
    _options: Param;
    private _kbdLastKeyPressed;
    private _hiddenData;
    private _debug;
    private _gtsList;
    private _data;
    private displayed;
    private modalOpenned;
    private LOG;
    constructor();
    ngAfterViewInit(): void;
    onWarpViewModalOpen(): void;
    onWarpViewModalClose(): void;
    isOpened(): Promise<boolean>;
    private showPopup;
    close(): void;
    private prepareData;
    isHidden(gts: any): boolean;
    identify(index: any, item: any): any;
}
