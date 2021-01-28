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
import {GTSLib} from '../../utils/gts.lib';
import {DataModel} from '../../model/dataModel';
import {SizeService} from '../../services/resize.service';
import {Logger} from '../../utils/logger';
import {Subject} from 'rxjs';
import {ColorLib} from '../../utils/color-lib';
import {ChartLib} from '../../utils/chart-lib';

@Component({
  selector: 'warpview-gts-tree',
  templateUrl: './warp-view-gts-tree.component.html',
  styleUrls: ['./warp-view-gts-tree.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WarpViewGtsTreeComponent extends WarpViewComponent implements AfterViewInit {
  @ViewChild('root', {static: true}) root: ElementRef;
  @ViewChild('tree', {static: true}) tree: ElementRef;

  @Input('kbdLastKeyPressed') kbdLastKeyPressed: string[] = [];
  private dataList: any[];

  @Input('gtsFilter') set gtsFilter(gtsFilter: string) {
    this._gtsFilter = gtsFilter;
  }

  get gtsFilter() {
    return this._gtsFilter;
  }


  @Input('hiddenData') set hiddenData(hiddenData: number[]) {
    this.LOG.debug(['hiddenData'], hiddenData, this.gtsList);
    this._hiddenData = hiddenData;
    (this.dataList || []).forEach(item => {
      (this._hiddenData || []).some(id => item.gid === id) ? this.hideChip(item) : this.showChip(item);
    });
  }

  get hiddenData(): number[] {
    return this._hiddenData;
  }

  @Output('warpViewSelectedGTS') warpViewSelectedGTS = new EventEmitter<any>();

  private _gtsFilter = 'x';
  gtsList: any[] = [];
  params: Param[] = [] as Param[];
  initOpen: Subject<void> = new Subject<void>();

  constructor(
    public el: ElementRef,
    public renderer: Renderer2,
    public sizeService: SizeService,
    public ngZone: NgZone,
  ) {
    super(el, renderer, sizeService, ngZone);
    this.LOG = new Logger(WarpViewGtsTreeComponent, this._debug);
  }

  ngAfterViewInit(): void {
    this.LOG.debug(['componentDidLoad', 'data'], this._data);
    if (this._data) {
      this.doRender();
    }
  }

  update(options: Param, refresh: boolean): void {
    this.doRender();
  }

  private doRender() {
    this.LOG.debug(['doRender', 'gtsList'], this._data);
    if (!this._data) {
      return;
    }
    this._options = ChartLib.mergeDeep(this.defOptions, this._options) as Param;
    this.dataList = this.generateData([
      GTSLib.flattenGtsIdArray(GTSLib.getData(this._data).data as any [], 0).res
    ]);
    this.addOrphans();
    this.params = this._data.params || [];
    this.LOG.debug(['doRender', 'gtsList', 'dataList'], this.dataList);
    this.chartDraw.emit();
  }

  protected convert(data: DataModel): any[] {
    return [];
  }

  public resize(layout: { width: number; height: any }) {
    //
  }

  orphans() {
    return this.dataList.filter(item => !item.parent);
  }

  hasChildren(parentId) {
    return this.dataList.some(item => item.parent === parentId);
  }

  getChildren(parentId) {
    return this.dataList.filter(item => item.parent === parentId);
  }

  switchPlotState(evt) {
    console.log('evt', evt);
  }

  generateListItem(item) {
    const li = this.renderer.createElement('li');
    li.id = 'item-' + item.id;
    if (this.hasChildren(item.id)) {
      const a = this.renderer.createElement('a');
      a.href = '#';
      a.textContent = `${item.name}`;
      a.classList.add('plus');
      a.addEventListener('click', e => this.toggle(e, a, li));
      this.renderer.appendChild(li, a);
      const loader = this.renderer.createElement('div');
      loader.classList.add('loader');
      loader.classList.add('hidden');
      this.renderer.appendChild(li, loader);
    } else {
      const span = this.renderer.createElement('span') as HTMLSpanElement;
      const color = ColorLib.getColor(item.gid, this._options.scheme);
      span.innerHTML = `<i class="chip"
style="background-color: ${this._hiddenData.some(id => id === item.gid) ? 'transparent' : color};border: 2px solid ${color};"></i>
&nbsp;${GTSLib.formatLabel(item.name)}`;
      span.addEventListener('click', e => this.select(item.id));
      this.renderer.appendChild(li, span);
    }
    return li;
  }

  private toggle(event, a: HTMLAnchorElement, parentLi: HTMLLIElement) {
    event.preventDefault();
    event.stopPropagation();
    if (a.classList.contains('plus')) {
      const loader = parentLi.querySelector('.loader');
      this.renderer.removeClass(loader, 'hidden');
      a.classList.remove('plus');
      a.classList.add('minus');
      const ul = this.renderer.createElement('ul');
      parentLi.appendChild(ul);
      setTimeout(() => {
        (() => new Promise(resolve => {
          const id = parentLi.id.replace('item-', '');
          const kids = this.getChildren(id);
          const size = kids.length;
          for (let i = 0; i < size; i++) {
            ul.appendChild(this.generateListItem(kids[i] as HTMLLIElement));
          }
          resolve();
        }))().then(() => {
          this.renderer.addClass(loader, 'hidden');
        });
      });
    } else {
      const ul = parentLi.querySelector('ul');
      parentLi.removeChild(ul);
      a.classList.remove('minus');
      a.classList.add('plus');
    }
  }

  addOrphans() {
    const root = this.tree.nativeElement as HTMLDivElement;
    if (root.hasChildNodes()) {
      for (let i = 0; i < root.childElementCount; i++) {
        root.children.item(i).remove();
      }
    }
    const orphansArray = this.orphans();
    if (orphansArray.length) {
      const items = orphansArray.map(this.generateListItem.bind(this));
      const ul = this.renderer.createElement('ul');
      items.forEach(li => ul.appendChild(li as Node));
      root.appendChild(ul);
    }
  }

  private generateData(res: any[], parent?: any) {
    let root = [];
    res.forEach(item => {
      if (GTSLib.isGts(item)) {
        root.push({
          id: GTSLib.uuidv4(),
          name: GTSLib.serializeGtsMetadata(item),
          gid: item.id,
          parent
        });
      } else if (GTSLib.isArray(item)) {
        const p = GTSLib.uuidv4();
        root.push({
          id: p,
          name: `List of ${item.length} element${item.length > 1 ? 's' : ''}`,
          parent
        });
        root = root.concat(this.generateData(item, p));
      }
    });
    return root;
  }

  private select(id) {
    const selected = this.dataList.find(g => g.id === id);
    const inActive = this._hiddenData.some(i => i === selected.gid);
    if (inActive) {
      this._hiddenData = this._hiddenData.filter(i => i === selected.gid);
      this.showChip(selected);
    } else {
      this._hiddenData.push(selected.gid);
      this.hideChip(selected);
    }
    this.warpViewSelectedGTS.emit({selected: inActive, gts: {id: selected.gid, name: selected.name}});
  }

  private hideChip(item) {
    const li = this.tree.nativeElement.querySelector('#item-' + item.id);
    if (!!li) {
      const chip = li.querySelector('.chip');
      if (chip) {
        this.renderer.setStyle(chip, 'background-color', 'transparent');
      }
    }
  }

  private showChip(item) {
    const li = this.tree.nativeElement.querySelector('#item-' + item.id);
    if (!!li) {
      const chip = li.querySelector('.chip');
      if (chip) {
        this.renderer.setStyle(chip, 'background-color', ColorLib.getColor(item.gid, this._options.scheme));
      }
    }
  }
}
