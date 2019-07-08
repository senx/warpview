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
import moment from "moment-timezone";
import {ChartBounds} from '../../model/chartBounds';

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
  @Prop({mutable: true}) gtsFilter = 'x';
  @Prop() debug = false;
  @Prop() isAlone: boolean = false;
  @Prop() initialChartHeight: string = "400";
  @Prop() initialMapHeight: string = "500";


  @State() private _options: Param = {
    showControls: true,
    showGTSTree: true,
    showDots: true,
    timeZone: 'UTC',
    timeUnit: 'us'
  };
  @State() private _data: DataModel = new DataModel();
  @State() private _toHide: number[] = [];
  @State() private _timeMin;
  @State() private _timeMax;
  @State() showChart = true;
  @State() showMap = false;
  @State() chartType = 'line';
  @State() timeClipValue: string = '';
  @State() kbdLastKeyPressed: string[] = [];

  private mainPlotDiv: HTMLElement;
  private LOG: Logger;
  private line: HTMLDivElement;
  private main: HTMLDivElement;
  private chart: HTMLWarpViewChartElement;
  private annotation: HTMLWarpViewAnnotationElement;
  private modal: HTMLWarpViewModalElement;
  private map: HTMLWarpViewMapElement;
  private timeClip: HTMLWarpViewModalElement;
  private filterInput: HTMLInputElement;
  private timeClipElement: HTMLElement;
  private mouseOutTimer: number;
  private tzSelector: HTMLSelectElement;
  private kbdCounter: number = 0;
  private gtsPopupModal: HTMLWarpViewGtsPopupElement;
  private gtsFilterCount: number = 0;
  private gtsIdList: number[] = [];
  private gtsBrowserIndex: number = -1;
  @State() warningMessage: string = '';


  //key event are trapped in plot component.
  //if one of this key is pressed, default action is prevented.
  private preventDefaultKeyList: string[] = ['Escape', '/'];
  private preventDefaultKeyListInModals: string[] = ['Escape', 'ArrowUp', 'ArrowDown', ' ', '/'];

  @Method()
  async getTimeClip(): Promise<ChartBounds> {
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
  private onData(newValue: DataModel | GTS[]) {
    this.LOG.debug(['data'], newValue);
    this.drawCharts(true);
  }

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if (!deepEqual(newValue, oldValue)) {
      this.LOG.debug(['options'], newValue);
      this.drawCharts();
    }
  }

