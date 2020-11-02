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
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Logger } from '../../../utils/logger';
import { GTSLib } from '../../../utils/gts.lib';
import { Param } from '../../../model/param';
import { Observable, Subject } from 'rxjs';
export class WarpViewTreeViewComponent {
    constructor() {
        this.gtsFilter = 'x';
        this.branch = false;
        this.hidden = false;
        this.warpViewSelectedGTS = new EventEmitter();
        this.hide = {};
        this.initOpen = new Subject();
        this.stateChange = new Subject();
        this._debug = false;
        this._hiddenData = [];
        this._kbdLastKeyPressed = [];
        this.LOG = new Logger(WarpViewTreeViewComponent, this.debug);
    }
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    get debug() {
        return this._debug;
    }
    set hiddenData(hiddenData) {
        this._hiddenData = [...hiddenData];
    }
    get hiddenData() {
        return this._hiddenData;
    }
    set kbdLastKeyPressed(kbdLastKeyPressed) {
        this.LOG.debug(['kbdLastKeyPressed'], kbdLastKeyPressed);
        this._kbdLastKeyPressed = kbdLastKeyPressed;
        if (kbdLastKeyPressed[0] === 'a') {
            this.stateChange.next(true);
        }
        if (kbdLastKeyPressed[0] === 'n') {
            this.stateChange.next(false);
        }
    }
    get kbdLastKeyPressed() {
        return this._kbdLastKeyPressed;
    }
    ngOnInit() {
        this.eventsSubscription = this.events.subscribe(() => this.open());
        this.LOG.debug(['ngOnInit'], this.gtsList);
        const size = this.gtsList.length;
        for (let i = 0; i < size; i++) {
            this.hide[i + ''] = false;
        }
    }
    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }
    toggleVisibility(index) {
        this.LOG.debug(['toggleVisibility'], index, this.hide);
        this.hide[index + ''] = !this.hide[index + ''];
    }
    isHidden(index) {
        return !!this.hide[index + ''] ? !!this.hide[index + ''] : false;
    }
    isGts(node) {
        return GTSLib.isGts(node);
    }
    identify(index, item) {
        return index;
    }
    warpViewSelectedGTSHandler(event) {
        // this.LOG.debug(['warpViewSelectedGTS'], event);
        this.warpViewSelectedGTS.emit(event);
    }
    open() {
        this.gtsList.forEach((g, index) => this.hide[index + ''] = true);
        setTimeout(() => this.initOpen.next());
    }
}
WarpViewTreeViewComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-tree-view',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"list\">\n  <ul *ngIf=\"gtsList\">\n    <li *ngFor=\"let gts of gtsList; trackBy:identify; index as index; first as first\">\n      <warpview-chip\n        *ngIf=\"isGts(gts)\"\n        [options]=\"options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\" [param]=\"params[gts.id]\"\n        [node]=\"{gts: gts}\" [gtsFilter]=\"gtsFilter\" [debug]=\"debug\" [hiddenData]=\"hiddenData\"\n        [events]=\"stateChange.asObservable()\"></warpview-chip>\n      <span *ngIf=\"!isGts(gts)\">\n        <span *ngIf=\"gts\">\n          <span *ngIf=\"branch\">\n            <span>\n            <span [ngClass]=\"{expanded:  hide[index + ''], collapsed: !hide[index + '']}\"\n                  (click)=\"toggleVisibility(index)\" [id]=\"'span-' + index\"> </span>\n                    <small (click)=\"toggleVisibility(index)\"> List of {{gts.length}}\n                      item{{gts.length > 1 ? 's' : ''}}</small>\n           </span>\n          </span>\n          <span *ngIf=\"!branch\">\n            <span class=\"stack-level\">\n              <span [ngClass]=\"{expanded: hide[index + ''], collapsed: !hide[index + '']}\"\n                    (click)=\"toggleVisibility(index)\" [id]=\"'span-' + index\"></span>\n              <span (click)=\"toggleVisibility(index)\">{{first ? '[TOP]' : '[' + (index + 1) + ']'}}&nbsp;\n                <small [id]=\"'inner-' + index\">List of {{gts.length}} item{{gts.length > 1 ? 's' : ''}}</small>\n              </span>\n                  </span>\n          </span>\n    <warpview-tree-view [gtsList]=\"gts\" [branch]=\"true\" *ngIf=\"hide[index + '']\"\n                        [debug]=\"debug\" [gtsFilter]=\"gtsFilter\" [params]=\"params\"\n                        [events]=\"initOpen.asObservable()\"\n                        [options]=\"options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\"\n                        [kbdLastKeyPressed]=\"kbdLastKeyPressed\" [hiddenData]=\"hiddenData\"></warpview-tree-view>\n        </span>\n      </span>\n    </li>\n  </ul>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host ul{border:none;list-style:none;margin:0;overflow:hidden;padding:0}:host li{color:var(--gts-stack-font-color,#000);line-height:20px;padding:0 0 0 20px;position:relative}:host .list,:host li .stack-level{font-size:1em;padding-top:5px}:host .list+div,:host li .stack-level+div{padding-left:25px}:host li .expanded{background-image:var(--gts-tree-expanded-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==))}:host li .collapsed,:host li .expanded{background-position:0;background-repeat:no-repeat;margin-right:5px;padding:1px 10px}:host li .collapsed{background-image:var(--gts-tree-collapsed-icon,url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=))}:host li .gtsInfo{white-space:normal;word-wrap:break-word}:host li .gtsInfo[disabled]{color:#aaa;cursor:not-allowed}:host li .normal{background-color:#bbb;border-radius:50%;display:inline-block}:host li i,:host li span{cursor:pointer}:host li .selected{background-color:#adf;font-weight:700;padding:1px 5px}"]
            },] }
];
WarpViewTreeViewComponent.ctorParameters = () => [];
WarpViewTreeViewComponent.propDecorators = {
    debug: [{ type: Input, args: ['debug',] }],
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    options: [{ type: Input, args: ['options',] }],
    gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
    gtsList: [{ type: Input, args: ['gtsList',] }],
    params: [{ type: Input, args: ['params',] }],
    branch: [{ type: Input, args: ['branch',] }],
    hidden: [{ type: Input, args: ['hidden',] }],
    events: [{ type: Input }],
    warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }],
    kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXRyZWUtdmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwLXZpZXcvcHJvamVjdHMvd2FycHZpZXctbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1ndHMtdHJlZS93YXJwLXZpZXctdHJlZS12aWV3L3dhcnAtdmlldy10cmVlLXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzNHLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDOUMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBUXZELE1BQU0sT0FBTyx5QkFBeUI7SUF1RHBDO1FBbkNvQixjQUFTLEdBQUcsR0FBRyxDQUFDO1FBR25CLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFDZixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBR0Qsd0JBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUU3RSxTQUFJLEdBQVEsRUFBRSxDQUFDO1FBQ2YsYUFBUSxHQUFrQixJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQzlDLGdCQUFXLEdBQXFCLElBQUksT0FBTyxFQUFXLENBQUM7UUFHL0MsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBRTNCLHVCQUFrQixHQUFhLEVBQUUsQ0FBQztRQW1CeEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE1BQU0s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Q0FBQztJQUVELDBCQUEwQixDQUFDLEtBQUs7UUFDOUIsa0RBQWtEO1FBQ2xELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELElBQUk7UUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ2pFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDekMsQ0FBQzs7O1lBeEdGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5Qix1cEZBQW1EO2dCQUVuRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsU0FBUzs7YUFDM0M7Ozs7b0JBR0UsS0FBSyxTQUFDLE9BQU87eUJBU2IsS0FBSyxTQUFDLFlBQVk7c0JBUWxCLEtBQUssU0FBQyxTQUFTO3dCQUNmLEtBQUssU0FBQyxXQUFXO3NCQUNqQixLQUFLLFNBQUMsU0FBUztxQkFDZixLQUFLLFNBQUMsUUFBUTtxQkFDZCxLQUFLLFNBQUMsUUFBUTtxQkFDZCxLQUFLLFNBQUMsUUFBUTtxQkFDZCxLQUFLO2tDQUVMLE1BQU0sU0FBQyxxQkFBcUI7Z0NBWTVCLEtBQUssU0FBQyxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvbG9nZ2VyJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctdHJlZS12aWV3JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy10cmVlLXZpZXcuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctdHJlZS12aWV3LmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld1RyZWVWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gIEBJbnB1dCgnZGVidWcnKSBzZXQgZGVidWcoZGVidWc6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kZWJ1ZyA9IGRlYnVnO1xuICAgIHRoaXMuTE9HLnNldERlYnVnKGRlYnVnKTtcbiAgfVxuXG4gIGdldCBkZWJ1ZygpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVidWc7XG4gIH1cblxuICBASW5wdXQoJ2hpZGRlbkRhdGEnKSBzZXQgaGlkZGVuRGF0YShoaWRkZW5EYXRhOiBudW1iZXJbXSkge1xuICAgIHRoaXMuX2hpZGRlbkRhdGEgPSBbLi4uaGlkZGVuRGF0YV07XG4gIH1cblxuICBnZXQgaGlkZGVuRGF0YSgpOiBudW1iZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2hpZGRlbkRhdGE7XG4gIH1cblxuICBASW5wdXQoJ29wdGlvbnMnKSBvcHRpb25zOiBQYXJhbTtcbiAgQElucHV0KCdndHNGaWx0ZXInKSBndHNGaWx0ZXIgPSAneCc7XG4gIEBJbnB1dCgnZ3RzTGlzdCcpIGd0c0xpc3Q6IGFueVtdO1xuICBASW5wdXQoJ3BhcmFtcycpIHBhcmFtczogUGFyYW1bXTtcbiAgQElucHV0KCdicmFuY2gnKSBicmFuY2ggPSBmYWxzZTtcbiAgQElucHV0KCdoaWRkZW4nKSBoaWRkZW4gPSBmYWxzZTtcbiAgQElucHV0KCkgZXZlbnRzOiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG4gIEBPdXRwdXQoJ3dhcnBWaWV3U2VsZWN0ZWRHVFMnKSB3YXJwVmlld1NlbGVjdGVkR1RTID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgaGlkZTogYW55ID0ge307XG4gIGluaXRPcGVuOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgc3RhdGVDaGFuZ2U6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIHByaXZhdGUgTE9HOiBMb2dnZXI7XG4gIHByaXZhdGUgX2RlYnVnID0gZmFsc2U7XG4gIHByaXZhdGUgX2hpZGRlbkRhdGE6IG51bWJlcltdID0gW107XG4gIHByaXZhdGUgZXZlbnRzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX2tiZExhc3RLZXlQcmVzc2VkOiBzdHJpbmdbXSA9IFtdO1xuXG4gIEBJbnB1dCgna2JkTGFzdEtleVByZXNzZWQnKVxuICBzZXQga2JkTGFzdEtleVByZXNzZWQoa2JkTGFzdEtleVByZXNzZWQ6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydrYmRMYXN0S2V5UHJlc3NlZCddLCBrYmRMYXN0S2V5UHJlc3NlZCk7XG4gICAgdGhpcy5fa2JkTGFzdEtleVByZXNzZWQgPSBrYmRMYXN0S2V5UHJlc3NlZDtcbiAgICBpZiAoa2JkTGFzdEtleVByZXNzZWRbMF0gPT09ICdhJykge1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZS5uZXh0KHRydWUpO1xuICAgIH1cbiAgICBpZiAoa2JkTGFzdEtleVByZXNzZWRbMF0gPT09ICduJykge1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZS5uZXh0KGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBnZXQga2JkTGFzdEtleVByZXNzZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2tiZExhc3RLZXlQcmVzc2VkO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3VHJlZVZpZXdDb21wb25lbnQsIHRoaXMuZGVidWcpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5ldmVudHNTdWJzY3JpcHRpb24gPSB0aGlzLmV2ZW50cy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5vcGVuKCkpO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnbmdPbkluaXQnXSwgdGhpcy5ndHNMaXN0KTtcbiAgICBjb25zdCBzaXplID0gdGhpcy5ndHNMaXN0Lmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgdGhpcy5oaWRlW2kgKyAnJ10gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmV2ZW50c1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cblxuICB0b2dnbGVWaXNpYmlsaXR5KGluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3RvZ2dsZVZpc2liaWxpdHknXSwgaW5kZXgsIHRoaXMuaGlkZSk7XG4gICAgdGhpcy5oaWRlW2luZGV4ICsgJyddID0gIXRoaXMuaGlkZVtpbmRleCArICcnXTtcbiAgfVxuXG4gIGlzSGlkZGVuKGluZGV4OiBudW1iZXIpIHtcbiAgICByZXR1cm4gISF0aGlzLmhpZGVbaW5kZXggKyAnJ10gPyAhIXRoaXMuaGlkZVtpbmRleCArICcnXSA6IGZhbHNlO1xuICB9XG5cbiAgaXNHdHMobm9kZSkge1xuICAgIHJldHVybiBHVFNMaWIuaXNHdHMobm9kZSk7XG4gIH1cblxuICBpZGVudGlmeShpbmRleCwgaXRlbSkge1xuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIHdhcnBWaWV3U2VsZWN0ZWRHVFNIYW5kbGVyKGV2ZW50KSB7XG4gICAgLy8gdGhpcy5MT0cuZGVidWcoWyd3YXJwVmlld1NlbGVjdGVkR1RTJ10sIGV2ZW50KTtcbiAgICB0aGlzLndhcnBWaWV3U2VsZWN0ZWRHVFMuZW1pdChldmVudCk7XG4gIH1cblxuICBvcGVuKCkge1xuICAgIHRoaXMuZ3RzTGlzdC5mb3JFYWNoKChnLCBpbmRleCkgPT4gdGhpcy5oaWRlW2luZGV4ICsgJyddID0gdHJ1ZSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmluaXRPcGVuLm5leHQoKSk7XG4gIH1cbn1cbiJdfQ==