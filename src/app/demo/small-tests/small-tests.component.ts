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

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SettingsService} from '../../../../projects/warpview-ng/src/lib/services/settings.service';

@Component({
  selector: 'warpview-small-tests',
  templateUrl: './small-tests.component.html',
  styleUrls: ['./small-tests.component.scss']
})
export class SmallTestsComponent implements OnInit {


  theme = 'light';
  options: any = {
    gridLineColor: '#000000',
    fontColor: '#000000',
    mapType: 'DEFAULT',
    showControls: false,
    showGTSTree: true,
    foldGTSTree: true,
    autoRefresh: -1
  };

  tests = [
    {
      title: 'Test 1',
      type: 'line',
      unit: '',
      warpscript: `'gM8Eegu4DhBFyDsVZaD7w7kHpLXtX1xrfDzv5d7.fZFvq3wlk1EIKxCBeq5bkhDlQuStFL7Lvz4V51HpnkRhM58SWkPcBx2kgmTR9mJZJbYyiojVIOruuZWEoSED.M6Lppi0NkmkwSkZwisjrxyV7V' 'TOKEN' STORE
        $TOKEN AUTHENTICATE 100000000 LIMIT

        '2018-03-11T23:59:59Z' TOTIMESTAMP 'now' STORE
        1 d  'duration' STORE

        // LFRB
        //48 26.83  60.0 / + -4 25.30 60.0 / - 5000 @senx/geo/circle
        // LFPG 370 CGZ
        //49 0.3 60.0 / + 2 44.4 60.0 / + 1000 @senx/geo/circle
        // BODIL
        //48.523167 -4.085917 2000 @senx/geo/circle
        //48.0 -4.5 2000 @senx/geo/circle
        //0.01 false GEO.WKT 'area' STORE $area
        //'POLYGON((-4.6 48, -4.6 48.5, -4 48.5, -4 48, -4.6 48))' 0.01 false GEO.WKT
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:max-line-length
        'POLYGON((-1.56280517578125 51.90530737927636,-1.5655517578125 51.146617353835516, 0.60150146484375 51.163844261348224, 0.5740356445312499 51.91039070988962,  -1.56280517578125 51.90530737927636))' 0.01 false GEO.WKT
        'area' STORE $area
        8 GEO.OPTIMIZE 0 GEO.OPTIMIZE GEO.REGEXP '~(' SWAP + ')' + 're' STORE
        [ $TOKEN 'opticon' { 'cell' $re } $now $duration ] FETCH

        //
        // Area around London
        //



        //
        // Now extract the ICAOs
        //

        [] 'icao' STORE
        [ SWAP
        <%
        7 GET 0 GET
        UNWRAP TICKLIST
        $icao SWAP +! DROP
        0 NaN NaN NaN NULL
        %>
        MACROMAPPER
        0 0 0 ] MAP
        DROP
        $icao FLATTEN ->SET SET->
        <% DROP TOSTRING %> LMAP
        REOPTALT 're' STORE
        [ $TOKEN 'adsbexchange' { 'opticonid' '~' $re + } $now $duration ] FETCH

        //
        // Identify the series which actually crossed the search area
        //
        [] SWAP
        <%
        'gts' STORE $gts $area GEO.INTERSECTS <% $gts +! %> IFT
        %> FOREACH

        // Keep only those datapoints within the area
        [ SWAP $area mapper.geo.within 0 0 0 ] MAP

        5000 LOCATIONOFFSET`
    }];
  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService) {
    settingsService.settingsAdded$.subscribe(evt => {
      this.theme = evt.settings.theme;
      if (evt.settings.theme === 'dark') {
        this.options.mapType = 'DEFAULT';
        this.options.gridLineColor = '#ffffff';
      } else {
        this.options.mapType = 'DEFAULT';
        this.options.gridLineColor = '#000000';
      }
      this.options = {...this.options};
    });
  }

  ngOnInit() {
  }

  manageTheme() {
    return {
      'text-white': (this.theme === 'dark'),
      'bg-light': this.theme === 'light',
      'bg-dark': this.theme === 'dark'
    };
  }
}
