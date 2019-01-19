/*
 *  Copyright 2018  SenX S.A.S.
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

import {Component, Listen, Method, Prop, State, Watch} from '@stencil/core'
import {DataModel} from "../../model/dataModel";
import {Param} from "../../model/param";
import {Logger} from "../../utils/logger";
import {GTS} from "../../model/GTS";
import {GTSLib} from "../../utils/gts.lib";
import {ChartLib} from "../../utils/chart-lib";
import deepEqual from "deep-equal";

@Component({
  tag: 'warp-view-plot',
  styleUrl: 'warp-view-plot.scss',
  shadow: true
})
export class WarpViewPlot {

  @Prop() data: string | GTS[] | DataModel;
  @Prop() options: string | Param;
  @Prop({mutable: true}) width = "";
  @Prop({mutable: true}) height = "";
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = false;
  @Prop({mutable: true}) gtsFilter = '';
  @Prop() debug = false;

  @State() private _options: Param = {
    showControls: true,
    showGTSTree: true,
    showDots: true
  };
  @State() private _data: DataModel = new DataModel();
  @State() private _toHide: number[] = [];
  @State() private _timeMin;
  @State() private _timeMax;
  @State() showChart = true;
  @State() showMap = false;
  @State() chartType = 'line';
  @State() timeClipValue: string = '';

  private LOG: Logger;
  private line: HTMLDivElement;
  private main: HTMLDivElement;
  private chartContainer: HTMLDivElement;
  private chart: HTMLWarpViewChartElement;
  private annotation: HTMLWarpViewAnnotationElement;
  private modal: HTMLWarpViewModalElement;
  private map: HTMLWarpViewMapElement;
  private timeClip: HTMLWarpViewModalElement;
  private filterInput: HTMLInputElement;
  private timeClipElement: HTMLElement;
  private mouseOutTimer: number;

  componentDidLoad() {
    this.drawCharts(true);
  }

  @Method()
  async getTimeClip(): Promise<[number, number]> {
    this.LOG.debug(['getTimeClip'], this.chart.getTimeClip());
    return this.chart.getTimeClip();
  }

  @Watch('gtsFilter')
  private onGtsFilter(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.drawCharts();
    }
  }

  @Watch('data')
  private onData(newValue: DataModel | GTS[], oldValue: DataModel | GTS[]) {
    if (!deepEqual(newValue, oldValue)) {
      this.LOG.debug(['data'], newValue);
      this.drawCharts(true);
    }
  }

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if (!deepEqual(newValue, oldValue)) {
      this.LOG.debug(['options'], newValue);
      this.drawCharts();
    }
  }

  @Listen('document:keyup')
  handleKeyUp(ev: KeyboardEvent) {
    this.LOG.debug(['document:keyup'], ev);
    ev.preventDefault();
    if (ev.key === '/') {
      this.modal.open();
      this.filterInput.focus();
      this.filterInput.select();
    }
    if (ev.key === 't') {
      this.chart.getTimeClip().then(tc => {
        this.timeClipValue = `${Math.round(tc[0]).toString()} ISO8601 ${Math.round(tc[1]).toString()} ISO8601 TIMECLIP`;
        this.LOG.debug(['handleKeyUp', 't'], this.timeClipValue);
        this.timeClip.open();
      });
    }
    return false;
  }

  @Listen('stateChange')
  stateChange(event: CustomEvent) {
    this.LOG.debug(['stateChange'], event.detail);
    switch (event.detail.id) {
      case 'timeSwitch' :
        if (event.detail.state) {
          this._options.timeMode = 'timestamp';
        } else {
          this._options.timeMode = 'date';
        }
        this.drawCharts();
        break;
      case 'typeSwitch' :
        if (event.detail.state) {
          this.chartType = 'step';
        } else {
          this.chartType = 'line';
        }
        this.drawCharts();
        break;
      case 'chartSwitch' :
        this.showChart = event.detail.state;
        this.drawCharts();
        break;
      case 'mapSwitch' :
        this.showMap = event.detail.state;
        if (this.showMap) {
          window.setTimeout(() => this.map.resize(), 500);
        }
        break;
    }
  }

  @Listen('boundsDidChange')
  boundsDidChange(event: CustomEvent) {
    this.LOG.debug(['boundsDidChange'], event.detail);
    this._timeMin = event.detail.bounds.min;
    this._timeMax = event.detail.bounds.max;
    this.line.style.left = '-100px';
  }

  @Listen('warpViewChartResize')
  onResize(event: CustomEvent) {
    this.LOG.debug(['warpViewChartResize'], event.detail);
    if (this.chartContainer) {
      this.chartContainer.style.height = event.detail.h + 'px';
    }
  }

  @Listen('warpViewSelectedGTS')
  warpViewSelectedGTS(event: CustomEvent) {
    this.LOG.debug(['warpViewSelectedGTS'], event.detail);
    if (!this._toHide.find(i => {
      return i === event.detail.gts.id;
    }) && !event.detail.selected) { //if not in toHide and state false, put id in toHide
      this._toHide.push(event.detail.gts.id);
    } else {
      if (event.detail.selected) { //if in toHide and state true, remove it from toHide
        this._toHide = this._toHide.filter(i => {
          return i !== event.detail.gts.id;
        });
      }
    }
    this.LOG.debug(['warpViewSelectedGTS'], this._toHide);
    this._toHide = this._toHide.slice();
    this.drawCharts();
  }

  private handleMouseMove(evt: MouseEvent) {
    if (this.mouseOutTimer) {
      window.clearTimeout(this.mouseOutTimer);
      delete this.mouseOutTimer;
    }
    if (!this.mouseOutTimer) {
      this.mouseOutTimer = window.setTimeout(() => {
        this.line.style.display = 'block';
        this.line.style.left = Math.max(evt.clientX - this.main.getBoundingClientRect().left, 100) + 'px';
      }, 1);
    }
  }

  private handleMouseOut(evt: MouseEvent) {
    this.line.style.left = Math.max(evt.clientX - this.main.getBoundingClientRect().left, 100) + 'px';
    if (this.mouseOutTimer) {
      window.clearTimeout(this.mouseOutTimer);
      delete this.mouseOutTimer;
    }
    if (!this.mouseOutTimer) {
      this.mouseOutTimer = window.setTimeout(() => {
        this.line.style.left = '-100px';
        this.line.style.display = 'none';
      }, 500);
    }
  }

  private drawCharts(firstDraw: boolean = false) {
    this.LOG.debug(['drawCharts'], [this.data, this.options]);
    this.timeClip.close();
    this.modal.close();
    let options: Param = ChartLib.mergeDeep(this._options, this.options);
    this._data = GTSLib.getData(this.data);
    let opts = new Param();
    if (typeof this.options === 'string') {
      opts = JSON.parse(this.options as string) as Param;
    } else {
      opts = this.options as Param;
    }

    options = ChartLib.mergeDeep(options, opts);

    this.LOG.debug(['PPts'], 'firstdraw ', firstDraw);
    if (firstDraw) { //on the first draw, we can set some default options.
      //automatically switch to timestamp mode
      //when the first tick and last tick of all the series are in the interval [-100ms 100ms]
      let tsLimit = 100 * GTSLib.getDivider(this._options.timeUnit);
      let dataList = this._data.data;
      if (dataList) {
        let gtsList = GTSLib.flattenGtsIdArray(dataList as any, 0).res;
        gtsList = GTSLib.flatDeep(gtsList);
        let timestampMode = true;
        gtsList.forEach(g => {
          if (g.v.length > 0) { //if gts not empty
            timestampMode = timestampMode && (g.v[0][0] > -tsLimit && g.v[0][0] < tsLimit);
            timestampMode = timestampMode && (g.v[g.v.length - 1][0] > -tsLimit && g.v[g.v.length - 1][0] < tsLimit)
          }
        });
        if (timestampMode) {
          options.timeMode = 'timestamp';
        }
      }
    }

    this._options = {...options};
    this.LOG.debug(['drawCharts', 'parsed'], this._data, this._options);
  }

  private applyFilter() {
    this.gtsFilter = this.filterInput.value;
    this.modal.close();
  }

  componentWillLoad() {
    this.LOG = new Logger(WarpViewPlot, this.debug);
  }

  inputTextKeyboardEvents(e:KeyboardEvent) {
    e.stopImmediatePropagation();
    if (e.key === 'Enter'){
      this.applyFilter();
    }
  }

  render() {
    return <div>
      <warp-view-modal modalTitle="TimeClip" ref={(el: HTMLWarpViewModalElement) => this.timeClip = el}>
        <pre><code ref={(el) => this.timeClipElement = el}
                   innerHTML={this.timeClipValue}/></pre>
      </warp-view-modal>
      <warp-view-modal modalTitle="GTS Filter" ref={(el: HTMLWarpViewModalElement) => this.modal = el}>
        <label>Enter a regular expression to filter GTS.</label>
        <input type="text" onKeyPress={(e) => this.inputTextKeyboardEvents(e)} onKeyDown={(e) => this.inputTextKeyboardEvents(e)} onKeyUp={(e) => this.inputTextKeyboardEvents(e)} ref={el => this.filterInput = el} value={this.gtsFilter}/>
        <button type="button" class={this._options.popupButtonValidateClass}
                onClick={() => this.applyFilter()} innerHTML={this._options.popupButtonValidateLabel || 'Apply'}>
        </button>
      </warp-view-modal>
      {this._options.showControls
        ? <div class="inline">
          <warp-view-toggle id="timeSwitch" text-1="Date" text-2="Timestamp"
                            checked={this._options.timeMode == "timestamp"}/>
          <warp-view-toggle id="typeSwitch" text-1="Line" text-2="Step"/>
          <warp-view-toggle id="chartSwitch" text-1="Hide chart" text-2="Display chart"
                            checked={this.showChart}/>
          <warp-view-toggle id="mapSwitch" text-1="Hide map" text-2="Display map"
                            checked={this.showMap}/>
        </div>
        : ''}
      {this._options.showGTSTree
        ? <warp-view-gts-tree data={this._data} id="tree" gtsFilter={this.gtsFilter}
                              debug={this.debug}
                              hiddenData={this._toHide} options={this._options}/>
        : ''}
      {this.showChart
        ? <div class="main-container" onMouseMove={evt => this.handleMouseMove(evt)}
               onMouseLeave={evt => this.handleMouseOut(evt)}
               ref={el => this.main = el}
        >
          <div class="bar" ref={el => this.line = el}/>
          <div class="annotation">
            <warp-view-annotation data={this._data} responsive={this.responsive} id="annotation"
                                  showLegend={this.showLegend}
                                  ref={(el: HTMLWarpViewAnnotationElement) => this.annotation = el}
                                  debug={this.debug}
                                  timeMin={this._timeMin} timeMax={this._timeMax} standalone={false}
                                  hiddenData={this._toHide} options={this._options}/>
          </div>
          <div style={{width: '100%', height: '768px'}} ref={el => this.chartContainer = el}>
            <warp-view-gts-popup maxToShow={5} hiddenData={this._toHide} gtsList={this._data}/>
            <warp-view-chart id="chart" responsive={this.responsive} standalone={false} data={this._data}
                             ref={(el: HTMLWarpViewChartElement) => this.chart = el}
                             debug={this.debug}
                             hiddenData={this._toHide} type={this.chartType}
                             options={this._options}/>
          </div>
        </div>
        : ''}
      {this.showMap
        ? <div class="map-container">
          <warp-view-map options={this._options}
                         ref={(el: HTMLWarpViewMapElement) => this.map = el} data={this._data as any}
                         debug={this.debug}
                         responsive={this.responsive} hiddenData={this._toHide}/>
        </div>
        : ''}
    </div>;
  }
}
