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

import {Component, Prop, State, Watch} from "@stencil/core";
import {GTSLib} from "../../utils/gts.lib";
import {DataModel} from "../../model/dataModel";
import {GTS} from "../../model/GTS";
import {Logger} from "../../utils/logger";

@Component({
  tag: "warp-view-gts-tree",
  styleUrls: ["warp-view-gts-tree.scss"]
})
export class WarpViewGtsTree {
  @Prop() data: DataModel | GTS[] | string;
  @Prop() theme: string = "light";
  @Prop() gtsFilter = '';

  @State() hide = false;

  private gtsList: {
    content: any[],
  } = {content: []};
  private LOG: Logger = new Logger(WarpViewGtsTree);

  @Watch("data")
  onData(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.doRender();
    }
  }

  @Watch('gtsFilter')
  private onGtsFilter(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.LOG.debug(['gtsFilter'], newValue);
      this.doRender();
    }
  }

  /**
   *
   */
  componentWillLoad() {
    this.LOG.debug(['componentWillLoad', 'data'], this.data);
    if (this.data) {
      this.doRender();
    }
  }

  private doRender() {
    let dataList = GTSLib.getData(this.data).data;
    this.gtsList = GTSLib.gtsFromJSONList(dataList, '');
    this.LOG.debug(['doRender', 'gtsList'], this.data);
  }

  toggleVisibility(event: UIEvent) {
    let el = (event.currentTarget as HTMLElement).firstChild as HTMLElement;
    if (el.className === 'expanded') {
      el.className = 'collapsed';
      this.hide = true;
    } else {
      el.className = 'expanded';
      this.hide = false;
    }
  }

  render() {
    return this.gtsList
      ? <div>
        <div class="stack-level"  onClick={(event: UIEvent) => this.toggleVisibility(event)}><span class="expanded" /> Stack</div>
        <warp-view-tree-view gtsList={this.gtsList} branch={false} theme={this.theme} hidden={this.hide} gtsFilter={this.gtsFilter} />
      </div>
      : '';
  }
}

export class Counter {
  public static item: number = -1;
}
