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
import { __awaiter } from "tslib";
import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { WarpViewComponent } from '../warp-view-component';
import { WarpViewModalComponent } from '../warp-view-modal/warp-view-modal.component';
import { Param } from '../../model/param';
import { WarpViewChartComponent } from '../warp-view-chart/warp-view-chart.component';
import { WarpViewAnnotationComponent } from '../warp-view-annotation/warp-view-annotation.component';
import { WarpViewMapComponent } from '../warp-view-map/warp-view-map.component';
import { WarpViewGtsPopupComponent } from '../warp-view-gts-popup/warp-view-gts-popup.component';
import moment from 'moment-timezone';
import { GTSLib } from '../../utils/gts.lib';
import { Size, SizeService } from '../../services/resize.service';
import { Logger } from '../../utils/logger';
/**
 *
 */
export class WarpViewPlotComponent extends WarpViewComponent {
    constructor(el, renderer, sizeService, ngZone) {
        super(el, renderer, sizeService, ngZone);
        this.el = el;
        this.renderer = renderer;
        this.sizeService = sizeService;
        this.ngZone = ngZone;
        this.isAlone = false;
        this.initialChartHeight = 400;
        this.initialMapHeight = 400;
        this.warpViewChartResize = new EventEmitter();
        this.warpViewNewOptions = new EventEmitter();
        this._options = Object.assign(Object.assign({}, new Param()), {
            showControls: true,
            showGTSTree: true,
            showDots: true,
            timeZone: 'UTC',
            timeUnit: 'us',
            timeMode: 'date',
            bounds: {}
        });
        this._toHide = [];
        this.showChart = true;
        this.showMap = false;
        this.timeClipValue = '';
        this.kbdLastKeyPressed = [];
        this.warningMessage = '';
        this.loading = false;
        this.gtsIdList = [];
        this.kbdCounter = 0;
        this.gtsFilterCount = 0;
        this.gtsBrowserIndex = -1;
        this._gtsFilter = 'x';
        this._type = 'line';
        this.chartBounds = {
            tsmin: Number.MAX_VALUE,
            tsmax: Number.MIN_VALUE,
            msmax: '',
            msmin: '',
            marginLeft: 0
        };
        // key event are trapped in plot component.
        // if one of this key is pressed, default action is prevented.
        this.preventDefaultKeyList = ['Escape', '/'];
        this.preventDefaultKeyListInModals = ['Escape', 'ArrowUp', 'ArrowDown', ' ', '/'];
        this.showLine = false;
        this.LOG = new Logger(WarpViewPlotComponent, this._debug);
    }
    set type(type) {
        this._type = type;
        this.drawChart();
    }
    get type() {
        return this._type;
    }
    set gtsFilter(gtsFilter) {
        this._gtsFilter = gtsFilter;
        this.drawChart();
    }
    get gtsFilter() {
        return this._gtsFilter;
    }
    ngOnInit() {
        this._options = this._options || this.defOptions;
    }
    ngAfterViewInit() {
        this.drawChart(true);
        this.resizeArea();
    }
    handleKeydown(ev) {
        this.LOG.debug(['handleKeydown'], ev);
        if (!this.isAlone) {
            this.handleKeyPress(ev).then(() => {
                // empty
            });
        }
    }
    stateChange(event) {
        this.LOG.debug(['stateChange'], event);
        switch (event.id) {
            case 'timeSwitch':
                if (event.state) {
                    this._options.timeMode = 'timestamp';
                }
                else {
                    this._options.timeMode = 'date';
                }
                this.drawChart(true);
                break;
            case 'typeSwitch':
                if (event.state) {
                    this._type = 'step';
                }
                else {
                    this._type = 'line';
                }
                this.drawChart(true);
                break;
            case 'chartSwitch':
                this.showChart = event.state;
                this.drawChart(false);
                break;
            case 'mapSwitch':
                this.showMap = event.state;
                if (this.showMap) {
                    requestAnimationFrame(() => this.map.resize());
                }
                break;
        }
        this.warpViewNewOptions.emit(this._options);
    }
    boundsDidChange(event) {
        this.LOG.debug(['updateBounds'], event);
        this._options.bounds = this._options.bounds || {};
        if (this._options.bounds.minDate !== event.bounds.min && this._options.bounds.maxDate !== event.bounds.max) {
            this._options.bounds = this._options.bounds || {};
            this._options.bounds.minDate = event.bounds.min;
            this._options.bounds.maxDate = event.bounds.max;
            this.warpViewNewOptions.emit(this._options);
            if (event.source === 'chart') {
                this.annotation.updateBounds(event.bounds.min, event.bounds.max, event.bounds.marginLeft);
            }
            else if (event.source === 'annotation') {
                this.chart.updateBounds(event.bounds.min, event.bounds.max);
            }
            this.LOG.debug(['updateBounds'], GTSLib.toISOString(event.bounds.min, 1, this._options.timeZone), GTSLib.toISOString(event.bounds.max, 1, this._options.timeZone));
            this.line.nativeElement.style.left = '-100px';
        }
    }
    onWarpViewModalClose() {
        this.mainPlotDiv.nativeElement.focus();
    }
    warpViewSelectedGTS(event) {
        this.LOG.debug(['warpViewSelectedGTS'], event);
        if (!this._toHide.find(i => {
            return i === event.gts.id;
        }) && !event.selected) { // if not in toHide and state false, put id in toHide
            this._toHide.push(event.gts.id);
        }
        else {
            if (event.selected) { // if in toHide and state true, remove it from toHide
                this._toHide = this._toHide.filter(i => {
                    return i !== event.gts.id;
                });
            }
        }
        this.LOG.debug(['warpViewSelectedGTS', 'this._toHide'], this._toHide);
        this.ngZone.run(() => {
            this._toHide = [...this._toHide];
        });
    }
    handleMouseMove(evt) {
        evt.preventDefault();
        if (this.showLine && this.line) {
            this.line.nativeElement.style.left = Math.max(evt.pageX - this.left, 50) + 'px';
        }
    }
    handleMouseEnter(evt) {
        evt.preventDefault();
        this.left = this.left || this.main.nativeElement.getBoundingClientRect().left;
        this.showLine = true;
        if (this.line) {
            this.renderer.setStyle(this.line.nativeElement, 'display', 'block');
        }
    }
    handleMouseOut(evt) {
        // evt.preventDefault();
        if (this.line) {
            this.showLine = false;
            this.renderer.setStyle(this.line.nativeElement, 'left', '-100px');
            this.renderer.setStyle(this.line.nativeElement, 'display', 'none');
        }
    }
    update(options, refresh) {
        this.drawChart(refresh);
    }
    inputTextKeyboardEvents(e) {
        e.stopImmediatePropagation();
        if (e.key === 'Enter') {
            this.applyFilter();
        }
        else if (e.key === 'Escape') {
            this.pushKbdEvent('Escape');
            this.modal.close();
        }
    }
    tzSelected(event) {
        const timeZone = this.tzSelector.nativeElement.value;
        this.LOG.debug(['timezone', 'tzselect'], timeZone, event);
        delete this._options.bounds;
        this._options.timeZone = timeZone;
        this.tzSelector.nativeElement.setAttribute('class', timeZone === 'UTC' ? 'defaulttz' : 'customtz');
        this.drawChart();
    }
    getTimeClip() {
        this.LOG.debug(['getTimeClip'], this.chart.getTimeClip());
        return this.chart.getTimeClip();
    }
    resizeChart(event) {
        if (this.initialChartHeight !== event) {
            this.LOG.debug(['resizeChart'], event);
            this.initialChartHeight = event;
            this.sizeService.change(new Size(this.width, event));
        }
    }
    drawChart(firstDraw = false) {
        this.LOG.debug(['drawCharts'], this._data, this._options);
        if (!this._data || !this._data.data || this._data.data.length === 0) {
            return;
        }
        if (this.timeClip) {
            this.timeClip.close();
        }
        if (this.modal) {
            this.modal.close();
        }
        this.LOG.debug(['PPts'], 'firstdraw ', firstDraw);
        if (firstDraw) { // on the first draw, we can set some default options.
            // automatically switch to timestamp mode
            // when the first tick and last tick of all the series are in the interval [-100ms 100ms]
            const tsLimit = 100 * GTSLib.getDivider(this._options.timeUnit);
            const dataList = this._data.data;
            if (dataList) {
                let gtsList = GTSLib.flattenGtsIdArray(dataList, 0).res;
                gtsList = GTSLib.flatDeep(gtsList);
                let timestampMode = true;
                let totalDatapoints = 0;
                gtsList.forEach(g => {
                    this.gtsIdList.push(g.id); // usefull for gts browse shortcut
                    if (g.v.length > 0) { // if gts not empty
                        timestampMode = timestampMode && (g.v[0][0] > -tsLimit && g.v[0][0] < tsLimit);
                        timestampMode = timestampMode && (g.v[g.v.length - 1][0] > -tsLimit && g.v[g.v.length - 1][0] < tsLimit);
                        totalDatapoints += g.v.length;
                    }
                });
                if (timestampMode) {
                    this._options.timeMode = 'timestamp';
                }
                this.LOG.debug(['drawCharts', 'parsed', 'timestampMode'], timestampMode);
            }
        }
        this.gtsList = this._data;
        this._options = Object.assign({}, this._options);
        this.LOG.debug(['drawCharts', 'parsed'], this._data, this._options);
        this.resizeArea();
    }
    focus(event) {
        // read the first 4 letters of id of all elements in the click tree
        const idListClicked = event.path.map(el => (el.id || '').slice(0, 4));
        // if not alone on the page, and click is not on the timezone selector and not on the map, force focus.
        if (!this.isAlone && idListClicked.indexOf('tzSe') < 0 && idListClicked.indexOf('map-') < 0) {
            this.mainPlotDiv.nativeElement.focus();
        } // prevent stealing focus of the timezone selector.
    }
    handleKeyPress(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            this.LOG.debug(['handleKeyPress'], ev);
            if (this.preventDefaultKeyList.indexOf(ev.key) >= 0) {
                ev.preventDefault();
            }
            if ((yield this.timeClip.isOpened()) || (yield this.modal.isOpened()) || (yield this.gtsPopupModal.isOpened())) {
                if (this.preventDefaultKeyListInModals.indexOf(ev.key) >= 0) {
                    ev.preventDefault();
                }
            }
            if (ev.key === '/') {
                this.modal.open();
                this.filterInput.nativeElement.focus();
                this.filterInput.nativeElement.select();
            }
            else if (ev.key === 't') {
                this.chart.getTimeClip().then(tc => {
                    this.timeClipValue = `<p>keep data between
          ${this._options.timeMode === 'timestamp' ? tc.tsmin : moment.tz(tc.tsmin, this._options.timeZone).toLocaleString()} and
          ${this._options.timeMode === 'timestamp' ? tc.tsmax : moment.tz(tc.tsmax, this._options.timeZone).toLocaleString()}
          ${this._options.timeUnit !== 'us' ? ' (for a ' + this._options.timeUnit + ' platform)' : ''}</p>
          <pre><code>${Math.round(tc.tsmax)} ${Math.round(tc.tsmax - tc.tsmin)} TIMECLIP</code></pre>`;
                    this.timeClip.open();
                });
            }
            else if (ev.key === 'b' || ev.key === 'B') { // browse among all gts
                if (this.gtsBrowserIndex < 0) {
                    this.gtsBrowserIndex = 0;
                }
                if (ev.key === 'b') { // increment index
                    this.gtsBrowserIndex++;
                    if (this.gtsBrowserIndex === this.gtsIdList.length) {
                        this.gtsBrowserIndex = 0;
                    }
                }
                else { // decrement index
                    this.gtsBrowserIndex--;
                    if (this.gtsBrowserIndex < 0) {
                        this.gtsBrowserIndex = this.gtsIdList.length - 1;
                    }
                }
                this._toHide = this.gtsIdList.filter(v => v !== this.gtsIdList[this.gtsBrowserIndex]); // hide all but one
            }
            else if (ev.key === 'n') {
                this._toHide = [...this.gtsIdList];
                return false;
            }
            else if (ev.key === 'a') {
                this._toHide = [];
            }
            else if (ev.key === 'Escape') {
                this.timeClip.isOpened().then(r => {
                    if (r) {
                        this.timeClip.close();
                    }
                });
                this.modal.isOpened().then(r => {
                    if (r) {
                        this.modal.close();
                    }
                });
                this.gtsPopupModal.isOpened().then(r => {
                    if (r) {
                        this.gtsPopupModal.close();
                    }
                });
            }
            else {
                this.pushKbdEvent(ev.key);
            }
            this.LOG.debug(['handleKeyPress', 'this.gtsIdList'], this._toHide, this.gtsBrowserIndex);
        });
    }
    applyFilter() {
        this.gtsFilterCount++;
        this._gtsFilter = this.gtsFilterCount.toString().slice(0, 1) + this.filterInput.nativeElement.value;
        this.modal.close();
    }
    pushKbdEvent(key) {
        this.kbdCounter++;
        this.kbdLastKeyPressed = [key, this.kbdCounter.toString()];
    }
    getTZ() {
        return moment.tz.names();
    }
    convert(data) {
        return [];
    }
    onChartDraw($event, component) {
        if (this.chartBounds
            && $event
            && this.chartBounds.tsmin !== Math.min(this.chartBounds.tsmin, $event.tsmin)
            && this.chartBounds.tsmax !== Math.max(this.chartBounds.tsmax, $event.tsmax)) {
            this.chartBounds.tsmin = Math.min(this.chartBounds.tsmin, $event.tsmin);
            this.chartBounds.tsmax = Math.max(this.chartBounds.tsmax, $event.tsmax);
            this.annotation.setRealBounds(this.chartBounds);
            this.chart.setRealBounds(this.chartBounds);
            this.chartDraw.emit();
            this.LOG.debug(['onChartDraw', 'this.chartBounds'], component, this.chartBounds, $event);
        }
        else {
            this.chartDraw.emit($event);
        }
        this.resizeArea();
    }
    resizeArea() {
        if (this.showChart && !!this.chart) {
            let h = this.chart.el.nativeElement.getBoundingClientRect().height;
            if (h > 0) {
                if (!!this.GTSTree) {
                    h -= this.GTSTree.nativeElement.getBoundingClientRect().height;
                }
                if (!!this.controls) {
                    h -= this.controls.nativeElement.getBoundingClientRect().height;
                }
                this.initialChartHeight = h;
            }
            else {
                setTimeout(() => this.resizeArea(), 100);
            }
        }
    }
}
WarpViewPlotComponent.decorators = [
    { type: Component, args: [{
                selector: 'warpview-plot',
                template: "<!--\n  ~  Copyright 2020  SenX S.A.S.\n  ~\n  ~  Licensed under the Apache License, Version 2.0 (the \"License\");\n  ~  you may not use this file except in compliance with the License.\n  ~  You may obtain a copy of the License at\n  ~\n  ~    http://www.apache.org/licenses/LICENSE-2.0\n  ~\n  ~  Unless required by applicable law or agreed to in writing, software\n  ~  distributed under the License is distributed on an \"AS IS\" BASIS,\n  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  ~  See the License for the specific language governing permissions and\n  ~  limitations under the License.\n  ~\n  -->\n\n<div #mainPlotDiv tabindex=\"0\" (click)=\"focus($event)\" id=\"focusablePlotDiv\">\n  <warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\" modalTitle=\"TimeClip\" #timeClip\n                  (warpViewModalClose)=\"onWarpViewModalClose()\"\n  >\n    <div #timeClipElement [innerHTML]=\"timeClipValue\"></div>\n  </warpview-modal>\n  <warpview-modal [kbdLastKeyPressed]=\"kbdLastKeyPressed\" modalTitle=\"GTS Filter\" #modal\n                  (warpViewModalClose)=\"onWarpViewModalClose()\"\n  >\n    <label for=\"filterInput\">Enter a regular expression to filter GTS.</label>\n    <br />\n    <input tabindex=\"1\" type=\"text\" (keypress)=\"inputTextKeyboardEvents($event)\" #filterInput id=\"filterInput\"\n           (keydown)=\"inputTextKeyboardEvents($event)\" (keyup)=\"inputTextKeyboardEvents($event)\"\n           [value]=\"gtsFilter.slice(1)\"/>\n    <button (click)=\"applyFilter()\" [innerHTML]=\"_options.popupButtonValidateLabel || 'Apply'\"\n            class=\"{{_options.popupButtonValidateClass}}\" tabindex=\"2\"\n            type=\"button\">\n    </button>\n  </warpview-modal>\n  <warpview-gts-popup [maxToShow]=\"5\" [hiddenData]=\"_toHide\" [gtsList]=\"gtsList\"\n                      [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n                      [options]=\"_options\" [debug]=\"debug\"\n                      (warpViewModalClose)=\"onWarpViewModalClose()\"\n                      (warpViewSelectedGTS)=\"warpViewSelectedGTS($event)\"\n                      #gtsPopupModal></warpview-gts-popup>\n  <div class=\"inline\" *ngIf=\"_options.showControls\" #controls>\n    <warpview-toggle id=\"timeSwitch\" text1=\"Date\" text2=\"Timestamp\"\n                     (stateChange)=\"stateChange($event)\"\n                     [checked]=\"_options.timeMode === 'timestamp'\"></warpview-toggle>\n    <warpview-toggle id=\"typeSwitch\" text1=\"Line\" text2=\"Step\"\n                     (stateChange)=\"stateChange($event)\"></warpview-toggle>\n    <warpview-toggle id=\"chartSwitch\" text1=\"Hide chart\" text2=\"Display chart\"\n                     (stateChange)=\"stateChange($event)\"\n                     [checked]=\"showChart\"></warpview-toggle>\n    <warpview-toggle id=\"mapSwitch\" text1=\"Hide map\" text2=\"Display map\"\n                     (stateChange)=\"stateChange($event)\" [checked]=\"showMap\"></warpview-toggle>\n    <div class=\"tzcontainer\">\n      <label for=\"tzSelector\"></label>\n      <select id=\"tzSelector\" class=\"defaulttz\" #tzSelector (change)=\"tzSelected($event)\">\n        <option *ngFor=\"let z of getTZ()\" [value]=\"z\" [selected]=\"z === 'UTC'\"\n                [ngClass]=\"{'defaulttz' :z === 'UTC','customtz': z !== 'UTC'}\">{{z}}</option>\n      </select>\n    </div>\n  </div>\n  <div *ngIf=\"warningMessage\" class=\"warningMessage\">{{warningMessage}}</div>\n  <warpview-gts-tree\n    *ngIf=\"_options.showGTSTree\"\n    [data]=\"gtsList\" id=\"tree\" [gtsFilter]=\"gtsFilter\" [debug]=\"debug\" #GTSTree\n    (warpViewSelectedGTS)=\"warpViewSelectedGTS($event)\"\n    [hiddenData]=\"_toHide\" [options]=\"_options\"\n    [kbdLastKeyPressed]=\"kbdLastKeyPressed\"\n  ></warpview-gts-tree>\n  <div [hidden]=\"!showChart\" #main class=\"main-container\"\n       (mouseleave)=\"handleMouseOut($event)\"\n       (mousemove)=\"handleMouseMove($event)\"\n       (mouseenter)=\"handleMouseEnter($event)\">\n    <div class=\"bar\" #line></div>\n    <div class=\"annotation\">\n      <warpview-annotation #annotation\n                           [data]=\"gtsList\" [responsive]=\"true\"\n                           (boundsDidChange)=\"boundsDidChange($event)\"\n                           (chartDraw)=\"onChartDraw($event, 'annotation')\"\n                           [showLegend]='showLegend' [debug]=\"debug\" [standalone]=\"false\"\n                           [hiddenData]=\"_toHide\" [options]=\"_options\"\n      ></warpview-annotation>\n    </div>\n    <warpview-resize minHeight=\"100\" [initialHeight]=\"initialChartHeight\" [debug]=\"debug\"\n                     (resize)=\"resizeChart($event)\"\n    >\n      <warpview-chart [responsive]=\"true\" [standalone]=\"false\" [data]=\"gtsList\"\n                      [showLegend]=\"showLegend\"\n                      (boundsDidChange)=\"boundsDidChange($event)\"\n                      (chartDraw)=\"onChartDraw($event, 'chart')\"\n                      #chart [debug]=\"debug\" [hiddenData]=\"_toHide\" [type]=\"type\" [options]=\"_options\"\n      ></warpview-chart>\n    </warpview-resize>\n  </div>\n  <warpview-resize *ngIf=\"showMap\" minHeight=\"100\" [initialHeight]=\"initialMapHeight\" [debug]=\"debug\">\n    <div class=\"map-container\">\n      <warpview-map [options]=\"_options\" #map [data]=\"gtsList\" [debug]=\"debug\" [responsive]=\"true\"\n                    [hiddenData]=\"_toHide\"\n      ></warpview-map>\n    </div>\n  </warpview-resize>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                styles: ["/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */\n/*!\n *  Copyright 2020  SenX S.A.S.\n *\n *  Licensed under the Apache License, Version 2.0 (the \"License\");\n *  you may not use this file except in compliance with the License.\n *  You may obtain a copy of the License at\n *\n *    http://www.apache.org/licenses/LICENSE-2.0\n *\n *  Unless required by applicable law or agreed to in writing, software\n *  distributed under the License is distributed on an \"AS IS\" BASIS,\n *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n *  See the License for the specific language governing permissions and\n *  limitations under the License.\n *\n */:root{--gts-attrname-font-color:#ed4a7b;--gts-attrvalue-font-color:#000;--gts-classname-font-color:#004eff;--gts-labelname-font-color:#19a979;--gts-labelvalue-font-color:#000;--gts-separator-font-color:#a0a0a0;--gts-stack-font-color:#000;--gts-tree-collapsed-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVQ4T6WTUW7CQAxEPQdozxYb9Qb94Aj9gQSoVCp6lMr21doDZFCQiFCU3YDY//d2PeOFPHnwJC+zAlVdA/jp+/6YmZ+1S0qCPxF5HUAAO3fvSpKS4ENEvm6gfUS0c5JiBma2Ibm/QiQPmbmdSqohquoA7GqSxRaapmkBjBkAeHP336t0UWBmHcnb+VcR4XcJpjDJLjPHkS4tleqZubmNiDHU6gumDQDYuvvh7hpV9V9EXgaA5Ka2jbMjmNk7yZOIfEfE8eFVfuSDLda4JDsD3FNdEckTC0YAAAAASUVORK5CYII=);--gts-tree-expanded-icon:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7klEQVQ4T82TMW7CQBBF/0g+QOpINEkVCmpaLoBm5COk5QYoaeAY3MDSei2LGu4QKakiBA1tCpTK8kS2sLVe2xSh8XSrnf9m/s4s4c6gO/UYGEBEXlT1bK396bFGIjIJguA7iqJLkVNbYOZXItoQ0QHAzBhz9CCFeAVgCeAjy7Jpmqa/NUBEEgDzktqGuOKKO47j+KsGhGH4lOf5HsDIg5ycyqVYVd+steuGheLAzM9EtPMgW1VdVGWJ6N0YU1gpozVGH+K+gy/uBHR1crXUqNzbQXXhduJ69sd7cxOZ+UFVH5Mk+exb+YGt8n9+5h8up1sReYC0WAAAAABJRU5ErkJggg==);--warp-slider-connect-color:#f90;--warp-slider-handle-bg-color:#fff;--warp-slider-handle-color:#004eff;--warp-slider-handle-shadow:inset 0 0 1px #fff,inset 0 1px 7px silver,0 3px 6px -3px #a0a0a0;--warp-view-annotationtooltip-font-color:#404040;--warp-view-annotationtooltip-value-font-color:#004eff;--warp-view-bar-color:#dc3545;--warp-view-chart-height:100%;--warp-view-chart-legend-bg:#fff;--warp-view-chart-legend-color:#404040;--warp-view-chart-width:100%;--warp-view-datagrid-cell-padding:5px;--warp-view-datagrid-even-bg-color:silver;--warp-view-datagrid-even-color:#000;--warp-view-datagrid-odd-bg-color:#fff;--warp-view-datagrid-odd-color:#404040;--warp-view-font-color:#000;--warp-view-map-margin:0;--warp-view-pagination-active-bg-color:#4caf50;--warp-view-pagination-active-border-color:#4caf50;--warp-view-pagination-active-color:#fff;--warp-view-pagination-bg-color:#fff;--warp-view-pagination-border-color:silver;--warp-view-pagination-disabled-color:silver;--warp-view-pagination-hover-bg-color:silver;--warp-view-pagination-hover-border-color:silver;--warp-view-pagination-hover-color:#000;--warp-view-plot-chart-height:100%;--warp-view-popup-bg-color:#fff;--warp-view-popup-body-bg-color:#fff;--warp-view-popup-body-color:#000;--warp-view-popup-border-color:rgba(0,0,0,0.2);--warp-view-popup-close-color:#404040;--warp-view-popup-header-bg-color:silver;--warp-view-popup-title-color:#404040;--warp-view-resize-handle-color:silver;--warp-view-resize-handle-height:10px;--warp-view-slider-pointer-size:65px;--warp-view-spinner-color:#f90;--warp-view-switch-handle-checked-color:radial-gradient(#fff 15%,#00cd00 100%);--warp-view-switch-handle-color:radial-gradient(#fff 15%,silver 100%);--warp-view-switch-height:30px;--warp-view-switch-inset-checked-color:#00cd00;--warp-view-switch-inset-color:silver;--warp-view-switch-radius:18px;--warp-view-switch-width:100px;--warp-view-tile-height:100%;--warp-view-tile-width:100%}.noData{color:var(--warp-view-chart-legend-color);position:relative;text-align:center;width:100%}:host,warp-view-plot,warpview-plot{height:100%;position:relative}:host .main-container,warp-view-plot .main-container,warpview-plot .main-container{position:relative}:host .map-container,warp-view-plot .map-container,warpview-plot .map-container{height:100%;margin-right:20px;position:relative;width:100%}:host .bar,warp-view-plot .bar,warpview-plot .bar{-webkit-backface-visibility:hidden;backface-visibility:hidden;background-color:transparent;border-left:2px dashed var(--warp-view-bar-color);bottom:55px;display:none;height:calc(100% - 75px);left:-100px;overflow:hidden;pointer-events:none;position:absolute;top:0;width:1px;z-index:0}:host .inline,warp-view-plot .inline,warpview-plot .inline{align-items:stretch;display:inline-flex;flex-direction:row;flex-wrap:wrap;justify-content:space-evenly;width:100%}:host label,warp-view-plot label,warpview-plot label{display:inline-block}:host input,warp-view-plot input,warpview-plot input{display:block;font-size:1rem;font-weight:400;line-height:1.5;padding:5px;width:calc(100% - 20px)}:host .annotation,warp-view-plot .annotation,warpview-plot .annotation{height:auto;margin-bottom:0;max-width:100%;padding-top:20px}:host #focusablePlotDiv:focus,warp-view-plot #focusablePlotDiv:focus,warpview-plot #focusablePlotDiv:focus{outline:none}:host #tzSelector,warp-view-plot #tzSelector,warpview-plot #tzSelector{border:none;border-radius:var(--warp-view-switch-radius);box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);color:var(--warp-view-font-color);height:var(--warp-view-switch-height);margin:auto;padding-left:calc(var(--warp-view-switch-radius)/2);padding-right:5px}:host .defaulttz,warp-view-plot .defaulttz,warpview-plot .defaulttz{background:var(--warp-view-switch-inset-color)}:host .customtz,warp-view-plot .customtz,warpview-plot .customtz{background:var(--warp-view-switch-inset-checked-color)}:host .tzcontainer,warp-view-plot .tzcontainer,warpview-plot .tzcontainer{display:flex}:host .chart-container,warp-view-plot .chart-container,warpview-plot .chart-container{height:var(--warp-view-plot-chart-height);width:100%}:host #bottomPlaceHolder,warp-view-plot #bottomPlaceHolder,warpview-plot #bottomPlaceHolder{height:200px;width:100%}:host .warningMessage,warp-view-plot .warningMessage,warpview-plot .warningMessage{background:#faebd7;border:2px solid orange;border-radius:3px;color:orange;display:block;margin:1em;padding:10px}"]
            },] }
];
WarpViewPlotComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SizeService },
    { type: NgZone }
];
WarpViewPlotComponent.propDecorators = {
    mainPlotDiv: [{ type: ViewChild, args: ['mainPlotDiv', { static: true },] }],
    timeClip: [{ type: ViewChild, args: ['timeClip', { static: true },] }],
    modal: [{ type: ViewChild, args: ['modal', { static: true },] }],
    chart: [{ type: ViewChild, args: ['chart',] }],
    gtsPopupModal: [{ type: ViewChild, args: ['gtsPopupModal',] }],
    annotation: [{ type: ViewChild, args: ['annotation',] }],
    map: [{ type: ViewChild, args: ['map',] }],
    timeClipElement: [{ type: ViewChild, args: ['timeClipElement', { static: true },] }],
    GTSTree: [{ type: ViewChild, args: ['GTSTree', { static: true },] }],
    controls: [{ type: ViewChild, args: ['controls', { static: true },] }],
    filterInput: [{ type: ViewChild, args: ['filterInput', { static: true },] }],
    tzSelector: [{ type: ViewChild, args: ['tzSelector',] }],
    line: [{ type: ViewChild, args: ['line',] }],
    main: [{ type: ViewChild, args: ['main',] }],
    type: [{ type: Input, args: ['type',] }],
    gtsFilter: [{ type: Input, args: ['gtsFilter',] }],
    isAlone: [{ type: Input, args: ['isAlone',] }],
    initialChartHeight: [{ type: Input, args: ['initialChartHeight',] }],
    initialMapHeight: [{ type: Input, args: ['initialMapHeight',] }],
    warpViewChartResize: [{ type: Output, args: ['warpViewChartResize',] }],
    warpViewNewOptions: [{ type: Output, args: ['warpViewNewOptions',] }],
    handleKeydown: [{ type: HostListener, args: ['keydown', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FycC12aWV3LXBsb3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3hhdmllci93b3Jrc3BhY2Uvd2FycC12aWV3L3Byb2plY3RzL3dhcnB2aWV3LW5nLyIsInNvdXJjZXMiOlsic3JjL2xpYi9lbGVtZW50cy93YXJwLXZpZXctcGxvdC93YXJwLXZpZXctcGxvdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOztBQUVILE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sRUFFTixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sOENBQThDLENBQUM7QUFDcEYsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3hDLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLDhDQUE4QyxDQUFDO0FBQ3BGLE9BQU8sRUFBQywyQkFBMkIsRUFBQyxNQUFNLHdEQUF3RCxDQUFDO0FBQ25HLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBQzlFLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLHNEQUFzRCxDQUFDO0FBRS9GLE9BQU8sTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBQ3JDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUczQyxPQUFPLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUUxQzs7R0FFRztBQU9ILE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxp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QUMsV0FBVztzQkFTakIsS0FBSyxTQUFDLFNBQVM7aUNBQ2YsS0FBSyxTQUFDLG9CQUFvQjsrQkFDMUIsS0FBSyxTQUFDLGtCQUFrQjtrQ0FFeEIsTUFBTSxTQUFDLHFCQUFxQjtpQ0FDNUIsTUFBTSxTQUFDLG9CQUFvQjs0QkE2RDNCLFlBQVksU0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogIENvcHlyaWdodCAyMDIwICBTZW5YIFMuQS5TLlxuICpcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqICBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1dhcnBWaWV3Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdNb2RhbENvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LW1vZGFsL3dhcnAtdmlldy1tb2RhbC5jb21wb25lbnQnO1xuaW1wb3J0IHtQYXJhbX0gZnJvbSAnLi4vLi4vbW9kZWwvcGFyYW0nO1xuaW1wb3J0IHtXYXJwVmlld0NoYXJ0Q29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctY2hhcnQvd2FycC12aWV3LWNoYXJ0LmNvbXBvbmVudCc7XG5pbXBvcnQge1dhcnBWaWV3QW5ub3RhdGlvbkNvbXBvbmVudH0gZnJvbSAnLi4vd2FycC12aWV3LWFubm90YXRpb24vd2FycC12aWV3LWFubm90YXRpb24uY29tcG9uZW50JztcbmltcG9ydCB7V2FycFZpZXdNYXBDb21wb25lbnR9IGZyb20gJy4uL3dhcnAtdmlldy1tYXAvd2FycC12aWV3LW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHtXYXJwVmlld0d0c1BvcHVwQ29tcG9uZW50fSBmcm9tICcuLi93YXJwLXZpZXctZ3RzLXBvcHVwL3dhcnAtdmlldy1ndHMtcG9wdXAuY29tcG9uZW50JztcbmltcG9ydCB7Q2hhcnRCb3VuZHN9IGZyb20gJy4uLy4uL21vZGVsL2NoYXJ0Qm91bmRzJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcbmltcG9ydCB7R1RTTGlifSBmcm9tICcuLi8uLi91dGlscy9ndHMubGliJztcbmltcG9ydCB7R1RTfSBmcm9tICcuLi8uLi9tb2RlbC9HVFMnO1xuaW1wb3J0IHtEYXRhTW9kZWx9IGZyb20gJy4uLy4uL21vZGVsL2RhdGFNb2RlbCc7XG5pbXBvcnQge1NpemUsIFNpemVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9yZXNpemUuc2VydmljZSc7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSAnLi4vLi4vdXRpbHMvbG9nZ2VyJztcblxuLyoqXG4gKlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd3YXJwdmlldy1wbG90JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3dhcnAtdmlldy1wbG90LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vd2FycC12aWV3LXBsb3QuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBXYXJwVmlld1Bsb3RDb21wb25lbnQgZXh0ZW5kcyBXYXJwVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBWaWV3Q2hpbGQoJ21haW5QbG90RGl2Jywge3N0YXRpYzogdHJ1ZX0pIG1haW5QbG90RGl2OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0aW1lQ2xpcCcsIHtzdGF0aWM6IHRydWV9KSB0aW1lQ2xpcDogV2FycFZpZXdNb2RhbENvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnbW9kYWwnLCB7c3RhdGljOiB0cnVlfSkgbW9kYWw6IFdhcnBWaWV3TW9kYWxDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2NoYXJ0JykgY2hhcnQ6IFdhcnBWaWV3Q2hhcnRDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2d0c1BvcHVwTW9kYWwnKSBndHNQb3B1cE1vZGFsOiBXYXJwVmlld0d0c1BvcHVwQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdhbm5vdGF0aW9uJykgYW5ub3RhdGlvbjogV2FycFZpZXdBbm5vdGF0aW9uQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdtYXAnKSBtYXA6IFdhcnBWaWV3TWFwQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCd0aW1lQ2xpcEVsZW1lbnQnLCB7c3RhdGljOiB0cnVlfSkgdGltZUNsaXBFbGVtZW50OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdHVFNUcmVlJywge3N0YXRpYzogdHJ1ZX0pIEdUU1RyZWU6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2NvbnRyb2xzJywge3N0YXRpYzogdHJ1ZX0pIGNvbnRyb2xzOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdmaWx0ZXJJbnB1dCcsIHtzdGF0aWM6IHRydWV9KSBmaWx0ZXJJbnB1dDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgndHpTZWxlY3RvcicpIHR6U2VsZWN0b3I6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2xpbmUnKSBsaW5lOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdtYWluJykgbWFpbjogRWxlbWVudFJlZjtcblxuICBASW5wdXQoJ3R5cGUnKSBzZXQgdHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gIH1cblxuICBASW5wdXQoJ2d0c0ZpbHRlcicpIHNldCBndHNGaWx0ZXIoZ3RzRmlsdGVyKSB7XG4gICAgdGhpcy5fZ3RzRmlsdGVyID0gZ3RzRmlsdGVyO1xuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XG4gIH1cblxuICBnZXQgZ3RzRmlsdGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9ndHNGaWx0ZXI7XG4gIH1cblxuICBASW5wdXQoJ2lzQWxvbmUnKSBpc0Fsb25lID0gZmFsc2U7XG4gIEBJbnB1dCgnaW5pdGlhbENoYXJ0SGVpZ2h0JykgaW5pdGlhbENoYXJ0SGVpZ2h0ID0gNDAwO1xuICBASW5wdXQoJ2luaXRpYWxNYXBIZWlnaHQnKSBpbml0aWFsTWFwSGVpZ2h0ID0gNDAwO1xuXG4gIEBPdXRwdXQoJ3dhcnBWaWV3Q2hhcnRSZXNpemUnKSB3YXJwVmlld0NoYXJ0UmVzaXplID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoJ3dhcnBWaWV3TmV3T3B0aW9ucycpIHdhcnBWaWV3TmV3T3B0aW9ucyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIF9vcHRpb25zOiBQYXJhbSA9IHtcbiAgICAuLi5uZXcgUGFyYW0oKSwgLi4ue1xuICAgICAgc2hvd0NvbnRyb2xzOiB0cnVlLFxuICAgICAgc2hvd0dUU1RyZWU6IHRydWUsXG4gICAgICBzaG93RG90czogdHJ1ZSxcbiAgICAgIHRpbWVab25lOiAnVVRDJyxcbiAgICAgIHRpbWVVbml0OiAndXMnLFxuICAgICAgdGltZU1vZGU6ICdkYXRlJyxcbiAgICAgIGJvdW5kczoge31cbiAgICB9XG4gIH07XG4gIF90b0hpZGU6IG51bWJlcltdID0gW107XG4gIHNob3dDaGFydCA9IHRydWU7XG4gIHNob3dNYXAgPSBmYWxzZTtcbiAgdGltZUNsaXBWYWx1ZSA9ICcnO1xuICBrYmRMYXN0S2V5UHJlc3NlZDogc3RyaW5nW10gPSBbXTtcbiAgd2FybmluZ01lc3NhZ2UgPSAnJztcbiAgbG9hZGluZyA9IGZhbHNlO1xuICBndHNJZExpc3Q6IG51bWJlcltdID0gW107XG4gIGd0c0xpc3Q6IERhdGFNb2RlbCB8IEdUU1tdIHwgc3RyaW5nO1xuXG4gIHByaXZhdGUga2JkQ291bnRlciA9IDA7XG4gIHByaXZhdGUgZ3RzRmlsdGVyQ291bnQgPSAwO1xuICBwcml2YXRlIGd0c0Jyb3dzZXJJbmRleCA9IC0xO1xuICBwcml2YXRlIF9ndHNGaWx0ZXIgPSAneCc7XG4gIHByaXZhdGUgX3R5cGUgPSAnbGluZSc7XG4gIHByaXZhdGUgY2hhcnRCb3VuZHM6IENoYXJ0Qm91bmRzID0ge1xuICAgIHRzbWluOiBOdW1iZXIuTUFYX1ZBTFVFLFxuICAgIHRzbWF4OiBOdW1iZXIuTUlOX1ZBTFVFLFxuICAgIG1zbWF4OiAnJyxcbiAgICBtc21pbjogJycsXG4gICAgbWFyZ2luTGVmdDogMFxuICB9O1xuICAvLyBrZXkgZXZlbnQgYXJlIHRyYXBwZWQgaW4gcGxvdCBjb21wb25lbnQuXG4gIC8vIGlmIG9uZSBvZiB0aGlzIGtleSBpcyBwcmVzc2VkLCBkZWZhdWx0IGFjdGlvbiBpcyBwcmV2ZW50ZWQuXG4gIHByaXZhdGUgcHJldmVudERlZmF1bHRLZXlMaXN0OiBzdHJpbmdbXSA9IFsnRXNjYXBlJywgJy8nXTtcbiAgcHJpdmF0ZSBwcmV2ZW50RGVmYXVsdEtleUxpc3RJbk1vZGFsczogc3RyaW5nW10gPSBbJ0VzY2FwZScsICdBcnJvd1VwJywgJ0Fycm93RG93bicsICcgJywgJy8nXTtcbiAgcHJpdmF0ZSBzaG93TGluZSA9IGZhbHNlO1xuICBwcml2YXRlIGxlZnQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHNpemVTZXJ2aWNlOiBTaXplU2VydmljZSxcbiAgICBwdWJsaWMgbmdab25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgc3VwZXIoZWwsIHJlbmRlcmVyLCBzaXplU2VydmljZSwgbmdab25lKTtcbiAgICB0aGlzLkxPRyA9IG5ldyBMb2dnZXIoV2FycFZpZXdQbG90Q29tcG9uZW50LCB0aGlzLl9kZWJ1Zyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9vcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCB0aGlzLmRlZk9wdGlvbnM7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3Q2hhcnQodHJ1ZSk7XG4gICAgdGhpcy5yZXNpemVBcmVhKCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlS2V5ZG93bihldjogS2V5Ym9hcmRFdmVudCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGFuZGxlS2V5ZG93biddLCBldik7XG4gICAgaWYgKCF0aGlzLmlzQWxvbmUpIHtcbiAgICAgIHRoaXMuaGFuZGxlS2V5UHJlc3MoZXYpLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyBlbXB0eVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGVDaGFuZ2UoZXZlbnQ6IGFueSkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnc3RhdGVDaGFuZ2UnXSwgZXZlbnQpO1xuICAgIHN3aXRjaCAoZXZlbnQuaWQpIHtcbiAgICAgIGNhc2UgJ3RpbWVTd2l0Y2gnIDpcbiAgICAgICAgaWYgKGV2ZW50LnN0YXRlKSB7XG4gICAgICAgICAgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9ICd0aW1lc3RhbXAnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX29wdGlvbnMudGltZU1vZGUgPSAnZGF0ZSc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQodHJ1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndHlwZVN3aXRjaCcgOlxuICAgICAgICBpZiAoZXZlbnQuc3RhdGUpIHtcbiAgICAgICAgICB0aGlzLl90eXBlID0gJ3N0ZXAnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3R5cGUgPSAnbGluZSc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQodHJ1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2hhcnRTd2l0Y2gnIDpcbiAgICAgICAgdGhpcy5zaG93Q2hhcnQgPSBldmVudC5zdGF0ZTtcbiAgICAgICAgdGhpcy5kcmF3Q2hhcnQoZmFsc2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21hcFN3aXRjaCcgOlxuICAgICAgICB0aGlzLnNob3dNYXAgPSBldmVudC5zdGF0ZTtcbiAgICAgICAgaWYgKHRoaXMuc2hvd01hcCkge1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLm1hcC5yZXNpemUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMud2FycFZpZXdOZXdPcHRpb25zLmVtaXQodGhpcy5fb3B0aW9ucyk7XG4gIH1cblxuICBib3VuZHNEaWRDaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3VwZGF0ZUJvdW5kcyddLCBldmVudCk7XG4gICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMgPSB0aGlzLl9vcHRpb25zLmJvdW5kcyB8fCB7fTtcbiAgICBpZiAodGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSAhPT0gZXZlbnQuYm91bmRzLm1pbiAmJiB0aGlzLl9vcHRpb25zLmJvdW5kcy5tYXhEYXRlICE9PSBldmVudC5ib3VuZHMubWF4KSB7XG4gICAgICB0aGlzLl9vcHRpb25zLmJvdW5kcyA9IHRoaXMuX29wdGlvbnMuYm91bmRzIHx8IHt9O1xuICAgICAgdGhpcy5fb3B0aW9ucy5ib3VuZHMubWluRGF0ZSA9IGV2ZW50LmJvdW5kcy5taW47XG4gICAgICB0aGlzLl9vcHRpb25zLmJvdW5kcy5tYXhEYXRlID0gZXZlbnQuYm91bmRzLm1heDtcbiAgICAgIHRoaXMud2FycFZpZXdOZXdPcHRpb25zLmVtaXQodGhpcy5fb3B0aW9ucyk7XG4gICAgICBpZiAoZXZlbnQuc291cmNlID09PSAnY2hhcnQnKSB7XG4gICAgICAgIHRoaXMuYW5ub3RhdGlvbi51cGRhdGVCb3VuZHMoZXZlbnQuYm91bmRzLm1pbiwgZXZlbnQuYm91bmRzLm1heCwgZXZlbnQuYm91bmRzLm1hcmdpbkxlZnQpO1xuICAgICAgfSBlbHNlIGlmIChldmVudC5zb3VyY2UgPT09ICdhbm5vdGF0aW9uJykge1xuICAgICAgICB0aGlzLmNoYXJ0LnVwZGF0ZUJvdW5kcyhldmVudC5ib3VuZHMubWluLCBldmVudC5ib3VuZHMubWF4KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsndXBkYXRlQm91bmRzJ10sXG4gICAgICAgIEdUU0xpYi50b0lTT1N0cmluZyhldmVudC5ib3VuZHMubWluLCAxLCB0aGlzLl9vcHRpb25zLnRpbWVab25lKSxcbiAgICAgICAgR1RTTGliLnRvSVNPU3RyaW5nKGV2ZW50LmJvdW5kcy5tYXgsIDEsIHRoaXMuX29wdGlvbnMudGltZVpvbmUpKTtcbiAgICAgIHRoaXMubGluZS5uYXRpdmVFbGVtZW50LnN0eWxlLmxlZnQgPSAnLTEwMHB4JztcbiAgICB9XG4gIH1cblxuICBvbldhcnBWaWV3TW9kYWxDbG9zZSgpIHtcbiAgICB0aGlzLm1haW5QbG90RGl2Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIHdhcnBWaWV3U2VsZWN0ZWRHVFMoZXZlbnQpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3dhcnBWaWV3U2VsZWN0ZWRHVFMnXSwgZXZlbnQpO1xuICAgIGlmICghdGhpcy5fdG9IaWRlLmZpbmQoaSA9PiB7XG4gICAgICByZXR1cm4gaSA9PT0gZXZlbnQuZ3RzLmlkO1xuICAgIH0pICYmICFldmVudC5zZWxlY3RlZCkgeyAvLyBpZiBub3QgaW4gdG9IaWRlIGFuZCBzdGF0ZSBmYWxzZSwgcHV0IGlkIGluIHRvSGlkZVxuICAgICAgdGhpcy5fdG9IaWRlLnB1c2goZXZlbnQuZ3RzLmlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGV2ZW50LnNlbGVjdGVkKSB7IC8vIGlmIGluIHRvSGlkZSBhbmQgc3RhdGUgdHJ1ZSwgcmVtb3ZlIGl0IGZyb20gdG9IaWRlXG4gICAgICAgIHRoaXMuX3RvSGlkZSA9IHRoaXMuX3RvSGlkZS5maWx0ZXIoaSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGkgIT09IGV2ZW50Lmd0cy5pZDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuTE9HLmRlYnVnKFsnd2FycFZpZXdTZWxlY3RlZEdUUycsICd0aGlzLl90b0hpZGUnXSwgdGhpcy5fdG9IaWRlKTtcbiAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgdGhpcy5fdG9IaWRlID0gWy4uLnRoaXMuX3RvSGlkZV07XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVNb3VzZU1vdmUoZXZ0OiBNb3VzZUV2ZW50KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKHRoaXMuc2hvd0xpbmUgJiYgdGhpcy5saW5lKSB7XG4gICAgICB0aGlzLmxpbmUubmF0aXZlRWxlbWVudC5zdHlsZS5sZWZ0ID0gTWF0aC5tYXgoZXZ0LnBhZ2VYIC0gdGhpcy5sZWZ0LCA1MCkgKyAncHgnO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1vdXNlRW50ZXIoZXZ0OiBNb3VzZUV2ZW50KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5sZWZ0ID0gdGhpcy5sZWZ0IHx8IHRoaXMubWFpbi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XG4gICAgdGhpcy5zaG93TGluZSA9IHRydWU7XG4gICAgaWYgKHRoaXMubGluZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmxpbmUubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVNb3VzZU91dChldnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAvLyBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodGhpcy5saW5lKSB7XG4gICAgICB0aGlzLnNob3dMaW5lID0gZmFsc2U7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMubGluZS5uYXRpdmVFbGVtZW50LCAnbGVmdCcsICctMTAwcHgnKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5saW5lLm5hdGl2ZUVsZW1lbnQsICdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUob3B0aW9ucywgcmVmcmVzaCk6IHZvaWQge1xuICAgIHRoaXMuZHJhd0NoYXJ0KHJlZnJlc2gpO1xuICB9XG5cbiAgaW5wdXRUZXh0S2V5Ym9hcmRFdmVudHMoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICB0aGlzLmFwcGx5RmlsdGVyKCk7XG4gICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIHRoaXMucHVzaEtiZEV2ZW50KCdFc2NhcGUnKTtcbiAgICAgIHRoaXMubW9kYWwuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICB0elNlbGVjdGVkKGV2ZW50KSB7XG4gICAgY29uc3QgdGltZVpvbmUgPSB0aGlzLnR6U2VsZWN0b3IubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ3RpbWV6b25lJywgJ3R6c2VsZWN0J10sIHRpbWVab25lLCBldmVudCk7XG4gICAgZGVsZXRlIHRoaXMuX29wdGlvbnMuYm91bmRzO1xuICAgIHRoaXMuX29wdGlvbnMudGltZVpvbmUgPSB0aW1lWm9uZTtcbiAgICB0aGlzLnR6U2VsZWN0b3IubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGltZVpvbmUgPT09ICdVVEMnID8gJ2RlZmF1bHR0eicgOiAnY3VzdG9tdHonKTtcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cbiAgcHVibGljIGdldFRpbWVDbGlwKCk6IFByb21pc2U8Q2hhcnRCb3VuZHM+IHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2dldFRpbWVDbGlwJ10sIHRoaXMuY2hhcnQuZ2V0VGltZUNsaXAoKSk7XG4gICAgcmV0dXJuIHRoaXMuY2hhcnQuZ2V0VGltZUNsaXAoKTtcbiAgfVxuXG4gIHJlc2l6ZUNoYXJ0KGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbENoYXJ0SGVpZ2h0ICE9PSBldmVudCkge1xuICAgICAgdGhpcy5MT0cuZGVidWcoWydyZXNpemVDaGFydCddLCBldmVudCk7XG4gICAgICB0aGlzLmluaXRpYWxDaGFydEhlaWdodCA9IGV2ZW50O1xuICAgICAgdGhpcy5zaXplU2VydmljZS5jaGFuZ2UobmV3IFNpemUodGhpcy53aWR0aCwgZXZlbnQpKTtcbiAgICB9XG4gIH1cblxuICBkcmF3Q2hhcnQoZmlyc3REcmF3OiBib29sZWFuID0gZmFsc2UpIHtcbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ2RyYXdDaGFydHMnXSwgdGhpcy5fZGF0YSwgdGhpcy5fb3B0aW9ucyk7XG4gICAgaWYgKCF0aGlzLl9kYXRhIHx8ICF0aGlzLl9kYXRhLmRhdGEgfHwgdGhpcy5fZGF0YS5kYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy50aW1lQ2xpcCkge1xuICAgICAgdGhpcy50aW1lQ2xpcC5jbG9zZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tb2RhbCkge1xuICAgICAgdGhpcy5tb2RhbC5jbG9zZSgpO1xuICAgIH1cbiAgICB0aGlzLkxPRy5kZWJ1ZyhbJ1BQdHMnXSwgJ2ZpcnN0ZHJhdyAnLCBmaXJzdERyYXcpO1xuICAgIGlmIChmaXJzdERyYXcpIHsgLy8gb24gdGhlIGZpcnN0IGRyYXcsIHdlIGNhbiBzZXQgc29tZSBkZWZhdWx0IG9wdGlvbnMuXG4gICAgICAvLyBhdXRvbWF0aWNhbGx5IHN3aXRjaCB0byB0aW1lc3RhbXAgbW9kZVxuICAgICAgLy8gd2hlbiB0aGUgZmlyc3QgdGljayBhbmQgbGFzdCB0aWNrIG9mIGFsbCB0aGUgc2VyaWVzIGFyZSBpbiB0aGUgaW50ZXJ2YWwgWy0xMDBtcyAxMDBtc11cbiAgICAgIGNvbnN0IHRzTGltaXQgPSAxMDAgKiBHVFNMaWIuZ2V0RGl2aWRlcih0aGlzLl9vcHRpb25zLnRpbWVVbml0KTtcbiAgICAgIGNvbnN0IGRhdGFMaXN0ID0gdGhpcy5fZGF0YS5kYXRhO1xuICAgICAgaWYgKGRhdGFMaXN0KSB7XG4gICAgICAgIGxldCBndHNMaXN0ID0gR1RTTGliLmZsYXR0ZW5HdHNJZEFycmF5KGRhdGFMaXN0IGFzIGFueSwgMCkucmVzO1xuICAgICAgICBndHNMaXN0ID0gR1RTTGliLmZsYXREZWVwKGd0c0xpc3QpO1xuICAgICAgICBsZXQgdGltZXN0YW1wTW9kZSA9IHRydWU7XG4gICAgICAgIGxldCB0b3RhbERhdGFwb2ludHMgPSAwO1xuICAgICAgICBndHNMaXN0LmZvckVhY2goZyA9PiB7XG4gICAgICAgICAgdGhpcy5ndHNJZExpc3QucHVzaChnLmlkKTsgLy8gdXNlZnVsbCBmb3IgZ3RzIGJyb3dzZSBzaG9ydGN1dFxuICAgICAgICAgIGlmIChnLnYubGVuZ3RoID4gMCkgeyAvLyBpZiBndHMgbm90IGVtcHR5XG4gICAgICAgICAgICB0aW1lc3RhbXBNb2RlID0gdGltZXN0YW1wTW9kZSAmJiAoZy52WzBdWzBdID4gLXRzTGltaXQgJiYgZy52WzBdWzBdIDwgdHNMaW1pdCk7XG4gICAgICAgICAgICB0aW1lc3RhbXBNb2RlID0gdGltZXN0YW1wTW9kZSAmJiAoZy52W2cudi5sZW5ndGggLSAxXVswXSA+IC10c0xpbWl0ICYmIGcudltnLnYubGVuZ3RoIC0gMV1bMF0gPCB0c0xpbWl0KTtcbiAgICAgICAgICAgIHRvdGFsRGF0YXBvaW50cyArPSBnLnYubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aW1lc3RhbXBNb2RlKSB7XG4gICAgICAgICAgdGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9ICd0aW1lc3RhbXAnO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuTE9HLmRlYnVnKFsnZHJhd0NoYXJ0cycsICdwYXJzZWQnLCAndGltZXN0YW1wTW9kZSddLCB0aW1lc3RhbXBNb2RlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5ndHNMaXN0ID0gdGhpcy5fZGF0YTtcbiAgICB0aGlzLl9vcHRpb25zID0gey4uLnRoaXMuX29wdGlvbnN9O1xuXG4gICAgdGhpcy5MT0cuZGVidWcoWydkcmF3Q2hhcnRzJywgJ3BhcnNlZCddLCB0aGlzLl9kYXRhLCB0aGlzLl9vcHRpb25zKTtcbiAgICB0aGlzLnJlc2l6ZUFyZWEoKTtcbiAgfVxuXG4gIGZvY3VzKGV2ZW50OiBhbnkpIHtcbiAgICAvLyByZWFkIHRoZSBmaXJzdCA0IGxldHRlcnMgb2YgaWQgb2YgYWxsIGVsZW1lbnRzIGluIHRoZSBjbGljayB0cmVlXG4gICAgY29uc3QgaWRMaXN0Q2xpY2tlZCA9IGV2ZW50LnBhdGgubWFwKGVsID0+IChlbC5pZCB8fCAnJykuc2xpY2UoMCwgNCkpO1xuICAgIC8vIGlmIG5vdCBhbG9uZSBvbiB0aGUgcGFnZSwgYW5kIGNsaWNrIGlzIG5vdCBvbiB0aGUgdGltZXpvbmUgc2VsZWN0b3IgYW5kIG5vdCBvbiB0aGUgbWFwLCBmb3JjZSBmb2N1cy5cbiAgICBpZiAoIXRoaXMuaXNBbG9uZSAmJiBpZExpc3RDbGlja2VkLmluZGV4T2YoJ3R6U2UnKSA8IDAgJiYgaWRMaXN0Q2xpY2tlZC5pbmRleE9mKCdtYXAtJykgPCAwKSB7XG4gICAgICB0aGlzLm1haW5QbG90RGl2Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9IC8vIHByZXZlbnQgc3RlYWxpbmcgZm9jdXMgb2YgdGhlIHRpbWV6b25lIHNlbGVjdG9yLlxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBoYW5kbGVLZXlQcmVzcyhldjogS2V5Ym9hcmRFdmVudCkge1xuICAgIHRoaXMuTE9HLmRlYnVnKFsnaGFuZGxlS2V5UHJlc3MnXSwgZXYpO1xuICAgIGlmICh0aGlzLnByZXZlbnREZWZhdWx0S2V5TGlzdC5pbmRleE9mKGV2LmtleSkgPj0gMCkge1xuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgaWYgKGF3YWl0IHRoaXMudGltZUNsaXAuaXNPcGVuZWQoKSB8fCBhd2FpdCB0aGlzLm1vZGFsLmlzT3BlbmVkKCkgfHwgYXdhaXQgdGhpcy5ndHNQb3B1cE1vZGFsLmlzT3BlbmVkKCkpIHtcbiAgICAgIGlmICh0aGlzLnByZXZlbnREZWZhdWx0S2V5TGlzdEluTW9kYWxzLmluZGV4T2YoZXYua2V5KSA+PSAwKSB7XG4gICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChldi5rZXkgPT09ICcvJykge1xuICAgICAgdGhpcy5tb2RhbC5vcGVuKCk7XG4gICAgICB0aGlzLmZpbHRlcklucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMuZmlsdGVySW5wdXQubmF0aXZlRWxlbWVudC5zZWxlY3QoKTtcbiAgICB9IGVsc2UgaWYgKGV2LmtleSA9PT0gJ3QnKSB7XG4gICAgICB0aGlzLmNoYXJ0LmdldFRpbWVDbGlwKCkudGhlbih0YyA9PiB7XG4gICAgICAgIHRoaXMudGltZUNsaXBWYWx1ZSA9IGA8cD5rZWVwIGRhdGEgYmV0d2VlblxuICAgICAgICAgICR7dGhpcy5fb3B0aW9ucy50aW1lTW9kZSA9PT0gJ3RpbWVzdGFtcCcgPyB0Yy50c21pbiA6IG1vbWVudC50eih0Yy50c21pbiwgdGhpcy5fb3B0aW9ucy50aW1lWm9uZSkudG9Mb2NhbGVTdHJpbmcoKX0gYW5kXG4gICAgICAgICAgJHt0aGlzLl9vcHRpb25zLnRpbWVNb2RlID09PSAndGltZXN0YW1wJyA/IHRjLnRzbWF4IDogbW9tZW50LnR6KHRjLnRzbWF4LCB0aGlzLl9vcHRpb25zLnRpbWVab25lKS50b0xvY2FsZVN0cmluZygpfVxuICAgICAgICAgICR7dGhpcy5fb3B0aW9ucy50aW1lVW5pdCAhPT0gJ3VzJyA/ICcgKGZvciBhICcgKyB0aGlzLl9vcHRpb25zLnRpbWVVbml0ICsgJyBwbGF0Zm9ybSknIDogJyd9PC9wPlxuICAgICAgICAgIDxwcmU+PGNvZGU+JHtNYXRoLnJvdW5kKHRjLnRzbWF4KX0gJHtNYXRoLnJvdW5kKHRjLnRzbWF4IC0gdGMudHNtaW4pfSBUSU1FQ0xJUDwvY29kZT48L3ByZT5gO1xuICAgICAgICB0aGlzLnRpbWVDbGlwLm9wZW4oKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZXYua2V5ID09PSAnYicgfHwgZXYua2V5ID09PSAnQicpIHsgLy8gYnJvd3NlIGFtb25nIGFsbCBndHNcbiAgICAgIGlmICh0aGlzLmd0c0Jyb3dzZXJJbmRleCA8IDApIHtcbiAgICAgICAgdGhpcy5ndHNCcm93c2VySW5kZXggPSAwO1xuICAgICAgfVxuICAgICAgaWYgKGV2LmtleSA9PT0gJ2InKSB7IC8vIGluY3JlbWVudCBpbmRleFxuICAgICAgICB0aGlzLmd0c0Jyb3dzZXJJbmRleCsrO1xuICAgICAgICBpZiAodGhpcy5ndHNCcm93c2VySW5kZXggPT09IHRoaXMuZ3RzSWRMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuZ3RzQnJvd3NlckluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHsgLy8gZGVjcmVtZW50IGluZGV4XG4gICAgICAgIHRoaXMuZ3RzQnJvd3NlckluZGV4LS07XG4gICAgICAgIGlmICh0aGlzLmd0c0Jyb3dzZXJJbmRleCA8IDApIHtcbiAgICAgICAgICB0aGlzLmd0c0Jyb3dzZXJJbmRleCA9IHRoaXMuZ3RzSWRMaXN0Lmxlbmd0aCAtIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuX3RvSGlkZSA9IHRoaXMuZ3RzSWRMaXN0LmZpbHRlcih2ID0+IHYgIT09IHRoaXMuZ3RzSWRMaXN0W3RoaXMuZ3RzQnJvd3NlckluZGV4XSk7IC8vIGhpZGUgYWxsIGJ1dCBvbmVcbiAgICB9IGVsc2UgaWYgKGV2LmtleSA9PT0gJ24nKSB7XG4gICAgICB0aGlzLl90b0hpZGUgPSBbLi4udGhpcy5ndHNJZExpc3RdO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZXYua2V5ID09PSAnYScpIHtcbiAgICAgIHRoaXMuX3RvSGlkZSA9IFtdO1xuICAgIH0gZWxzZSBpZiAoZXYua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgdGhpcy50aW1lQ2xpcC5pc09wZW5lZCgpLnRoZW4ociA9PiB7XG4gICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgdGhpcy50aW1lQ2xpcC5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMubW9kYWwuaXNPcGVuZWQoKS50aGVuKHIgPT4ge1xuICAgICAgICBpZiAocikge1xuICAgICAgICAgIHRoaXMubW9kYWwuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLmd0c1BvcHVwTW9kYWwuaXNPcGVuZWQoKS50aGVuKHIgPT4ge1xuICAgICAgICBpZiAocikge1xuICAgICAgICAgIHRoaXMuZ3RzUG9wdXBNb2RhbC5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wdXNoS2JkRXZlbnQoZXYua2V5KTtcbiAgICB9XG4gICAgdGhpcy5MT0cuZGVidWcoWydoYW5kbGVLZXlQcmVzcycsICd0aGlzLmd0c0lkTGlzdCddLCB0aGlzLl90b0hpZGUsIHRoaXMuZ3RzQnJvd3NlckluZGV4KTtcbiAgfVxuXG4gIGFwcGx5RmlsdGVyKCkge1xuICAgIHRoaXMuZ3RzRmlsdGVyQ291bnQrKztcbiAgICB0aGlzLl9ndHNGaWx0ZXIgPSB0aGlzLmd0c0ZpbHRlckNvdW50LnRvU3RyaW5nKCkuc2xpY2UoMCwgMSkgKyB0aGlzLmZpbHRlcklucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gICAgdGhpcy5tb2RhbC5jbG9zZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBwdXNoS2JkRXZlbnQoa2V5OiBzdHJpbmcpIHtcbiAgICB0aGlzLmtiZENvdW50ZXIrKztcbiAgICB0aGlzLmtiZExhc3RLZXlQcmVzc2VkID0gW2tleSwgdGhpcy5rYmRDb3VudGVyLnRvU3RyaW5nKCldO1xuICB9XG5cbiAgZ2V0VFooKSB7XG4gICAgcmV0dXJuIG1vbWVudC50ei5uYW1lcygpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnZlcnQoZGF0YTogRGF0YU1vZGVsKTogYW55W10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIG9uQ2hhcnREcmF3KCRldmVudDogYW55LCBjb21wb25lbnQpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLmNoYXJ0Qm91bmRzXG4gICAgICAmJiAkZXZlbnRcbiAgICAgICYmIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gIT09IE1hdGgubWluKHRoaXMuY2hhcnRCb3VuZHMudHNtaW4sICRldmVudC50c21pbilcbiAgICAgICYmIHRoaXMuY2hhcnRCb3VuZHMudHNtYXggIT09IE1hdGgubWF4KHRoaXMuY2hhcnRCb3VuZHMudHNtYXgsICRldmVudC50c21heClcbiAgICApIHtcbiAgICAgIHRoaXMuY2hhcnRCb3VuZHMudHNtaW4gPSBNYXRoLm1pbih0aGlzLmNoYXJ0Qm91bmRzLnRzbWluLCAkZXZlbnQudHNtaW4pO1xuICAgICAgdGhpcy5jaGFydEJvdW5kcy50c21heCA9IE1hdGgubWF4KHRoaXMuY2hhcnRCb3VuZHMudHNtYXgsICRldmVudC50c21heCk7XG4gICAgICB0aGlzLmFubm90YXRpb24uc2V0UmVhbEJvdW5kcyh0aGlzLmNoYXJ0Qm91bmRzKTtcbiAgICAgIHRoaXMuY2hhcnQuc2V0UmVhbEJvdW5kcyh0aGlzLmNoYXJ0Qm91bmRzKTtcbiAgICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoKTtcbiAgICAgIHRoaXMuTE9HLmRlYnVnKFsnb25DaGFydERyYXcnLCAndGhpcy5jaGFydEJvdW5kcyddLCBjb21wb25lbnQsIHRoaXMuY2hhcnRCb3VuZHMsICRldmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2hhcnREcmF3LmVtaXQoJGV2ZW50KTtcbiAgICB9XG4gICAgdGhpcy5yZXNpemVBcmVhKCk7XG4gIH1cblxuICBwcml2YXRlIHJlc2l6ZUFyZWEoKSB7XG4gICAgaWYgKHRoaXMuc2hvd0NoYXJ0ICYmICEhdGhpcy5jaGFydCkge1xuICAgICAgbGV0IGggPSB0aGlzLmNoYXJ0LmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgaWYgKGggPiAwKSB7XG4gICAgICAgIGlmICghIXRoaXMuR1RTVHJlZSkge1xuICAgICAgICAgIGggLT0gdGhpcy5HVFNUcmVlLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGlmICghIXRoaXMuY29udHJvbHMpIHtcbiAgICAgICAgICBoIC09IHRoaXMuY29udHJvbHMubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0aWFsQ2hhcnRIZWlnaHQgPSBoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlc2l6ZUFyZWEoKSwgMTAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==