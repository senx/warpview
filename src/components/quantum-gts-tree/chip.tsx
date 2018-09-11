import {Component, Element, Event, EventEmitter, Prop} from "@stencil/core";
import {GTSLib} from "../../utils/gts.lib";

@Component({
  tag: 'quantum-chip',
  styleUrls: [
    'chip.scss'
  ]
})
export class QuantumChip {
  @Prop() name: string;
  @Prop() index: number;
  @Prop() node: any;
  _node: any = {
    selected: true,
    gts: {
      c: '', l: {}, a: {}, v: []
    }
  };

  @Event() quantumSelectedGTS: EventEmitter;

  @Element() el: HTMLElement;

  /**
   *
   * @param {boolean} state
   * @returns {string}
   */
  gtsColor(state: boolean): string {
    if (state) {
      return GTSLib.getColor(this.index);
    } else {
      return '#bbbbbb';
    }
  }

  /**
   *
   */
  componentWillLoad() {
    this._node = {...this.node, selected: true};
  }

  /**
   *
   */
  componentDidLoad() {
    (this.el.getElementsByClassName('normal')[0] as HTMLElement).style.setProperty('background-color', this.gtsColor(this._node.selected));
  }

  /**
   *
   * @param index
   * @param obj
   * @returns {boolean}
   * @private
   */
  _lastIndex(index, obj) {
    let array = this._toArray(obj);
    return (index === array.length - 1);
  }

  /**
   *
   * @param obj
   * @returns {any}
   * @private
   */
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

  /**
   *
   * @param {UIEvent} event
   */
  switchPlotState(event: UIEvent) {
    this._node = { ...this._node, selected: !this._node.selected, label: GTSLib.serializeGtsMetadata({ c: this._node.gts.c, l: this._node.gts.l, a: this._node.gts.a})};
    console.debug('[QuantumChip] - switchPlotState', this._node);
    (this.el.getElementsByClassName('normal')[0] as HTMLElement).style.setProperty('background-color', this.gtsColor(this._node.selected));
    this.quantumSelectedGTS.emit(this._node);
  }

  render() {
    return (
      <div>
        {this._node && this._node.gts && this._node.gts.l?
          <span><i class="normal"/>
            <span class="gtsInfo" onClick={(event: UIEvent) => this.switchPlotState(event)}>
          <span class='gts-classname'>{this._node.gts.c}</span>
          <span class='gts-separator' innerHTML={'&lcub; '}/>
            {this._toArray(this._node.gts.l).map((label, labelIndex) =>
                <span>
              <span class='gts-labelname'>{label.name}</span>
              <span class='gts-separator'>=</span>
              <span class='gts-labelvalue'>{label.value}</span>
              <span hidden={this._lastIndex(labelIndex, this._node.gts.l)}>, </span>
            </span>
            )}
            <span class='gts-separator' innerHTML={' &rcub;'}/>
          </span>
          </span>
          : ''
        }
      </div>
    )
  }
}