//two ways to capture keyboard events : 
// - local level, click to get focus. 
// - document level (only if isalone property is true)
  @Listen('keydown')
  handleLocalKeydown(ev: KeyboardEvent) {
    if (!this.isAlone) {
      this.handleKeyDown(ev).then(() => {
        // empty
      });
    }
  }

  @Listen('document:keydown')
  handleDocKeydown(ev: KeyboardEvent) {
    if (this.isAlone) {
      this.handleKeyDown(ev).then(() => {
        // empty
      });
    }
  }

  private async handleKeyDown(ev: KeyboardEvent) {
    this.LOG.debug(['document:keydown'], ev);
    if (this.preventDefaultKeyList.indexOf(ev.key) >= 0) {
      ev.preventDefault();
    }
    if (await this.timeClip.isOpened() || await this.modal.isOpened() || await this.gtsPopupModal.isOpened()) {
      if (this.preventDefaultKeyListInModals.indexOf(ev.key) >= 0) {
        ev.preventDefault();
      }
    }
    if (ev.key === '/') {
      this.modal.open();
      this.filterInput.focus();
      this.filterInput.select();
    } else if (ev.key === 't') {
      this.chart.getTimeClip().then(tc => {
        this.timeClipValue = `// keep data between ${moment.tz(tc.msmin, this._options.timeZone).toLocaleString()} and ` +
          `${moment.tz(tc.msmax, this._options.timeZone).toLocaleString()}<br/>` +
          `${this._options.timeUnit !== 'us' ? '// (for a ' + this._options.timeUnit + ' platform)<br/>' : ''}` +
          `${Math.round(tc.tsmax)} ${Math.round(tc.tsmax - tc.tsmin)} TIMECLIP`;
        this.LOG.debug(['handleKeyUp', 't'], this.timeClipValue);
        this.timeClip.open();
      });
    } else if (ev.key === 'b' || ev.key === 'B') { //browse among all gts
      if (this.gtsBrowserIndex < 0) {
        this.gtsBrowserIndex = 0;
      }
      if (ev.key === 'b') { //increment index
        this.gtsBrowserIndex++;
        if (this.gtsBrowserIndex === this.gtsIdList.length) {
          this.gtsBrowserIndex = 0;
        }
      } else { //decrement index
        this.gtsBrowserIndex--;
        if (this.gtsBrowserIndex < 0) {
          this.gtsBrowserIndex = this.gtsIdList.length - 1;
        }
      }
      this._toHide = this.gtsIdList.filter(v => v !== this.gtsIdList[this.gtsBrowserIndex]); // hide all but one
    } else {
      this.pushKbdEvent(ev.key);
    }

  }

  private pushKbdEvent(key: string) {
    this.kbdCounter++;
    this.kbdLastKeyPressed = [key, this.kbdCounter.toString()];
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
        let totalDatapoints = 0;
        gtsList.forEach(g => {
          this.gtsIdList.push(g.id); //usefull for gts browse shortcut
          if (g.v.length > 0) { //if gts not empty
            timestampMode = timestampMode && (g.v[0][0] > -tsLimit && g.v[0][0] < tsLimit);
            timestampMode = timestampMode && (g.v[g.v.length - 1][0] > -tsLimit && g.v[g.v.length - 1][0] < tsLimit);
            totalDatapoints += g.v.length;
          }
        });
        if (timestampMode) {
          options.timeMode = 'timestamp';
        }
        //do not display the chart if there is obviously lots of data
        if (gtsList.length > 1000 || totalDatapoints > 1000000) {
          this.LOG.warn(['firstdraw'], 'Lots of GTS or datapoint, hiding the graph...');
          this.showChart = false;
          this.warningMessage = `Warning : ${gtsList.length} series, ${totalDatapoints} points. Chart may be slow.`;
        }
      }
    }

    this._options = {...options};
    this.LOG.debug(['drawCharts', 'parsed'], this._data, this._options);
  }

  private applyFilter() {
    this.gtsFilterCount++;
    this.gtsFilter = this.gtsFilterCount.toString().slice(0, 1) + this.filterInput.value;
    this.modal.close();
  }

  componentWillLoad() {
    this.LOG = new Logger(WarpViewPlot, this.debug);
  }

  componentDidLoad() {
    this.drawCharts(true);
  }

  @Listen('warpViewModalClose')
  onWarpViewModalClose() {
    this.mainPlotDiv.focus();
  }

  inputTextKeyboardEvents(e: KeyboardEvent) {
    e.stopImmediatePropagation();
    if (e.key === 'Enter') {
      this.applyFilter();
    } else if (e.key === 'Escape') {
      this.pushKbdEvent('Escape');
    }
  }

  tzSelected() {
    let timeZone = this.tzSelector.value;
    this.LOG.debug(["timezone", "tzselect"], timeZone);
    this._options.timeZone = timeZone;
    this.tzSelector.setAttribute('class', timeZone === 'UTC' ? 'defaulttz' : 'customtz');
    this.drawCharts();
  }

  updateZoom(evt: CustomEvent) {
    this._options.bounds = evt.detail;
  }

  render() {
    return <div id="focusablePlotDiv" tabindex="0" onClick={(e: any) => {
      //read the first 4 letters of id of all elements in the click tree
      let idListClicked = e.path.map(el => (el.id || '').slice(0, 4));
      //if not alone on the page, and click is not on the timezone selector and not on the map, force focus.
      if (!this.isAlone && idListClicked.indexOf('tzSe') < 0 && idListClicked.indexOf('map-') < 0) {
        this.mainPlotDiv.focus();
      } //prevent stealing focus of the timezone selector.
    }
    } ref={(el) => this.mainPlotDiv = el}>

      <warp-view-modal kbdLastKeyPressed={this.kbdLastKeyPressed} modalTitle="TimeClip"
                       ref={(el: HTMLWarpViewModalElement) => this.timeClip = el}>
        <pre><code ref={(el) => this.timeClipElement = el}
                   innerHTML={this.timeClipValue}/></pre>
      </warp-view-modal>
      <warp-view-modal kbdLastKeyPressed={this.kbdLastKeyPressed} modalTitle="GTS Filter"
                       ref={(el: HTMLWarpViewModalElement) => this.modal = el}>
        <label>Enter a regular expression to filter GTS.</label>
        <input tabindex="1" type="text" onKeyPress={(e) => this.inputTextKeyboardEvents(e)}
               onKeyDown={(e) => this.inputTextKeyboardEvents(e)} onKeyUp={(e) => this.inputTextKeyboardEvents(e)}
               ref={el => this.filterInput = el} value={this.gtsFilter.slice(1)}/>
        <button tabindex="2" type="button" class={this._options.popupButtonValidateClass}
                onClick={() => this.applyFilter()} innerHTML={this._options.popupButtonValidateLabel || 'Apply'}>
        </button>
      </warp-view-modal>
      {this._options.showControls ?
        <div class="inline">
          <warp-view-toggle id="timeSwitch" text-1="Date" text-2="Timestamp"
                            checked={this._options.timeMode == "timestamp"}/>
          <warp-view-toggle id="typeSwitch" text-1="Line" text-2="Step"/>
          <warp-view-toggle id="chartSwitch" text-1="Hide chart" text-2="Display chart"
                            checked={this.showChart}/>
          <warp-view-toggle id="mapSwitch" text-1="Hide map" text-2="Display map"
                            checked={this.showMap}/>
          <div class="tzcontainer">
            <select id="tzSelector" class="defaulttz" ref={(el) => this.tzSelector = el}
                    onChange={() => this.tzSelected()}>
              {moment.tz.names().map((z) => <option value={z} selected={z === 'UTC'}
                                                    class={z === 'UTC' ? 'defaulttz' : 'customtz'}>{z}</option>)}
            </select>
          </div>
        </div>
        : ''}
      {this.warningMessage !== '' ? <div class="warningMessage">{this.warningMessage}</div> : ''}
      {this._options.showGTSTree
        ? <warp-view-gts-tree data={this._data} id="tree" gtsFilter={this.gtsFilter}
                              debug={this.debug}
                              hiddenData={this._toHide} options={this._options}
                              kbdLastKeyPressed={this.kbdLastKeyPressed}/>
        : ''}
      {this.showChart ?
        <div class="main-container" onMouseMove={evt => this.handleMouseMove(evt)}
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
          <warp-view-resize minHeight="100" initialHeight={this.initialChartHeight}>
            <warp-view-gts-popup maxToShow={5} hiddenData={this._toHide} gtsList={this._data}
                                 kbdLastKeyPressed={this.kbdLastKeyPressed}
                                 ref={(el: HTMLWarpViewGtsPopupElement) => this.gtsPopupModal = el}/>
            <warp-view-chart id="chart" responsive={this.responsive} standalone={false} data={this._data}
                             ref={(el: HTMLWarpViewChartElement) => this.chart = el}
                             debug={this.debug}
                             onZoom={evt => this.updateZoom(evt)}
                             hiddenData={this._toHide} type={this.chartType}
                             options={this._options}/>
          </warp-view-resize>
        </div>
        : ''}
      {this.showMap ?
        <warp-view-resize minHeight="100" initialHeight={this.initialMapHeight}>
          <div class="map-container">
            <warp-view-map options={this._options}
                           ref={(el: HTMLWarpViewMapElement) => this.map = el} data={this._data as any}
                           debug={this.debug}
                           responsive={this.responsive} hiddenData={this._toHide}/>
          </div>
        </warp-view-resize>
        : ''}
      <div id="bottomPlaceHolder"/>
    </div>;
  }
}
