import {Component, Event, EventEmitter, Prop} from "@stencil/core";
import {GTSLib} from "../../gts.lib";
import {Counter} from "./quantum-gts-tree";

@Component({
  tag: "quantum-tree-view",
  styleUrls: ["tree.scss"]
})
export class QuantumTreeView {
  @Prop() gtsList: any;
  @Prop() branch = false;
  @Event() selected: EventEmitter;

  /**
   *
   * @param node
   * @returns {number}
   */
  getIndex(node: any): number {
    Counter.item++;
    node.index = Counter.item;
    console.debug("[QuantumTreeView] - getIndex", Counter.item, node);
    return Counter.item;
  }

  /**
   *
   */
  componentWillLoad() {
    console.debug("[QuantumTreeView] - componentWillLoad", Counter.item);
  }

  /**
   *
   * @returns {any}
   */
  render() {
    return (
      <div>
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
                  index={this.getIndex(node)}
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
