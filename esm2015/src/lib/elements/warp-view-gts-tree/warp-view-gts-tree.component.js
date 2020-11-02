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
import { Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { ChartLib } from '../../utils/chart-lib';
import { GTSLib } from '../../utils/gts.lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
import { Subject } from 'rxjs';
/**
 *
 */
export class WarpViewGtsTreeComponent extends WarpViewComponent {
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.kbdLastKeyPressed = [];
        this.warpViewSelectedGTS = new EventEmitter();
        this._gtsFilter = 'x';
        this.gtsList = [];
        this.params = [];
        this.expand = false;
        this.initOpen = new Subject();
        this.LOG = new Logger(WarpViewGtsTreeComponent, this._debug);
    }
    set gtsFilter(gtsFilter) {
        this._gtsFilter = gtsFilter;
    }
    get gtsFilter() {
        return this._gtsFilter;
    }
    ngAfterViewInit() {
        this.LOG.debug(['componentDidLoad', 'data'], this._data);
        if (!!this._options.foldGTSTree && !this.expand) {
            this.foldAll();
        }
        if (!this._options.foldGTSTree) {
            this.initOpen.next();
        }
        if (this._data) {
            this.doRender();
        }
    }
    update(options, refresh) {
        if (!!this._options.foldGTSTree && !this.expand) {
            this.foldAll();
        }
        this.doRender();
    }
    doRender() {
        this.LOG.debug(['doRender', 'gtsList'], this._data);
        if (!this._data) {
            return;
        }
        this._options = ChartLib.mergeDeep(this.defOptions, this._options);
        const dataList = GTSLib.getData(this._data).data;
        this.params = this._data.params || [];
        this.LOG.debug(['doRender', 'gtsList', 'dataList'], dataList);
        if (!dataList) {
            return;
        }
        this.expand = !this._options.foldGTSTree;
        this.gtsList = GTSLib.flattenGtsIdArray(dataList, 0).res;
        this.LOG.debug(['doRender', 'gtsList'], this.gtsList, this._options.foldGTSTree, this.expand);
        this.loading = false;
        this.chartDraw.emit();
    }
    foldAll() {
        if (!this.root) {
            setTimeout(() => this.foldAll());
        }
        else {
            this.expand = false;
        }
    }
    toggleVisibility() {
        requestAnimationFrame(() => this.expand = !this.expand);
    }
    convert(data) {
        return [];
    }
    warpViewSelectedGTSHandler(event) {
        this.LOG.debug(['warpViewSelectedGTS'], event);
        this.warpViewSelectedGTS.emit(event);
    }
}
WarpViewGtsTreeComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-gts-tree',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\">\n  <div class=\"stack-level\" (click)=\"toggleVisibility()\">\n    <span [ngClass]=\"{expanded: this.expand, collapsed: !this.expand}\" #root></span> Results\n    <small id=\"inner-a\">List of {{gtsList.length}} item{{gtsList.length > 1 ? 's' : ''}}</small>\n  </div>\n  <warpview-tree-view [events]=\"initOpen.asObservable()\"\n                      [gtsList]=\"gtsList\" [branch]=\"false\" *ngIf=\"expand\" [params]=\"params\"\n                      [options]=\"_options\" (warpViewSelectedGTS)=\"warpViewSelectedGTSHandler($event)\"\n                      [debug]=\"debug\" [hiddenData]=\"hiddenData\" [gtsFilter]=\"gtsFilter\"\n                      [kbdLastKeyPressed]=\"kbdLastKeyPressed\"></warpview-tree-view>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host .wrapper{min-height:0!important;text-align:left}:host .stack-level{color:var(--gts-stack-font-color);cursor:pointer;font-size:1em;padding-top:5px}:host .stack-level+div{padding-left:25px}:host .expanded{background-image:var(--gts-tree-expanded-icon)}:host .collapsed,:host .expanded{background-position:0;background-repeat:no-repeat;margin-right:5px;padding:1px 10px}:host .collapsed{background-image:var(--gts-tree-collapsed-icon)}"]
            },] }
];
WarpViewGtsTreeComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewGtsTreeComponent.propDecorators = {
    root: [{ type: ViewChild, args: ['root', { static: true },] }],
    kbdLastKeyPressed: [{ type: Input, args: ['kbdLastKeyPressed',] }],
    gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
    warpViewSelectedGTS: [{ type: Output, args: ['warpViewSelectedGTS',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWd0cy10cmVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnAtdmlldy9wcm9qZWN0cy93YXJwdmlldy1uZy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWd0cy10cmVlL3dhcnAtdmlldy1ndHMtdHJlZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRXpELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFM0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQzFELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRTdCOztHQUVHO0FBT0gsTUFBTSxPQUFPLHdCQUF5QixTQUFRLGlCQUFpQjtJQXFCN0QsWUFDUyxFQUFjLEVBQ2QsUUFBbUIsRUFDbkIsV0FBd0IsRUFDeEIsTUFBYztRQUVyQixLQUFLLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFMbEMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQXRC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SSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRU8sT0FBTztRQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ2xDO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFUyxPQUFPLENBQUMsSUFBZTtRQUMvQixPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCwwQkFBMEIsQ0FBQyxLQUFLO1FBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7OztZQS9GRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsazRDQUFrRDtnQkFFbEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2FBQzNDOzs7WUExQkMsVUFBVTtZQUtWLFNBQVM7WUFTSCxXQUFXO1lBWGpCLE1BQU07OzttQkF5QkwsU0FBUyxTQUFDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7Z0NBRWhDLEtBQUssU0FBQyxtQkFBbUI7d0JBRXpCLEtBQUssU0FBQyxXQUFXO2tDQVFqQixNQUFNLFNBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uLy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7Q2hhcnRMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2NoYXJ0LWxpYic7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5pbXBvcnQge0RhdGFNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWwvZGF0YU1vZGVsJztcbmltcG9ydCB7U2l6ZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuLyoqXG4gKlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1ndHMtdHJlZScsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctZ3RzLXRyZWUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi93YXJwLXZpZXctZ3RzLXRyZWUuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3R3RzVHJlZUNvbXBvbmVudCBleHRlbmRzIFdhcnBWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBWaWV3Q2hpbGQoJ3Jvb3QnLCB7c3RhdGljOiB0cnVlfSkgcm9vdDogRWxlbWVudFJlZjtcblxuICBASW5wdXQoJ2tiZExhc3RLZXlQcmVzc2VkJykga2JkTGFzdEtleVByZXNzZWQ6IHN0cmluZ1tdID0gW107XG5cbiAgQElucHV0KCdndHNGaWx0ZXInKSBzZXQgZ3RzRmlsdGVyKGd0c0ZpbHRlcjogc3RyaW5nKSB7XG4gICAgdGhpcy5fZ3RzRmlsdGVyID0gZ3RzRmlsdGVyO1xuICB9XG5cbiAgZ2V0IGd0c0ZpbHRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZ3RzRmlsdGVyO1xuICB9XG5cbiAgQE91dHB1dCgnd2FycFZpZXdTZWxlY3RlZEdUUycpIHdhcnBWaWV3U2VsZWN0ZWRHVFMgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwcml2YXRlIF9ndHNGaWx0ZXIgPSAneCc7XG4gIGd0c0xpc3Q6IGFueVtdID0gW107XG4gIHBhcmFtczogUGFyYW1bXSA9IFtdIGFzIFBhcmFtW107XG4gIGV4cGFuZCA9IGZhbHNlO1xuXG4gIGluaXRPcGVuOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBzaXplU2VydmljZTogU2l6ZVNlcnZpY2UsXG4gICAgcHVibGljIG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIHN1cGVyKGVsLCByZW5kZXJlciwgc2l6ZVNlcnZpY2UsIG5nWm9uZSk7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3R3RzVHJlZUNvbXBvbmVudCwgdGhpcy5fZGVidWcpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnY29tcG9uZW50RGlkTG9hZCcsICdkYXRhJ10sIHRoaXMuX2RhdGEpO1xuICAgIGlmICghIXRoaXMuX29wdGlvbnMuZm9sZEdUU1RyZWUgJiYgIXRoaXMuZXhwYW5kKSB7XG4gICAgICB0aGlzLmZvbGRBbGwoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9vcHRpb25zLmZvbGRHVFNUcmVlKSB7XG4gICAgICB0aGlzLmluaXRPcGVuLm5leHQoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2RhdGEpIHtcbiAgICAgIHRoaXMuZG9SZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUob3B0aW9uczogUGFyYW0sIHJlZnJlc2g6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoISF0aGlzLl9vcHRpb25zLmZvbGRHVFNUcmVlICYmICF0aGlzLmV4cGFuZCkge1xuICAgICAgdGhpcy5mb2xkQWxsKCk7XG4gICAgfVxuICAgIHRoaXMuZG9SZW5kZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9SZW5kZXIoKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkb1JlbmRlcicsICdndHNMaXN0J10sIHRoaXMuX2RhdGEpO1xuICAgIGlmICghdGhpcy5fZGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9vcHRpb25zID0gQ2hhcnRMaWIubWVyZ2VEZWVwKHRoaXMuZGVmT3B0aW9ucywgdGhpcy5fb3B0aW9ucykgYXMgUGFyYW07XG4gICAgY29uc3QgZGF0YUxpc3QgPSBHVFNMaWIuZ2V0RGF0YSh0aGlzLl9kYXRhKS5kYXRhO1xuICAgIHRoaXMucGFyYW1zID0gdGhpcy5fZGF0YS5wYXJhbXMgfHwgW107XG4gICAgdGhpcy5MT0cuZGVidWcoWydkb1JlbmRlcicsICdndHNMaXN0JywgJ2RhdGFMaXN0J10sIGRhdGFMaXN0KTtcbiAgICBpZiAoIWRhdGFMaXN0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZXhwYW5kID0gIXRoaXMuX29wdGlvbnMuZm9sZEdUU1RyZWU7XG4gICAgdGhpcy5ndHNMaXN0ID0gR1RTTGliLmZsYXR0ZW5HdHNJZEFycmF5KGRhdGFMaXN0IGFzIGFueVtdLCAwKS5yZXM7XG4gICAgdGhpcy5MT0cuZGVidWcoWydkb1JlbmRlcicsICdndHNMaXN0J10sIHRoaXMuZ3RzTGlzdCwgdGhpcy5fb3B0aW9ucy5mb2xkR1RTVHJlZSwgdGhpcy5leHBhbmQpO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZm9sZEFsbCgpIHtcbiAgICBpZiAoIXRoaXMucm9vdCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmZvbGRBbGwoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXhwYW5kID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlVmlzaWJpbGl0eSgpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5leHBhbmQgPSAhdGhpcy5leHBhbmQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnZlcnQoZGF0YTogRGF0YU1vZGVsKTogYW55W10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHdhcnBWaWV3U2VsZWN0ZWRHVFNIYW5kbGVyKGV2ZW50KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWyd3YXJwVmlld1NlbGVjdGVkR1RTJ10sIGV2ZW50KTtcbiAgICB0aGlzLndhcnBWaWV3U2VsZWN0ZWRHVFMuZW1pdChldmVudCk7XG4gIH1cblxufVxuIl19