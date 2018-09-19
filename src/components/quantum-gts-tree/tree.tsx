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

import {Component, Prop} from "@stencil/core";
import {GTSLib} from "../../utils/gts.lib";
import {Counter} from "./quantum-gts-tree";
import {Logger} from "../../utils/logger";

@Component({
  tag: "quantum-tree-view",
  styleUrls: ["tree.scss"]
})
export class QuantumTreeView {
  @Prop() gtsList: any;
  @Prop() branch = false;
  @Prop() theme: string = "light";

  private static LOG: Logger = new Logger(QuantumTreeView);
  /**
   *
   * @param node
   * @returns {number}
   */
  private static getIndex(node: any): number {
    Counter.item++;
    node.index = Counter.item;
    this.LOG.debug(['getIndex'], [Counter.item, node]);
    return Counter.item;
  }

  /**
   *
   */
  componentWillLoad() {
    QuantumTreeView.LOG.debug(['componentWillLoad'], Counter.item);
  }

  /**
   *
   * @returns {any}
   */
  render() {
    return (
      <div class="list">
        {this.gtsList && this.gtsList.content ? (
        <ul>
          {this.gtsList.content.map((node, index) => (
            <li>
              {this.branch ? (
                ""
              ) : (
                <div class="stack-level">Stack level {index}</div>
              )}
              {GTSLib.isGts(node.gts) ? (
                <quantum-chip
                  node={node}
                  index={QuantumTreeView.getIndex(node)}
                  name={node.gts.c}
                />
              ) : (
                <span>
                {node.content ? (
                  <div>
                    <span class="expanded"/>
                    List of {node.content.length} item{node.content.length > 1
                    ? "s"
                    : ""}
                    <quantum-tree-view gtsList={node} branch={true}/>
                  </div>
                ) : (
                  <span/>
                )}
              </span>
              )}
            </li>
          ))}
        </ul>): ''}
      </div>
    );
  }
}
