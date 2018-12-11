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

import {Component, Element, Listen, Method, Prop, State, Watch} from '@stencil/core';
import {GTSLib} from '../../utils/gts.lib';
import {DataModel} from "../../model/dataModel";
import {Logger} from "../../utils/logger";
import {Param} from "../../model/param";
import {ChartLib} from "../../utils/chart-lib";

@Component({
  tag: 'warp-view-tile',
  styleUrl: 'warp-view-tile.scss',
  shadow: true
})
export class WarpViewTile {

  LOG: Logger = new Logger(WarpViewTile);

  @State() data: any;
  @Prop() options: Param;
  @Prop() unit: string = '';
  @Prop() type: string = 'line';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = false;
  @Prop() url: string = '';
  @Prop() gtsFilter: string = '';

  @Element() wsElement: HTMLElement;


  private warpscript: string = '';
  private execUrl = '';
  private timeunit = 'us';
  private graphs = {
    'scatter': ['scatter'],
    'chart': ['line', 'spline', 'step', 'area'],
    'pie': ['pie', 'doughnut', 'gauge'],
    'polar': ['polar'],
    'radar': ['radar'],
    'bar': ['bar'],
    'annotation': ['annotation'],
    'gts-tree': ['gts-tree'],
  };
  private loading = true;
  private gtsList: any;
  private _options: Param;
  private timer: any;
  private _autoRefresh;


  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    this.LOG.debug(['options'], newValue);
    if (oldValue !== newValue) {
      this.LOG.debug(['options', 'changed'], newValue);
      this.parseGTS();
    }
  }

  @Watch('gtsFilter')
  private onGtsFilter(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.parseGTS();
    }
  }

  @Method()
  resize() {
    this.execute();
  }

  @Listen('document:keyup')
  handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'r') {
      this.execute();
    }
  }

  componentDidLoad() {
    this.execute();
  }

  private parseGTS() {
    let data: DataModel = new DataModel();
    if (GTSLib.isArray(this.gtsList) && this.gtsList.length === 1) {
      const dataLine = this.gtsList[0];
      if (dataLine.hasOwnProperty('data')) {
        data.data = dataLine.data;
        data.globalParams = dataLine.globalParams || {} as Param;
        data.globalParams.type = data.globalParams.type || this.type;
        data.params = dataLine.params;
      } else {
        data.data = dataLine;
        data.globalParams = {type: this.type} as Param;
      }
    } else {
      data.data = this.gtsList;
      data.globalParams = {type: this.type} as Param;
    }
    data.globalParams.timeUnit=this.timeunit;
    this.LOG.debug(['parseGTS', 'data'], data);
    this.data = data;
    this._options = ChartLib.mergeDeep(this.options || {}, data.globalParams);
    this.LOG.debug(['parseGTS', 'options'], this._options);
    if (this._autoRefresh !== this._options.autoRefresh) {
      this._autoRefresh = this._options.autoRefresh;
      if (this.timer) {
        window.clearInterval(this.timer);
      }
      if (this._autoRefresh && this._autoRefresh > 0) {
        this.timer = window.setInterval(() => this.execute(), this._autoRefresh * 1000);
      }
    }
    this.loading = false;
  }

  //detect some VSCode special modifiers in the beginnig of the code: 
  // @endpoint xxxURLxxx
  // @timeunit ns
  //warning : the first line is empty (to confirm with other browsers) 
  private detectWarpScriptSpecialComments(){
    //
    //analyse the first warpscript lines starting with //
    // 
    let warpscriptlines = this.warpscript.split('\n');
    for (let l = 1; l < warpscriptlines.length; l++) {
      let currentline = warpscriptlines[l];
      if (currentline == "" || currentline.search("//") >= 0) {
        //find and extract // @paramname parameters
        let extraparamsPattern = /\s*\/\/\s*@(\w*)\s*(.*)$/g;
        let lineonMatch: RegExpMatchArray | null;
        let re = RegExp(extraparamsPattern);
        while (lineonMatch = re.exec(currentline)) {
          let parametername = lineonMatch[1];
          let parametervalue = lineonMatch[2];
          switch (parametername) {
            case "endpoint":        //        // @endpoint http://mywarp10server/api/v0/exec
              this.execUrl = parametervalue; 
              break;
            case "timeunit":
              this.timeunit = parametervalue.toLowerCase();   // set the time unit for graphs
              break;

            default:
              break;
          }
        }
      }
      else {
        break; //no more comments at the beginning of the file
      }
    }
  }

  private execute() {
    this.loading = true;
    this.warpscript = this.wsElement.textContent;
    this.LOG.debug(['execute', 'warpscript'], this.warpscript);
    this.execUrl = this.url;
    this.detectWarpScriptSpecialComments();
    fetch(this.execUrl, {method: 'POST', body: this.warpscript}).then(response => {
      response.text().then(gtsStr => {
        this.LOG.debug(['execute', 'response'], gtsStr);
        try {
          this.gtsList = JSON.parse(gtsStr);
          this.parseGTS();
        } catch (e) {
          this.LOG.error(['execute'], e);
        }
        this.loading = false;
      }, err => {
        this.LOG.error(['execute'], [err, this.url, this.warpscript]);
        this.loading = false;
      });
    }, err => {
      this.LOG.error(['execute'], [err, this.url, this.warpscript]);
      this.loading = false;
    })
  }

  render() {
    return <div class="wrapper" id="wrapper">
      <div class="warpscript">
        <slot/>
      </div>

      {this.graphs['scatter'].indexOf(this.type) > -1 ?
        <div>
          <h1>{this.chartTitle}</h1>
          <div class="tile">
            <warp-view-scatter responsive={this.responsive} unit={this.unit} data={this.data} options={this._options}
                               showLegend={this.showLegend}/>
          </div>
        </div>
        :
        ''
      }
      {this.graphs['chart'].indexOf(this.type) > -1 ?
        <div>
          <h1>{this.chartTitle}</h1>
          <div class="tile">
            <warp-view-chart type={this.type} responsive={this.responsive} unit={this.unit} data={this.data}
                             options={this._options} show-legend={this.showLegend}/>
          </div>
        </div>
        :
        ''
      }
      {this.type == 'bubble' ?
        <div>
          <h1>{this.chartTitle}
            <small>{this.unit}</small>
          </h1>
          <div class="tile">
            <warp-view-bubble showLegend={this.showLegend} responsive={true} unit={this.unit} data={this.data}
                              options={this._options}/>
          </div>
        </div>
        : ''
      }
      {this.type == 'map' ?
        <div>
          <h1>{this.chartTitle}
            <small>{this.unit}</small>
          </h1>
          <div class="tile">
            <warp-view-map responsive={true} data={this.data} options={this._options}/>
          </div>
        </div>
        : ''
      }
      {this.graphs['pie'].indexOf(this.type) > -1 ?
        <div>
          <h1>{this.chartTitle}
            <small>{this.unit}</small>
          </h1>
          <div class="tile">
            <warp-view-pie responsive={this.responsive} data={this.data} options={this._options}
                           showLegend={this.showLegend}/>
          </div>
        </div>
        : ''
      }
      {this.graphs['polar'].indexOf(this.type) > -1 ?
        <div>
          <h1>{this.chartTitle}
            <small>{this.unit}</small>
          </h1>
          <div class="tile">
            <warp-view-polar responsive={this.responsive} data={this.data} showLegend={this.showLegend}
                             options={this._options}/>
          </div>
        </div>
        : ''
      }
      {this.graphs['radar'].indexOf(this.type) > -1 ?
        <div>
          <h1>{this.chartTitle}
            <small>{this.unit}</small>
          </h1>
          <div class="tile">
            <warp-view-radar responsive={this.responsive} data={this.data} showLegend={this.showLegend}
                             options={this._options}/>
          </div>
        </div>
        : ''
      }
      {this.graphs['bar'].indexOf(this.type) > -1 ?
        <div>
          <h1>{this.chartTitle}</h1>
          <div class="tile">
            <warp-view-bar responsive={this.responsive} unit={this.unit} data={this.data} showLegend={this.showLegend}
                           options={this._options}/>
          </div>
        </div>
        : ''
      }
      {this.type == 'text' ?
        <div>
          <h1>{this.chartTitle}</h1>
          <div class="tile">
            <warp-view-display responsive={this.responsive} unit={this.unit} data={this.data} options={this._options}/>
          </div>
        </div>
        : ''
      }
      {this.type == 'image' ?
        <div>
          <h1>{this.chartTitle}
            <small>{this.unit}</small>
          </h1>
          <div class="tile">
            <warp-view-image responsive={this.responsive} data={this.data} options={this._options}/>
          </div>
        </div>
        : ''
      }
      {this.type == 'plot' ?
        <div>
          <h1>{this.chartTitle}
            <small>{this.unit}</small>
          </h1>
          <div class="tile">
            <warp-view-plot responsive={this.responsive} data={this.data} showLegend={this.showLegend}
                            options={this._options} gtsFilter={this.gtsFilter}/>
          </div>
        </div>
        : ''
      }
      {this.type == 'annotation' ?
        <div>
          <h1>{this.chartTitle}
            <small>{this.unit}</small>
          </h1>
          <div class="tile">
            <warp-view-annotation responsive={this.responsive} data={this.data} showLegend={this.showLegend}
                            options={this._options} />
          </div>
        </div>
        : ''
      }
      {this.type == 'gts-tree' ?
        <div>
          <h1>{this.chartTitle}
            <small>{this.unit}</small>
          </h1>
          <div class="tile">
            <warp-view-gts-tree  data={this.data} options={this._options} />
          </div>
        </div>
        : ''
      }
      {this.loading ? <warp-view-spinner/> : ''}
    </div>
  }
}
