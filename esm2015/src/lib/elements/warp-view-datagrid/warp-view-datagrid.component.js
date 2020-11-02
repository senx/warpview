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
import { Component, ElementRef, Input, NgZone, Renderer2, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { GTSLib } from '../../utils/gts.lib';
import { SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
export class WarpViewDatagridComponent extends WarpViewComponent {
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.elemsCount = 15;
        // tslint:disable-next-line:variable-name
        this._tabularData = [];
        this.LOG = new Logger(WarpViewDatagridComponent, this._debug);
    }
    ngOnInit() {
        this.drawChart();
    }
    update(options) {
        this.drawChart();
    }
    drawChart() {
        this.loading = false;
        this.chartDraw.emit();
        if (!this.initChart(this.el)) {
            return;
        }
    }
    getHeaderParam(i, j, key, def) {
        return this._data.params && this._data.params[i] && this._data.params[i][key] && this._data.params[i][key][j]
            ? this._data.params[i][key][j]
            : this._data.globalParams && this._data.globalParams[key] && this._data.globalParams[key][j]
                ? this._data.globalParams[key][j]
                : def;
    }
    convert(data) {
        if (GTSLib.isArray(data.data)) {
            const dataList = GTSLib.flatDeep(this._data.data);
            this.LOG.debug(['convert', 'isArray'], dataList);
            if (data.data.length > 0 && GTSLib.isGts(dataList[0])) {
                this._tabularData = this.parseData(dataList);
            }
            else {
                this._tabularData = this.parseCustomData(dataList);
            }
        }
        else {
            this._tabularData = this.parseCustomData([data.data]);
        }
        return [];
    }
    parseCustomData(data) {
        const flatData = [];
        data.forEach(d => {
            const dataSet = {
                name: d.title || '',
                values: d.rows,
                headers: d.columns,
            };
            flatData.push(dataSet);
        });
        this.LOG.debug(['parseCustomData', 'flatData'], flatData);
        return flatData;
    }
    parseData(data) {
        const flatData = [];
        this.LOG.debug(['parseData'], data);
        data.forEach((d, i) => {
            const dataSet = {
                name: '',
                values: [],
                headers: []
            };
            if (GTSLib.isGts(d)) {
                this.LOG.debug(['parseData', 'isGts'], d);
                dataSet.name = GTSLib.serializeGtsMetadata(d);
                dataSet.values = d.v.map(v => [this.formatDate(v[0])].concat(v.slice(1, v.length)));
            }
            else {
                this.LOG.debug(['parseData', 'is not a Gts'], d);
                dataSet.values = GTSLib.isArray(d) ? d : [d];
            }
            dataSet.headers = [this.getHeaderParam(i, 0, 'headers', 'Date')];
            if (d.v && d.v.length > 0 && d.v[0].length > 2) {
                dataSet.headers.push(this.getHeaderParam(i, 1, 'headers', 'Latitude'));
            }
            if (d.v && d.v.length > 0 && d.v[0].length > 3) {
                dataSet.headers.push(this.getHeaderParam(i, 2, 'headers', 'Longitude'));
            }
            if (d.v && d.v.length > 0 && d.v[0].length > 4) {
                dataSet.headers.push(this.getHeaderParam(i, 3, 'headers', 'Elevation'));
            }
            if (d.v && d.v.length > 0) {
                dataSet.headers.push(this.getHeaderParam(i, d.v[0].length - 1, 'headers', 'Value'));
            }
            if (dataSet.values.length > 0) {
                flatData.push(dataSet);
            }
        });
        this.LOG.debug(['parseData', 'flatData'], flatData, this._options.timeMode);
        return flatData;
    }
    formatDate(date) {
        return this._options.timeMode === 'date' ? GTSLib.toISOString(date, this.divider, this._options.timeZone) : date.toString();
    }
}
WarpViewDatagridComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-datagrid',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"wrapper\" style=\"overflow: auto; height: 100%\">\n  <warpview-spinner *ngIf=\"loading\" message=\"Parsing data\"></warpview-spinner>\n  <p class=\"noData\" *ngIf=\"noData\">No data to display</p>\n  <div *ngIf=\"!loading && !noData\">\n    <warpview-paginable\n      *ngFor=\"let data of _tabularData\"\n      [data]=\"data\" [options]=\"_options\"\n      [debug]=\"debug\"></warpview-paginable>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}"]
            },] }
];
WarpViewDatagridComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewDatagridComponent.propDecorators = {
    elemsCount: [{ type: Input, args: ['elemsCount',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWRhdGFncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnAtdmlldy9wcm9qZWN0cy93YXJwdmlldy1uZy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWRhdGFncmlkL3dhcnAtdmlldy1kYXRhZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBVSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekcsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFekQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRTNDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFRMUMsTUFBTSxPQUFPLHlCQUEwQixTQUFRLGlCQUFpQjtJQVE5RCxZQUNTLEVBQWMsRUFDZCxRQUFtQixFQUNuQixXQUF3QixFQUN4QixNQUFjO1FBRXJCLEtBQUssQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUxsQyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBVEYsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUVyQyx5Q0FBeUM7UUFDekMsaUJBQVksR0FBeUQsRUFBRSxDQUFDO1FBU3RFLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLE1B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cmNlc0NvbnRlbnQiOlsiLypcbiAqICBDb3B5cmlnaHQgMjAyMCAgU2VuWCBTLkEuUy5cbiAqXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5pbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIE5nWm9uZSwgT25Jbml0LCBSZW5kZXJlcjIsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7V2FycFZpZXdDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1jb21wb25lbnQnO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtHVFNMaWJ9IGZyb20gJy4uLy4uL3V0aWxzL2d0cy5saWInO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge1NpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnd2FycHZpZXctZGF0YWdyaWQnLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LWRhdGFncmlkLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LWRhdGFncmlkLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLlNoYWRvd0RvbVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld0RhdGFncmlkQ29tcG9uZW50IGV4dGVuZHMgV2FycFZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG5cbiAgQElucHV0KCdlbGVtc0NvdW50JykgZWxlbXNDb3VudCA9IDE1O1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YXJpYWJsZS1uYW1lXG4gIF90YWJ1bGFyRGF0YTogeyBuYW1lOiBzdHJpbmcsIHZhbHVlczogYW55W10sIGhlYWRlcnM6IHN0cmluZ1tdIH1bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZixcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgc2l6ZVNlcnZpY2U6IFNpemVTZXJ2aWNlLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihlbCwgcmVuZGVyZXIsIHNpemVTZXJ2aWNlLCBuZ1pvbmUpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld0RhdGFncmlkQ29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgdXBkYXRlKG9wdGlvbnM6IFBhcmFtKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhd0NoYXJ0KCkge1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoKTtcbiAgICBpZiAoIXRoaXMuaW5pdENoYXJ0KHRoaXMuZWwpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRIZWFkZXJQYXJhbShpOiBudW1iZXIsIGo6IG51bWJlciwga2V5OiBzdHJpbmcsIGRlZjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YS5wYXJhbXMgJiYgdGhpcy5fZGF0YS5wYXJhbXNbaV0gJiYgdGhpcy5fZGF0YS5wYXJhbXNbaV1ba2V5XSAmJiB0aGlzLl9kYXRhLnBhcmFtc1tpXVtrZXldW2pdXG4gICAgICA/IHRoaXMuX2RhdGEucGFyYW1zW2ldW2tleV1bal1cbiAgICAgIDogdGhpcy5fZGF0YS5nbG9iYWxQYXJhbXMgJiYgdGhpcy5fZGF0YS5nbG9iYWxQYXJhbXNba2V5XSAmJiB0aGlzLl9kYXRhLmdsb2JhbFBhcmFtc1trZXldW2pdXG4gICAgICAgID8gdGhpcy5fZGF0YS5nbG9iYWxQYXJhbXNba2V5XVtqXVxuICAgICAgICA6IGRlZjtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0KGRhdGE6IERhdGFNb2RlbCk6IGFueVtdIHtcbiAgICBpZiAoR1RTTGliLmlzQXJyYXkoZGF0YS5kYXRhKSkge1xuICAgICAgY29uc3QgZGF0YUxpc3QgPSBHVFNMaWIuZmxhdERlZXAodGhpcy5fZGF0YS5kYXRhIGFzIGFueVtdKTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnY29udmVydCcsICdpc0FycmF5J10sIGRhdGFMaXN0KTtcbiAgICAgIGlmIChkYXRhLmRhdGEubGVuZ3RoID4gMCAmJiBHVFNMaWIuaXNHdHMoZGF0YUxpc3RbMF0pKSB7XG4gICAgICAgIHRoaXMuX3RhYnVsYXJEYXRhID0gdGhpcy5wYXJzZURhdGEoZGF0YUxpc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdGFidWxhckRhdGEgPSB0aGlzLnBhcnNlQ3VzdG9tRGF0YShkYXRhTGlzdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RhYnVsYXJEYXRhID0gdGhpcy5wYXJzZUN1c3RvbURhdGEoW2RhdGEuZGF0YSBhcyBhbnldKTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUN1c3RvbURhdGEoZGF0YTogYW55W10pOiB7IG5hbWU6IHN0cmluZywgdmFsdWVzOiBhbnlbXSwgaGVhZGVyczogc3RyaW5nW10gfVtdIHtcbiAgICBjb25zdCBmbGF0RGF0YTogeyBuYW1lOiBzdHJpbmcsIHZhbHVlczogYW55W10sIGhlYWRlcnM6IHN0cmluZ1tdIH1bXSA9IFtdO1xuICAgIGRhdGEuZm9yRWFjaChkID0+IHtcbiAgICAgIGNvbnN0IGRhdGFTZXQ6IHsgbmFtZTogc3RyaW5nLCB2YWx1ZXM6IGFueVtdLCBoZWFkZXJzOiBzdHJpbmdbXSB9ID0ge1xuICAgICAgICBuYW1lOiBkLnRpdGxlIHx8ICcnLFxuICAgICAgICB2YWx1ZXM6IGQucm93cyxcbiAgICAgICAgaGVhZGVyczogZC5jb2x1bW5zLFxuICAgICAgfTtcbiAgICAgIGZsYXREYXRhLnB1c2goZGF0YVNldCk7XG4gICAgfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydwYXJzZUN1c3RvbURhdGEnLCAnZmxhdERhdGEnXSwgZmxhdERhdGEpO1xuICAgIHJldHVybiBmbGF0RGF0YTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwYXJzZURhdGEoZGF0YTogYW55W10pOiB7IG5hbWU6IHN0cmluZywgdmFsdWVzOiBhbnlbXSwgaGVhZGVyczogc3RyaW5nW10gfVtdIHtcbiAgICBjb25zdCBmbGF0RGF0YTogeyBuYW1lOiBzdHJpbmcsIHZhbHVlczogYW55W10sIGhlYWRlcnM6IHN0cmluZ1tdIH1bXSA9IFtdO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsncGFyc2VEYXRhJ10sIGRhdGEpO1xuICAgIGRhdGEuZm9yRWFjaCgoZCwgaSkgPT4ge1xuICAgICAgY29uc3QgZGF0YVNldDogeyBuYW1lOiBzdHJpbmcsIHZhbHVlczogYW55W10sIGhlYWRlcnM6IHN0cmluZ1tdIH0gPSB7XG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICB2YWx1ZXM6IFtdLFxuICAgICAgICBoZWFkZXJzOiBbXVxuICAgICAgfTtcbiAgICAgIGlmIChHVFNMaWIuaXNHdHMoZCkpIHtcbiAgICAgICAgdGhpcy5MT0cuZGVidWcoWydwYXJzZURhdGEnLCAnaXNHdHMnXSwgZCk7XG4gICAgICAgIGRhdGFTZXQubmFtZSA9IEdUU0xpYi5zZXJpYWxpemVHdHNNZXRhZGF0YShkKTtcbiAgICAgICAgZGF0YVNldC52YWx1ZXMgPSBkLnYubWFwKHYgPT4gW3RoaXMuZm9ybWF0RGF0ZSh2WzBdKV0uY29uY2F0KHYuc2xpY2UoMSwgdi5sZW5ndGgpKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3BhcnNlRGF0YScsICdpcyBub3QgYSBHdHMnXSwgZCk7XG4gICAgICAgIGRhdGFTZXQudmFsdWVzID0gR1RTTGliLmlzQXJyYXkoZCkgPyBkIDogW2RdO1xuICAgICAgfVxuICAgICAgZGF0YVNldC5oZWFkZXJzID0gW3RoaXMuZ2V0SGVhZGVyUGFyYW0oaSwgMCwgJ2hlYWRlcnMnLCAnRGF0ZScpXTtcbiAgICAgIGlmIChkLnYgJiYgZC52Lmxlbmd0aCA+IDAgJiYgZC52WzBdLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgZGF0YVNldC5oZWFkZXJzLnB1c2godGhpcy5nZXRIZWFkZXJQYXJhbShpLCAxLCAnaGVhZGVycycsICdMYXRpdHVkZScpKTtcbiAgICAgIH1cbiAgICAgIGlmIChkLnYgJiYgZC52Lmxlbmd0aCA+IDAgJiYgZC52WzBdLmxlbmd0aCA+IDMpIHtcbiAgICAgICAgZGF0YVNldC5oZWFkZXJzLnB1c2godGhpcy5nZXRIZWFkZXJQYXJhbShpLCAyLCAnaGVhZGVycycsICdMb25naXR1ZGUnKSk7XG4gICAgICB9XG4gICAgICBpZiAoZC52ICYmIGQudi5sZW5ndGggPiAwICYmIGQudlswXS5sZW5ndGggPiA0KSB7XG4gICAgICAgIGRhdGFTZXQuaGVhZGVycy5wdXNoKHRoaXMuZ2V0SGVhZGVyUGFyYW0oaSwgMywgJ2hlYWRlcnMnLCAnRWxldmF0aW9uJykpO1xuICAgICAgfVxuICAgICAgaWYgKGQudiAmJiBkLnYubGVuZ3RoID4gMCkge1xuICAgICAgICBkYXRhU2V0LmhlYWRlcnMucHVzaCh0aGlzLmdldEhlYWRlclBhcmFtKGksIGQudlswXS5sZW5ndGggLSAxLCAnaGVhZGVycycsICdWYWx1ZScpKTtcbiAgICAgIH1cbiAgICAgIGlmIChkYXRhU2V0LnZhbHVlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZsYXREYXRhLnB1c2goZGF0YVNldCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5MT0cuZGVidWcoWydwYXJzZURhdGEnLCAnZmxhdERhdGEnXSwgZmxhdERhdGEsIHRoaXMuX29wdGlvbnMudGltZU1vZGUpO1xuICAgIHJldHVybiBmbGF0RGF0YTtcbiAgfVxuXG4gIGZvcm1hdERhdGUoZGF0ZTogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ2RhdGUnID8gR1RTTGliLnRvSVNPU3RyaW5nKGRhdGUsIHRoaXMuZGl2aWRlciwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkgOiBkYXRlLnRvU3RyaW5nKCk7XG4gIH1cbn1cbiJdfQ==