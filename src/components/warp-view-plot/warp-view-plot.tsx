/*
 *
 *    Copyright 2016  Cityzen Data
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */

import {Component, Element, Listen, Prop, State, Watch} from '@stencil/core'
import {DataModel} from "../../model/dataModel";
import {Param} from "../../model/param";
import {Logger} from "../../utils/logger";
import {GTS} from "../../model/GTS";
import {GTSLib} from "../../utils/gts.lib";
import {ChartLib} from "../../utils/chart-lib";

@Component({
  tag: 'warp-view-plot',
  styleUrl: 'warp-view-plot.scss',
  shadow: true
})
export class WarpViewPlot {
  @Element() el: HTMLElement;

  @Prop() data: string | GTS[] | DataModel;
  @Prop() options: string | Param;

  @Prop({mutable: true}) width = "";
  @Prop({mutable: true}) height = "";
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = false;

  @State() private _options: Param = new Param();
  @State() private _data: DataModel = new DataModel();
  @State() private _toHide: string[] = [];
  @State() private _timeMin;
  @State() private _timeMax;
  @State() showChart = true;
  @State() showMap = false;

  private LOG: Logger = new Logger(WarpViewPlot);
  private line: HTMLElement;
  private main: HTMLElement;
  private chart: HTMLElement;
  private annotation: HTMLElement;
  private mouseOutTimer: number;

  componentDidLoad() {
    this.line = this.el.shadowRoot.querySelector('div.bar');
    this.main = this.el.shadowRoot.querySelector('div.maincontainer');
    this.chart = this.el.shadowRoot.querySelector('warp-view-chart');
    this.annotation = this.el.shadowRoot.querySelector('warp-view-annotation');
    this.drawCharts();
  }

  @Watch('data')
  private onData(newValue: DataModel | GTS[], oldValue: DataModel | GTS[]) {
    if (oldValue !== newValue) {
      this.LOG.debug(['data'], newValue);
      this.drawCharts();
    }
  }

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if (oldValue !== newValue) {
      this.LOG.debug(['options'], newValue);
      this.drawCharts();
    }
  }

  @Listen('stateChange')
  stateChange(event: CustomEvent) {
    this.LOG.debug(['stateChange'], event.detail);
    switch (event.detail.id) {
      case 'timeSwitch' :
        if (event.detail.state) {
          this._options.timeMode = 'timestamp';
        }
        else {
          this._options.timeMode = 'date';
        }
        this.drawCharts();
        break;
      case 'chartSwitch' :
        this.showChart = event.detail.state;
        break;
      case 'mapSwitch' :
        this.showMap = event.detail.state;
        if (this.showMap) {
          window.setTimeout(() => {
            (this.el.shadowRoot.querySelector('#map') as any).resize();
          }, 500);
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

  private handleMouseMove(evt) {
    if (this.mouseOutTimer) {
      window.clearTimeout(this.mouseOutTimer);
      delete this.mouseOutTimer;
    }
    this.LOG.debug(['handleMouseMove'], [evt, this.mouseOutTimer]);
    if (!this.mouseOutTimer) {
      this.mouseOutTimer = window.setTimeout(() => {
        this.line.style.display = 'block';
        this.line.style.left = evt.offsetX + 'px';
      }, 1);
    }
  }

  private handleMouseOut(evt: MouseEvent) {
    this.LOG.debug(['handleMouseOut'], evt);
    this.line.style.left = evt.offsetX + 'px';
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


  @Listen('warpViewSelectedGTS')
  warpViewSelectedGTS(event: CustomEvent) {
    this.LOG.debug(['warpViewSelectedGTS'], event.detail);
    if (!this._toHide.find(i => {
      return i === event.detail.label;
    }) && !event.detail.selected) {
      this._toHide.push(event.detail.label);
    } else {
      this._toHide = this._toHide.filter(i => {
        return i !== event.detail.label;
      });
    }
    this.LOG.debug(['warp-viewSelectedGTS'], this._toHide);
    this._toHide = this._toHide.slice();
    this.drawCharts();
  }

  private drawCharts() {
    this.LOG.debug(['drawCharts'], [this.data, this.options]);
    this._data = GTSLib.getData(this.data);
    let opts = new Param();
    if (typeof this.options === 'string') {
      opts = JSON.parse(this.options as string) as Param;
    } else {
      opts = this.options as Param;
    }

    this._options = ChartLib.mergeDeep(this._options, opts);
    this.LOG.debug(['drawCharts', 'parsed'], [this._data, this._options]);
  }

  render() {
    return <div>
      <div class="inline">
        <warp-view-toggle id="timeSwitch" text-1="Date" text-2="Timestamp"></warp-view-toggle>
        <warp-view-toggle id="chartSwitch" text-1="Hide chart" text-2="Display chart"
                          checked={this.showChart}></warp-view-toggle>
        <warp-view-toggle id="mapSwitch" text-1="Hide map" text-2="Display map"
                          checked={this.showMap}></warp-view-toggle>
      </div>
      <warp-view-gts-tree data={this._data} id="tree"></warp-view-gts-tree>
      {this.showChart ? <div class="maincontainer" onMouseMove={evt => this.handleMouseMove(evt)}
                             onMouseLeave={evt => this.handleMouseOut(evt)}>
        <div class="bar"></div>
        <warp-view-annotation data={this._data} responsive={this.responsive} id="annotation"
                              show-legend={this.showLegend}
                              timeMin={this._timeMin} timeMax={this._timeMax}
                              hiddenData={this._toHide} options={this._options}></warp-view-annotation>
        <div style={{width: '100%', height: '768px'}}>
          <warp-view-chart id="chart" responsive={this.responsive} standalone={false} data={this._data}
                           hiddenData={this._toHide}
                           options={this._options}></warp-view-chart>
        </div>
      </div> : ''}
      {this.showMap ? <div style={{width: '100%', height: '768px'}}>
        <warp-view-map options={this._options} id="map" data={this._data as any}
                       responsive={this.responsive} hiddenData={this._toHide}
        ></warp-view-map>
      </div> : ''}
    </div>;
  }
}
