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
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import moment from 'moment';
import { Logger } from '../../utils/logger';
import * as noUiSlider from 'nouislider';
/**
 *
 */
export class WarpViewSliderComponent {
    constructor() {
        this.mode = 'timestamp';
        this.change = new EventEmitter();
        this.show = false;
        this._step = 0;
        this.loaded = false;
        this.manualRefresh = new EventEmitter();
        this._debug = false;
        this.LOG = new Logger(WarpViewSliderComponent, this.debug);
        this.LOG.debug(['constructor'], this.debug);
    }
    set min(m) {
        this.LOG.debug(['min'], m);
        this._min = m;
        this.setOptions();
    }
    get min() {
        return this._min;
    }
    set max(m) {
        this.LOG.debug(['max'], m);
        this._max = m;
        this.setOptions();
    }
    get max() {
        return this._max;
    }
    set step(step) {
        this.LOG.debug(['step'], step);
        if (this._step !== step) {
            this._step = step;
            this.setOptions();
        }
    }
    get step() {
        return this._step;
    }
    set debug(debug) {
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    get debug() {
        return this._debug;
    }
    ngAfterViewInit() {
        this.loaded = false;
        this.setOptions();
    }
    setOptions() {
        if (!this._min && !this._max) {
            return;
        }
        this.LOG.debug(['_step'], this._step);
        const tmpVAl = Math.min(Math.max(this.value || Number.MIN_VALUE, this._min), this._max);
        if (tmpVAl !== this.value && this.loaded) {
            this.change.emit(tmpVAl);
        }
        this.value = tmpVAl;
        this.loaded = true;
        this.LOG.debug(['noUiSlider'], this.slider);
        if (this.slider) {
            if (!this._uiSlider) {
                const opts = {
                    start: [this.value + 1],
                    tooltips: [this.getFormat()],
                    range: { min: [this._min], max: [this._max] }
                };
                if (!!this._step && this._step > 0) {
                    opts.step = Math.floor((this._max - this._min) / this._step);
                }
                this._uiSlider = noUiSlider.create(this.slider.nativeElement, opts);
                this._uiSlider.on('end', event => {
                    this.LOG.debug(['onChange'], event);
                    this.value = parseInt(event[0], 10);
                    this.change.emit({ value: parseInt(event[0], 10) });
                });
            }
            else {
                this.updateSliderOptions();
            }
        }
    }
    updateSliderOptions() {
        // tslint:disable-next-line:no-string-literal
        this.slider.nativeElement['noUiSlider'].set([this.value]);
        const opts = { range: { min: [this._min], max: [this._max] } };
        if (!!this._step && this._step > 0) {
            opts.step = Math.floor((this._max - this._min) / this._step);
        }
        // tslint:disable-next-line:no-string-literal
        this.slider.nativeElement['noUiSlider'].updateOptions(opts);
    }
    format(value) {
        if (this.mode !== 'timestamp') {
            return moment(value).utc(true).format('YYYY/MM/DD hh:mm:ss');
        }
        else {
            return value.toString();
        }
    }
    getFormat() {
        return {
            to: value => this.format(value),
            from: value => value.replace(',-', '')
        };
    }
}
WarpViewSliderComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-slider',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"custom-slider\" *ngIf=\"loaded\">\n  <div style=\"display: flex; width: 100%;justify-content: flex-start;\">\n    <div>{{format(_min)}}</div>\n    <div #slider style=\"flex-grow: 4\"></div>\n    <div>{{format(_max)}}</div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */@import url(/home/xavier/workspace/warp-view/node_modules/nouislider/distribute/nouislider.min.css);\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.noUi-origin{left:100%}.noUi-target{margin:0 20px 40px;max-width:100%}.noUi-connect{background:var(--warp-slider-connect-color);left:0}.noUi-handle{background:var(--warp-slider-handle-bg-color);border:1px solid var(--warp-slider-handle-color);border-radius:3px;box-shadow:var(--warp-slider-handle-shadow);cursor:pointer}.noUi-handle:after,.noUi-handle:before{background:var(--warp-slider-handle-color)}.noUi-tooltip{display:none}.noUi-active .noUi-tooltip{display:block}:host .custom-slider{margin-top:50px}"]
            },] }
];
WarpViewSliderComponent.ctorParameters = () => [];
WarpViewSliderComponent.propDecorators = {
    slider: [{ type: ViewChild, args: ['slider',] }],
    min: [{ type: Input, args: ['min',] }],
    max: [{ type: Input, args: ['max',] }],
    value: [{ type: Input, args: ['value',] }],
    step: [{ type: Input, args: ['step',] }],
    mode: [{ type: Input, args: ['mode',] }],
    debug: [{ type: Input, args: ['debug',] }],
    change: [{ type: Output, args: ['change',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXNsaWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwLXZpZXcvcHJvamVjdHMvd2FycHZpZXctbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1zbGlkZXIvd2FycC12aWV3LXNsaWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFnQixTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5SCxPQUFPLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDNUIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sS0FBSyxVQUFVLE1BQU0sWUFBWSxDQUFDO0FBRXpDOztHQUVHO0FBT0gsTUFBTSxPQUFPLHVCQUF1QjtJQTZEbEM7UUF2QmUsU0FBSSxHQUFHLFdBQVcsQ0FBQztRQVdoQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUk5QyxTQUFJLEdBQUcsS0FBSyxDQUFDO1FBRUgsVUFBSyxHQUFHLENBQUMsQ0FBQztRQUVwQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ0wsa0JBQWEsR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUM3RCxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBR3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUE3REQsSUFBa0IsR0FBRyxDQUFDLENBQUM7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OzthQUMzQzs7OztxQkFFRSxTQUFTLFNBQUMsUUFBUTtrQkFFbEIsS0FBSyxTQUFDLEtBQUs7a0JBVVgsS0FBSyxTQUFDLEtBQUs7b0JBV1gsS0FBSyxTQUFDLE9BQU87bUJBRWIsS0FBSyxTQUFDLE1BQU07bUJBWVosS0FBSyxTQUFDLE1BQU07b0JBRVosS0FBSyxTQUFDLE9BQU87cUJBU2IsTUFBTSxTQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5pbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0ICogYXMgbm9VaVNsaWRlciBmcm9tICdub3Vpc2xpZGVyJztcblxuLyoqXG4gKlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1zbGlkZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LXNsaWRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1zbGlkZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3U2xpZGVyQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBWaWV3Q2hpbGQoJ3NsaWRlcicpIHNsaWRlcjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG5cbiAgQElucHV0KCdtaW4nKSBzZXQgbWluKG0pIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ21pbiddLCBtKTtcbiAgICB0aGlzLl9taW4gPSBtO1xuICAgIHRoaXMuc2V0T3B0aW9ucygpO1xuICB9XG5cbiAgZ2V0IG1pbigpIHtcbiAgICByZXR1cm4gdGhpcy5fbWluO1xuICB9XG5cbiAgQElucHV0KCdtYXgnKSBzZXQgbWF4KG0pIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ21heCddLCBtKTtcbiAgICB0aGlzLl9tYXggPSBtO1xuICAgIHRoaXMuc2V0T3B0aW9ucygpO1xuICB9XG5cbiAgZ2V0IG1heCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4O1xuICB9XG5cblxuICBASW5wdXQoJ3ZhbHVlJykgdmFsdWU6IG51bWJlcjtcblxuICBASW5wdXQoJ3N0ZXAnKSBzZXQgc3RlcChzdGVwOiBudW1iZXIpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3N0ZXAnXSwgc3RlcCk7XG4gICAgaWYgKHRoaXMuX3N0ZXAgIT09IHN0ZXApIHtcbiAgICAgIHRoaXMuX3N0ZXAgPSBzdGVwO1xuICAgICAgdGhpcy5zZXRPcHRpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHN0ZXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0ZXA7XG4gIH1cblxuICBASW5wdXQoJ21vZGUnKSBtb2RlID0gJ3RpbWVzdGFtcCc7XG5cbiAgQElucHV0KCdkZWJ1ZycpIHNldCBkZWJ1ZyhkZWJ1ZzogYm9vbGVhbikge1xuICAgIHRoaXMuX2RlYnVnID0gZGVidWc7XG4gICAgdGhpcy5MT0cuc2V0RGVidWcoZGVidWcpO1xuICB9XG5cbiAgZ2V0IGRlYnVnKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWJ1ZztcbiAgfVxuXG4gIEBPdXRwdXQoJ2NoYW5nZScpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBfbWluOiBudW1iZXI7XG4gIF9tYXg6IG51bWJlcjtcbiAgc2hvdyA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgX3VpU2xpZGVyO1xuICBwcm90ZWN0ZWQgX3N0ZXAgPSAwO1xuICBwcm90ZWN0ZWQgTE9HOiBMb2dnZXI7XG4gIGxvYWRlZCA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgbWFudWFsUmVmcmVzaDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBwcm90ZWN0ZWQgX2RlYnVnID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5MT0cgPSBuZXcgTG9nZ2VyKFdhcnBWaWV3U2xpZGVyQ29tcG9uZW50LCB0aGlzLmRlYnVnKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnN0cnVjdG9yJ10sIHRoaXMuZGVidWcpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG4gICAgdGhpcy5zZXRPcHRpb25zKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0T3B0aW9ucygpIHtcbiAgICBpZiAoIXRoaXMuX21pbiAmJiAhdGhpcy5fbWF4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnX3N0ZXAnXSwgdGhpcy5fc3RlcCk7XG4gICAgY29uc3QgdG1wVkFsID0gTWF0aC5taW4oTWF0aC5tYXgodGhpcy52YWx1ZSB8fCBOdW1iZXIuTUlOX1ZBTFVFLCB0aGlzLl9taW4pLCB0aGlzLl9tYXgpO1xuICAgIGlmICh0bXBWQWwgIT09IHRoaXMudmFsdWUgJiYgdGhpcy5sb2FkZWQpIHtcbiAgICAgIHRoaXMuY2hhbmdlLmVtaXQodG1wVkFsKTtcbiAgICB9XG4gICAgdGhpcy52YWx1ZSA9IHRtcFZBbDtcbiAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgdGhpcy5MT0cuZGVidWcoWydub1VpU2xpZGVyJ10sIHRoaXMuc2xpZGVyKTtcbiAgICBpZiAodGhpcy5zbGlkZXIpIHtcbiAgICAgIGlmICghdGhpcy5fdWlTbGlkZXIpIHtcbiAgICAgICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgICAgICBzdGFydDogW3RoaXMudmFsdWUgKyAxXSxcbiAgICAgICAgICB0b29sdGlwczogW3RoaXMuZ2V0Rm9ybWF0KCldLFxuICAgICAgICAgIHJhbmdlOiB7bWluOiBbdGhpcy5fbWluXSwgbWF4OiBbdGhpcy5fbWF4XX1cbiAgICAgICAgfSBhcyBhbnk7XG4gICAgICAgIGlmICghIXRoaXMuX3N0ZXAgJiYgdGhpcy5fc3RlcCA+IDApIHtcbiAgICAgICAgICBvcHRzLnN0ZXAgPSBNYXRoLmZsb29yKCh0aGlzLl9tYXggLSB0aGlzLl9taW4pIC8gdGhpcy5fc3RlcCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdWlTbGlkZXIgPSBub1VpU2xpZGVyLmNyZWF0ZSh0aGlzLnNsaWRlci5uYXRpdmVFbGVtZW50LCBvcHRzKTtcbiAgICAgICAgdGhpcy5fdWlTbGlkZXIub24oJ2VuZCcsIGV2ZW50ID0+IHtcbiAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uQ2hhbmdlJ10sIGV2ZW50KTtcbiAgICAgICAgICB0aGlzLnZhbHVlID0gcGFyc2VJbnQoZXZlbnRbMF0sIDEwKTtcbiAgICAgICAgICB0aGlzLmNoYW5nZS5lbWl0KHt2YWx1ZTogcGFyc2VJbnQoZXZlbnRbMF0sIDEwKX0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXBkYXRlU2xpZGVyT3B0aW9ucygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVTbGlkZXJPcHRpb25zKCkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zdHJpbmctbGl0ZXJhbFxuICAgIHRoaXMuc2xpZGVyLm5hdGl2ZUVsZW1lbnRbJ25vVWlTbGlkZXInXS5zZXQoW3RoaXMudmFsdWVdKTtcbiAgICBjb25zdCBvcHRzID0ge3JhbmdlOiB7bWluOiBbdGhpcy5fbWluXSwgbWF4OiBbdGhpcy5fbWF4XX19IGFzIGFueTtcbiAgICBpZiAoISF0aGlzLl9zdGVwICYmIHRoaXMuX3N0ZXAgPiAwKSB7XG4gICAgICBvcHRzLnN0ZXAgPSBNYXRoLmZsb29yKCh0aGlzLl9tYXggLSB0aGlzLl9taW4pIC8gdGhpcy5fc3RlcCk7XG4gICAgfVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zdHJpbmctbGl0ZXJhbFxuICAgIHRoaXMuc2xpZGVyLm5hdGl2ZUVsZW1lbnRbJ25vVWlTbGlkZXInXS51cGRhdGVPcHRpb25zKG9wdHMpO1xuICB9XG5cbiAgZm9ybWF0KHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5tb2RlICE9PSAndGltZXN0YW1wJykge1xuICAgICAgcmV0dXJuIG1vbWVudCh2YWx1ZSkudXRjKHRydWUpLmZvcm1hdCgnWVlZWS9NTS9ERCBoaDptbTpzcycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Rm9ybWF0KCkge1xuICAgIHJldHVybiB7XG4gICAgICB0bzogdmFsdWUgPT4gdGhpcy5mb3JtYXQodmFsdWUpLFxuICAgICAgZnJvbTogdmFsdWUgPT4gdmFsdWUucmVwbGFjZSgnLC0nLCAnJylcbiAgICB9O1xuICB9XG59XG4iXX0=