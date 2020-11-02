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
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Logger } from '../../../utils/logger';
import { Param } from '../../../model/param';
import { ChartLib } from '../../../utils/chart-lib';
import deepEqual from 'deep-equal';
import { GTSLib } from '../../../utils/gts.lib';
export class WarpViewPaginableComponent {
    constructor() {
        this.elemsCount = 15;
        this.windowed = 5;
        this.page = 0;
        this.pages = [];
        this.displayedValues = [];
        // tslint:disable-next-line:variable-name
        this._debug = false;
        // tslint:disable-next-line:variable-name
        this._options = Object.assign(Object.assign({}, new Param()), {
            timeMode: 'date',
            timeZone: 'UTC',
            timeUnit: 'us',
            bounds: {}
        });
        this.LOG = new Logger(WarpViewPaginableComponent, this.debug);
    }
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    get debug() {
        return this._debug;
    }
    set options(options) {
        if (!deepEqual(options, this._options)) {
            this.drawGridData();
        }
    }
    set data(data) {
        if (data) {
            this._data = data;
            this.drawGridData();
        }
    }
    goto(page) {
        this.page = page;
        this.drawGridData();
    }
    next() {
        this.page = Math.min(this.page + 1, this._data.values.length - 1);
        this.drawGridData();
    }
    prev() {
        this.page = Math.max(this.page - 1, 0);
        this.drawGridData();
    }
    drawGridData() {
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.LOG.debug(['drawGridData', '_options'], this._options);
        if (!this._data) {
            return;
        }
        this.pages = [];
        for (let i = 0; i < (this._data.values || []).length / this.elemsCount; i++) {
            this.pages.push(i);
        }
        this.displayedValues = (this._data.values || []).slice(Math.max(0, this.elemsCount * this.page), Math.min(this.elemsCount * (this.page + 1), (this._data.values || []).length));
        this.LOG.debug(['drawGridData', '_data'], this._data);
    }
    decodeURIComponent(str) {
        return decodeURIComponent(str);
    }
    ngOnInit() {
        this.drawGridData();
    }
    formatLabel(name) {
        return GTSLib.formatLabel(name);
    }
}
WarpViewPaginableComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-paginable',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div>\n  <div class=\"heading\" [innerHTML]=\"formatLabel(_data.name)\"></div>\n  <table>\n    <thead>\n    <th *ngFor=\"let h of _data.headers\">{{h}}</th>\n    </thead>\n    <tbody>\n    <tr *ngFor=\"let value of displayedValues; even as isEven; odd as isOdd\" [ngClass]=\"{ odd: isOdd, even: isEven}\">\n      <td *ngFor=\"let v of value\">\n        <span [innerHTML]=\"v\"></span>\n      </td>\n    </tr>\n    </tbody>\n  </table>\n  <div class=\"center\">\n    <div class=\"pagination\">\n      <div class=\"prev hoverable\" (click)=\"prev()\" *ngIf=\"page !== 0\">&lt;</div>\n      <div class=\"index disabled\" *ngIf=\"page - windowed > 0\">...</div>\n      <span *ngFor=\"let c of pages\">\n        <span *ngIf=\" c >= page - windowed && c <= page + windowed\"\n             [ngClass]=\"{ index: true, hoverable: page !== c, active: page === c}\" (click)=\"goto(c)\">{{c}}</span>\n      </span>\n      <div class=\"index disabled\" *ngIf=\"page + windowed < pages.length\">...</div>\n      <div class=\"next hoverable\" (click)=\"next()\" *ngIf=\"page + windowed < (_data.values ||\u00A0[]).length - 1\">&gt;</div>\n    </div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.gts-classname{color:var(--gts-classname-font-color)}.gts-labelname{color:var(--gts-labelname-font-color)}.gts-attrname{color:var(--gts-attrname-font-color)}.gts-separator{color:var(--gts-separator-font-color)}.gts-labelvalue{color:var(--gts-labelvalue-font-color);font-style:italic}.gts-attrvalue{color:var(--gts-attrvalue-font-color);font-style:italic}:host table{color:var(--warp-view-font-color);width:100%}:host table td,:host table th{padding:var(--warp-view-datagrid-cell-padding)}:host table .odd{background-color:var(--warp-view-datagrid-odd-bg-color);color:var(--warp-view-datagrid-odd-color)}:host table .even{background-color:var(--warp-view-datagrid-even-bg-color);color:var(--warp-view-datagrid-even-color)}:host .center{text-align:center}:host .center .pagination{display:inline-block}:host .center .pagination .index,:host .center .pagination .next,:host .center .pagination .prev{background-color:var(--warp-view-pagination-bg-color);border:1px solid var(--warp-view-pagination-border-color);color:var(--warp-view-font-color);cursor:pointer;float:left;margin:0;padding:8px 16px;text-decoration:none;transition:background-color .3s}:host .center .pagination .index.active,:host .center .pagination .next.active,:host .center .pagination .prev.active{background-color:var(--warp-view-pagination-active-bg-color);border:1px solid var(--warp-view-pagination-active-border-color);color:var(--warp-view-pagination-active-color)}:host .center .pagination .index.hoverable:hover,:host .center .pagination .next.hoverable:hover,:host .center .pagination .prev.hoverable:hover{background-color:var(--warp-view-pagination-hover-bg-color);border:1px solid var(--warp-view-pagination-hover-border-color);color:var(--warp-view-pagination-hover-color)}:host .center .pagination .index.disabled,:host .center .pagination .next.disabled,:host .center .pagination .prev.disabled{color:var(--warp-view-pagination-disabled-color);cursor:auto}:host .round{background-color:#bbb;border:2px solid #454545;border-radius:50%;display:inline-block;height:12px;width:12px}:host ul{list-style:none}"]
            },] }
];
WarpViewPaginableComponent.ctorParameters = () => [];
WarpViewPaginableComponent.propDecorators = {
    debug: [{ type: Input, args: ['debug',] }],
    options: [{ type: Input, args: ['options',] }],
    data: [{ type: Input, args: ['data',] }],
    elemsCount: [{ type: Input, args: ['elemsCount',] }],
    windowed: [{ type: Input, args: ['windowed',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXBhZ2luYWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwLXZpZXcvcHJvamVjdHMvd2FycHZpZXctbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1kYXRhZ3JpZC93YXJwLXZpZXctcGFnaW5hYmxlL3dhcnAtdmlldy1wYWdpbmFibGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFVLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFFLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDM0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ2xELE9BQU8sU0FBUyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFROUMsTUFBTSxPQUFPLDBCQUEwQjtJQUNyQztRQTBCcUIsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNsQixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWhDLFNBQUksR0FBRyxDQUFDLENBQUM7UUFDVCxVQUFLLEdBQWEsRUFBRSxDQUFDO1FBR3JCLG9CQUFlLEdBQVUsRUFBRSxDQUFDO1FBRTVCLHlDQUF5QztRQUNqQyxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLHlDQUF5QztRQUNqQyxhQUFRLG1DQUNYLElBQUksS0FBSyxFQUFFLEdBQUs7WUFDakIsUUFBUSxFQUFFLE1BQU07WUFDaEIsUUFBUSxFQUFFLEtBQUs7WUFDZixRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxFQUFFO1NBQ1gsRUFDRDtRQTVDQSxJQUFJLENBQUMsR0FB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S0FBSyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELGtCQUFrQixDQUFDLEdBQVc7UUFDNUIsT0FBTyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsV0FBVyxDQUFDLElBQVk7UUFDdEIsT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7OztZQWhHRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIscXhEQUFtRDtnQkFFbkQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2FBQzNDOzs7O29CQU1FLEtBQUssU0FBQyxPQUFPO3NCQVNiLEtBQUssU0FBQyxTQUFTO21CQU1mLEtBQUssU0FBQyxNQUFNO3lCQU9aLEtBQUssU0FBQyxZQUFZO3VCQUNsQixLQUFLLFNBQUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtDaGFydExpYn0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvY2hhcnQtbGliJztcbmltcG9ydCBkZWVwRXF1YWwgZnJvbSAnZGVlcC1lcXVhbCc7XG5pbXBvcnQge0dUU0xpYn0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZ3RzLmxpYic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dhcnB2aWV3LXBhZ2luYWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi93YXJwLXZpZXctcGFnaW5hYmxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LXBhZ2luYWJsZS5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5TaGFkb3dEb21cbn0pXG5leHBvcnQgY2xhc3MgV2FycFZpZXdQYWdpbmFibGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdQYWdpbmFibGVDb21wb25lbnQsIHRoaXMuZGVidWcpO1xuICB9XG5cbiAgQElucHV0KCdkZWJ1ZycpIHNldCBkZWJ1ZyhkZWJ1ZzogYm9vbGVhbikge1xuICAgIHRoaXMuX2RlYnVnID0gZGVidWc7XG4gICAgdGhpcy5MT0cuc2V0RGVidWcoZGVidWcpO1xuICB9XG5cbiAgZ2V0IGRlYnVnKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWJ1ZztcbiAgfVxuXG4gIEBJbnB1dCgnb3B0aW9ucycpIHNldCBvcHRpb25zKG9wdGlvbnM6IFBhcmFtKSB7XG4gICAgaWYgKCFkZWVwRXF1YWwob3B0aW9ucywgdGhpcy5fb3B0aW9ucykpIHtcbiAgICAgIHRoaXMuZHJhd0dyaWREYXRhKCk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdkYXRhJykgc2V0IGRhdGEoZGF0YTogeyBuYW1lOiBzdHJpbmcsIHZhbHVlczogYW55W10sIGhlYWRlcnM6IHN0cmluZ1tdIH0pIHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gICAgICB0aGlzLmRyYXdHcmlkRGF0YSgpO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgnZWxlbXNDb3VudCcpIGVsZW1zQ291bnQgPSAxNTtcbiAgQElucHV0KCd3aW5kb3dlZCcpIHdpbmRvd2VkID0gNTtcblxuICBwYWdlID0gMDtcbiAgcGFnZXM6IG51bWJlcltdID0gW107XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIF9kYXRhOiB7IG5hbWU6IHN0cmluZywgdmFsdWVzOiBhbnlbXSwgaGVhZGVyczogc3RyaW5nW10gfTtcbiAgZGlzcGxheWVkVmFsdWVzOiBhbnlbXSA9IFtdO1xuICBwcml2YXRlIExPRzogTG9nZ2VyO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9kZWJ1ZyA9IGZhbHNlO1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxuICBwcml2YXRlIF9vcHRpb25zOiBQYXJhbSA9IHtcbiAgICAuLi5uZXcgUGFyYW0oKSwgLi4ue1xuICAgICAgdGltZU1vZGU6ICdkYXRlJyxcbiAgICAgIHRpbWVab25lOiAnVVRDJyxcbiAgICAgIHRpbWVVbml0OiAndXMnLFxuICAgICAgYm91bmRzOiB7fVxuICAgIH1cbiAgfTtcblxuICBnb3RvKHBhZ2U6IG51bWJlcikge1xuICAgIHRoaXMucGFnZSA9IHBhZ2U7XG4gICAgdGhpcy5kcmF3R3JpZERhdGEoKTtcbiAgfVxuXG4gIG5leHQoKSB7XG4gICAgdGhpcy5wYWdlID0gTWF0aC5taW4odGhpcy5wYWdlICsgMSwgdGhpcy5fZGF0YS52YWx1ZXMubGVuZ3RoIC0gMSk7XG4gICAgdGhpcy5kcmF3R3JpZERhdGEoKTtcbiAgfVxuXG4gIHByZXYoKSB7XG4gICAgdGhpcy5wYWdlID0gTWF0aC5tYXgodGhpcy5wYWdlIC0gMSwgMCk7XG4gICAgdGhpcy5kcmF3R3JpZERhdGEoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd0dyaWREYXRhKCkge1xuICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAodGhpcy5fb3B0aW9ucywgdGhpcy5vcHRpb25zKSBhcyBQYXJhbTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdHcmlkRGF0YScsICdfb3B0aW9ucyddLCB0aGlzLl9vcHRpb25zKTtcbiAgICBpZiAoIXRoaXMuX2RhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wYWdlcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgKHRoaXMuX2RhdGEudmFsdWVzIHx8IFtdICkubGVuZ3RoIC8gdGhpcy5lbGVtc0NvdW50OyBpKyspIHtcbiAgICAgIHRoaXMucGFnZXMucHVzaChpKTtcbiAgICB9XG4gICAgdGhpcy5kaXNwbGF5ZWRWYWx1ZXMgPSAodGhpcy5fZGF0YS52YWx1ZXMgfHwgW10gKS5zbGljZShcbiAgICAgIE1hdGgubWF4KDAsIHRoaXMuZWxlbXNDb3VudCAqIHRoaXMucGFnZSksXG4gICAgICBNYXRoLm1pbih0aGlzLmVsZW1zQ291bnQgKiAodGhpcy5wYWdlICsgMSksICh0aGlzLl9kYXRhLnZhbHVlcyB8fCBbXSApLmxlbmd0aClcbiAgICApO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0dyaWREYXRhJywgJ19kYXRhJ10sIHRoaXMuX2RhdGEpO1xuICB9XG5cbiAgZGVjb2RlVVJJQ29tcG9uZW50KHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cik7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmRyYXdHcmlkRGF0YSgpO1xuICB9XG5cbiAgZm9ybWF0TGFiZWwobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIEdUU0xpYi5mb3JtYXRMYWJlbChuYW1lKTtcbiAgfVxufVxuIl19