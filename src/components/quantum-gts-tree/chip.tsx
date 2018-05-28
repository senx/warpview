import {Component, Element, Prop} from "@stencil/core";

@Component({
  tag: 'quantum-chip',
  styleUrls: [
    'chip.scss'
  ]
})
export class QuantumChip {
  @Prop() color: string;
  @Element() el: HTMLElement;


  componentDidLoad() {
    (this.el.firstElementChild as HTMLElement).style.setProperty('background-color', this.color);
  }

  render() {
    return (
      <i class="normal"/>
    )
  }
}
