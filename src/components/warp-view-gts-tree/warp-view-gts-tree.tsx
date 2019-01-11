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

import {Component, Prop, State, Watch} from "@stencil/core";
import {GTSLib} from "../../utils/gts.lib";
import {DataModel} from "../../model/dataModel";
import {GTS} from "../../model/GTS";
import {Logger} from "../../utils/logger";
import {Param} from "../../model/param";
import {ChartLib} from "../../utils/chart-lib";
import deepEqual from "deep-equal";

@Component({
  tag: "warp-view-gts-tree",
  styleUrls: ["warp-view-gts-tree.scss"]
})
export class WarpViewGtsTree {
  @Prop() data: DataModel | DataModel[] | GTS[] | string;
  @Prop() gtsFilter = '';
  @Prop() options: Param = new Param();
  @Prop() hiddenData: number[] = [];
  @Prop() debug = false;

  @State() hide = false;

  private gtsList: any[] = [];
  private _options: Param = new Param();
  private LOG: Logger;
  private root: HTMLSpanElement;

  @Watch("data")
  onData(newValue, oldValue) {
    if (!deepEqual(newValue, oldValue)) {
      this.LOG.debug(['options'], newValue, oldValue);
      this.doRender();
    }
  }

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if (!deepEqual(newValue, oldValue)) {
      this.LOG.debug(['options'], newValue, oldValue);
      this.doRender();
      if (!!this._options.foldGTSTree && !this.hide) {
        this.foldAll();
      }
    }
  }

  @Watch('gtsFilter')
  private onGtsFilter(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.LOG.debug(['gtsFilter'], newValue);
      this.doRender();
    }
  }

  @Watch('hiddenData')
  private onHideData(newValue: number[], oldValue: number[]) {
    if (!deepEqual(newValue, oldValue)) {
      this.LOG.debug(['hiddenData'], newValue);
      this.doRender();
    }
  }

  componentWillLoad() {
    this.LOG = new Logger(WarpViewGtsTree, this.debug);
  }

  componentDidLoad() {
    this.LOG.debug(['componentDidLoad', 'data'], this.data);
    if (this.data) {
      this.doRender();
    }
    if (this._options.foldGTSTree !== undefined && !!this._options.foldGTSTree && !this.hide) {
      this.foldAll();
    }
  }

  private doRender() {
    this.LOG.debug(['doRender', 'gtsList'], this.data);
    this._options = ChartLib.mergeDeep(this._options, this.options);
    if (!this.data) {
      return;
    }
    let dataList = GTSLib.getData(this.data).data;
    this.LOG.debug(['doRender', 'gtsList', 'dataList'], dataList);
    if (!dataList) {
      return;
    }
    this.gtsList = GTSLib.flattenGtsIdArray(dataList as any[], 0).res;
    this.LOG.debug(['doRender', 'gtsList'], this.gtsList, this._options.foldGTSTree, this.hide);
  }

  private foldAll() {
    if (!this.root) {
      window.setTimeout(() => {
        this.foldAll();
      }, 100)
    } else {
      this.hide = true;
    }
  }

  toggleVisibility() {
    this.hide = !this.hide;
  }

  render() {
    return this.gtsList
      ? <div>
        <div class="stack-level" onClick={() => this.toggleVisibility()}>
          <span class={{'expanded': !this.hide, 'collapsed': this.hide}} ref={el => this.root = el}/> Stack
        </div>
        <warp-view-tree-view gtsList={this.gtsList} branch={false} hidden={this.hide}
                             debug={this.debug}
                             hiddenData={this.hiddenData} gtsFilter={this.gtsFilter}/>
      </div>
      : '';
  }
}
