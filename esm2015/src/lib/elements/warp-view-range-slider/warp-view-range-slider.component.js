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
import { Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { WarpViewSliderComponent } from '../warp-view-slider/warp-view-slider.component';
import { Logger } from '../../utils/logger';
import * as noUiSlider from 'nouislider';
/**
 *
 */
export class WarpViewRangeSliderComponent extends WarpViewSliderComponent {
    constructor() {
        super();
        this.LOG = new Logger(WarpViewRangeSliderComponent, this.debug);
        this.LOG.debug(['constructor'], this.debug);
    }
    ngOnInit() {
        this.setOptions();
        this.minValue = this.minValue || this._min;
        this.maxValue = this.maxValue || this._max;
    }
    ngAfterViewInit() {
        this.loaded = false;
        this.setOptions();
    }
    onChange(val) {
        this.change.emit({ value: this.minValue, highValue: this.maxValue });
        this.LOG.debug(['onChange'], val, { value: this.minValue, highValue: this.maxValue });
    }
    setOptions() {
        this.LOG.debug(['setOptions'], this._min, this._max);
        if (!this._min && !this._max) {
            return;
        }
        this.loaded = true;
        this.value = Math.max(this.value || Number.MIN_VALUE, this._min);
        this.LOG.debug(['noUiSlider'], this.slider);
        if (this.slider) {
            if (!this._uiSlider) {
                const opts = {
                    start: [this.minValue, this.maxValue],
                    connect: true,
                    tooltips: [this.getFormat(), this.getFormat()],
                    range: { min: [this._min], max: [this._max] }
                };
                if (!!this._step && this._step > 0) {
                    opts.step = Math.floor((this._max - this._min) / this._step);
                }
                const uiSlider = noUiSlider.create(this.slider.nativeElement, opts);
                uiSlider.on('end', event => {
                    this.LOG.debug(['onChange'], event);
                    this.change.emit({
                        min: parseInt(event[0], 10),
                        max: parseInt(event[1], 10)
                    });
                });
            }
            else {
                this.updateSliderOptions();
            }
        }
    }
}
WarpViewRangeSliderComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-range-slider',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div class=\"custom-slider\" *ngIf=\"loaded\">\n  <div style=\"display: flex; width: 100%;justify-content: flex-start;\">\n    <div>{{format(_min)}}</div>\n    <div #slider style=\"flex-grow: 4\"></div>\n    <div>{{format(_max)}}</div>\n  </div>\n</div>\n",
                encapsulation: ViewEncapsulation.ShadowDom,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}\n\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */.noUi-origin{left:100%}.noUi-target{margin:0 20px 40px;max-width:100%}.noUi-connect{background:var(--warp-slider-connect-color);left:0}.noUi-handle{background:var(--warp-slider-handle-bg-color);border:1px solid var(--warp-slider-handle-color);border-radius:3px;box-shadow:var(--warp-slider-handle-shadow);cursor:pointer}.noUi-handle:after,.noUi-handle:before{background:var(--warp-slider-handle-color)}.noUi-tooltip{display:none}.noUi-active .noUi-tooltip{display:block}:host .custom-slider{margin-top:50px}"]
            },] }
];
WarpViewRangeSliderComponent.ctorParameters = () => [];
WarpViewRangeSliderComponent.propDecorators = {
    slider: [{ type: ViewChild, args: ['slider',] }],
    minValue: [{ type: Input, args: ['minValue',] }],
    maxValue: [{ type: Input, args: ['maxValue',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXJhbmdlLXNsaWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL2hvbWUveGF2aWVyL3dvcmtzcGFjZS93YXJwLXZpZXcvcHJvamVjdHMvd2FycHZpZXctbmcvIiwic291cmNlcyI6WyJzcmMvbGliL2VsZW1lbnRzL3dhcnAtdmlldy1yYW5nZS1zbGlkZXIvd2FycC12aWV3LXJhbmdlLXNsaWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFnQixTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBVSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDaEgsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sZ0RBQWdELENBQUM7QUFDdkYsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sS0FBSyxVQUFVLE1BQU0sWUFBWSxDQUFDO0FBRXpDOztHQUVHO0FBT0gsTUFBTSxPQUFPLDRCQUE2QixTQUFRLHVCQUF1QjtJQUt2RTtRQUNFLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyw0QkFBNEIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDM0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDN0MsQ0FBQztJQUVE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QUNILENBQUM7OztZQWhFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsazVCQUFzRDtnQkFFdEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLFNBQVM7O2FBQzNDOzs7O3FCQUVFLFNBQVMsU0FBQyxRQUFRO3VCQUNsQixLQUFLLFNBQUMsVUFBVTt1QkFDaEIsS0FBSyxTQUFDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5pbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIE9uSW5pdCwgVmlld0NoaWxkLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3U2xpZGVyQ29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctc2xpZGVyL3dhcnAtdmlldy1zbGlkZXIuY29tcG9uZW50JztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi8uLi91dGlscy9sb2dnZXInO1xuaW1wb3J0ICogYXMgbm9VaVNsaWRlciBmcm9tICdub3Vpc2xpZGVyJztcblxuLyoqXG4gKlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1yYW5nZS1zbGlkZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vd2FycC12aWV3LXJhbmdlLXNsaWRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3dhcnAtdmlldy1yYW5nZS1zbGlkZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uU2hhZG93RG9tXG59KVxuZXhwb3J0IGNsYXNzIFdhcnBWaWV3UmFuZ2VTbGlkZXJDb21wb25lbnQgZXh0ZW5kcyBXYXJwVmlld1NsaWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBWaWV3Q2hpbGQoJ3NsaWRlcicpIHNsaWRlcjogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG4gIEBJbnB1dCgnbWluVmFsdWUnKSBtaW5WYWx1ZTogbnVtYmVyO1xuICBASW5wdXQoJ21heFZhbHVlJykgbWF4VmFsdWU6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuTE9HID0gbmV3IExvZ2dlcihXYXJwVmlld1JhbmdlU2xpZGVyQ29tcG9uZW50LCB0aGlzLmRlYnVnKTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2NvbnN0cnVjdG9yJ10sIHRoaXMuZGVidWcpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRPcHRpb25zKCk7XG4gICAgdGhpcy5taW5WYWx1ZSA9IHRoaXMubWluVmFsdWUgfHwgdGhpcy5fbWluO1xuICAgIHRoaXMubWF4VmFsdWUgPSB0aGlzLm1heFZhbHVlIHx8IHRoaXMuX21heDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuc2V0T3B0aW9ucygpO1xuICB9XG5cbiAgb25DaGFuZ2UodmFsKSB7XG4gICAgdGhpcy5jaGFuZ2UuZW1pdCh7dmFsdWU6IHRoaXMubWluVmFsdWUsIGhpZ2hWYWx1ZTogdGhpcy5tYXhWYWx1ZX0pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnb25DaGFuZ2UnXSwgdmFsLCB7dmFsdWU6IHRoaXMubWluVmFsdWUsIGhpZ2hWYWx1ZTogdGhpcy5tYXhWYWx1ZX0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldE9wdGlvbnMoKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydzZXRPcHRpb25zJ10sIHRoaXMuX21pbiwgdGhpcy5fbWF4KTtcbiAgICBpZiAoIXRoaXMuX21pbiAmJiAhdGhpcy5fbWF4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICB0aGlzLnZhbHVlID0gTWF0aC5tYXgodGhpcy52YWx1ZSB8fCBOdW1iZXIuTUlOX1ZBTFVFLCB0aGlzLl9taW4pO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnbm9VaVNsaWRlciddLCB0aGlzLnNsaWRlcik7XG4gICAgaWYgKHRoaXMuc2xpZGVyKSB7XG4gICAgICBpZiAoIXRoaXMuX3VpU2xpZGVyKSB7XG4gICAgICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAgICAgc3RhcnQ6IFt0aGlzLm1pblZhbHVlLCB0aGlzLm1heFZhbHVlXSxcbiAgICAgICAgICBjb25uZWN0OiB0cnVlLFxuICAgICAgICAgIHRvb2x0aXBzOiBbdGhpcy5nZXRGb3JtYXQoKSwgdGhpcy5nZXRGb3JtYXQoKV0sXG4gICAgICAgICAgcmFuZ2U6IHttaW46IFt0aGlzLl9taW5dLCBtYXg6IFt0aGlzLl9tYXhdfVxuICAgICAgICB9IGFzIGFueTtcbiAgICAgICAgaWYgKCEhdGhpcy5fc3RlcCAmJiB0aGlzLl9zdGVwID4gMCkge1xuICAgICAgICAgIG9wdHMuc3RlcCA9IE1hdGguZmxvb3IoKHRoaXMuX21heCAtIHRoaXMuX21pbikgLyB0aGlzLl9zdGVwKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1aVNsaWRlciA9IG5vVWlTbGlkZXIuY3JlYXRlKHRoaXMuc2xpZGVyLm5hdGl2ZUVsZW1lbnQsIG9wdHMpO1xuICAgICAgICB1aVNsaWRlci5vbignZW5kJywgZXZlbnQgPT4ge1xuICAgICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnb25DaGFuZ2UnXSwgZXZlbnQpO1xuICAgICAgICAgIHRoaXMuY2hhbmdlLmVtaXQoe1xuICAgICAgICAgICAgbWluOiBwYXJzZUludChldmVudFswXSwgMTApLFxuICAgICAgICAgICAgbWF4OiBwYXJzZUludChldmVudFsxXSwgMTApXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51cGRhdGVTbGlkZXJPcHRpb25zKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=