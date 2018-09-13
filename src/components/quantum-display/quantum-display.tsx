import {Component, Element, Prop, Watch} from "@stencil/core";
import {Logger} from "../../utils/logger";
import {Param} from "../../model/param";
import {GTSLib} from "../../utils/gts.lib";
import {DataModel} from "../../model/dataModel";
import {ChartLib} from "../../utils/chart-lib";
/**
 * Display component
 */
@Component({
  tag: 'quantum-display',
  styleUrl: 'quantum-display.scss',
  shadow: true
})
export class QuantumDisplay {

  @Prop() unit: string = '';
  @Prop() displayTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() data: DataModel | any[] | string | number;
  @Prop() options: Param;
  @Prop() theme = 'light';
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';

  @Element() el: HTMLElement;

  private LOG: Logger = new Logger(QuantumDisplay);
  private toDisplay: string;
  private _options: Param;

  @Watch('data')
  private onData(newValue: DataModel | any[] | string | number, oldValue: DataModel | any[] | string | number) {
    if (oldValue !== newValue) {
      this.LOG.debug(['onData'], newValue);
      this.drawChart();
    }
  }

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if (oldValue !== newValue) {
      this.LOG.debug(['options'], newValue);
      this.drawChart();
    }
  }

  @Watch('theme')
  private onTheme(newValue: string, oldValue: string) {
    if (oldValue !== newValue) {
      this.LOG.debug(['onTheme'], newValue);
      this.drawChart();
    }
  }

  private drawChart() {
    this.LOG.debug(['drawChart'], [this.options, this._options]);
    this._options = ChartLib.mergeDeep(this._options, this.options);
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + 'px';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + 'px';
    if (this.data instanceof DataModel) {
      this.toDisplay = GTSLib.isArray(this.data.data)? this.data.data[0]: this.data.data;
    } else {
      this.toDisplay = GTSLib.isArray(this.data)? this.data[0]: this.data;
    }
    this.LOG.debug(['drawChart'], [this.data, this.toDisplay]);
  }

  private getStyle() {
    this.LOG.debug(['getStyle'], this._options);
    if (!this._options) {
      return {};
    } else {
      const style: any = {'background-color': this._options.bgColor || 'transparent'};
      if (this._options.fontColor) {
        style.color = this._options.fontColor;
      }
      this.LOG.debug(['getStyle', 'style'], style);
      return style;
    }
  }

  componentDidLoad() {
    this.LOG.debug(['componentDidLoad'], this._options);
    this.drawChart()
  }

  render() {
    return <div class={this.theme}>
      <h1>{this.displayTitle}</h1>
      {this.toDisplay && this.toDisplay !== '' ?
        <div class="chart-container" id="#wrapper">
          <div style={this.getStyle()}>
            <div class="value">
              {this.toDisplay}
              <small>{this.unit}</small>
            </div>
          </div>
        </div>
        :
        <quantum-spinner theme={this.theme}/>
      }
    </div>;
  }
}
