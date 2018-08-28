import {Component, Event, EventEmitter, Prop, State} from '@stencil/core';
import {GTSLib} from "../../gts.lib";

@Component({
  tag: 'quantum-toggle',
  styleUrl: 'quantum-toggle.scss',
  shadow: true
})
export class QuantumToggle {

  @Prop() option: string = '{}';
  @Prop() checked: boolean = false;
  @State() state: boolean = false;
  @Prop() text1: string = "";
  @Prop() text2: string = "";

  @Event() timeSwitched: EventEmitter;

  private _option = {
    switchClass: '',
    switchLabelClass: '',
    switchHandleClass: ''
  };

  componentWillLoad(){
    this._option = GTSLib.mergeDeep(this._option, JSON.parse(this.option));
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
        <label class={ 'switch ' + this._option.switchClass } >
          {this.state
            ? <input type="checkbox" class="switch-input" checked onClick={() => this.switched()}/>
            : <input type="checkbox" class="switch-input" onClick={() => this.switched()}/>
          }
          <span class={ 'switch-label ' + this._option.switchLabelClass } />
          <span class={ 'switch-handle ' + this._option.switchHandleClass } />
        </label>
        <div class="text">{this.text2}</div>
      </div>
    );
  }
}
