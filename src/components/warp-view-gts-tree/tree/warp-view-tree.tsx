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
import {GTSLib} from "../../../utils/gts.lib";
import {Logger} from "../../../utils/logger";
import {ChartLib} from "../../../utils/chart-lib";

@Component({
  tag: "warp-view-tree-view",
  styleUrls: ["warp-view-tree.scss"]
})
export class WarpViewTreeView {
  @Prop() gtsList: any[];
  @Prop() branch = false;
  @Prop() hidden = false;
  @Prop() gtsFilter = 'x';
  @Prop() hiddenData: number[] = [];
  @Prop() debug = false;
  @Prop() kbdLastKeyPressed: string[] = [];

  @State() ref: number = 0; //just to trigger the render

  private hide: any = {};
  private LOG: Logger;

  /**
   *
   * @param {UIEvent} event
   * @param {number} index
   */
  toggleVisibility(event: UIEvent, index: number) {
    let el: HTMLElement;
    if ((event.currentTarget as HTMLElement).id) {
      el = event.currentTarget as HTMLElement;
    } else {
      el = (event.currentTarget as HTMLElement).previousElementSibling as HTMLElement;
    }
    if (el.className === 'expanded') {
      el.className = 'collapsed';
      this.hide[index + ''] = true;
    } else {
      el.className = 'expanded';
      this.hide[index + ''] = false;
    }
    this.ref++;
  }

  @Watch('gtsFilter')
  private onGtsFilter(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.ref++;
    }
  }

  @Watch('hiddenData')
  private onHideData(newValue: number[]) {
    this.LOG.debug(['hiddenData'], newValue);
    this.ref++;
  }

  /**
   *
   * @param {number} index
   * @returns boolean
   */
  isHidden(index: number) {
    if (this.hide.hasOwnProperty(index + '')) {
      return this.hide[index + ''];
    } else {
      return false;
    }
  }

  componentWillLoad() {
    this.LOG = new Logger(WarpViewTreeView, this.debug);
  }

  /**
   *
   * @returns {any}
   */
  render() {
    return <div class="list">
      {this.gtsList ? <ul>
        {this.gtsList.map((node, index) => (
          <li hidden={this.hidden}>
            {GTSLib.isGts(node)
              ? <warp-view-chip node={{gts: node}} name={node.c} gtsFilter={this.gtsFilter}
                                debug={this.debug} hiddenData={this.hiddenData}
                                kbdLastKeyPressed={this.kbdLastKeyPressed}/>
              : <span>{node
                ? <div>{this.branch
                  ? <div>
                    <span class="expanded" onClick={(event: UIEvent) => this.toggleVisibility(event, index)}
                          id={ChartLib.guid()}/>
                    <span onClick={(event: UIEvent) => this.toggleVisibility(event, index)}>
                    <small>List
                      of {node.length} item{node.length > 1
                        ? 's'
                        : ''}</small></span>
                  </div>
                  : <div class="stack-level">
                    <span class="expanded" onClick={(event: UIEvent) => this.toggleVisibility(event, index)}
                          id={ChartLib.guid()}/>
                    <span
                      onClick={(event: UIEvent) => this.toggleVisibility(event, index)}>{index === 0 ? '[TOP]' : '[' + (index + 1) + ']'}
                      &nbsp;
                      <small>List
                      of {node.length} item{node.length > 1
                          ? 's'
                          : ''}</small></span>
                  </div>}
                  <warp-view-tree-view gtsList={node} branch={true} hidden={this.isHidden(index)}
                                       debug={this.debug} gtsFilter={this.gtsFilter}
                                       kbdLastKeyPressed={this.kbdLastKeyPressed} hiddenData={this.hiddenData}/>
                </div>
                : ''}
              </span>}
          </li>
        ))}
      </ul> : ''}
    </div>;
  }
}
