/*
 *  Copyright 2020  SenX S.A.S.
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

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {WarpViewComponent} from '../warp-view-component';
import {Param} from '../../model/param';
import {ChartLib} from '../../utils/chart-lib';
import {GTSLib} from '../../utils/gts.lib';
import {DataModel} from '../../model/dataModel';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {Subject} from 'rxjs';

/**
 *
 */
@Component({
  selector: 'warpview-gts-tree',
  templateUrl: './warp-view-gts-tree.component.html',
  styleUrls: ['./warp-view-gts-tree.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewGtsTreeComponent extends WarpViewComponent implements AfterViewInit {
  @ViewChild('root', {static: true}) root: ElementRef;

  @Input('kbdLastKeyPressed') kbdLastKeyPressed: string[] = [];

  @Input('gtsFilter') set gtsFilter(gtsFilter: string) {
    this._gtsFilter = gtsFilter;
  }

  get gtsFilter() {
    return this._gtsFilter;
  }

  @Output('warpViewSelectedGTS') warpViewSelectedGTS = new EventEmitter<any>();

  private _gtsFilter = 'x';
  gtsList: any[] = [];
  params: Param[] = [] as Param[];
  expand = false;

  initOpen: Subject<void> = new Subject<void>();
  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone
  ) {
    super(el, renderer, sizeService, ngZone);
    this.LOG = new Logger(WarpViewGtsTreeComponent, this._debug);
  }

  ngAfterViewInit(): void {
    this.LOG.debug(['componentDidLoad', 'data'], this._data);
    if (!!this._options.foldGTSTree && !this.expand) {
      this.foldAll();
    }
    if (!this._options.foldGTSTree) {
      this.initOpen.next();
    }
    if (this._data) {
      this.doRender();
    }
  }

  update(options: Param, refresh: boolean): void {
    if (!!this._options.foldGTSTree && !this.expand) {
      this.foldAll();
    }
    this.doRender();
  }

  private doRender() {
    this.LOG.debug(['doRender', 'gtsList'], this._data);
    if (!this._data) {
      return;
    }
    this._options = ChartLib.mergeDeep(this.defOptions, this._options) as Param;
    const dataList = GTSLib.getData(this._data).data;
    this.params = this._data.params || [];
    this.LOG.debug(['doRender', 'gtsList', 'dataList'], dataList);
    if (!dataList) {
      return;
    }
    this.expand = !this._options.foldGTSTree;
    this.gtsList = GTSLib.flattenGtsIdArray(dataList as any[], 0).res;
    this.LOG.debug(['doRender', 'gtsList'], this.gtsList, this._options.foldGTSTree, this.expand);
    this.loading = false;
    this.chartDraw.emit();
  }

  private foldAll() {
    if (!this.root) {
      setTimeout(() => this.foldAll());
    } else {
      this.expand = false;
    }
  }

  toggleVisibility() {
    this.expand = !this.expand;
  }

  protected convert(data: DataModel): any[] {
    return [];
  }

  warpViewSelectedGTSHandler(event) {
    this.LOG.debug(['warpViewSelectedGTS'], event);
    this.warpViewSelectedGTS.emit(event);
  }

}
