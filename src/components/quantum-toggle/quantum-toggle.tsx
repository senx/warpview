import {Component, Event, EventEmitter, Prop, State} from '@stencil/core';
import {ChartLib} from "../../utils/chart-lib";

@Component({
  tag: 'quantum-toggle',
  styleUrl: 'quantum-toggle.scss',
  shadow: true
})
export class QuantumToggle {

  @Prop() options: string = '{}';
  @Prop() checked: boolean = false;
  @State() state: boolean = false;
  @Prop() text1: string = "";
  @Prop() text2: string = "";

  @Event() timeSwitched: EventEmitter;

  private _options = {
    switchClass: '',
    switchLabelClass: '',
    switchHandleClass: ''
  };

  componentWillLoad(){
    this._options = ChartLib.mergeDeep(this._options, JSON.parse(this.options));
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
        <label class={ 'switch ' + this._options.switchClass } >
          {this.state
            ? <input type="checkbox" class="switch-input" checked onClick={() => this.switched()}/>
            : <input type="checkbox" class="switch-input" onClick={() => this.switched()}/>
          }
          <span class={ 'switch-label ' + this._options.switchLabelClass } />
          <span class={ 'switch-handle ' + this._options.switchHandleClass } />
        </label>
        <div class="text">{this.text2}</div>
      </div>
    );
  }
}
