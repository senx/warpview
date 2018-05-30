import {Component, EventEmitter, Prop, Event} from "@stencil/core";
import {GTSLib} from "../../gts.lib";

@Component({
  tag: 'quantum-tree-view',
  styleUrls: [
    'tree.scss'
  ]
})
export class QuantumTreeView {

  @Prop() gtsList: any;
  @Prop() branch = false;
  @Prop() index: number = -1;
  @Event() selected: EventEmitter;

  _index = -1;

  /**
   *
   * @param node
   * @returns {number}
   */
  getIndex(node: any): number {
    console.debug('[QuantumTreeView] - getIndex', node);
    if (!node.index) {
      this._index++;
      node.index = this._index;
    }
    return node.index;
  }


  /**
   *
   * @param {CustomEvent} event
   */
  onSelected(event: CustomEvent) {
    console.debug('[QuantumTreeView] - onSelected', event);
    this.selected.emit(event);
  }

  /**
   *
   */
  componentWillLoad() {
    this._index = this.index || -1;
  }


  /**
   *
   * @returns {any}
   */
  render() {
    return (
      <ul>

        {this.gtsList.content.map((node, index) =>
            <li>
              {
                this.branch
                  ? ('')
                  : <div class="stack-level">Stack level {index}</div>
              }
              {
                GTSLib.isGts(node.gts)
                  ? <quantum-chip node={node} index={this.getIndex(node)} name={node.gts.c}
                                  onSelected={(event: CustomEvent) => this.onSelected(event)}
                  />
                  : <span>{node.content ? <div>
                    <span class="expanded"/> List of {node.content.length} item{node.content.length > 1 ? 's' : ''}
                    <quantum-tree-view gtsList={node} branch={true} index={this.index || index}  onSelected={(event: CustomEvent) => this.onSelected(event)} />
                  </div> : <span/>
                  }
        </span>
              }</li>
        )}</ul>
    )
  }
}
