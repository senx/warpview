import { Component, Prop, EventEmitter, Event, State, Listen} from '@stencil/core';
import { GTSLib } from "../../gts.lib";

@Component({
  tag: 'quantum-toggle',
  styleUrl: 'quantum-toggle.scss',
  shadow: true
})
export class QuantumToggle {

  @Prop() option: string = '{}';
  @Prop() checked: boolean = false;

  @State() state: boolean = false;

  @Event() timeSwitched: EventEmitter;

  private _option = {
    switchClass: '',
    switchLabelClass: '',
    switchHandleClass: ''
  };

  componentWillLoad(){
    this._option = GTSLib.mergeDeep(this._option, JSON.parse(this.option));
  }

  componentDidLoad(){}
  componentWillUpdate(){}
  componentDidUpdate(){}

  render() {
    return (
      <label class={ 'switch ' + this._option.switchClass } >
        {this.checked
          ? <input type="checkbox" class="switch-input" checked onClick={() => this.switched()}/>
          : <input type="checkbox" class="switch-input" onClick={() => this.switched()}/>
        }
        <span class={ 'switch-label ' + this._option.switchLabelClass } />
        <span class={ 'switch-handle ' + this._option.switchHandleClass } />
      </label>
    );
  }

  switched(){
    this.state = !this.state;
    this.timeSwitched.emit({state: this.state});
  }

  @Listen('timeSwitched')
    switchedListener(event: CustomEvent){
    }
}
