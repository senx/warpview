import {Component, Element, Event, EventEmitter, Prop, State} from '@stencil/core';

@Component({
  tag: 'quantum-toggle',
  styleUrl: 'quantum-toggle.scss',
  shadow: true
})
export class QuantumToggle {
  @Prop() checked: boolean = false;
  @Prop() text1: string = "";
  @Prop() text2: string = "";

  @Element() el: HTMLElement;

  @State() state: boolean = false;

  @Event() stateChange: EventEmitter;

  componentWillLoad() {
    this.state = this.checked;
  }

  switched() {
    this.state = !this.state;
    this.stateChange.emit({state: this.state, id: this.el.id});
  }

  render() {
    return <div class="container">
      <div class="text">{this.text1}</div>
      <label class="switch">
        {this.state
          ? <input type="checkbox" class="switch-input" checked onClick={() => this.switched()}/>
          : <input type="checkbox" class="switch-input" onClick={() => this.switched()}/>
        }
        <span class="switch-label"/>
        <span class="switch-handle"/>
      </label>
      <div class="text">{this.text2}</div>
    </div>;
  }
}
