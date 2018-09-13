import {Component, Event, EventEmitter, Prop, State} from '@stencil/core';
import {ChartLib} from "../../utils/chart-lib";
import {Param} from "../../model/param";

@Component({
  tag: 'quantum-toggle',
  styleUrl: 'quantum-toggle.scss',
  shadow: true
})
export class QuantumToggle {

  @Prop() options: Param = new Param();
  @Prop() checked: boolean = false;
  @Prop() text1: string = "";
  @Prop() text2: string = "";

  @State() state: boolean = false;

  @Event() timeSwitched: EventEmitter;

  private _options: Param = new Param();

  componentWillLoad(){
    this._options = ChartLib.mergeDeep(this._options, this.options);
    this.state = this.checked;
  }

  switched(){
    this.state = !this.state;
    this.timeSwitched.emit({state: this.state});
  }

  render() {
    return (
      <div class="container">
        <div class="text">{this.text1}</div>
        <label class="switch" >
          {this.state
            ? <input type="checkbox" class="switch-input" checked onClick={() => this.switched()}/>
            : <input type="checkbox" class="switch-input" onClick={() => this.switched()}/>
          }
          <span class="switch-label" />
          <span class="switch-handle" />
        </label>
        <div class="text">{this.text2}</div>
      </div>
    );
  }
}
