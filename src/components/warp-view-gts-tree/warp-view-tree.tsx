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

import {Component, Element, Prop, State, Watch} from "@stencil/core";
import {GTSLib} from "../../utils/gts.lib";
import {Counter} from "./warp-view-gts-tree";
import {Logger} from "../../utils/logger";
import {ChartLib} from "../../utils/chart-lib";

@Component({
  tag: "warp-view-tree-view",
  styleUrls: ["warp-view-tree.scss"]
})
export class WarpViewTreeView {
  @Prop() gtsList: any;
  @Prop() branch = false;
  @Prop() theme: string = "light";
  @Prop() hidden = false;
  @Prop() gtsFilter = '';

  @State() ref = false;

  @Element() el: HTMLElement;

  hide: any = {};
  private static LOG: Logger = new Logger(WarpViewTreeView);

  /**
   *
   * @param node
   * @returns {number}
   */
  private static getIndex(node: any): number {
    Counter.item++;
    node.index = Counter.item;
    return Counter.item;
  }

  /**
   *
   */
  componentWillLoad() {
    WarpViewTreeView.LOG.debug(['componentWillLoad'], Counter.item);
  }

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
    this.ref = !this.ref;
  }

  @Watch('gtsFilter')
  private onGtsFilter(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.ref = !this.ref;
    }
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

  /**
   *
   * @returns {any}
   */
  render() {
    return <div class="list">
      {this.gtsList && this.gtsList.content ? <ul>
        {this.gtsList.content.map((node, index) => (
          <li hidden={this.hidden}>
            {GTSLib.isGts(node.gts)
              ? <warp-view-chip node={node} index={WarpViewTreeView.getIndex(node)} name={node.gts.c} gtsFilter={this.gtsFilter} />
              : <span>{node.content
                ? <div>{this.branch
                  ? <div>
                    <span class="expanded" onClick={(event: UIEvent) => this.toggleVisibility(event, index)}
                          id={ChartLib.guid()}/>
                    <span onClick={(event: UIEvent) => this.toggleVisibility(event, index)}>
                    <small>List
                      of {node.content.length} item{node.content.length > 1
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
                      of {node.content.length} item{node.content.length > 1
                          ? 's'
                          : ''}</small></span>
                  </div>}
                  <warp-view-tree-view gtsList={node} branch={true} hidden={this.isHidden(index)} gtsFilter={this.gtsFilter}/>
                </div>
                : ''}
              </span>}
          </li>
        ))}
      </ul> : ''}
    </div>;
  }
}
