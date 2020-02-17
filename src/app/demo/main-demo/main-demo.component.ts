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

/* tslint:disable:max-line-length */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {SettingsService} from '../../../../projects/warpview-ng/src/lib/services/settings.service';
import {Param} from '../../../../projects/warpview-ng/src/lib/model/param';
import moment from 'moment';

@Component({
  selector: 'warpview-main-demo',
  templateUrl: './main-demo.component.html',
  styleUrls: ['./main-demo.component.scss']
})
export class MainDemoComponent implements OnInit, OnDestroy {
  demo = {
    default: [
      {
        title: 'Default behaviour',
        type: 'plot',
        warpscript: `@training/dataset0
        // warp.store.hbase.puts.committed is the number of datapoints committed to
// HBase since the restart of the Store daemon
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 10 d ] FETCH
[ SWAP mapper.rate 1 0 0 ] MAP
// Keep only 1000 datapoints per GTS
1000 LTTB DUP
// Detect 5 anomalies per GTS using an ESD (Extreme Studentized Deviate) Test
5 false ESDTEST
// Convert the ticks identified by ESDTEST into an annotation GTS
<%
  DROP // excude element index
  NEWGTS // create a new GTS
  SWAP // get timestamp list
  <% NaN NaN NaN 'anomaly' ADDVALUE %> FOREACH // for each timestamp
%> LMAP 2 ->LIST // Put our GTS in a list
ZIP // merge into a list of GTS
// Now rename and relabel the anomaly GTS
<%
  DROP // exclude element index
  LIST-> // flatten list
  DROP // exclude number of elements of our list
  SWAP // put our fetched GTS on the top
  DUP // duplicate the GTS
  NAME // get the className of the GTS
  ':anomaly' + 'name' STORE // suffix the name
  DUP LABELS 'labels' STORE // duplicate the GTS and get labels
  SWAP // put the anomaly GTS on the top of the stack
  $name RENAME // rename the GTS
  $labels RELABEL // put labels
  2 ->LIST // put both GTS in a list
%> LMAP`
      }],
    chart: [
      {
        title: 'Plot',
        type: 'plot',
        warpscript: `[
  NEWGTS 'Date' RENAME // Commenting that makes it work
  1000 NaN NaN NaN 2.5 ADDVALUE
  2000 NaN NaN NaN 2.5 ADDVALUE
  3000 NaN NaN NaN 2.5 ADDVALUE
  4000 NaN NaN NaN 2.5 ADDVALUE

  NEWGTS '1' RENAME
  1000 NaN NaN NaN 1 ADDVALUE
  2000 NaN NaN NaN 2 ADDVALUE
  3000 NaN NaN NaN 3 ADDVALUE
  4000 NaN NaN NaN 4 ADDVALUE

  NEWGTS '1' RENAME
  1000 NaN NaN NaN 4 ADDVALUE
  2000 NaN NaN NaN 3 ADDVALUE
  3000 NaN NaN NaN 2 ADDVALUE
  4000 NaN NaN NaN 1 ADDVALUE
]`
      },
      {
        title: 'Line chart',
        type: 'line',
        warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -20 ] FETCH
false RESETS
[ SWAP mapper.delta 1 0 0 ] MAP`
      }, {
        title: 'Area chart',
        type: 'area',
        warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -20 ] FETCH
false RESETS
[ SWAP mapper.delta 1 0 0 ] MAP 'data' STORE
{
  'data' $data
  'params' [ { 'datasetColor' '#d05ce3' } { 'datasetColor' '#ff80ab' } { 'datasetColor' '#4db6ac' } ]
  'globalParams' { 'showRangeSelector' false }
}`
      }, {
        title: 'Smooth chart',
        type: 'spline',
        warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH
false RESETS
[ SWAP mapper.delta 1 0 0 ] MAP`
      }, {
        title: 'Step chart',
        type: 'step',
        warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH
false RESETS
[ SWAP mapper.delta 1 0 0 ] MAP`
      }, {
        title: 'Scatter chart',
        type: 'scatter',
        warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH
false RESETS
[ SWAP mapper.delta 1 0 0 ] MAP`
      }],
    box: [
      {
        title: 'Box chart',
        type: 'box',
        warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' 'dc' 'rbx4' } $NOW 2 d ] FETCH
false RESETS
[ SWAP mapper.delta 1 0 0 ] MAP
[ SWAP bucketizer.mean $NOW 1 h 0 ] BUCKETIZE
'data' STORE
{ 'data' $data 'globalParams' { 'showDots' true } }`
      }, {
        title: 'Box chart by date',
        type: 'box-date',
        warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod'  'dc' 'rbx4'  } $NOW 1 d ] FETCH
false RESETS
[ SWAP mapper.delta 1 0 0 ] MAP
[ SWAP bucketizer.mean $NOW 1 h 0 ] BUCKETIZE
'data' STORE
{ 'data' $data 'globalParams' { 'split' 'D' } }`
      }],
    bar: [{
      title: 'Bar chart',
      type: 'bar',
      warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH
false RESETS
[ SWAP bucketizer.last $NOW 1 m 0 ] BUCKETIZE
[ SWAP mapper.delta 1 0 0 ] MAP 'values' STORE
{ 'data' $values }`
    }, {
      title: 'Horizontal Stacked Bar chart',
      type: 'bar',
      warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -10 ] FETCH
false RESETS
[ SWAP bucketizer.last $NOW 1 m 0 ] BUCKETIZE
[ SWAP mapper.delta 1 0 0 ] MAP 'values' STORE
{ 'data' $values 'globalParams' { 'horizontal' true 'stacked' true } }`
    }, {
      title: 'Horizontal Stacked Bar chart With custom data',
      type: 'bar',
      warpscript: `{
'title' 'Test'
'columns'  [ 'A' 'B' 'C' 'D' ]
'rows' [
  [ 'label X' 15 56 44 22 ]
  [ 'label Y' 1 5 4 2 ]
  [ 'label Z' 14 45 78 12 ]
]
} 'values' STORE
{ 'data' $values 'globalParams' { 'horizontal' true 'stacked' true } }`
    }],
    line3d: [{
      title: '3D line chart',
      type: 'line3d',
      warpscript: `0 5 <% 'j' STORE
  NEWGTS 'serie' $j TOSTRING + RENAME 'gts' STORE
  0 10 <%
    'i' STORE
    $gts NOW $i 1000 * - 40 RAND - -4 RAND - 1000 RAND * T ADDVALUE DROP
  %> FOR
  $gts
%> FOR`
    }],
    bubble: [{
      title: 'Bubble chart',
      type: 'bubble',
      warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -30 ] FETCH
false RESETS
[ SWAP bucketizer.last $NOW 1 m 0 ] BUCKETIZE
10 LTTB
<% DROP 'gts' STORE { $gts NAME $gts VALUES <% DROP 'val' STORE [ RAND 100 *
RAND 100 * RAND 100 * ]
%>
LMAP
}
%> LMAP 'values' STORE
{ 'data' $values }`
    }],
    spectrum: [
      {
        title: 'Spectrum chart / contour by density',
        type: 'histogram2dcontour',
        warpscript: `@training/dataset0
[ $TOKEN '~linux.*running' { 'cell' 'prod' 'rack' '~55b.*' } $NOW 1 h ] FETCH 'data' STORE
{
  'data' $data
  'globalParams' {
    'histo' {
      'histnorm' 'density'
      'histfunc' 'count'
    }
  }
}`
      },
      {
        title: 'Spectrum chart / contour by percent',
        type: 'histogram2dcontour',
        warpscript: `@training/dataset0
[ $TOKEN '~linux.*running' { 'cell' 'prod' 'rack' '~55b.*' } $NOW 1 h ] FETCH MERGE 'data' STORE
{ 'data' $data 'globalParams' { 'histo' { 'histnorm' 'percent' 'histfunc' 'avg' } } }`
      },
      {
        title: 'Spectrum chart / contour by probability',
        type: 'histogram2dcontour',
        warpscript: `@training/dataset0
[ $TOKEN '~linux.*running' { 'cell' 'prod' 'rack' '~55b.*' } $NOW 1 h ] FETCH MERGE 'data' STORE
{ 'data' $data 'globalParams' { 'histo' { 'histnorm' 'probability' 'histfunc' 'max' } } }`
      },
      {
        title: 'Spectrum chart / histogram by density',
        type: 'histogram2d',
        warpscript: `@training/dataset0
[ $TOKEN '~linux.*running' { 'cell' 'prod' 'rack' '~55b.*' } $NOW 1 h ] FETCH MERGE 'data' STORE
{ 'data' $data 'globalParams' { 'histo' { 'histnorm' 'density' 'histfunc' 'count' } } }`
      },
      {
        title: 'Spectrum chart / histogram by percent',
        type: 'histogram2d',
        warpscript: `@training/dataset0
[ $TOKEN '~linux.*running' { 'cell' 'prod' 'rack' '~55b.*' } $NOW 1 h ] FETCH MERGE 'data' STORE
{ 'data' $data 'globalParams' { 'histo' { 'histnorm' 'percent' 'histfunc' 'avg' } } }`
      },
      {
        title: 'Spectrum chart / histogram by probability',
        type: 'histogram2d',
        warpscript: `@training/dataset0
[ $TOKEN '~linux.*running' { 'cell' 'prod' 'rack' '~55b.*' } $NOW 1 h ] FETCH MERGE 'data' STORE
{ 'data' $data 'globalParams' { 'histo' { 'histnorm' 'probability' 'histfunc' 'max' } } }`
      },
    ],
    datagrid: [{
      title: 'Data grid',
      type: 'datagrid',
      warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 1 d ] FETCH
'data' STORE
{ 'data' $data 'globalParams' { 'headers' [ 'A' 'B' ] } 'params' [ { 'headers' [ 'C' 'D' ] } ] }`
    }, {
      title: 'Data grid custom data',
      type: 'datagrid',
      warpscript: `{
'title' 'Test'
'columns'  [ 'A' 'B' 'C' 'D' ]
'rows' [
  [ 'label X' 15 56 44 22 ]
  [ 'label Y' 1 5 4 2 ]
  [ 'label Z' 14 45 78 12 ]
]
} 'values' STORE
{ 'data' $values }`
    }],
    display: [{
      title: 'Data display',
      type: 'display',
      warpscript: ` { 'data' 42 'globalParams' {
  'timeMode' 'custom'
  'bgColor' 'darkblue'
  'fontColor' 'cyan'
} }`,
      unit: '°C'
    }, {
      title: 'Data display Date',
      type: 'display',
      warpscript: ` { 'data' NOW 'globalParams' { 'timeMode' 'date' } }`,
    }, {
      title: 'Data display Duration',
      type: 'display',
      warpscript: ` { 'data' NOW 5 s - 'globalParams' { 'timeMode' 'duration' } }`,
    }, {
      title: 'Data display long text',
      type: 'display',
      warpscript: `{
        'data'
        <'
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent iaculis dictum dolor sit amet dapibus. Vivamus mattis elit eu
        pretium porttitor. Duis eleifend gravida tortor eu tempus. Mauris dui arcu, ultricies et lobortis pharetra, pulvinar quis velit.
        Maecenas vitae felis a nisi mollis consectetur at et lectus. Nullam sit amet ex pellentesque, aliquet velit quis, tempus ex.
        Vestibulum vel nunc augue. Curabitur sagittis vitae justo non lobortis. Maecenas porttitor nisl id augue feugiat hendrerit.
        '>
        'globalParams' { 'bgColor' '#1e88e5' 'fontColor' 'white' 'timeMode' 'custom' } }`,
    }, {
      title: 'Data display HTML',
      type: 'display',
      warpscript: `{
  'data' '<a href="https://warp10.io/" target="_blank">Warp 10</a>'
  'globalParams' { 'bgColor' '#f57f17' 'fontColor' '#bc5100' 'timeMode' 'custom' }
}`,
    }
    ],
    drilldown: [{
      title: 'Drill down',
      type: 'drilldown',
      warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 700 d ] FETCH
false RESETS
[ SWAP mapper.delta 1 0 0 ] MAP
[ SWAP bucketizer.mean $NOW 1 h 0 ] BUCKETIZE
[ NaN NaN NaN 0 ] FILLVALUE`
    }],
    'gts-tree': [{
      title: 'GTS tree',
      type: 'gts-tree',
      warpscript: `@training/dataset0
// warp.store.hbase.puts.committed is the number of datapoints committed to
// HBase since the restart of the Store daemon
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 10 d ] FETCH
[ SWAP mapper.rate 1 0 0 ] MAP
// Keep only 1000 datapoints per GTS
1000 LTTB DUP
// Detect 5 anomalies per GTS using an ESD (Extreme Studentized Deviate) Test
5 false ESDTEST
// Convert the ticks identified by ESDTEST into an annotation GTS
<%
  DROP // excude element index
  NEWGTS // create a new GTS
  SWAP // get timestamp list
  <% NaN NaN NaN 'anomaly' ADDVALUE %> FOREACH // for each timestamp
%> LMAP 2 ->LIST // Put our GTS in a list
ZIP // merge into a list of GTS
// Now rename and relabel the anomaly GTS
<%
  DROP // exclude element index
  LIST-> // flatten list
  DROP // exclude number of elements of our list
  SWAP // put our fetched GTS on the top
  DUP // duplicate the GTS
  NAME // get the className of the GTS
  ':anomaly' + 'name' STORE // suffix the name
  DUP LABELS 'labels' STORE // duplicate the GTS and get labels
  SWAP // put the anomaly GTS on the top of the stack
  $name RENAME // rename the GTS
  $labels RELABEL // put labels
  2 ->LIST // put both GTS in a list
%> LMAP`
    }],
    map: [{
      title: 'Map',
      type: 'map',
      warpscript: `'{"data":[{"c":"A","l":{},"a":{},"v":[[1460540141224657,51.45877850241959,-0.01000002957880497,1000,8.090169943749475],[1460540131224657,51.49510562885553,-0.02000005915760994,1000,3.0901699437494745],[1460540121224657,51.49510562885553,-0.030000004917383194,1000,-3.0901699437494736],[1460540111224657,51.45877850241959,-0.040000034496188164,1000,-8.090169943749473],[1460540101224657,51.39999998733401,-0.050000064074993134,1000,-10.0],[1460540091224657,51.341221472248435,-0.06000000983476639,1000,-8.090169943749475],[1460540081224657,51.3048943458125,-0.07000003941357136,1000,-3.0901699437494754],[1460540071224657,51.3048943458125,-0.08000006899237633,1000,3.0901699437494723],[1460540061224657,51.341221472248435,-0.09000001475214958,1000,8.090169943749473],[1460540051224657,51.39999998733401,-0.10000004433095455,1000,10.0]]},{"c":"B","l":{},"a":{},"v":[[1460540141224657,51.49999998975545,-0.10000004433095455,10],[1460540131224657,51.45999999716878,-0.09000001475214958,9],[1460540121224657,51.41999996267259,-0.08000006899237633,8],[1460540111224657,51.39999998733401,-0.07000003941357136,7],[1460540101224657,51.439999979920685,-0.06000000983476639,6],[1460540091224657,51.47999997250736,-0.050000064074993134,8],[1460540081224657,51.49999998975545,-0.030000004917383194,10],[1460540071224657,51.51999996509403,-0.02000005915760994,9],[1460540061224657,51.539999982342124,-0.01000002957880497,8],[1460540051224657,51.55999999959022,0.0,9]]},{"c":"D","l":{},"a":{},"v":[[1460540141224657,51.49999998975545,-0.10000004433095455,"a"],[1460540131224657,51.45999999716878,-0.09000001475214958,"b"],[1460540121224657,51.41999996267259,-0.08000006899237633,"c"],[1460540111224657,51.39999998733401,-0.07000003941357136,"d"]]},{"c":"E","l":{},"a":{},"v":[[1460540136224657,51.439999979920685,0.05999992601573467,true],[1460540116224657,51.47999997250736,0.04999998025596142,false],[1460540096224657,51.49999998975545,0.02999992109835148,true],[1460540076224657,51.51999996509403,0.019999975338578224,false],[1460540056224657,51.539999982342124,0.009999945759773254,true]]},{"positions":[[51.5,-0.22],[51.46,-0.3],[51.42,-0.2]]},{"positions":[[51.2,-0.12,42],[51.36,-0.0,21],[51.32,-0.2,84]]},{"positions":[[51.2,-0.52,42],[51.36,-0.4,21],[51.32,-0.6,84]]},{"positions":[[51.1,-0.52,42,10],[51.56,-0.4,21,30],[51.42,-0.6,84,40],[51.3,-0.82,42,1],[51.76,-0.7,21,20],[51.62,-0.9,84,45]]}],"params":[{"key":"Path A"},{"key":"Path B"},{"key":"Annotations (text)","render":"marker","marker":"lodging"},{"key":"Annotations (boolean)","baseRadius":5},{"key":"Test","render":"marker"},{"key":"points 2","render":"dots","color":"#ffa","borderColor":"#f00","baseRadius":5},{"key":"points","render":"weightedDots","color":"#aaf","borderColor":"#f00","maxValue":100,"minValue":0,"baseRadius":5,"numSteps":10},{"key":"coloredWeightedDots","render":"coloredWeightedDots","maxValue":100,"minValue":0,"baseRadius":5,"maxColorValue":50,"minColorValue":0,"numColorSteps":10,"startColor":"#ff0000","endColor":"#00ff00"}]}'
                    JSON->`
    }, {
      title: 'GeoJSON',
      type: 'map',
      warpscript: `<'
{
"data" : [
  {
    "type":"Feature",
    "properties": {
      "nom":"Guipavas",
      "code":"29075",
      "codeDepartement":"29",
      "codeRegion":"53",
      "codesPostaux":["29490"],
      "population":13966
    },
    "geometry": {
      "type":"Polygon",
      "coordinates":[[[-4.4591,48.42489],[-4.45799,48.42546],[-4.45508,48.42746],[-4.45315,48.42809],[-4.45282,48.42888],[-4.45022,48.42845],[-4.44958,48.42921],[-4.44738,48.43051],[-4.44684,48.43064],[-4.44717,48.43129],[-4.44579,48.43174],[-4.44438,48.43195],[-4.444,48.43229],[-4.44185,48.4327],[-4.44407,48.43553],[-4.44203,48.43675],[-4.44195,48.43704],[-4.44136,48.4372],[-4.44179,48.43768],[-4.44184,48.43844],[-4.44246,48.43844],[-4.44239,48.4389],[-4.44266,48.43899],[-4.44238,48.44022],[-4.4419,48.44023],[-4.44179,48.44093],[-4.44117,48.44151],[-4.44087,48.44256],[-4.44104,48.4429],[-4.44064,48.4437],[-4.44094,48.4448],[-4.44167,48.44519],[-4.44191,48.44576],[-4.44056,48.44606],[-4.43965,48.4467],[-4.44001,48.44698],[-4.43899,48.44765],[-4.43853,48.44775],[-4.43693,48.44739],[-4.43481,48.44603],[-4.43312,48.44579],[-4.43304,48.44598],[-4.43153,48.44623],[-4.43151,48.4481],[-4.43059,48.44799],[-4.43008,48.44946],[-4.43044,48.45017],[-4.43018,48.45163],[-4.43242,48.45258],[-4.433,48.45174],[-4.4335,48.45186],[-4.43256,48.45487],[-4.43215,48.4572],[-4.43099,48.45919],[-4.42995,48.45832],[-4.42901,48.45842],[-4.42612,48.45824],[-4.42593,48.45886],[-4.42453,48.4584],[-4.42376,48.45937],[-4.42296,48.4589],[-4.42266,48.45925],[-4.42116,48.45887],[-4.41971,48.45892],[-4.41879,48.4585],[-4.41815,48.45891],[-4.41753,48.45886],[-4.41691,48.45924],[-4.41713,48.46063],[-4.41684,48.46073],[-4.41509,48.46081],[-4.41163,48.4606],[-4.41001,48.46087],[-4.41005,48.46127],[-4.40954,48.46166],[-4.40943,48.46147],[-4.40819,48.46118],[-4.40815,48.46103],[-4.40665,48.46084],[-4.40373,48.46098],[-4.40348,48.46104],[-4.40334,48.46169],[-4.40405,48.4627],[-4.40304,48.46284],[-4.40214,48.46328],[-4.40057,48.46435],[-4.40024,48.46519],[-4.39977,48.46529],[-4.39922,48.46468],[-4.39716,48.4638],[-4.39498,48.46363],[-4.39268,48.46251],[-4.39172,48.46242],[-4.3901,48.46177],[-4.38992,48.46096],[-4.39037,48.45998],[-4.38753,48.46052],[-4.38767,48.46009],[-4.38718,48.45981],[-4.38631,48.45873],[-4.38398,48.45923],[-4.37997,48.46124],[-4.37943,48.46035],[-4.37991,48.46006],[-4.38103,48.45982],[-4.38046,48.45912],[-4.37946,48.4595],[-4.37912,48.45865],[-4.37937,48.45776],[-4.37839,48.45707],[-4.37684,48.45526],[-4.37616,48.45431],[-4.37613,48.45374],[-4.37475,48.45316],[-4.37249,48.45395],[-4.36912,48.45482],[-4.36707,48.45566],[-4.36229,48.45698],[-4.36204,48.45635],[-4.36131,48.45556],[-4.35823,48.45497],[-4.35672,48.45437],[-4.35529,48.45403],[-4.35269,48.45382],[-4.35096,48.4539],[-4.35074,48.45323],[-4.35204,48.45241],[-4.35164,48.45201],[-4.35167,48.45152],[-4.3511,48.45088],[-4.35015,48.45046],[-4.34986,48.45076],[-4.34866,48.4505],[-4.34773,48.45122],[-4.34657,48.4505],[-4.34851,48.4461],[-4.34934,48.44501],[-4.34648,48.44418],[-4.34419,48.44324],[-4.34195,48.44306],[-4.34101,48.44258],[-4.34083,48.44196],[-4.34117,48.4414],[-4.34293,48.44009],[-4.3439,48.43961],[-4.34449,48.43856],[-4.34481,48.43849],[-4.3445,48.43753],[-4.34491,48.4372],[-4.34342,48.43599],[-4.34338,48.43538],[-4.34309,48.43538],[-4.34281,48.43501],[-4.34233,48.43489],[-4.34228,48.43378],[-4.34148,48.43298],[-4.34106,48.433],[-4.34066,48.43232],[-4.34043,48.43102],[-4.34061,48.43044],[-4.34104,48.43011],[-4.34047,48.42917],[-4.33869,48.42782],[-4.33877,48.42724],[-4.33803,48.42683],[-4.33807,48.42473],[-4.33852,48.4242],[-4.33806,48.42304],[-4.33825,48.42268],[-4.33892,48.42239],[-4.33904,48.4216],[-4.3384,48.42139],[-4.33778,48.42082],[-4.33751,48.42092],[-4.33668,48.42077],[-4.33609,48.42025],[-4.33502,48.41975],[-4.3347,48.41936],[-4.33381,48.41933],[-4.33283,48.41969],[-4.33177,48.41959],[-4.33166,48.41927],[-4.32861,48.41787],[-4.32805,48.41643],[-4.32669,48.41587],[-4.32783,48.41519],[-4.33029,48.41437],[-4.33154,48.41426],[-4.33298,48.41381],[-4.33372,48.41381],[-4.33298,48.41394],[-4.33376,48.41435],[-4.33577,48.41469],[-4.33669,48.41446],[-4.33702,48.41406],[-4.3378,48.41367],[-4.34074,48.41303],[-4.34287,48.41176],[-4.34396,48.41],[-4.34462,48.40975],[-4.34586,48.40863],[-4.34633,48.40667],[-4.34607,48.40646],[-4.34571,48.40647],[-4.34606,48.4063],[-4.34641,48.40648],[-4.34727,48.40656],[-4.34872,48.40627],[-4.34996,48.40646],[-4.35068,48.40694],[-4.35033,48.40709],[-4.35024,48.40735],[-4.35071,48.40794],[-4.35117,48.40808],[-4.35175,48.40856],[-4.35226,48.40835],[-4.3534,48.40836],[-4.35432,48.40842],[-4.35492,48.40872],[-4.35501,48.40691],[-4.35546,48.40661],[-4.35644,48.4067],[-4.35674,48.40697],[-4.35658,48.40747],[-4.35713,48.4076],[-4.35717,48.40808],[-4.35915,48.40912],[-4.36031,48.40941],[-4.36047,48.40931],[-4.36007,48.409],[-4.36003,48.40864],[-4.36039,48.40795],[-4.3621,48.40777],[-4.36331,48.40782],[-4.36422,48.4081],[-4.3647,48.40757],[-4.36692,48.4067],[-4.36805,48.40667],[-4.3685,48.40638],[-4.36872,48.40572],[-4.3695,48.40493],[-4.36981,48.40365],[-4.3688,48.40362],[-4.36903,48.40145],[-4.37121,48.40074],[-4.37224,48.40071],[-4.3727,48.40048],[-4.37424,48.40031],[-4.3751,48.40003],[-4.37593,48.4],[-4.37631,48.40031],[-4.37665,48.40029],[-4.37645,48.40039],[-4.37684,48.40091],[-4.37766,48.4014],[-4.37673,48.40285],[-4.37659,48.40347],[-4.37678,48.404],[-4.37797,48.4051],[-4.37884,48.40545],[-4.38051,48.40576],[-4.38046,48.40655],[-4.38091,48.40778],[-4.38243,48.4082],[-4.38285,48.40854],[-4.38212,48.40884],[-4.38216,48.40895],[-4.38424,48.40933],[-4.38468,48.40963],[-4.38483,48.40988],[-4.38449,48.41104],[-4.38478,48.41205],[-4.38571,48.41287],[-4.38599,48.41348],[-4.38585,48.41357],[-4.38709,48.4148],[-4.38779,48.41487],[-4.38785,48.41534],[-4.38934,48.4148],[-4.39061,48.41455],[-4.39288,48.41505],[-4.39576,48.41398],[-4.39761,48.41657],[-4.39783,48.41477],[-4.40274,48.4151],[-4.40506,48.41481],[-4.40493,48.41394],[-4.40726,48.41329],[-4.40814,48.41346],[-4.40774,48.41239],[-4.41039,48.41249],[-4.41045,48.41226],[-4.41335,48.41136],[-4.41272,48.41025],[-4.41414,48.41],[-4.41907,48.40967],[-4.41917,48.41001],[-4.41979,48.40965],[-4.42016,48.40853],[-4.41935,48.40585],[-4.41904,48.40388],[-4.42446,48.40325],[-4.42546,48.40461],[-4.42596,48.40429],[-4.42568,48.40393],[-4.42571,48.40221],[-4.42632,48.40005],[-4.42612,48.39944],[-4.42645,48.39923],[-4.42341,48.39842],[-4.42232,48.3984],[-4.42286,48.39681],[-4.42356,48.39723],[-4.42568,48.39752],[-4.42911,48.39748],[-4.43251,48.39674],[-4.43376,48.39593],[-4.43449,48.39618],[-4.43543,48.39575],[-4.43634,48.39671],[-4.43692,48.39778],[-4.43834,48.39863],[-4.44001,48.39916],[-4.44077,48.39959],[-4.44107,48.39984],[-4.44094,48.40004],[-4.44145,48.40038],[-4.44294,48.40065],[-4.44386,48.40138],[-4.44471,48.40157],[-4.44622,48.4026],[-4.44859,48.40378],[-4.4492,48.40436],[-4.44951,48.40515],[-4.45038,48.4057],[-4.45044,48.40632],[-4.45094,48.40696],[-4.45073,48.4076],[-4.44979,48.40783],[-4.4494,48.40814],[-4.45067,48.4104],[-4.45159,48.41081],[-4.45355,48.41079],[-4.45427,48.41112],[-4.45499,48.41097],[-4.45678,48.41159],[-4.45721,48.41148],[-4.45957,48.41316],[-4.45902,48.41437],[-4.4603,48.41641],[-4.45449,48.41813],[-4.45298,48.41723],[-4.45252,48.41738],[-4.45166,48.4168],[-4.45136,48.4174],[-4.45157,48.41817],[-4.45291,48.41919],[-4.45259,48.41945],[-4.45319,48.42109],[-4.45432,48.42241],[-4.45574,48.42232],[-4.45724,48.42298],[-4.45904,48.42443],[-4.4591,48.42489]]]
    }
  },
  {
    "type":"Feature",
    "properties": {
      "nom":"Bohars",
      "code":"29011",
      "codeDepartement": "29",
      "codeRegion":"53",
      "codesPostaux":["29820"],
      "population":3528
    },
    "geometry": {
      "type":"Polygon",
      "coordinates": [[[-4.51964,48.44911],[-4.51524,48.44896],[-4.51562,48.44635],[-4.5155,48.44588],[-4.51157,48.44621],[-4.50892,48.44619],[-4.50539,48.44505],[-4.50152,48.4443],[-4.50156,48.44389],[-4.50284,48.44379],[-4.50475,48.44387],[-4.50664,48.44422],[-4.50847,48.4438],[-4.50853,48.44326],[-4.50819,48.44166],[-4.50788,48.44122],[-4.50823,48.44089],[-4.50758,48.43918],[-4.50655,48.43856],[-4.50282,48.43795],[-4.50157,48.43713],[-4.5005,48.43546],[-4.50136,48.43405],[-4.50263,48.43412],[-4.50314,48.43377],[-4.50354,48.43161],[-4.50416,48.43049],[-4.50393,48.43042],[-4.50457,48.42979],[-4.50534,48.42992],[-4.50608,48.42922],[-4.50651,48.42856],[-4.50638,48.42795],[-4.50696,48.42786],[-4.50751,48.4282],[-4.50828,48.42806],[-4.50909,48.4268],[-4.51109,48.42557],[-4.51163,48.42497],[-4.51158,48.42462],[-4.51235,48.42389],[-4.51509,48.4233],[-4.51519,48.42231],[-4.51451,48.42011],[-4.5151,48.41933],[-4.51578,48.41892],[-4.51606,48.41912],[-4.51636,48.41897],[-4.51646,48.41828],[-4.51803,48.41636],[-4.51849,48.41424],[-4.51915,48.41381],[-4.5189,48.41255],[-4.51856,48.4125],[-4.51829,48.41196],[-4.51863,48.41123],[-4.5195,48.41077],[-4.51999,48.41077],[-4.52019,48.41055],[-4.52057,48.41066],[-4.52083,48.41045],[-4.52179,48.41046],[-4.52212,48.4101],[-4.52339,48.40984],[-4.52487,48.40923],[-4.52584,48.40983],[-4.52677,48.41108],[-4.5282,48.41183],[-4.52861,48.41248],[-4.52943,48.41303],[-4.5296,48.41329],[-4.52939,48.41435],[-4.5314,48.41597],[-4.53147,48.41809],[-4.5334,48.42005],[-4.53343,48.42167],[-4.53367,48.42197],[-4.53416,48.42206],[-4.5342,48.42244],[-4.5346,48.42269],[-4.53479,48.42342],[-4.53452,48.42363],[-4.53479,48.42371],[-4.53516,48.42437],[-4.53592,48.42465],[-4.5362,48.42508],[-4.53748,48.42563],[-4.53742,48.42627],[-4.53692,48.4269],[-4.53903,48.42962],[-4.53878,48.42971],[-4.53895,48.43036],[-4.53863,48.43077],[-4.53829,48.43076],[-4.53793,48.43113],[-4.53782,48.43164],[-4.53803,48.43183],[-4.53671,48.4331],[-4.53944,48.43528],[-4.5404,48.43496],[-4.5409,48.43671],[-4.54225,48.43799],[-4.54067,48.43876],[-4.54078,48.44001],[-4.53827,48.43988],[-4.53424,48.44049],[-4.53331,48.44043],[-4.5322,48.44154],[-4.53209,48.44242],[-4.53283,48.44483],[-4.53055,48.44365],[-4.52999,48.44349],[-4.52925,48.44355],[-4.52781,48.44278],[-4.52553,48.44215],[-4.52518,48.44306],[-4.52429,48.44364],[-4.5246,48.44412],[-4.52333,48.44446],[-4.52478,48.44668],[-4.52542,48.44722],[-4.52459,48.44844],[-4.5253,48.44919],[-4.51964,48.44911]]]}},{"type":"Feature","properties":{"nom":"Guilers","code":"29069","codeDepartement":"29","codeRegion":"53","codesPostaux":["29820"],"population":7886},"geometry":{"type":"Polygon","coordinates":[[[-4.59929,48.42831],[-4.59552,48.42906],[-4.59208,48.43018],[-4.59004,48.43107],[-4.58697,48.43286],[-4.58309,48.43458],[-4.5789,48.43616],[-4.57575,48.43677],[-4.57535,48.43922],[-4.57565,48.43967],[-4.57555,48.44038],[-4.57395,48.44026],[-4.57254,48.43974],[-4.57207,48.44034],[-4.56997,48.4413],[-4.56923,48.44209],[-4.56717,48.44245],[-4.56241,48.44405],[-4.56122,48.44517],[-4.56077,48.44491],[-4.56077,48.44454],[-4.55878,48.44389],[-4.5581,48.44383],[-4.55768,48.4442],[-4.55589,48.44438],[-4.55513,48.44357],[-4.55375,48.44338],[-4.55294,48.44308],[-4.54931,48.44123],[-4.54879,48.4407],[-4.54865,48.43953],[-4.54802,48.43823],[-4.54678,48.43711],[-4.54639,48.43637],[-4.5443,48.43543],[-4.54343,48.43419],[-4.5404,48.43496],[-4.53944,48.43528],[-4.53671,48.4331],[-4.53803,48.43183],[-4.53782,48.43164],[-4.53793,48.43113],[-4.53829,48.43076],[-4.53863,48.43077],[-4.53895,48.43036],[-4.53878,48.42971],[-4.53903,48.42962],[-4.53692,48.4269],[-4.53742,48.42627],[-4.53748,48.42563],[-4.5362,48.42508],[-4.53592,48.42465],[-4.53516,48.42437],[-4.53479,48.42371],[-4.53452,48.42363],[-4.53479,48.42342],[-4.5346,48.42269],[-4.5342,48.42244],[-4.53416,48.42206],[-4.53367,48.42197],[-4.53343,48.42167],[-4.5334,48.42005],[-4.53147,48.41809],[-4.5314,48.41597],[-4.52939,48.41435],[-4.5296,48.41329],[-4.52943,48.41303],[-4.52861,48.41248],[-4.5282,48.41183],[-4.52677,48.41108],[-4.52584,48.40983],[-4.52487,48.40923],[-4.52462,48.40634],[-4.52385,48.40513],[-4.52387,48.40467],[-4.52603,48.40424],[-4.53009,48.40487],[-4.53042,48.40436],[-4.53159,48.40383],[-4.53192,48.404],[-4.53247,48.40346],[-4.5324,48.40321],[-4.5335,48.40288],[-4.53472,48.40193],[-4.53639,48.4019],[-4.53664,48.40173],[-4.53679,48.40194],[-4.53737,48.40197],[-4.53746,48.40176],[-4.53784,48.40166],[-4.53891,48.40198],[-4.5397,48.40191],[-4.54003,48.40205],[-4.54015,48.40187],[-4.54055,48.40204],[-4.54105,48.40191],[-4.54177,48.4026],[-4.54205,48.40248],[-4.54317,48.40264],[-4.54352,48.40252],[-4.54417,48.40279],[-4.54505,48.40285],[-4.54481,48.40226],[-4.5458,48.40189],[-4.54596,48.40197],[-4.54604,48.40181],[-4.54635,48.402],[-4.54703,48.40186],[-4.54749,48.40153],[-4.5491,48.40127],[-4.54941,48.40142],[-4.55079,48.40122],[-4.55154,48.40002],[-4.5513,48.39992],[-4.55174,48.39925],[-4.5517,48.39895],[-4.55215,48.39848],[-4.55323,48.39807],[-4.55391,48.39735],[-4.55377,48.39724],[-4.55411,48.39709],[-4.55474,48.39706],[-4.55536,48.39745],[-4.55623,48.39754],[-4.55683,48.3979],[-4.55865,48.39794],[-4.55913,48.39819],[-4.56036,48.39809],[-4.5609,48.39824],[-4.56284,48.39825],[-4.56456,48.39771],[-4.56503,48.39777],[-4.56633,48.39721],[-4.56746,48.39612],[-4.56818,48.39493],[-4.56832,48.39427],[-4.56877,48.39386],[-4.56857,48.39342],[-4.56892,48.39279],[-4.56969,48.39249],[-4.57304,48.39422],[-4.57465,48.39456],[-4.57662,48.39458],[-4.57741,48.39504],[-4.57736,48.39611],[-4.57653,48.39807],[-4.57654,48.40099],[-4.57692,48.40149],[-4.57819,48.40129],[-4.57866,48.4035],[-4.57896,48.40395],[-4.57983,48.40455],[-4.58141,48.40514],[-4.5821,48.40562],[-4.58204,48.40642],[-4.58581,48.40746],[-4.58564,48.40792],[-4.58603,48.40852],[-4.58695,48.40898],[-4.58745,48.40964],[-4.58832,48.41028],[-4.58875,48.41049],[-4.59055,48.41032],[-4.59128,48.41048],[-4.59095,48.4107],[-4.59092,48.41186],[-4.59311,48.41293],[-4.5937,48.41345],[-4.59284,48.4137],[-4.59324,48.41407],[-4.59353,48.41483],[-4.59373,48.41604],[-4.59349,48.41654],[-4.59398,48.41678],[-4.59351,48.4179],[-4.5937,48.41836],[-4.59348,48.41854],[-4.59506,48.41971],[-4.59507,48.42002],[-4.59614,48.42092],[-4.59709,48.42107],[-4.59759,48.42134],[-4.59796,48.42129],[-4.59924,48.42203],[-4.59958,48.42237],[-4.59927,48.4228],[-4.59965,48.4233],[-4.5995,48.42393],[-4.59984,48.42434],[-4.60074,48.42461],[-4.60095,48.42487],[-4.60079,48.42549],[-4.60105,48.42603],[-4.60101,48.42672],[-4.60152,48.42719],[-4.59929,48.42831]]]
      }
    },
    {
      "type":"Feature",
      "properties":{
        "nom":"Brest",
        "code":"29019",
        "codeDepartement":"29",
        "codeRegion":"53",
        "codesPostaux":["29200"],
        "population":139386
      },
      "geometry": {
        "type":"Point",
        "coordinates":[-4.501745593952485,48.402931706263466]
      }
    },
    {
      "type":"Feature",
      "properties":{
        "nom":"Gouesnou",
        "code":"29061",
        "codeDepartement":"29",
        "codeRegion":"53",
        "codesPostaux":["29850"],
        "population":5845
      },
      "geometry":{
        "type":"Polygon",
        "coordinates":[[[-4.49249,48.45395],[-4.49042,48.45361],[-4.49023,48.45549],[-4.48953,48.45799],[-4.48901,48.45866],[-4.48696,48.45879],[-4.48652,48.45917],[-4.48611,48.45919],[-4.48617,48.46085],[-4.48588,48.46175],[-4.48458,48.46245],[-4.48262,48.46249],[-4.48228,48.46292],[-4.48077,48.46365],[-4.4804,48.46403],[-4.47926,48.46435],[-4.47857,48.46486],[-4.47837,48.46632],[-4.4791,48.46777],[-4.47986,48.46824],[-4.47976,48.46833],[-4.4786,48.46755],[-4.47517,48.4693],[-4.47122,48.47006],[-4.47097,48.46824],[-4.47075,48.46805],[-4.4709,48.46771],[-4.47058,48.4673],[-4.47061,48.46638],[-4.47002,48.46551],[-4.46876,48.46504],[-4.46838,48.46435],[-4.46739,48.46395],[-4.4664,48.4638],[-4.46513,48.46389],[-4.4648,48.45995],[-4.46549,48.45716],[-4.45868,48.45678],[-4.45635,48.45627],[-4.45454,48.4564],[-4.45268,48.45599],[-4.45267,48.45584],[-4.45051,48.45517],[-4.44887,48.45502],[-4.44412,48.45522],[-4.44273,48.45567],[-4.44102,48.45589],[-4.43956,48.45688],[-4.43932,48.45761],[-4.43765,48.45777],[-4.43595,48.4583],[-4.4321,48.46001],[-4.43099,48.45919],[-4.43215,48.4572],[-4.43256,48.45487],[-4.4335,48.45186],[-4.433,48.45174],[-4.43242,48.45258],[-4.43018,48.45163],[-4.43044,48.45017],[-4.43008,48.44946],[-4.43059,48.44799],[-4.43151,48.4481],[-4.43153,48.44623],[-4.43304,48.44598],[-4.43312,48.44579],[-4.43481,48.44603],[-4.43693,48.44739],[-4.43853,48.44775],[-4.43899,48.44765],[-4.44001,48.44698],[-4.43965,48.4467],[-4.44056,48.44606],[-4.44191,48.44576],[-4.44167,48.44519],[-4.44094,48.4448],[-4.44064,48.4437],[-4.44104,48.4429],[-4.44087,48.44256],[-4.44117,48.44151],[-4.44179,48.44093],[-4.4419,48.44023],[-4.44238,48.44022],[-4.44266,48.43899],[-4.44239,48.4389],[-4.44246,48.43844],[-4.44184,48.43844],[-4.44179,48.43768],[-4.44136,48.4372],[-4.44195,48.43704],[-4.44203,48.43675],[-4.44407,48.43553],[-4.44185,48.4327],[-4.444,48.43229],[-4.44438,48.43195],[-4.44579,48.43174],[-4.44717,48.43129],[-4.44684,48.43064],[-4.44738,48.43051],[-4.44958,48.42921],[-4.45022,48.42845],[-4.45282,48.42888],[-4.45315,48.42809],[-4.45508,48.42746],[-4.45799,48.42546],[-4.4591,48.42489],[-4.46042,48.42415],[-4.46066,48.42575],[-4.46183,48.42697],[-4.46609,48.42967],[-4.46787,48.42863],[-4.47349,48.42759],[-4.47355,48.42847],[-4.47286,48.43036],[-4.47384,48.43181],[-4.47477,48.43249],[-4.47534,48.43264],[-4.47588,48.43314],[-4.47678,48.43444],[-4.47692,48.43542],[-4.47768,48.43661],[-4.47901,48.43733],[-4.48015,48.43752],[-4.48131,48.43727],[-4.48255,48.43774],[-4.48443,48.43776],[-4.48818,48.43837],[-4.48842,48.43853],[-4.48744,48.43958],[-4.48525,48.44045],[-4.48404,48.44149],[-4.48393,48.44272],[-4.48337,48.44312],[-4.48192,48.44502],[-4.48315,48.44446],[-4.48318,48.4446],[-4.48378,48.4447],[-4.48405,48.4454],[-4.48558,48.4462],[-4.48946,48.44743],[-4.48943,48.44795],[-4.48976,48.4484],[-4.48934,48.44908],[-4.48918,48.45038],[-4.49008,48.4504],[-4.49023,48.45081],[-4.49264,48.45151],[-4.4924,48.45273],[-4.49249,48.45395]]]
        }
      },
      {
        "type": "LineString",
        "coordinates": [[-4.49023, 48.42232], [-4.45, 48.42443], [-4.4, 48.42298]]
      }
    ],
    "params": [ {"color": "#6D4C41", "fillColor": "#FFB300" } ],
    "globalParams": {
      "map": {
        "showTimeSlider" : false,
        "showTimeRange": false,
        "mapType": "OCEANS",
        "tiles": [
         "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
        ]
      }
    }
  }
'>
JSON->`
    },/* {
      title: 'Time Span',
      type: 'map',
      warpscript: `<'
{
"data" : [],
    "params": [{"key":"Annotations (text)","render":"marker","marker":"lodging"} ],
    "globalParams": {
    "startLat" :48.8631763,
    "startLong": 2.3385101,
    "startZoom": 12,
      "map": {
        "showTimeSlider" : true,
        "showTimeRange": true,
        "timeSliderMin" : 1506816000000000,
        "timeSliderMax" : 1525132800000000,
        "timeSpan": 180000000,
        "timeSliderStep": 180000000,
        "timeSpanList": [
          { "label": "3 m" , "value": 180000000 },
          { "label": "15 m" , "value": 900000000 },
          { "label": "30 m" , "value": 1800000000 },
          { "label": "1 h" , "value": 3600000000 }
        ],
        "timeSliderMode": "date",
        "mapType": "TONER_LITE",
        "tiles": [
          "https://tile-{s}.senx.io/polivisu/tiles/issy/traffic/{start}/{end}/{z}/{x}/{y}.png"
        ]
      }
    }
  }
'>
JSON->`
    } */
    ],
    image: [{
      title: 'Images',
      type: 'image',
      warpscript: `//draw tangents along the curve
300 200 '2D3' PGraphics
255 Pbackground
16 PtextSize

50 'x1' STORE
50 'y1' STORE
200 'x2' STORE
130 'y2' STORE

100 'cx1' STORE
40 'cy1' STORE

110 'cx2' STORE
140 'cy2' STORE


4 PstrokeWeight
$x1 $y1 Ppoint //first anchor
$x2 $y2 Ppoint //second anchor

2 PstrokeWeight
$x1 $y1 $cx1 $cy1 Pline
$x2 $y2 $cx2 $cy2 Pline

2 PstrokeWeight
0xffff0000 Pstroke
$x1 $y1 $cx1 $cy1 $cx2 $cy2 $x2 $y2 Pbezier

0 10
<%
10.0 / 't' STORE

$x1 $cx1 $cx2 $x2 $t PbezierPoint 'x' STORE
$y1 $cy1 $cy2 $y2 $t PbezierPoint 'y' STORE
$x1 $cx1 $cx2 $x2 $t PbezierTangent 'tx' STORE
$y1 $cy1 $cy2 $y2 $t PbezierTangent 'ty' STORE
$ty $tx ATAN2 PI 2.0 / - 'angle' STORE
0xff009f00 Pstroke
$x
$y
$x $angle COS 12 * +
$y $angle SIN 12 * +
Pline

0x9f009f00 Pfill
PnoStroke
'CENTER' PellipseMode
$x $y 5 5 Pellipse
%> FOR
Pencode`
    }],
    pie: [{
      title: 'Pie chart',
      type: 'pie',
      warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH
<% DROP 'gts' STORE [ $gts NAME ' ' + $gts LABELS 'dc' GET +  $gts VALUES 0 GET ] %> LMAP 'values' STORE
{ 'data' $values }`
    }, {
      title: 'Donut chart',
      type: 'donut',
      warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH
<% DROP 'gts' STORE [ $gts NAME ' ' + $gts LABELS 'dc' GET + $gts VALUES 0 GET ] %> LMAP 'values' STORE
{ 'data' $values }`
    }],
    gauge: [{
      title: 'Gauge chart',
      type: 'gauge',
      warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH 'res' STORE
$res <% DROP 'gts' STORE [ $gts NAME $gts VALUES 0 GET ] %> LMAP
LIST-> DROP`
    }, {
      title: 'Gauge chart',
      type: 'gauge',
      warpscript: `  @training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH 'res' STORE
[ $res 0 GET ] 'res' STORE
$res <% DROP 'gts' STORE [ $gts NAME $gts VALUES 0 GET ] %> LMAP
LIST-> DROP`
    }, {
      title: 'Bullet chart',
      type: 'bullet',
      warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW -1 ] FETCH 'res' STORE
$res <% DROP 'gts' STORE [ $gts NAME $gts VALUES 0 GET ] %> LMAP
LIST-> DROP`
    }
    ],
    annotation: [{
      title: 'Annotation chart',
      type: 'annotation',
      warpscript: `0 50 <% 'j' STORE
  NEWGTS 'serie' $j TOSTRING + RENAME 'gts' STORE
  0 3 <%
    'i' STORE
    $gts NOW RAND 100000 * -  NaN NaN NaN "t" ADDVALUE DROP
  %> FOR
  $gts
%> FOR`
    }
    ],
    polar: [{
      title: 'Polar chart',
      type: 'polar',
      warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 30 d ] FETCH
[ SWAP bucketizer.mean $NOW 0 5 ] BUCKETIZE`
    }
    ],
    radar: [{
      title: 'Radar chart',
      type: 'radar',
      warpscript: `@training/dataset0
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 30 d ] FETCH
[ SWAP bucketizer.mean $NOW 0 5 ] BUCKETIZE`
    }
    ],
    plot: [{
      title: 'Plot',
      type: 'plot',
      warpscript: `[
  NEWGTS 'Date' RENAME // Commenting that makes it work
  1000 NaN NaN NaN 2.5 ADDVALUE
  2000 NaN NaN NaN 2.5 ADDVALUE
  3000 NaN NaN NaN 2.5 ADDVALUE
  4000 NaN NaN NaN 2.5 ADDVALUE

  NEWGTS '1' RENAME
  1000 NaN NaN NaN 1 ADDVALUE
  2000 NaN NaN NaN 2 ADDVALUE
  3000 NaN NaN NaN 3 ADDVALUE
  4000 NaN NaN NaN 4 ADDVALUE

  NEWGTS '1' RENAME
  1000 NaN NaN NaN 4 ADDVALUE
  2000 NaN NaN NaN 3 ADDVALUE
  3000 NaN NaN NaN 2 ADDVALUE
  4000 NaN NaN NaN 1 ADDVALUE
]`
    }, {
      title: 'Plot',
      type: 'plot',
      warpscript: `@training/dataset0
