import {Component, Element, Listen, Prop, Watch} from "@stencil/core";
import {Logger} from "../../utils/logger";
import {Param} from "../../model/param";
import {GTSLib} from "../../utils/gts.lib";
import {DataModel} from "../../model/dataModel";
import {ChartLib} from "../../utils/chart-lib";
/**
 * Display component
 */
@Component({
  tag: 'quantum-image',
  styleUrl: 'quantum-image.scss',
  shadow: true
})
export class QuantumImage {
  @Prop() imageTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() data: DataModel | any[] | string;
  @Prop() options: Param = new Param();
  @Prop({mutable: true}) width = '';
  @Prop({mutable: true}) height = '';

  @Element() el: HTMLElement;

  private LOG: Logger = new Logger(QuantumImage);
  private _options: Param = new Param();
  private toDisplay: string[];
  private resizeTimer;

  @Listen('window:resize')
  onResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.LOG.debug(['onResize'], this.el.parentElement.clientWidth);
      this.drawChart();
    }, 250);
  }

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

  private drawChart() {
    this.LOG.debug(['drawChart'], [this.options, this._options]);
    this._options = ChartLib.mergeDeep(this._options, this.options);
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + 'px';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + 'px';
    this.toDisplay = [];
    if (this.data instanceof DataModel) {
      if(this.data.data && this.data.data.length > 0 && GTSLib.isEmbeddedImage(this.data.data[0])) {
        this.toDisplay.push(this.data.data[0]);
      } else if(this.data.data && GTSLib.isEmbeddedImage(this.data.data)) {
        this.toDisplay.push(this.data.data as string);
      }
    } else {
      if(GTSLib.isArray(this.data)) {
        (this.data as string[]).forEach(d => {
          if(GTSLib.isEmbeddedImage(d)) {
            this.toDisplay.push(d)
          }
        })
      }
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
    return <div>
      {this.toDisplay ?
        <div class="chart-container" id="#wrapper">
          {this.toDisplay.map((img) =>
              <div style={this.getStyle()}>
                <img src={img} class="responsive"/>
              </div>
          )}
        </div>
        :
        <quantum-spinner />
      }
    </div>;
  }
}
