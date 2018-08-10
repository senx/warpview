import {Component, Event, EventEmitter, Prop, Watch} from "@stencil/core";
import {GTSLib} from "../../gts.lib";

@Component({
  tag: "quantum-gts-tree",
  styleUrls: ["quantum-gts-tree.scss"]
})
export class QuantumGtsTree {
  @Prop() data: string = "[]";
  @Event() selectedGTS: EventEmitter;
  gtsList: any;

  @Watch("data")
  dataChanged(newValue: string, _oldValue: string) {
    if (newValue !== _oldValue) {
      this.gtsList = JSON.parse(newValue);
    }
  }

  /**
   *
   */
  componentWillLoad() {
    const data = JSON.parse(this.data);
    this.gtsList = GTSLib.gtsFromJSONList(data, "");
    console.debug(
      "[QuantumGtsTree] - componentWillLoad - gtsList",
      this.gtsList
    );
  }

  render() {
    return <quantum-tree-view gtsList={this.gtsList} branch={false} />;
  }
}

export class Counter {
  public static item: number = -1;
}
