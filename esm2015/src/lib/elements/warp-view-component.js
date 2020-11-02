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
import { ChartLib } from '../utils/chart-lib';
import { Param } from '../model/param';
import { GTSLib } from '../utils/gts.lib';
import { Directive, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewChild } from '@angular/core';
import deepEqual from 'deep-equal';
import { SizeService } from '../services/resize.service';
import { PlotlyComponent } from '../plotly/plotly.component';
// tslint:disable-next-line:directive-class-suffix
export class WarpViewComponent {
    constructor(el, renderer, sizeService, ngZone) {
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.width = ChartLib.DEFAULT_WIDTH;
        this.height = ChartLib.DEFAULT_HEIGHT;
        this.chartDraw = new EventEmitter();
        this._options = new Param();
        this.defOptions = ChartLib.mergeDeep(new Param(), {
            dotsLimit: 1000,
            heatControls: false,
            timeMode: 'date',
            showRangeSelector: true,
            gridLineColor: '#8e8e8e',
            showDots: false,
            timeZone: 'UTC',
            timeUnit: 'us',
            showControls: true,
        });
        this._debug = false;
        this._showLegend = false;
        this._responsive = true;
        this._unit = '';
        this._autoResize = true;
        this._hiddenData = [];
        this.tooltipPosition = { top: '-10000px', left: '-1000px' };
        this.loading = true;
        this.noData = false;
        this.layout = {
            margin: {
                t: 10,
                b: 25,
                r: 10,
                l: 10
            }
        };
        this.plotlyConfig = {
            responsive: true,
            showAxisDragHandles: true,
            scrollZoom: true,
            doubleClick: 'reset+autosize',
            showTips: true,
            plotGlPixelRatio: 1,
            staticPlot: false,
            displaylogo: false,
            modeBarButtonsToRemove: [
                'lasso2d', 'select2d', 'toggleSpikelines', 'toggleHover', 'hoverClosest3d', 'autoScale2d',
                'hoverClosestGeo', 'hoverClosestGl2d', 'hoverClosestPie', 'toggleHover',
                'hoverClosestCartesian', 'hoverCompareCartesian'
            ]
        };
        this.sizeService.sizeChanged$.subscribe((size) => {
            if (el.nativeElement.parentElement) {
                const parentSize = el.nativeElement.parentElement.getBoundingClientRect();
                if (this._responsive) {
                    this.height = parentSize.height;
                    this.width = parentSize.width;
                }
                if (!!this.graph && this._responsive && parentSize.height > 0) {
                    const layout = {
                        width: parentSize.width,
                        height: this._autoResize ? parentSize.height : this.layout.height
                    };
                    if (this.layout.width !== layout.width || this.layout.height !== layout.height) {
                        setTimeout(() => this.layout = Object.assign(Object.assign({}, this.layout), layout));
                        this.LOG.debug(['sizeChanged$'], this.layout.width, this.layout.height);
                        this.graph.resize(layout);
                    }
                }
            }
        });
    }
    set hiddenData(hiddenData) {
        this._hiddenData = hiddenData;
    }
    get hiddenData() {
        return this._hiddenData;
    }
    set unit(unit) {
        this._unit = unit;
        this.update(undefined, false);
    }
    get unit() {
        return this._unit;
    }
    set debug(debug) {
        if (typeof debug === 'string') {
            debug = 'true' === debug;
        }
        this._debug = debug;
        this.LOG.setDebug(debug);
    }
    get debug() {
        return this._debug;
    }
    set showLegend(showLegend) {
        if (typeof showLegend === 'string') {
            showLegend = 'true' === showLegend;
        }
        this._showLegend = showLegend;
    }
    get showLegend() {
        return this._showLegend;
    }
    set responsive(responsive) {
        if (typeof responsive === 'string') {
            responsive = 'true' === responsive;
        }
        this._responsive = responsive;
    }
    get responsive() {
        return this._responsive;
    }
    set options(options) {
        this.LOG.debug(['onOptions'], options);
        if (typeof options === 'string') {
            options = JSON.parse(options);
        }
        if (!deepEqual(options, this._options)) {
            this.LOG.debug(['onOptions', 'changed'], options);
            this._options = options;
            this.update(this._options, false);
        }
    }
    set data(data) {
        this.LOG.debug(['onData'], data);
        if (data) {
            this._data = GTSLib.getData(data);
            this.update(this._options, this._options.isRefresh);
            this.LOG.debug(['onData'], this._data);
        }
    }
    legendFormatter(x, series, highlighted = -1) {
        const displayedCurves = [];
        if (x === null) {
            // This happens when there's no selection and {legend: 'always'} is set.
            return `<br>
      ${series.map(s => {
                // FIXME :  if (!s.isVisible) return;
                let labeledData = GTSLib.formatLabel(s.data.text || '') + ': ' + ((this._options.horizontal ? s.x : s.y) || s.r || '');
                let color = s.data.line.color;
                if (!!s.data.marker) {
                    if (GTSLib.isArray(s.data.marker.color)) {
                        color = s.data.marker.color[0];
                    }
                    else {
                        color = s.data.marker.color;
                    }
                }
                if (s.curveNumber === highlighted) {
                    labeledData = `<i class="chip"
    style="background-color: ${color};border: 2px solid ${color};"></i> ${labeledData}`;
                }
                return labeledData;
            }).join('<br>')}`;
        }
        let html = '';
        if (!!series[0]) {
            x = series[0].x || series[0].theta;
        }
        html += `<b>${x}</b><br />`;
        // put the highlighted one(s?) first, keep only visibles, keep only 50 first ones.
        series = series.sort((sa, sb) => (sa.curveNumber === highlighted) ? -1 : 1);
        series
            // .filter(s => s.isVisible && s.yHTML)
            .slice(0, 50)
            .forEach((s, i) => {
            if (displayedCurves.indexOf(s.curveNumber) <= -1) {
                displayedCurves.push(s.curveNumber);
                let value = series[0].data.orientation === 'h' ? s.x : s.y;
                if (!value && value !== 0) {
                    value = s.r;
                }
                let labeledData = GTSLib.formatLabel(s.data.text || '') + ': ' + value;
                if (s.curveNumber === highlighted) {
                    labeledData = `<b>${labeledData}</b>`;
                }
                let color = s.data.line ? s.data.line.color : '';
                if (!!s.data.marker) {
                    if (GTSLib.isArray(s.data.marker.color)) {
                        color = s.data.marker.color[0];
                    }
                    else {
                        color = s.data.marker.color;
                    }
                }
                html += `<i class="chip" style="background-color: ${color};border: 2px solid ${color};"></i>&nbsp;${labeledData}`;
                if (i < series.length) {
                    html += '<br>';
                }
            }
        });
        return html;
    }
    initChart(el, resize = true) {
        this.noData = false;
        const parentSize = el.nativeElement.parentElement.parentElement.getBoundingClientRect();
        if (this._responsive) {
            if (resize) {
                if (this._autoResize && (parentSize.height === 0 || this.height !== parentSize.height)
                    || parentSize.width === 0 || this.width !== parentSize.width) {
                    if (this._autoResize) {
                        this.height = parentSize.height;
                    }
                    this.width = parentSize.width;
                    setTimeout(() => this.initChart(el), 100);
                    return;
                }
                else {
                    if (this._autoResize) {
                        this.height = parentSize.height;
                    }
                    this.width = parentSize.width;
                }
            }
        }
        this.LOG.debug(['initiChart', 'this._data'], this._data, this._options);
        if (!this._data || !this._data.data || this._data.data.length === 0 || !this._options) {
            this.loading = false;
            this.LOG.debug(['initiChart', 'nodata']);
            this.noData = true;
            this.chartDraw.emit();
            return false;
        }
        this._options = ChartLib.mergeDeep(this.defOptions, this._options || {});
        const dataModel = this._data;
        this._options = ChartLib.mergeDeep(this._options || {}, this._data.globalParams);
        this._options.timeMode = this._options.timeMode || 'date';
        this.loading = !this._options.isRefresh;
        this.divider = GTSLib.getDivider(this._options.timeUnit);
        this.plotlyData = this.convert(dataModel);
        this.plotlyConfig.responsive = this._responsive;
        this.layout.paper_bgcolor = 'rgba(0,0,0,0)';
        this.layout.plot_bgcolor = 'rgba(0,0,0,0)';
        if (!this._responsive) {
            this.layout.width = this.width || ChartLib.DEFAULT_WIDTH;
            this.layout.height = this.height || ChartLib.DEFAULT_HEIGHT;
        }
        else {
            this.layout.width = this.width || parentSize.width;
            this.layout.height = this.height || parentSize.height;
        }
        this.layout.showLegend = !!this._options.showLegend;
        this.LOG.debug(['initiChart', 'plotlyData'], this.plotlyData);
        this.loading = false;
        this.chartDraw.emit();
        return !(!this.plotlyData || this.plotlyData.length === 0);
    }
    afterPlot(plotlyInstance) {
        this.LOG.debug(['afterPlot', 'plotlyInstance'], plotlyInstance);
        this.loading = false;
        this.rect = this.graph.getBoundingClientRect();
        this.chartDraw.emit();
    }
    hideTooltip() {
        if (!!this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
        }
        this.hideTooltipTimer = setTimeout(() => {
            this.toolTip.nativeElement.style.display = 'none';
        }, 1000);
    }
    unhover(data, point) {
        this.LOG.debug(['unhover'], data);
        if (!!this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
        }
    }
    hover(data, point) {
        this.renderer.setStyle(this.toolTip.nativeElement, 'display', 'block');
        if (!!this.hideTooltipTimer) {
            clearTimeout(this.hideTooltipTimer);
        }
        let delta = Number.MAX_VALUE;
        const curves = [];
        if (!point) {
            if (data.points[0] && data.points[0].data.orientation !== 'h') {
                const y = (data.yvals || [''])[0];
                data.points.forEach(p => {
                    curves.push(p.curveNumber);
                    const d = Math.abs((p.y || p.r) - y);
                    if (d < delta) {
                        delta = d;
                        point = p;
                    }
                });
            }
            else {
                const x = (data.xvals || [''])[0];
                data.points.forEach(p => {
                    curves.push(p.curveNumber);
                    const d = Math.abs((p.x || p.r) - x);
                    if (d < delta) {
                        delta = d;
                        point = p;
                    }
                });
            }
        }
        if (point && !!data.event) {
            const content = this.legendFormatter(this._options.horizontal ?
                (data.yvals || [''])[0] :
                (data.xvals || [''])[0], data.points, point.curveNumber);
            let left = (data.event.offsetX + 20) + 'px';
            if (data.event.offsetX > this.chartContainer.nativeElement.clientWidth / 2) {
                left = Math.max(0, data.event.offsetX - this.toolTip.nativeElement.clientWidth - 20) + 'px';
            }
            const top = Math.min(this.el.nativeElement.getBoundingClientRect().height - this.toolTip.nativeElement.getBoundingClientRect().height - 20, data.event.y - 20 - this.el.nativeElement.getBoundingClientRect().top) + 'px';
            this.moveTooltip(top, left, content);
        }
    }
    getTooltipPosition() {
        return {
            top: this.tooltipPosition.top,
            left: this.tooltipPosition.left,
        };
    }
    moveTooltip(top, left, content) {
        this.tooltipPosition = { top, left };
        this.renderer.setProperty(this.toolTip.nativeElement, 'innerHTML', content);
        this.LOG.debug(['hover - moveTooltip'], new Date().toISOString());
    }
    relayout($event) {
    }
    getLabelColor(el) {
        return this.getCSSColor(el, '--warp-view-chart-label-color', '#8e8e8e').trim();
    }
    getGridColor(el) {
        return this.getCSSColor(el, '--warp-view-chart-grid-color', '#8e8e8e').trim();
    }
    getCSSColor(el, property, defColor) {
        const color = getComputedStyle(el).getPropertyValue(property).trim();
        return color === '' ? defColor : color;
    }
}
WarpViewComponent.decorators = [
    { type: Directive }
];
WarpViewComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewComponent.propDecorators = {
    toolTip: [{ type: ViewChild, args: ['toolTip', { static: true },] }],
    graph: [{ type: ViewChild, args: ['graph',] }],
    chartContainer: [{ type: ViewChild, args: ['chartContainer', { static: true },] }],
    width: [{ type: Input, args: ['width',] }],
    height: [{ type: Input, args: ['height',] }],
    hiddenData: [{ type: Input, args: ['hiddenData',] }],
    unit: [{ type: Input, args: ['unit',] }],
    debug: [{ type: Input, args: ['debug',] }],
    showLegend: [{ type: Input, args: ['showLegend',] }],
    responsive: [{ type: Input, args: ['responsive',] }],
    options: [{ type: Input, args: ['options',] }],
    data: [{ type: Input, args: ['data',] }],
    chartDraw: [{ type: Output, args: ['chartDraw',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LWNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS94YXZpZXIvd29ya3NwYWNlL3dhcnAtdmlldy9wcm9qZWN0cy93YXJwdmlldy1uZy8iLCJzb3VyY2VzIjpbInNyYy9saWIvZWxlbWVudHMvd2FycC12aWV3LWNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDNUMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBSXJDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUN4QyxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMvRyxPQUFPLFNBQVMsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFPLFdBQVcsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQzdELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQU0zRCxrREFBa0Q7QUFDbEQsTUFBTSxPQUFnQixpQkFBaUI7SUF3SXJDLFlBQ1MsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLFdBQXdCLEVBQ3hCLE1BQWM7UUFIZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBdklQLFVBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO1FBQzlCLFdBQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDO1FBMEU3QixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUV6RCxhQUFRLEdBQVUsSUFBSSxLQUFLLEVB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QUFDLEVBQUUsRUFBRSw4QkFBOEIsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoRixDQUFDO0lBRVMsV0FBVyxDQUFDLEVBQWUsRUFBRSxRQUFnQixFQUFFLFFBQWdCO1FBQ3ZFLE1BQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JFLE9BQU8sS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDekMsQ0FBQzs7O1lBaFlGLFNBQVM7OztZQVJTLFVBQVU7WUFBdUMsU0FBUztZQUUvRCxXQUFXO1lBRjJCLE1BQU07OztzQkFXdkQsU0FBUyxTQUFDLFNBQVMsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7b0JBQ25DLFNBQVMsU0FBQyxPQUFPOzZCQUNqQixTQUFTLFNBQUMsZ0JBQWdCLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO29CQUUxQyxLQUFLLFNBQUMsT0FBTztxQkFDYixLQUFLLFNBQUMsUUFBUTt5QkFFZCxLQUFLLFNBQUMsWUFBWTttQkFRbEIsS0FBSyxTQUFDLE1BQU07b0JBU1osS0FBSyxTQUFDLE9BQU87eUJBWWIsS0FBSyxTQUFDLFlBQVk7eUJBV2xCLEtBQUssU0FBQyxZQUFZO3NCQVdsQixLQUFLLFNBQUMsU0FBUzttQkFZZixLQUFLLFNBQUMsTUFBTTt3QkFTWixNQUFNLFNBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQ29weXJpZ2h0IDIwMjAgIFNlblggUy5BLlMuXG4gKlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiAgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtDaGFydExpYn0gZnJvbSAnLi4vdXRpbHMvY2hhcnQtbGliJztcbmltcG9ydCB7UGFyYW19IGZyb20gJy4uL21vZGVsL3BhcmFtJztcbmltcG9ydCB7TG9nZ2VyfSBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge0dUU30gZnJvbSAnLi4vbW9kZWwvR1RTJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBOZ1pvbmUsIE91dHB1dCwgUmVuZGVyZXIyLCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IGRlZXBFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcbmltcG9ydCB7U2l6ZSwgU2l6ZVNlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL3Jlc2l6ZS5zZXJ2aWNlJztcbmltcG9ydCB7UGxvdGx5Q29tcG9uZW50fSBmcm9tICcuLi9wbG90bHkvcGxvdGx5LmNvbXBvbmVudCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAncGxvdGx5LmpzJztcblxuZXhwb3J0IHR5cGUgVmlzaWJpbGl0eVN0YXRlID0gJ3Vua25vd24nIHwgJ25vdGhpbmdQbG90dGFibGUnIHwgJ3Bsb3R0YWJsZXNBbGxIaWRkZW4nIHwgJ3Bsb3R0YWJsZVNob3duJztcblxuQERpcmVjdGl2ZSgpXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLWNsYXNzLXN1ZmZpeFxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFdhcnBWaWV3Q29tcG9uZW50IHtcbiAgQFZpZXdDaGlsZCgndG9vbFRpcCcsIHtzdGF0aWM6IHRydWV9KSB0b29sVGlwOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdncmFwaCcpIGdyYXBoOiBQbG90bHlDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2NoYXJ0Q29udGFpbmVyJywge3N0YXRpYzogdHJ1ZX0pIGNoYXJ0Q29udGFpbmVyOiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgnd2lkdGgnKSB3aWR0aCA9IENoYXJ0TGliLkRFRkFVTFRfV0lEVEg7XG4gIEBJbnB1dCgnaGVpZ2h0JykgaGVpZ2h0ID0gQ2hhcnRMaWIuREVGQVVMVF9IRUlHSFQ7XG5cbiAgQElucHV0KCdoaWRkZW5EYXRhJykgc2V0IGhpZGRlbkRhdGEoaGlkZGVuRGF0YTogbnVtYmVyW10pIHtcbiAgICB0aGlzLl9oaWRkZW5EYXRhID0gaGlkZGVuRGF0YTtcbiAgfVxuXG4gIGdldCBoaWRkZW5EYXRhKCk6IG51bWJlcltdIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZGVuRGF0YTtcbiAgfVxuXG4gIEBJbnB1dCgndW5pdCcpIHNldCB1bml0KHVuaXQ6IHN0cmluZykge1xuICAgIHRoaXMuX3VuaXQgPSB1bml0O1xuICAgIHRoaXMudXBkYXRlKHVuZGVmaW5lZCwgZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHVuaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3VuaXQ7XG4gIH1cblxuICBASW5wdXQoJ2RlYnVnJykgc2V0IGRlYnVnKGRlYnVnOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiBkZWJ1ZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGRlYnVnID0gJ3RydWUnID09PSBkZWJ1ZztcbiAgICB9XG4gICAgdGhpcy5fZGVidWcgPSBkZWJ1ZztcbiAgICB0aGlzLkxPRy5zZXREZWJ1ZyhkZWJ1Zyk7XG4gIH1cblxuICBnZXQgZGVidWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlYnVnO1xuICB9XG5cbiAgQElucHV0KCdzaG93TGVnZW5kJykgc2V0IHNob3dMZWdlbmQoc2hvd0xlZ2VuZDogYm9vbGVhbiB8IHN0cmluZykge1xuICAgIGlmICh0eXBlb2Ygc2hvd0xlZ2VuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHNob3dMZWdlbmQgPSAndHJ1ZScgPT09IHNob3dMZWdlbmQ7XG4gICAgfVxuICAgIHRoaXMuX3Nob3dMZWdlbmQgPSBzaG93TGVnZW5kO1xuICB9XG5cbiAgZ2V0IHNob3dMZWdlbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3dMZWdlbmQ7XG4gIH1cblxuICBASW5wdXQoJ3Jlc3BvbnNpdmUnKSBzZXQgcmVzcG9uc2l2ZShyZXNwb25zaXZlOiBib29sZWFuIHwgc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiByZXNwb25zaXZlID09PSAnc3RyaW5nJykge1xuICAgICAgcmVzcG9uc2l2ZSA9ICd0cnVlJyA9PT0gcmVzcG9uc2l2ZTtcbiAgICB9XG4gICAgdGhpcy5fcmVzcG9uc2l2ZSA9IHJlc3BvbnNpdmU7XG4gIH1cblxuICBnZXQgcmVzcG9uc2l2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2l2ZTtcbiAgfVxuXG4gIEBJbnB1dCgnb3B0aW9ucycpIHNldCBvcHRpb25zKG9wdGlvbnM6IFBhcmFtIHwgc3RyaW5nKSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWydvbk9wdGlvbnMnXSwgb3B0aW9ucyk7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgICAgb3B0aW9ucyA9IEpTT04ucGFyc2Uob3B0aW9ucyk7XG4gICAgfVxuICAgIGlmICghZGVlcEVxdWFsKG9wdGlvbnMsIHRoaXMuX29wdGlvbnMpKSB7XG4gICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uT3B0aW9ucycsICdjaGFuZ2VkJ10sIG9wdGlvbnMpO1xuICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgYXMgUGFyYW07XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLl9vcHRpb25zLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdkYXRhJykgc2V0IGRhdGEoZGF0YTogc3RyaW5nIHwgRGF0YU1vZGVsIHwgR1RTW10pIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ29uRGF0YSddLCBkYXRhKTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5fZGF0YSA9IEdUU0xpYi5nZXREYXRhKGRhdGEpO1xuICAgICAgdGhpcy51cGRhdGUodGhpcy5fb3B0aW9ucywgdGhpcy5fb3B0aW9ucy5pc1JlZnJlc2gpO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydvbkRhdGEnXSwgdGhpcy5fZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgQE91dHB1dCgnY2hhcnREcmF3JykgY2hhcnREcmF3ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgX29wdGlvbnM6IFBhcmFtID0gbmV3IFBhcmFtKCk7XG4gIHByb3RlY3RlZCBMT0c6IExvZ2dlcjtcbiAgcHJvdGVjdGVkIGRlZk9wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXAobmV3IFBhcmFtKCksIHtcbiAgICBkb3RzTGltaXQ6IDEwMDAsXG4gICAgaGVhdENvbnRyb2xzOiBmYWxzZSxcbiAgICB0aW1lTW9kZTogJ2RhdGUnLFxuICAgIHNob3dSYW5nZVNlbGVjdG9yOiB0cnVlLFxuICAgIGdyaWRMaW5lQ29sb3I6ICcjOGU4ZThlJyxcbiAgICBzaG93RG90czogZmFsc2UsXG4gICAgdGltZVpvbmU6ICdVVEMnLFxuICAgIHRpbWVVbml0OiAndXMnLFxuICAgIHNob3dDb250cm9sczogdHJ1ZSxcbiAgICAvLyBib3VuZHM6IHt9XG4gIH0pIGFzIFBhcmFtO1xuXG4gIHByb3RlY3RlZCBfZGVidWcgPSBmYWxzZTtcbiAgcHJvdGVjdGVkIF9zaG93TGVnZW5kID0gZmFsc2U7XG4gIHByb3RlY3RlZCBfcmVzcG9uc2l2ZSA9IHRydWU7XG4gIHByb3RlY3RlZCBfdW5pdCA9ICcnO1xuICBwcm90ZWN0ZWQgX2RhdGE6IERhdGFNb2RlbDtcbiAgcHJvdGVjdGVkIF9hdXRvUmVzaXplID0gdHJ1ZTtcbiAgcHJvdGVjdGVkIF9oaWRkZW5EYXRhOiBudW1iZXJbXSA9IFtdO1xuICBwcm90ZWN0ZWQgZGl2aWRlcjogbnVtYmVyO1xuXG4gIHRvb2x0aXBQb3NpdGlvbjogYW55ID0ge3RvcDogJy0xMDAwMHB4JywgbGVmdDogJy0xMDAwcHgnfTtcbiAgbG9hZGluZyA9IHRydWU7XG4gIG5vRGF0YSA9IGZhbHNlO1xuICBsYXlvdXQ6IFBhcnRpYWw8YW55PiA9IHtcbiAgICBtYXJnaW46IHtcbiAgICAgIHQ6IDEwLFxuICAgICAgYjogMjUsXG4gICAgICByOiAxMCxcbiAgICAgIGw6IDEwXG4gICAgfVxuICB9O1xuICBwbG90bHlDb25maWc6IFBhcnRpYWw8Q29uZmlnPiA9IHtcbiAgICByZXNwb25zaXZlOiB0cnVlLFxuICAgIHNob3dBeGlzRHJhZ0hhbmRsZXM6IHRydWUsXG4gICAgc2Nyb2xsWm9vbTogdHJ1ZSxcbiAgICBkb3VibGVDbGljazogJ3Jlc2V0K2F1dG9zaXplJyxcbiAgICBzaG93VGlwczogdHJ1ZSxcbiAgICBwbG90R2xQaXhlbFJhdGlvOiAxLFxuICAgIHN0YXRpY1Bsb3Q6IGZhbHNlLFxuICAgIGRpc3BsYXlsb2dvOiBmYWxzZSxcbiAgICBtb2RlQmFyQnV0dG9uc1RvUmVtb3ZlOiBbXG4gICAgICAnbGFzc28yZCcsICdzZWxlY3QyZCcsICd0b2dnbGVTcGlrZWxpbmVzJywgJ3RvZ2dsZUhvdmVyJywgJ2hvdmVyQ2xvc2VzdDNkJywgJ2F1dG9TY2FsZTJkJyxcbiAgICAgICdob3ZlckNsb3Nlc3RHZW8nLCAnaG92ZXJDbG9zZXN0R2wyZCcsICdob3ZlckNsb3Nlc3RQaWUnLCAndG9nZ2xlSG92ZXInLFxuICAgICAgJ2hvdmVyQ2xvc2VzdENhcnRlc2lhbicsICdob3ZlckNvbXBhcmVDYXJ0ZXNpYW4nXG4gICAgXVxuICB9O1xuICBwbG90bHlEYXRhOiBQYXJ0aWFsPGFueT5bXTtcbiAgcHJpdmF0ZSBoaWRlVG9vbHRpcFRpbWVyOiBhbnk7XG4gIHByaXZhdGUgcmVjdDogYW55O1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgdGhpcy5zaXplU2VydmljZS5zaXplQ2hhbmdlZCQuc3Vic2NyaWJlKChzaXplOiBTaXplKSA9PiB7XG4gICAgICBpZiAoKGVsLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgcGFyZW50U2l6ZSA9IChlbC5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KS5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAodGhpcy5fcmVzcG9uc2l2ZSkge1xuICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gcGFyZW50U2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgdGhpcy53aWR0aCA9IHBhcmVudFNpemUud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEhdGhpcy5ncmFwaCAmJiB0aGlzLl9yZXNwb25zaXZlICYmIHBhcmVudFNpemUuaGVpZ2h0ID4gMCkge1xuICAgICAgICAgIGNvbnN0IGxheW91dCA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBwYXJlbnRTaXplLndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLl9hdXRvUmVzaXplID8gcGFyZW50U2l6ZS5oZWlnaHQgOiB0aGlzLmxheW91dC5oZWlnaHRcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmICh0aGlzLmxheW91dC53aWR0aCAhPT0gbGF5b3V0LndpZHRoIHx8IHRoaXMubGF5b3V0LmhlaWdodCAhPT0gbGF5b3V0LmhlaWdodCkge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmxheW91dCA9IHsuLi50aGlzLmxheW91dCwgLi4ubGF5b3V0fSk7XG4gICAgICAgICAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3NpemVDaGFuZ2VkJCddLCB0aGlzLmxheW91dC53aWR0aCwgdGhpcy5sYXlvdXQuaGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuZ3JhcGgucmVzaXplKGxheW91dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgdXBkYXRlKG9wdGlvbnM6IFBhcmFtLCByZWZyZXNoOiBib29sZWFuKTogdm9pZDtcblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgY29udmVydChkYXRhOiBEYXRhTW9kZWwpOiBQYXJ0aWFsPGFueT5bXTtcblxuICBwcm90ZWN0ZWQgbGVnZW5kRm9ybWF0dGVyKHgsIHNlcmllcywgaGlnaGxpZ2h0ZWQgPSAtMSk6IHN0cmluZyB7XG4gICAgY29uc3QgZGlzcGxheWVkQ3VydmVzID0gW107XG4gICAgaWYgKHggPT09IG51bGwpIHtcbiAgICAgIC8vIFRoaXMgaGFwcGVucyB3aGVuIHRoZXJlJ3Mgbm8gc2VsZWN0aW9uIGFuZCB7bGVnZW5kOiAnYWx3YXlzJ30gaXMgc2V0LlxuICAgICAgcmV0dXJuIGA8YnI+XG4gICAgICAke3Nlcmllcy5tYXAocyA9PiB7XG4gICAgICAgIC8vIEZJWE1FIDogIGlmICghcy5pc1Zpc2libGUpIHJldHVybjtcbiAgICAgICAgbGV0IGxhYmVsZWREYXRhID0gR1RTTGliLmZvcm1hdExhYmVsKHMuZGF0YS50ZXh0IHx8ICcnKSArICc6ICcgKyAoKHRoaXMuX29wdGlvbnMuaG9yaXpvbnRhbCA/IHMueCA6IHMueSkgfHwgcy5yIHx8ICcnKTtcbiAgICAgICAgbGV0IGNvbG9yID0gcy5kYXRhLmxpbmUuY29sb3I7XG4gICAgICAgIGlmICghIXMuZGF0YS5tYXJrZXIpIHtcbiAgICAgICAgICBpZiAoR1RTTGliLmlzQXJyYXkocy5kYXRhLm1hcmtlci5jb2xvcikpIHtcbiAgICAgICAgICAgIGNvbG9yID0gcy5kYXRhLm1hcmtlci5jb2xvclswXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sb3IgPSBzLmRhdGEubWFya2VyLmNvbG9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocy5jdXJ2ZU51bWJlciA9PT0gaGlnaGxpZ2h0ZWQpIHtcbiAgICAgICAgICBsYWJlbGVkRGF0YSA9IGA8aSBjbGFzcz1cImNoaXBcIlxuICAgIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn07Ym9yZGVyOiAycHggc29saWQgJHtjb2xvcn07XCI+PC9pPiAke2xhYmVsZWREYXRhfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhYmVsZWREYXRhO1xuICAgICAgfSkuam9pbignPGJyPicpfWA7XG4gICAgfVxuXG4gICAgbGV0IGh0bWwgPSAnJztcbiAgICBpZiAoISFzZXJpZXNbMF0pIHtcbiAgICAgIHggPSBzZXJpZXNbMF0ueCB8fCBzZXJpZXNbMF0udGhldGE7XG4gICAgfVxuICAgIGh0bWwgKz0gYDxiPiR7eH08L2I+PGJyIC8+YDtcbiAgICAvLyBwdXQgdGhlIGhpZ2hsaWdodGVkIG9uZShzPykgZmlyc3QsIGtlZXAgb25seSB2aXNpYmxlcywga2VlcCBvbmx5IDUwIGZpcnN0IG9uZXMuXG4gICAgc2VyaWVzID0gc2VyaWVzLnNvcnQoKHNhLCBzYikgPT4gKHNhLmN1cnZlTnVtYmVyID09PSBoaWdobGlnaHRlZCkgPyAtMSA6IDEpO1xuICAgIHNlcmllc1xuICAgICAgLy8gLmZpbHRlcihzID0+IHMuaXNWaXNpYmxlICYmIHMueUhUTUwpXG4gICAgICAuc2xpY2UoMCwgNTApXG4gICAgICAuZm9yRWFjaCgocywgaSkgPT4ge1xuICAgICAgICBpZiAoZGlzcGxheWVkQ3VydmVzLmluZGV4T2Yocy5jdXJ2ZU51bWJlcikgPD0gLTEpIHtcbiAgICAgICAgICBkaXNwbGF5ZWRDdXJ2ZXMucHVzaChzLmN1cnZlTnVtYmVyKTtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBzZXJpZXNbMF0uZGF0YS5vcmllbnRhdGlvbiA9PT0gJ2gnID8gcy54IDogcy55O1xuICAgICAgICAgIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICAgICAgICAgIHZhbHVlID0gcy5yO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgbGFiZWxlZERhdGEgPSBHVFNMaWIuZm9ybWF0TGFiZWwocy5kYXRhLnRleHQgfHwgJycpICsgJzogJyArIHZhbHVlO1xuICAgICAgICAgIGlmIChzLmN1cnZlTnVtYmVyID09PSBoaWdobGlnaHRlZCkge1xuICAgICAgICAgICAgbGFiZWxlZERhdGEgPSBgPGI+JHtsYWJlbGVkRGF0YX08L2I+YDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbGV0IGNvbG9yID0gcy5kYXRhLmxpbmUgPyBzLmRhdGEubGluZS5jb2xvciA6ICcnO1xuICAgICAgICAgIGlmICghIXMuZGF0YS5tYXJrZXIpIHtcbiAgICAgICAgICAgIGlmIChHVFNMaWIuaXNBcnJheShzLmRhdGEubWFya2VyLmNvbG9yKSkge1xuICAgICAgICAgICAgICBjb2xvciA9IHMuZGF0YS5tYXJrZXIuY29sb3JbMF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb2xvciA9IHMuZGF0YS5tYXJrZXIuY29sb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGh0bWwgKz0gYDxpIGNsYXNzPVwiY2hpcFwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvcn07Ym9yZGVyOiAycHggc29saWQgJHtjb2xvcn07XCI+PC9pPiZuYnNwOyR7bGFiZWxlZERhdGF9YDtcbiAgICAgICAgICBpZiAoaSA8IHNlcmllcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGh0bWwgKz0gJzxicj4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdENoYXJ0KGVsOiBFbGVtZW50UmVmLCByZXNpemUgPSB0cnVlKTogYm9vbGVhbiB7XG4gICAgdGhpcy5ub0RhdGEgPSBmYWxzZTtcbiAgICBjb25zdCBwYXJlbnRTaXplID0gKGVsLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAodGhpcy5fcmVzcG9uc2l2ZSkge1xuICAgICAgaWYgKHJlc2l6ZSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5fYXV0b1Jlc2l6ZSAmJiAocGFyZW50U2l6ZS5oZWlnaHQgPT09IDAgfHwgdGhpcy5oZWlnaHQgIT09IHBhcmVudFNpemUuaGVpZ2h0KVxuICAgICAgICAgIHx8IHBhcmVudFNpemUud2lkdGggPT09IDAgfHwgdGhpcy53aWR0aCAhPT0gcGFyZW50U2l6ZS53aWR0aCkge1xuICAgICAgICAgIGlmICh0aGlzLl9hdXRvUmVzaXplKSB7XG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IHBhcmVudFNpemUuaGVpZ2h0O1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLndpZHRoID0gcGFyZW50U2l6ZS53aWR0aDtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaW5pdENoYXJ0KGVsKSwgMTAwKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2F1dG9SZXNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gcGFyZW50U2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMud2lkdGggPSBwYXJlbnRTaXplLndpZHRoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnaW5pdGlDaGFydCcsICd0aGlzLl9kYXRhJ10sIHRoaXMuX2RhdGEsIHRoaXMuX29wdGlvbnMpO1xuICAgIGlmICghdGhpcy5fZGF0YSB8fCAhdGhpcy5fZGF0YS5kYXRhIHx8IHRoaXMuX2RhdGEuZGF0YS5sZW5ndGggPT09IDAgfHwgIXRoaXMuX29wdGlvbnMpIHtcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydpbml0aUNoYXJ0JywgJ25vZGF0YSddKTtcbiAgICAgIHRoaXMubm9EYXRhID0gdHJ1ZTtcbiAgICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5fb3B0aW9ucyA9IENoYXJ0TGliLm1lcmdlRGVlcDxQYXJhbT4odGhpcy5kZWZPcHRpb25zLCB0aGlzLl9vcHRpb25zIHx8IHt9KSBhcyBQYXJhbTtcbiAgICBjb25zdCBkYXRhTW9kZWwgPSB0aGlzLl9kYXRhO1xuICAgIHRoaXMuX29wdGlvbnMgPSBDaGFydExpYi5tZXJnZURlZXA8UGFyYW0+KHRoaXMuX29wdGlvbnMgfHwge30gYXMgUGFyYW0sIHRoaXMuX2RhdGEuZ2xvYmFsUGFyYW1zKSBhcyBQYXJhbTtcbiAgICB0aGlzLl9vcHRpb25zLnRpbWVNb2RlID0gdGhpcy5fb3B0aW9ucy50aW1lTW9kZSB8fCAnZGF0ZSc7XG4gICAgdGhpcy5sb2FkaW5nID0gIXRoaXMuX29wdGlvbnMuaXNSZWZyZXNoO1xuICAgIHRoaXMuZGl2aWRlciA9IEdUU0xpYi5nZXREaXZpZGVyKHRoaXMuX29wdGlvbnMudGltZVVuaXQpO1xuICAgIHRoaXMucGxvdGx5RGF0YSA9IHRoaXMuY29udmVydChkYXRhTW9kZWwpO1xuICAgIHRoaXMucGxvdGx5Q29uZmlnLnJlc3BvbnNpdmUgPSB0aGlzLl9yZXNwb25zaXZlO1xuICAgIHRoaXMubGF5b3V0LnBhcGVyX2JnY29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XG4gICAgdGhpcy5sYXlvdXQucGxvdF9iZ2NvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuICAgIGlmICghdGhpcy5fcmVzcG9uc2l2ZSkge1xuICAgICAgdGhpcy5sYXlvdXQud2lkdGggPSB0aGlzLndpZHRoIHx8IENoYXJ0TGliLkRFRkFVTFRfV0lEVEg7XG4gICAgICB0aGlzLmxheW91dC5oZWlnaHQgPSB0aGlzLmhlaWdodCB8fCBDaGFydExpYi5ERUZBVUxUX0hFSUdIVDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXlvdXQud2lkdGggPSB0aGlzLndpZHRoIHx8IHBhcmVudFNpemUud2lkdGg7XG4gICAgICB0aGlzLmxheW91dC5oZWlnaHQgPSB0aGlzLmhlaWdodCB8fCBwYXJlbnRTaXplLmhlaWdodDtcbiAgICB9XG4gICAgdGhpcy5sYXlvdXQuc2hvd0xlZ2VuZCA9ICEhdGhpcy5fb3B0aW9ucy5zaG93TGVnZW5kO1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaW5pdGlDaGFydCcsICdwbG90bHlEYXRhJ10sIHRoaXMucGxvdGx5RGF0YSk7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5jaGFydERyYXcuZW1pdCgpO1xuICAgIHJldHVybiAhKCF0aGlzLnBsb3RseURhdGEgfHwgdGhpcy5wbG90bHlEYXRhLmxlbmd0aCA9PT0gMCk7XG4gIH1cblxuICBhZnRlclBsb3QocGxvdGx5SW5zdGFuY2U/OiBhbnkpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2FmdGVyUGxvdCcsICdwbG90bHlJbnN0YW5jZSddLCBwbG90bHlJbnN0YW5jZSk7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5yZWN0ID0gdGhpcy5ncmFwaC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB0aGlzLmNoYXJ0RHJhdy5lbWl0KCk7XG4gIH1cblxuICBoaWRlVG9vbHRpcCgpIHtcbiAgICBpZiAoISF0aGlzLmhpZGVUb29sdGlwVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmhpZGVUb29sdGlwVGltZXIpO1xuICAgIH1cbiAgICB0aGlzLmhpZGVUb29sdGlwVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudG9vbFRpcC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSwgMTAwMCk7XG4gIH1cblxuICB1bmhvdmVyKGRhdGE/OiBhbnksIHBvaW50PzogYW55KSB7XG4gICAgdGhpcy5MT0cuZGVidWcoWyd1bmhvdmVyJ10sIGRhdGEpO1xuICAgIGlmICghIXRoaXMuaGlkZVRvb2x0aXBUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaGlkZVRvb2x0aXBUaW1lcik7XG4gICAgfVxuICB9XG5cbiAgaG92ZXIoZGF0YTogYW55LCBwb2ludD86IGFueSkge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy50b29sVGlwLm5hdGl2ZUVsZW1lbnQsICdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgaWYgKCEhdGhpcy5oaWRlVG9vbHRpcFRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5oaWRlVG9vbHRpcFRpbWVyKTtcbiAgICB9XG4gICAgbGV0IGRlbHRhID0gTnVtYmVyLk1BWF9WQUxVRTtcbiAgICBjb25zdCBjdXJ2ZXMgPSBbXTtcbiAgICBpZiAoIXBvaW50KSB7XG4gICAgICBpZiAoZGF0YS5wb2ludHNbMF0gJiYgZGF0YS5wb2ludHNbMF0uZGF0YS5vcmllbnRhdGlvbiAhPT0gJ2gnKSB7XG4gICAgICAgIGNvbnN0IHkgPSAoZGF0YS55dmFscyB8fCBbJyddKVswXTtcbiAgICAgICAgZGF0YS5wb2ludHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICBjdXJ2ZXMucHVzaChwLmN1cnZlTnVtYmVyKTtcbiAgICAgICAgICBjb25zdCBkID0gTWF0aC5hYnMoKHAueSB8fCBwLnIpIC0geSk7XG4gICAgICAgICAgaWYgKGQgPCBkZWx0YSkge1xuICAgICAgICAgICAgZGVsdGEgPSBkO1xuICAgICAgICAgICAgcG9pbnQgPSBwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB4OiBudW1iZXIgPSAoZGF0YS54dmFscyB8fCBbJyddKVswXTtcbiAgICAgICAgZGF0YS5wb2ludHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICBjdXJ2ZXMucHVzaChwLmN1cnZlTnVtYmVyKTtcbiAgICAgICAgICBjb25zdCBkID0gTWF0aC5hYnMoKHAueCB8fCBwLnIpIC0geCk7XG4gICAgICAgICAgaWYgKGQgPCBkZWx0YSkge1xuICAgICAgICAgICAgZGVsdGEgPSBkO1xuICAgICAgICAgICAgcG9pbnQgPSBwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwb2ludCAmJiAhIWRhdGEuZXZlbnQpIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmxlZ2VuZEZvcm1hdHRlcihcbiAgICAgICAgdGhpcy5fb3B0aW9ucy5ob3Jpem9udGFsID9cbiAgICAgICAgICAoZGF0YS55dmFscyB8fCBbJyddKVswXSA6XG4gICAgICAgICAgKGRhdGEueHZhbHMgfHwgWycnXSlbMF1cbiAgICAgICAgLCBkYXRhLnBvaW50cywgcG9pbnQuY3VydmVOdW1iZXIpO1xuICAgICAgbGV0IGxlZnQgPSAoZGF0YS5ldmVudC5vZmZzZXRYICsgMjApICsgJ3B4JztcbiAgICAgIGlmIChkYXRhLmV2ZW50Lm9mZnNldFggPiB0aGlzLmNoYXJ0Q29udGFpbmVyLm5hdGl2ZUVsZW1lbnQuY2xpZW50V2lkdGggLyAyKSB7XG4gICAgICAgIGxlZnQgPSBNYXRoLm1heCgwLCBkYXRhLmV2ZW50Lm9mZnNldFggLSB0aGlzLnRvb2xUaXAubmF0aXZlRWxlbWVudC5jbGllbnRXaWR0aCAtIDIwKSArICdweCc7XG4gICAgICB9XG4gICAgICBjb25zdCB0b3AgPSBNYXRoLm1pbihcbiAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAtIHRoaXMudG9vbFRpcC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAtIDIwLFxuICAgICAgICBkYXRhLmV2ZW50LnkgLSAyMCAtIHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApICsgJ3B4JztcbiAgICAgIHRoaXMubW92ZVRvb2x0aXAodG9wLCBsZWZ0LCBjb250ZW50KTtcbiAgICB9XG4gIH1cblxuICBnZXRUb29sdGlwUG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogdGhpcy50b29sdGlwUG9zaXRpb24udG9wLFxuICAgICAgbGVmdDogdGhpcy50b29sdGlwUG9zaXRpb24ubGVmdCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlVG9vbHRpcCh0b3AsIGxlZnQsIGNvbnRlbnQpIHtcbiAgICB0aGlzLnRvb2x0aXBQb3NpdGlvbiA9IHt0b3AsIGxlZnR9O1xuICAgIHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy50b29sVGlwLm5hdGl2ZUVsZW1lbnQsICdpbm5lckhUTUwnLCBjb250ZW50KTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2hvdmVyIC0gbW92ZVRvb2x0aXAnXSwgbmV3IERhdGUoKS50b0lTT1N0cmluZygpKTtcbiAgfVxuXG4gIHJlbGF5b3V0KCRldmVudDogYW55KSB7XG5cbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRMYWJlbENvbG9yKGVsOiBIVE1MRWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLmdldENTU0NvbG9yKGVsLCAnLS13YXJwLXZpZXctY2hhcnQtbGFiZWwtY29sb3InLCAnIzhlOGU4ZScpLnRyaW0oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRHcmlkQ29sb3IoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q1NTQ29sb3IoZWwsICctLXdhcnAtdmlldy1jaGFydC1ncmlkLWNvbG9yJywgJyM4ZThlOGUnKS50cmltKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Q1NTQ29sb3IoZWw6IEhUTUxFbGVtZW50LCBwcm9wZXJ0eTogc3RyaW5nLCBkZWZDb2xvcjogc3RyaW5nKSB7XG4gICAgY29uc3QgY29sb3IgPSBnZXRDb21wdXRlZFN0eWxlKGVsKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KS50cmltKCk7XG4gICAgcmV0dXJuIGNvbG9yID09PSAnJyA/IGRlZkNvbG9yIDogY29sb3I7XG4gIH1cbn1cbiJdfQ==