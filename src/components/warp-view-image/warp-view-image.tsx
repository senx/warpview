/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import { Component, Element, Listen, Prop, Watch } from "@stencil/core";
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { GTSLib } from "../../utils/gts.lib";
import { DataModel } from "../../model/dataModel";
import { ChartLib } from "../../utils/chart-lib";

/**
 * Display component
 */
@Component({
  tag: 'warp-view-image',
  styleUrl: 'warp-view-image.scss',
  shadow: true
})
export class WarpViewImage {
  @Prop() imageTitle: string = '';
  @Prop() responsive: boolean = false;
  @Prop() data: DataModel | any[] | string;
  @Prop() options: Param = new Param();
  @Prop({ mutable: true }) width = '';
  @Prop({ mutable: true }) height = '';

  @Element() el: HTMLElement;

  private LOG: Logger = new Logger(WarpViewImage);
  private _options: Param = new Param();
  private toDisplay: string[];
  private resizeTimer;

  @Listen('window:resize')
  onResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.LOG.debug([ 'onResize' ], this.el.parentElement.clientWidth);
      this.drawChart();
    }, 250);
  }

  @Watch('data')
  private onData(newValue: DataModel | any[] | string | number, oldValue: DataModel | any[] | string | number) {
    if(oldValue !== newValue) {
      this.LOG.debug([ 'onData' ], newValue);
      this.drawChart();
    }
  }

  @Watch('options')
  private onOptions(newValue: Param, oldValue: Param) {
    if(oldValue !== newValue) {
      this.LOG.debug([ 'options' ], newValue);
      this.drawChart();
    }
  }

  private drawChart() {
    this.LOG.debug([ 'drawChart' ], [ this.options, this._options ]);
    this._options = ChartLib.mergeDeep(this._options, this.options);
    this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + 'px';
    this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + 'px';
    this.toDisplay = [];
    if(!this.data) return;
    let gts: any = this.data;
    if(typeof gts === 'string') {
      try {
        gts = JSON.parse(gts as string);
      } catch(error) {
        // empty : it's a base64 string
      }
    }
    if(gts instanceof DataModel || gts.hasOwnProperty('data')) {
      if(gts.data && gts.data.length > 0 && GTSLib.isEmbeddedImage(gts.data[ 0 ])) {
        this._options = ChartLib.mergeDeep(this._options, gts.globalParams || {});
        this.toDisplay.push(gts.data[ 0 ]);
      } else if(gts.data && GTSLib.isEmbeddedImage(gts.data)) {
        this.toDisplay.push(gts.data as string);
      }
    } else {
      if(GTSLib.isArray(gts)) {
        (gts as string[]).forEach(d => {
          if(GTSLib.isEmbeddedImage(d)) {
            this.toDisplay.push(d)
          }
        })
      }
    }
    this.LOG.debug([ 'drawChart' ], [ this.data, this.toDisplay ]);
  }

  private getStyle() {
    this.LOG.debug([ 'getStyle' ], this._options);
    if(!this._options) {
      return {};
    } else {
      const style: any = { 'background-color': this._options.bgColor || 'transparent' };
      if(this._options.fontColor) {
        style.color = this._options.fontColor;
      }
      this.LOG.debug([ 'getStyle', 'style' ], style);
      return style;
    }
  }

  componentDidLoad() {
    this.LOG.debug([ 'componentDidLoad' ], this._options);
    this.drawChart()
  }

  render() {
    return <div>
      {this.toDisplay ?
        <div class="chart-container" id="#wrapper">
          {this.toDisplay.map((img) =>
            <div style={this.getStyle()}>
              <img src={img} class="responsive" alt="Result"/>
            </div>
          )}
        </div>
        :
        <warp-view-spinner/>
      }
    </div>;
  }
}
