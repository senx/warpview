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
  @Prop() data: DataModel | GTS[] | string;
  @Prop() theme: string = "light";

  private gtsList: {
    content: any[],
  } = {content: []};
  private LOG: Logger = new Logger(QuantumGtsTree);

  @Watch("data")
  onData(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.doRender();
    }
  }

  /**
   *
   */
  componentWillLoad() {
    this.LOG.debug(['componentWillLoad', 'data'], this.data);
    if (this.data) {
      this.doRender();
    }
  }

  private doRender() {
    let dataList = GTSLib.getData(this.data).data;
    this.gtsList = GTSLib.gtsFromJSONList(dataList, '');
    this.LOG.debug(['doRender', 'gtsList'], this.data);
  }

  render() {
    return (this.gtsList ? <quantum-tree-view gtsList={this.gtsList} branch={false} theme={this.theme}/> : '');
  }
}

export class Counter {
  public static item: number = -1;
}
