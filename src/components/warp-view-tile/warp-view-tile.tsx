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
import deepEqual from "deep-equal";

@Component({
  tag: 'warp-view-tile',
  styleUrl: 'warp-view-tile.scss',
  shadow: true
})
export class WarpViewTile {

  @State() data: any;
  @Prop() options: Param;
  @Prop() unit: string = '';
  @Prop() type: string = 'line';
  @Prop() chartTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() showLegend: boolean = false;
  @Prop() url: string = '';
  @Prop() gtsFilter: string = '';
  @Prop() debug = false;

  @Element() wsElement: HTMLElement;

  private LOG: Logger;
  private warpScript: string = '';
  private execUrl = '';
  private timeUnit = 'us';
  private graphs = {
    'scatter': ['scatter'],
    'chart': ['line', 'spline', 'step', 'area'],
    'pie': ['pie', 'doughnut', 'gauge'],
    'polar': ['polar'],
    'radar': ['radar'],
    'bar': ['bar'],
    'annotation': ['annotation'],
    'gts-tree': ['gts-tree']
  };
  private loading = true;
  private executionErrorText: string = '';
  private gtsList: any;
  private _options: Param = new Param();
  private timer: any;
  private _autoRefresh;

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if (!deepEqual(newValue, oldValue)) {
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
    this.LOG.debug(['parseGTS', 'data'], data);
    this.data = data;
    this._options = ChartLib.mergeDeep(this.options || {}, data.globalParams);
    this.LOG.debug(['parseGTS', 'options'], [this.options, this._options]);
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
  // @timeUnit ns
  //warning : the first line is empty (to confirm with other browsers)
  private detectWarpScriptSpecialComments() {
    //
    //analyse the first warpScript lines starting with //
    //
    let warpscriptlines = this.warpScript.split('\n');
    for (let l = 1; l < warpscriptlines.length; l++) {
      let currentline = warpscriptlines[l];
      if (currentline == "" || currentline.search("//") >= 0) {
        //find and extract // @paramname parameters
        let extraparamsPattern = /\s*\/\/\s*@(\w*)\s*(.*)$/g;
        let lineonMatch: RegExpMatchArray | null;
        let re = RegExp(extraparamsPattern);
        // noinspection JSAssignmentUsedAsCondition
        while (lineonMatch = re.exec(currentline)) {
          let parameterName = lineonMatch[1];
          let parameterValue = lineonMatch[2];
          switch (parameterName) {
            case "endpoint":        //        // @endpoint http://mywarp10server/api/v0/exec
              this.execUrl = parameterValue;
              break;
            case "timeUnit":
              this.timeUnit = parameterValue.toLowerCase();   // set the time unit for graphs
              break;

            default:
              break;
          }
        }
      } else {
        break; //no more comments at the beginning of the file
      }
    }
  }


  componentWillLoad() {
    this.LOG = new Logger(WarpViewTile, this.debug);
  }

  private execute() {
    this.loading = true;
    this.warpScript = this.wsElement.textContent;
    this.LOG.debug(['execute', 'warpScript'], this.warpScript);
    this.execUrl = this.url;
    this.detectWarpScriptSpecialComments();
    fetch(this.execUrl, {method: 'POST', body: this.warpScript}).then(response => {
      if (response.status == 200) {
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
          this.LOG.error(['execute'], [err, this.url, this.warpScript]);
          this.loading = false;
        });
      } else {
        this.executionErrorText = "Execution Error : #" + response.headers.get('X-Warp10-Error-Line') + ' ' + response.headers.get('X-Warp10-Error-Message');
      }
    }, err => {
      this.LOG.error(['execute'], [err, this.url, this.warpScript]);
      this.loading = false;
      this.executionErrorText = "Failed to reach execution endpoint " + this.url;
    })
  }

  render() {
    if (this.executionErrorText != '') {
      // noinspection JSXNamespaceValidation
      return <div class="executionErrorText"> {this.executionErrorText} </div>
    } else {
      return <div class="wrapper" id="wrapper">
        <div class="warpscript">
          <slot/>
        </div>
        {this.executionErrorText != '' ? <div class="executionErrorText"> {this.executionErrorText} </div> : ''}
        {this.graphs['scatter'].indexOf(this.type) > -1 ?
          <div>
            <h1>{this.chartTitle}</h1>
            <div class="tile">
              <warp-view-scatter debug={this.debug} responsive={this.responsive} unit={this.unit} data={this.data}
                                 options={this._options} showLegend={this.showLegend}/>
            </div>
          </div>
          :
          ''
        }
        {this.graphs['chart'].indexOf(this.type) > -1 ?
          <div>
            <h1>{this.chartTitle}</h1>
            <div class="tile">
              <warp-view-chart debug={this.debug} type={this.type} responsive={this.responsive} unit={this.unit}
                               data={this.data} options={this._options} show-legend={this.showLegend}/>
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
              <warp-view-bubble debug={this.debug} showLegend={this.showLegend} responsive={true} unit={this.unit}
                                data={this.data} options={this._options}/>
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
              <warp-view-map debug={this.debug} responsive={true} data={this.data} options={this._options}/>
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
              <warp-view-pie debug={this.debug} responsive={this.responsive} data={this.data} options={this._options}
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
              <warp-view-polar debug={this.debug} responsive={this.responsive} data={this.data}
                               showLegend={this.showLegend} options={this._options}/>
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
              <warp-view-radar debug={this.debug} responsive={this.responsive} data={this.data}
                               showLegend={this.showLegend} options={this._options}/>
            </div>
          </div>
          : ''
        }
        {this.graphs['bar'].indexOf(this.type) > -1 ?
          <div>
            <h1>{this.chartTitle}</h1>
            <div class="tile">
              <warp-view-bar debug={this.debug} responsive={this.responsive} unit={this.unit} data={this.data}
                             showLegend={this.showLegend} options={this._options}/>
            </div>
          </div>
          : ''
        }
        {this.type == 'text' ?
          <div>
            <h1>{this.chartTitle}</h1>
            <div class="tile">
              <warp-view-display debug={this.debug} responsive={this.responsive} unit={this.unit} data={this.data}
                                 options={this._options}/>
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
              <warp-view-image debug={this.debug} responsive={this.responsive} data={this.data}
                               options={this._options}/>
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
              <warp-view-plot debug={this.debug} responsive={this.responsive} data={this.data}
                              showLegend={this.showLegend} options={this._options} gtsFilter={this.gtsFilter}/>
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
              <warp-view-annotation debug={this.debug} responsive={this.responsive} data={this.data}
                                    showLegend={this.showLegend} options={this._options}/>
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
              <warp-view-gts-tree debug={this.debug} data={this.data} options={this._options}/>
            </div>
          </div>
          : ''
        }
        {this.type == 'drilldown' ?
          <div>
            <h1>{this.chartTitle}
              <small>{this.unit}</small>
            </h1>
            <div class="tile">
              <warp-view-drilldown debug={this.debug} data={this.data} options={this._options}/>
            </div>
          </div>
          : ''
        }
        {this.type == 'datagrid' ?
          <div>
            <h1>{this.chartTitle}
              <small>{this.unit}</small>
            </h1>
            <div class="tile">
              <warp-view-datagrid debug={this.debug} data={this.data} options={this._options}/>
            </div>
          </div>
          : ''
        }
        {this.loading ? <warp-view-spinner/> : ''}
      </div>
    }
  }
}