// warp.store.hbase.puts.committed is the number of datapoints committed to
// HBase since the restart of the Store daemon
[ $TOKEN '~warp.*committed' { 'cell' 'prod' } $NOW 10 d ] FETCH
[ SWAP mapper.rate 1 0 0 ] MAP
// Keep only 1000 datapoints per GTS
1000 LTTB DUP
// Detect 5 anomalies per GTS using an ESD (Extreme Studentized Deviate) Test
5 false ESDTEST
// Convert the ticks identified by ESDTEST into an annotation GTS
<%
  DROP // excude element index
  NEWGTS // create a new GTS
  SWAP // get timestamp list
  <% NaN NaN NaN 'anomaly' ADDVALUE %> FOREACH // for each timestamp
%> LMAP 2 ->LIST // Put our GTS in a list
ZIP // merge into a list of GTS
// Now rename and relabel the anomaly GTS
<%
  DROP // exclude element index
  LIST-> // flatten list
  DROP // exclude number of elements of our list
  SWAP // put our fetched GTS on the top
  DUP // duplicate the GTS
  NAME // get the className of the GTS
  ':anomaly' + 'name' STORE // suffix the name
  DUP LABELS 'labels' STORE // duplicate the GTS and get labels
  SWAP // put the anomaly GTS on the top of the stack
  $name RENAME // rename the GTS
  $labels RELABEL // put labels
  2 ->LIST // put both GTS in a list
