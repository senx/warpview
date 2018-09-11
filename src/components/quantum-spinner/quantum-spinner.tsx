import {Component, Prop} from "@stencil/core";

/**
 * Spinner component
 */
@Component({
  tag: 'quantum-spinner',
  styleUrl: 'quantum-spinner.scss',
  shadow: true
})
export class QuantumSpinner {
  @Prop() theme = 'light';

  render() {
    return <div class="wrapper">
      <div class={this.theme + " lds-ring"}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>;
  }
}
