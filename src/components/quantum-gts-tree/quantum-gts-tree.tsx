import {Component, Event, EventEmitter, Prop, Watch} from "@stencil/core";
import {GTSLib} from "../../utils/gts.lib";
import {DataModel} from "../../model/dataModel";
import {GTS} from "../../model/GTS";
import {Logger} from "../../utils/logger";

@Component({
  tag: "quantum-gts-tree",
  styleUrls: ["quantum-gts-tree.scss"]
})
export class QuantumGtsTree {
  @Prop() data: DataModel | GTS[];
  @Prop() theme: string = "light";
  @Event() selectedGTS: EventEmitter;

  private gtsList: any;
  private LOG: Logger = new Logger(QuantumGtsTree);

  @Watch("data")
  onData(newValue: DataModel | GTS[], oldValue: DataModel | GTS[]) {
    if (newValue !== oldValue) {
      this.gtsList = newValue;
    }
  }

  /**
   *
   */
  componentWillLoad() {
    this.gtsList = GTSLib.gtsFromJSONList(this.data, '');
    this.LOG.debug(['componentWillLoad', 'gtsList'], this.gtsList);
  }

  render() {
    return <quantum-tree-view gtsList={this.gtsList} branch={false} theme={this.theme}/>;
  }
}

export class Counter {
  public static item: number = -1;
}