%> LMAP`
    }
    ]
  };

  currentChart: { title: string, warpscript: string, type: string, unit?: string }[];
  options: Param = {
    ...new Param(), ...{
      gridLineColor: '#000000',
      fontColor: '#000000',
      map: {mapType: 'CARTODB_DARK'},
      showControls: true,
      showGTSTree: true,
      foldGTSTree: true,
      autoRefresh: -1
    }
  };
  theme: string;

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService) {
    settingsService.settingsAdded$.subscribe(evt => {
      this.theme = evt.settings.theme;
      this.options.scheme = evt.settings.colorScheme;
      if (this.theme === 'dark') {
        this.options.map.mapType = 'CARTODB_DARK';
      } else {
        this.options.map.mapType = 'DEFAULT';
      }
      console.log('main', this.options.map.mapType);
      this.options = {...this.options};
    });
    router.events.subscribe(r => {
      if (r instanceof NavigationStart) {
        this.currentChart = undefined;
      }
    });
  }


  ngOnInit() {
    console.log('main - ngOnInit', this.options.map.mapType);
    this.route.paramMap.subscribe(params => {
      if (params.get('component')) {
        this.currentChart = this.demo[params.get('component')];
      }
    });
  }

  ngOnDestroy() {
    this.currentChart = undefined;
  }

  manageTheme() {
    return {
      'text-white': (this.theme === 'dark'),
      'bg-light': this.theme === 'light',
      'bg-dark': this.theme === 'dark'
    };
  }
}
