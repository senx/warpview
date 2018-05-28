import {Component, Prop, State, Watch} from "@stencil/core";
import {GTSLib} from "../../gts.lib";

@Component({
  tag: 'quantum-gts-tree',
  styleUrls: [
    'quantum-gts-tree.scss'
  ]
})
export class QuantumGtsTree {
  @Prop() data: string;
  @Prop() branch = false;
  @Prop() index: number;
  _index: number;
  gtsList: any[];

  @Watch('data')
  dataChanged(newValue: string, _oldValue: string) {
    this.gtsList = JSON.parse(newValue);
  }

  componentWillLoad() {
    this.gtsList = JSON.parse(this.data);
    this._index = this.index || -1;
    console.debug(this.gtsList)
  }

  switchPlotState(event: UIEvent) {
    alert('Received the button click!');
  }

  selectNodeHead(event: UIEvent) {
    alert('Received the button click!');
  }


  gtsColor(b: boolean): string {
    this._index++;
    console.log(this._index);
    return GTSLib.getColor(this._index);
  }

  _lastIndex(index, obj) {
    let array = this._toArray(obj);
    return (index === array.length - 1);
  }

  _toArray(obj) {
    if (obj === undefined) {
      return [];
    }
    return Object.keys(obj).map(function (key) {
      return {
        name: key,
        value: obj[key],
      };
    });
  }

  render() {
    return (
      <ul>{this.gtsList.map((node, index) =>
        <li>
          {
            this.branch ? ('') :
              <div>
                <div class="stack-level " onClick={(event: UIEvent) => this.selectNodeHead(event)}>
                  Stack level {index}
                </div>
              </div>
          }
          {
            GTSLib.isGts(node)
              ? <span>
                <quantum-chip color={this.gtsColor(false)} onClick={(event: UIEvent) => this.switchPlotState(event)}/>
                <span class="gtsInfo" onClick={(event: UIEvent) => this.switchPlotState(event)}>
                <span class='gts-classname'>{node.c}</span>
                <span class='gts-separator'>{'{'}</span>{node.l}
                  {this._toArray(node.l).map((label, labelIndex) =>
                    <span>
                      <span class='gts-labelname'>{label.name}</span>
                      <span class='gts-separator'>=</span>
                      <span class='gts-labelvalue'>{label.value}</span>
                      <span hidden={this._lastIndex(labelIndex, node.l)}>,</span>
                    </span>
                  )}
                  <span class='gts-separator'>{'}'}</span>
              </span>
                </span>
              : <quantum-gts-tree data={JSON.stringify(node.gts || node)} branch={true}
                                  index={this.index || index}></quantum-gts-tree>
          }</li>
      )}</ul>
    )
  }

}
