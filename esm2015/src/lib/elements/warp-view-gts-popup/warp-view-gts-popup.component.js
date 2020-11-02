/*
 *  Copyright 2020  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataModel } from '../../model/dataModel';
import { Logger } from '../../utils/logger';
import { GTSLib } from '../../utils/gts.lib';
import { WarpViewModalComponent } from '../warp-view-modal/warp-view-modal.component';
import { Param } from '../../model/param';
import deepEqual from 'deep-equal';
import { ChartLib } from '../../utils/chart-lib';
/**
 *
 */
export class WarpViewGtsPopupComponent {
    constructor() {
        this.maxToShow = 5;
        this.warpViewSelectedGTS = new EventEmitter();
        this.warpViewModalOpen = new EventEmitter();
        this.warpViewModalClose = new EventEmitter();
        this.current = 0;
        // tslint:disable-next-line:variable-name
        this._gts = [];
        this._options = new Param();
        // tslint:disable-next-line:variable-name
        this._kbdLastKeyPressed = [];
        // tslint:disable-next-line:variable-name
        this._hiddenData = [];
        // tslint:disable-next-line:variable-name
        this._debug = false;
        this.displayed = [];
        this.modalOpenned = false;
        this.LOG = new Logger(WarpViewGtsPopupComponent, this.debug);
    }
    set options(options) {
        this.LOG.debug(['onOptions'], options);
        if (typeof options === 'string') {
            options = JSON.parse(options);
        }
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['options', 'changed'], options);
            this._options = ChartLib.mergeDeep(this._options, options);
            this.prepareData();
        }
    }
    set gtsList(gtsList) {
        this._gtsList = gtsList;
        this.LOG.debug(['_gtsList'], this._gtsList);
        this.prepareData();
    }
    get gtslist() {
        return this._gtsList;
    }
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    get debug() {
        return this._debug;
    }
    set data(data) {
        this.LOG.debug(['data'], data);
        if (data) {
            this._data = data;
        }
    }
    get data() {
        return this._data;
    }
    set hiddenData(hiddenData) {
        this._hiddenData = hiddenData;
        this.prepareData();
    }
    get hiddenData() {
        return this._hiddenData;
    }
    set kbdLastKeyPressed(kbdLastKeyPressed) {
        this._kbdLastKeyPressed = kbdLastKeyPressed;
        if (kbdLastKeyPressed[0] === 's' && !this.modalOpenned) {
            this.showPopup();
        }
        else if (this.modalOpenned) {
            switch (kbdLastKeyPressed[0]) {
                case 'ArrowUp':
                case 'j':
                    this.current = Math.max(0, this.current - 1);
                    this.prepareData();
                    break;
                case 'ArrowDown':
                case 'k':
                    this.current = Math.min(this._gts.length - 1, this.current + 1);
                    this.prepareData();
                    break;
                case ' ':
                    this.warpViewSelectedGTS.emit({
                        gts: this._gts[this.current],
                        selected: this.hiddenData.indexOf(this._gts[this.current].id) > -1
                    });
                    break;
                default:
                    return;
            }
        }
    }
    get kbdLastKeyPressed() {
        return this._kbdLastKeyPressed;
    }
    ngAfterViewInit() {
        this.prepareData();
    }
    onWarpViewModalOpen() {
        this.modalOpenned = true;
        this.warpViewModalOpen.emit({});
    }
    onWarpViewModalClose() {
        this.modalOpenned = false;
        this.warpViewModalClose.emit({});
    }
    isOpened() {
        return this.modal.isOpened();
    }
    showPopup() {
        this.current = 0;
        this.prepareData();
        this.modal.open();
    }
    close() {
        this.modal.close();
    }
    prepareData() {
        if (this._gtsList && this._gtsList.data) {
            this._gts = GTSLib.flatDeep([this._gtsList.data]);
            this.displayed = this._gts.slice(Math.max(0, Math.min(this.current - this.maxToShow, this._gts.length - 2 * this.maxToShow)), Math.min(this._gts.length, this.current + this.maxToShow + Math.abs(Math.min(this.current - this.maxToShow, 0))));
            this.LOG.debug(['prepareData'], this.displayed);
        }
    }
    isHidden(gts) {
        return !this.displayed.find(g => !!gts ? gts.id === g.id : false);
    }
    identify(index, item) {
        return index;
    }
}
WarpViewGtsPopupComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-gts-popup',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n                modalTitle=\"GTS Selector\"\n                #modal\n                (warpViewModalClose)=\"onWarpViewModalClose()\"\n                (warpViewModalOpen)=\"onWarpViewModalOpen()\">\n  <div class=\"up-arrow\" *ngIf=\"this.current > 0\"></div>\n  <ul>\n    <li *ngFor=\"let g of _gts; index as index; trackBy:identify\"\n        [ngClass]=\"{ selected: current == index, hidden: isHidden(g.id) }\"\n    >\n      <warpview-chip [node]=\"{gts: g}\" [hiddenData]=\"hiddenData\" [options]=\"_options\"></warpview-chip>\n    </li>\n  </ul>\n  <div class=\"down-arrow\" *ngIf=\"current < _gts.length - 1\"></div>\n</warpview-modal>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}"]
            },] }
];
WarpViewGtsPopupComponent.ctorParameters = () => [];
WarpViewGtsPopupComponent.propDecorators = {
    modal: [{ type: ViewChild, args: ['modal', { static: true },] }],
    options: [{ type: Input, args: ['options',] }],
    gtsList: [{ type: Input, args: ['gtsList',] }],
    debug: [{ type: Input, args: ['debug',] }],
    data: [{ type: Input, args: ['data',] }],
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    maxToShow: [{ type: Input, args: ['maxToShow',] }],
    kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
    warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }],
    warpViewModalOpen: [{ type: Output, args: ['warpViewModalOpen',] }],
    warpViewModalClose: [{ type: Output, args: ['warpViewModalClose',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWd0cy1wb3B1cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwLXZpZXcvcHJvamVjdHMvd2FycHZpZXctbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1ndHMtcG9wdXAvd2FycC12aWV3LWd0cy1wb3B1cC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFnQixTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xILE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBQ3BGLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUN4QyxPQUFPLFNBQVMsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRS9DOztHQUVHO0FBT0gsTUFBTSxPQUFPLHlCQUF5QjtJQWlIcEM7UUF6RG9CLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFrQ0gsd0JBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNoRCxzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzNDLHVCQUFrQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFM0UsWUFBTyxHQUFHLENBQUMsQ0FBQztRQUNaLHlDQUF5QztRQUN6QyxTQUFJLEdBQVUsRUFBRSxDQUFDO1FBQ2pCLGFBQVEsR0FB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QyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUN4RyxDQUFDO1lBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDakQ7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLEdBQUc7UUFDVixPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUk7UUFDbEIsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOzs7WUF4S0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLCswQ0FBbUQ7Z0JBRW5ELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTOzthQUMzQzs7OztvQkFFRSxTQUFTLFNBQUMsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztzQkFFakMsS0FBSyxTQUFDLFNBQVM7c0JBWWYsS0FBSyxTQUFDLFNBQVM7b0JBV2YsS0FBSyxTQUFDLE9BQU87bUJBU2IsS0FBSyxTQUFDLE1BQU07eUJBWVosS0FBSyxTQUFDLFlBQVk7d0JBU2xCLEtBQUssU0FBQyxXQUFXO2dDQUVqQixLQUFLLFNBQUMsbUJBQW1CO2tDQWdDekIsTUFBTSxTQUFDLHFCQUFxQjtnQ0FDNUIsTUFBTSxTQUFDLG1CQUFtQjtpQ0FDMUIsTUFBTSxTQUFDLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCwgVmlld0NoaWxkLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtXYXJwVmlld01vZGFsQ29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctbW9kYWwvd2FycC12aWV3LW1vZGFsLmNvbXBvbmVudCc7XG5pbXBvcnQge1BhcmFtfSBmcm9tICcuLi8uLi9tb2RlbC9wYXJhbSc7XG5pbXBvcnQgZGVlcEVxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xuaW1wb3J0IHtDaGFydExpYn0gZnJvbSAnLi4vLi4vdXRpbHMvY2hhcnQtbGliJztcblxuLyoqXG4gKlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1ndHMtcG9wdXAnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWd0cy1wb3B1cC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1ndHMtcG9wdXAuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3R3RzUG9wdXBDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZCgnbW9kYWwnLCB7c3RhdGljOiB0cnVlfSkgbW9kYWw6IFdhcnBWaWV3TW9kYWxDb21wb25lbnQ7XG5cbiAgQElucHV0KCdvcHRpb25zJykgc2V0IG9wdGlvbnMob3B0aW9uczogUGFyYW0gfCBzdHJpbmcpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uT3B0aW9ucyddLCBvcHRpb25zKTtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvcHRpb25zID0gSlNPTi5wYXJzZShvcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKCFkZWVwRXF1YWwob3B0aW9ucywgdGhpcy5fb3B0aW9ucykpIHtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnb3B0aW9ucycsICdjaGFuZ2VkJ10sIG9wdGlvbnMpO1xuICAgICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcCh0aGlzLl9vcHRpb25zLCBvcHRpb25zIGFzIFBhcmFtKSBhcyBQYXJhbTtcbiAgICAgIHRoaXMucHJlcGFyZURhdGEoKTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2d0c0xpc3QnKSBzZXQgZ3RzTGlzdChndHNMaXN0OiBEYXRhTW9kZWwpIHtcbiAgICB0aGlzLl9ndHNMaXN0ID0gZ3RzTGlzdDtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ19ndHNMaXN0J10sIHRoaXMuX2d0c0xpc3QpO1xuXG4gICAgdGhpcy5wcmVwYXJlRGF0YSgpO1xuICB9XG5cbiAgZ2V0IGd0c2xpc3QoKTogRGF0YU1vZGVsIHtcbiAgICByZXR1cm4gdGhpcy5fZ3RzTGlzdDtcbiAgfVxuXG4gIEBJbnB1dCgnZGVidWcnKSBzZXQgZGVidWcoZGVidWc6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kZWJ1ZyA9IGRlYnVnO1xuICAgIHRoaXMuTE9HLnNldERlYnVnKGRlYnVnKTtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVidWc7XG4gIH1cblxuICBASW5wdXQoJ2RhdGEnKSBzZXQgZGF0YShkYXRhOiBEYXRhTW9kZWwpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RhdGEnXSwgZGF0YSk7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICAgIH1cbiAgfVxuXG4gIGdldCBkYXRhKCk6IERhdGFNb2RlbCB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gIH1cblxuXG4gIEBJbnB1dCgnaGlkZGVuRGF0YScpIHNldCBoaWRkZW5EYXRhKGhpZGRlbkRhdGE6IG51bWJlcltdKSB7XG4gICAgdGhpcy5faGlkZGVuRGF0YSA9IGhpZGRlbkRhdGE7XG4gICAgdGhpcy5wcmVwYXJlRGF0YSgpO1xuICB9XG5cbiAgZ2V0IGhpZGRlbkRhdGEoKTogbnVtYmVyW10ge1xuICAgIHJldHVybiB0aGlzLl9oaWRkZW5EYXRhO1xuICB9XG5cbiAgQElucHV0KCdtYXhUb1Nob3cnKSBtYXhUb1Nob3cgPSA1O1xuXG4gIEBJbnB1dCgna2JkTGFzdEtleVByZXNzZWQnKSBzZXQga2JkTGFzdEtleVByZXNzZWQoa2JkTGFzdEtleVByZXNzZWQ6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fa2JkTGFzdEtleVByZXNzZWQgPSBrYmRMYXN0S2V5UHJlc3NlZDtcbiAgICBpZiAoa2JkTGFzdEtleVByZXNzZWRbMF0gPT09ICdzJyAmJiAhdGhpcy5tb2RhbE9wZW5uZWQpIHtcbiAgICAgIHRoaXMuc2hvd1BvcHVwKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1vZGFsT3Blbm5lZCkge1xuICAgICAgc3dpdGNoIChrYmRMYXN0S2V5UHJlc3NlZFswXSkge1xuICAgICAgICBjYXNlJ0Fycm93VXAnOlxuICAgICAgICBjYXNlJ2onOlxuICAgICAgICAgIHRoaXMuY3VycmVudCA9IE1hdGgubWF4KDAsIHRoaXMuY3VycmVudCAtIDEpO1xuICAgICAgICAgIHRoaXMucHJlcGFyZURhdGEoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgY2FzZSAnayc6XG4gICAgICAgICAgdGhpcy5jdXJyZW50ID0gTWF0aC5taW4odGhpcy5fZ3RzLmxlbmd0aCAtIDEsIHRoaXMuY3VycmVudCArIDEpO1xuICAgICAgICAgIHRoaXMucHJlcGFyZURhdGEoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgdGhpcy53YXJwVmlld1NlbGVjdGVkR1RTLmVtaXQoe1xuICAgICAgICAgICAgZ3RzOiB0aGlzLl9ndHNbdGhpcy5jdXJyZW50XSxcbiAgICAgICAgICAgIHNlbGVjdGVkOiB0aGlzLmhpZGRlbkRhdGEuaW5kZXhPZih0aGlzLl9ndHNbdGhpcy5jdXJyZW50XS5pZCkgPiAtMVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXQga2JkTGFzdEtleVByZXNzZWQoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl9rYmRMYXN0S2V5UHJlc3NlZDtcbiAgfVxuXG4gIEBPdXRwdXQoJ3dhcnBWaWV3U2VsZWN0ZWRHVFMnKSB3YXJwVmlld1NlbGVjdGVkR1RTID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3dhcnBWaWV3TW9kYWxPcGVuJykgd2FycFZpZXdNb2RhbE9wZW4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnd2FycFZpZXdNb2RhbENsb3NlJykgd2FycFZpZXdNb2RhbENsb3NlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgY3VycmVudCA9IDA7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIF9ndHM6IGFueVtdID0gW107XG4gIF9vcHRpb25zOiBQYXJhbSA9IG5ldyBQYXJhbSgpO1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX2tiZExhc3RLZXlQcmVzc2VkOiBzdHJpbmdbXSA9IFtdO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9oaWRkZW5EYXRhOiBudW1iZXJbXSA9IFtdO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9kZWJ1ZyA9IGZhbHNlO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9ndHNMaXN0OiBEYXRhTW9kZWw7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIHByaXZhdGUgX2RhdGE6IERhdGFNb2RlbDtcbiAgcHJpdmF0ZSBkaXNwbGF5ZWQ6IGFueVtdID0gW107XG4gIHByaXZhdGUgbW9kYWxPcGVubmVkID0gZmFsc2U7XG4gIHByaXZhdGUgTE9HOiBMb2dnZXI7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3R3RzUG9wdXBDb21wb25lbnQsIHRoaXMuZGVidWcpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMucHJlcGFyZURhdGEoKTtcbiAgfVxuXG4gIG9uV2FycFZpZXdNb2RhbE9wZW4oKSB7XG4gICAgdGhpcy5tb2RhbE9wZW5uZWQgPSB0cnVlO1xuICAgIHRoaXMud2FycFZpZXdNb2RhbE9wZW4uZW1pdCh7fSk7XG4gIH1cblxuICBvbldhcnBWaWV3TW9kYWxDbG9zZSgpIHtcbiAgICB0aGlzLm1vZGFsT3Blbm5lZCA9IGZhbHNlO1xuICAgIHRoaXMud2FycFZpZXdNb2RhbENsb3NlLmVtaXQoe30pO1xuICB9XG5cbiAgcHVibGljIGlzT3BlbmVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLm1vZGFsLmlzT3BlbmVkKCk7XG4gIH1cblxuICBwcml2YXRlIHNob3dQb3B1cCgpIHtcbiAgICB0aGlzLmN1cnJlbnQgPSAwO1xuICAgIHRoaXMucHJlcGFyZURhdGEoKTtcbiAgICB0aGlzLm1vZGFsLm9wZW4oKTtcbiAgfVxuXG4gIHB1YmxpYyBjbG9zZSgpIHtcbiAgICB0aGlzLm1vZGFsLmNsb3NlKCk7XG4gIH1cblxuICBwcml2YXRlIHByZXBhcmVEYXRhKCkge1xuICAgIGlmICh0aGlzLl9ndHNMaXN0ICYmIHRoaXMuX2d0c0xpc3QuZGF0YSkge1xuICAgICAgdGhpcy5fZ3RzID0gR1RTTGliLmZsYXREZWVwKFt0aGlzLl9ndHNMaXN0LmRhdGFdKTtcbiAgICAgIHRoaXMuZGlzcGxheWVkID0gdGhpcy5fZ3RzLnNsaWNlKFxuICAgICAgICBNYXRoLm1heCgwLCBNYXRoLm1pbih0aGlzLmN1cnJlbnQgLSB0aGlzLm1heFRvU2hvdywgdGhpcy5fZ3RzLmxlbmd0aCAtIDIgKiB0aGlzLm1heFRvU2hvdykpLFxuICAgICAgICBNYXRoLm1pbih0aGlzLl9ndHMubGVuZ3RoLCB0aGlzLmN1cnJlbnQgKyB0aGlzLm1heFRvU2hvdyArIE1hdGguYWJzKE1hdGgubWluKHRoaXMuY3VycmVudCAtIHRoaXMubWF4VG9TaG93LCAwKSkpXG4gICAgICApIGFzIGFueVtdO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydwcmVwYXJlRGF0YSddLCB0aGlzLmRpc3BsYXllZCk7XG4gICAgfVxuICB9XG5cbiAgaXNIaWRkZW4oZ3RzKSB7XG4gICAgcmV0dXJuICF0aGlzLmRpc3BsYXllZC5maW5kKGcgPT4gISFndHMgPyBndHMuaWQgPT09IGcuaWQgOiBmYWxzZSk7XG4gIH1cblxuICBpZGVudGlmeShpbmRleCwgaXRlbSkge1xuICAgIHJldHVybiBpbmRleDtcbiAgfVxufVxuIl19