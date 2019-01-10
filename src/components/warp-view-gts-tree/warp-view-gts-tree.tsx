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
  private _isFolded : boolean = false;
  private root: HTMLSpanElement;
  private initialized = false;

  @Watch("data")
  onData(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.doRender();
    }
  }

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if (oldValue !== newValue) {
      this.LOG.debug(['options'], newValue);
      this._isFolded = !!this.options.foldGTSTree;
      this.doRender();
    }
  }

  @Watch('gtsFilter')
  private onGtsFilter(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.LOG.debug(['gtsFilter'], newValue);
      this.doRender();
      if (!!this._options.foldGTSTree && !this._isFolded) {
        this.foldAll();
      }
    }
  }

  @Watch('hiddenData')
  private onHideData(newValue: number[]) {
    this.LOG.debug(['hiddenData'], newValue);
    this.doRender();
  }

  componentDidLoad() {
    this.LOG = new Logger(WarpViewGtsTree, this.debug);
    this.LOG.debug(['componentWillLoad', 'data'], this.data);
    if (this.data) {
      this.doRender();
    }
  }

  private doRender() {
    this._options = ChartLib.mergeDeep(this._options, this.options);
    if (!this.data) {
      return;
    }
    this.LOG.debug(['doRender', 'gtsList'], this.data);
    let dataList = GTSLib.getData(this.data).data;
    this.LOG.debug(['doRender', 'gtsList', 'dataList'], dataList);
    if (!dataList) {
      return;
    }
    this.gtsList = GTSLib.flattenGtsIdArray(dataList as any[], 0).res;
    this.LOG.debug(['doRender', 'gtsList'], this.gtsList, this._options.foldGTSTree, this._isFolded);
    if(!this.initialized) {
      if (this._options.foldGTSTree !== undefined && !!this._options.foldGTSTree && !this._isFolded) {
        this.LOG.debug(['doRender'], 'About to fold');
        this.foldAll();
      }
      this.initialized = true;
    }

  }

  private foldAll() {
    if (!this.root) {
      this.LOG.debug(['doRender'], 'no root');
      window.setTimeout(() => {
        this.foldAll();
      }, 100)
    } else {
      this.LOG.debug(['doRender'], 'Ok collapse');
      this.root.className = 'collapsed';
      this.hide = true;
      this._isFolded = true;
    }
  }

  toggleVisibility(event: UIEvent) {
    let el = (event.currentTarget as HTMLElement).firstChild as HTMLElement;
    if (el.className === 'expanded') {
      this._isFolded = true;
      el.className = 'collapsed';
      this.hide = true;
    } else {
      el.className = 'expanded';
      this._isFolded = false;
      this.hide = false;
    }
  }

  render() {
    return this.gtsList
      ? <div>
        <div class="stack-level" onClick={(event: UIEvent) => this.toggleVisibility(event)}>
          <span class="expanded" ref={el => this.root = el}/> Stack
        </div>
        <warp-view-tree-view gtsList={this.gtsList} branch={false} hidden={this.hide}
                             debug={this.debug}
                             hiddenData={this.hiddenData} gtsFilter={this.gtsFilter}/>
      </div>
      : '';
  }
}
