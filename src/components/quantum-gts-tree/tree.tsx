import {Component, Event, EventEmitter, Prop} from "@stencil/core";
import {GTSLib} from "../../utils/gts.lib";
import {Counter} from "./quantum-gts-tree";
import {GTS} from "../../model/GTS";
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
      <div class={this.theme}>
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
