import {Component, Event, EventEmitter, Prop, Watch} from "@stencil/core";
import {GTSLib} from "../../gts.lib";

@Component({
  tag: 'quantum-gts-tree',
  styleUrls: [
    'quantum-gts-tree.scss'
  ]
})
export class QuantumGtsTree {
  @Prop() data: string;
  @Event() selected: EventEmitter;
  gtsList: any;

  @Watch('data')
  dataChanged(newValue: string, _oldValue: string) {
    this.gtsList = JSON.parse(newValue);
  }

  /**
   *
   * @param {CustomEvent} event
   */
  onSelected(event: CustomEvent) {
    console.debug('[QuantumGtsTree] - onSelected', event);
    this.selected.emit(event);

  }

  /**
   *
   */
  componentWillLoad() {
    console.debug('[QuantumGtsTree] - componentWillLoad', JSON.parse(this.data));
    this.gtsList = GTSLib.gtsFromJSONList(JSON.parse(this.data), undefined);
    console.debug('[QuantumGtsTree] - componentWillLoad - gtsList', this.gtsList);
  }

  render() {
    return (
      <quantum-tree-view gtsList={this.gtsList} branch={false} onSelected={(event: CustomEvent) => this.onSelected(event)} />
    )
  }

}

export class Counter {
  public static item: number = -1;
}
