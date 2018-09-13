# quantum-map

Quantum-map is a [StencilJs](https://stenciljs.com/) web-component based on [Leaflet](https://leafletjs.com/).
Map pins are from [MapBox](https://www.mapbox.com/maki-icons/) and heatmap plugin module is [Leaflet.heat](https://github.com/Vivien-/types-leaflet-heat).

## Attributs :

- `map-title` *string* (optional) : title displayed on top left of the map
- `width` *string* (optional) : width of the map, default *100%*
- `height` *string* (optional) : height of the map, default *800px*
- `start-lat` *number* (optional) : starting latitude, default *30*
- `start-long` *number* (optional) : starting longitude, default *0*
- `start-zoom` *number* (optional) : starting zoom, default *3*
- `dots-limit` *number* (optional) : limit at which points are clustered for performance reasons, default *1000*
- `data` *object* (optional) : data to display, see syntax below

- `heat-radius` *number* (optional) : radius of heat-point, default *25*
- `heat-blur` *number* (optional) : amount of blur, default *15*
- `heat-opacity` *number* (optional) : opacity of heat-point, default *0.5*
- `heat-controls` *boolean* (optional) : display controls to modify heat radius, blur and opacity, default *false*
- `heat-data` *string* (optional) : heat-data to display, see syntax below

## Data syntax :

Data is map composed of two properties :
- `data`: a list of GTS or positions to plot
- `params`: a list of visualisation parameters for each GTS or positions to plot

Each item in `data` array matches to an item in `params` array.


### `data` :

- GTS have standard GTS JSON syntax as following : `{"c":"","l":{},"a":{},"v":[[1460540141224657,51.45877850241959,-0.01000002957880497,1000,8.090169943749475],[1460540131224657,51.49510562885553,-0.02000005915760994,1000,3.0901699437494745]]}`.\
Each datapoint of a GTS need to have at least a date, latitude and longitude.

- Positions are a map with `positions` key and a list of positions and values :
  - positions only : `{"positions":[[51.5,-0.22],[51.46,-0.3],[51.42,-0.2]]}`
  - positions and one value used as dot radius : `{"positions":[[51.2,-0.12,10],[51.36,-0.0,21],[51.32,-0.2,15]]}`
  - positions and two values used as dot radius and dot fill color : `{"positions":[[51.1,-0.52,42,10],[51.56,-0.4,21,30],[51.42,-0.6,84,40],[51.3,-0.82,42,1],[51.76,-0.7,21,20]]}`

  Each position need to have at least latitude and longitude

Each information of a point are accessible in a popup by clicking on associate marker.


### `params` :


#### For GTS :

- `key` : specify render type
  - `path` : display line between positions, usefull for a trajectory
    - `color` (optional) : path color
    - `displayDots` (optional) : true or false, display dots at datapoints
  - `point` : display dots or markers (to specify with "render")
    - `render` :
      - `dot`
        - `radius`
        - `fillColor` (optional)
        - `fillOpacity` (optional)
        - `edgeColor` (optional)
        - `edgeOpacity` (optional)
        - `weight` (optional) : edge thickness
      - `marker`
        - `marker` : name of the marker icon, see [Maki](https://www.mapbox.com/maki-icons/). It can also be a letter or a two digits number.
        - `color` (optional)
- `legend` (optional) : text of your choice

#### For positions : 

- `radius`
- `fillColor` (optional)
- `fillOpacity` (optional)
- `edgeColor` (optional)
- `edgeOpacity` (optional)
- `weight` (optional) : edge thickness
- `legend` (optional) : text of your choice


## Heat-data syntax :

Heat-data is an array of positions with for each an intensity value between 0 and 1 : `[[51.5,-0.3, 0.5], [51.6,-0.3, 0.7], [51.3, -0.3, 1]]`.


## Example :

    <quantum-map data=
      '[{
        "gts":[
            {"c":"","l":{},"a":{},"v":[
              [1460540141224657,51.45877850241959,-0.01000002957880497,1000,8.090169943749475],
              [1460540131224657,51.49510562885553,-0.02000005915760994,1000,3.0901699437494745],
              [1460540121224657,51.49510562885553,-0.030000004917383194,1000,-3.0901699437494736],
              [1460540111224657,51.45877850241959,-0.040000034496188164,1000,-8.090169943749473],
              [1460540101224657,51.39999998733401,-0.050000064074993134,1000,-10.0],
              [1460540091224657,51.341221472248435,-0.06000000983476639,1000,-8.090169943749475],
              [1460540081224657,51.3048943458125,-0.07000003941357136,1000,-3.0901699437494754],
              [1460540071224657,51.3048943458125,-0.08000006899237633,1000,3.0901699437494723],
              [1460540061224657,51.341221472248435,-0.09000001475214958,1000,8.090169943749473],
              [1460540051224657,51.39999998733401,-0.10000004433095455,1000,10.0]
            ]},
            {"c":"","l":{},"a":{},"v":[
                [1460540141224657,51.49999998975545,-0.10000004433095455,10],
                [1460540131224657,51.45999999716878,-0.09000001475214958,9],
                [1460540121224657,51.41999996267259,-0.08000006899237633,8],
                [1460540111224657,51.39999998733401,-0.07000003941357136,7],
                [1460540101224657,51.439999979920685,-0.06000000983476639,6],
                [1460540091224657,51.47999997250736,-0.050000064074993134,8],
                [1460540081224657,51.49999998975545,-0.030000004917383194,10],
                [1460540071224657,51.51999996509403,-0.02000005915760994,9],
                [1460540061224657,51.539999982342124,-0.01000002957880497,8],
                [1460540051224657,51.55999999959022,0.0,9]
            ]},
            {"c":"","l":{},"a":{},"v":[
                [1460540141224657,51.49999998975545,-0.10000004433095455,"a"],
                [1460540131224657,51.45999999716878,-0.09000001475214958,"b"],
                [1460540121224657,51.41999996267259,-0.08000006899237633,"c"],
                [1460540111224657,51.39999998733401,-0.07000003941357136,"d"]
            ]},
            {"c":"","l":{},"a":{},"v":[
                [1460540136224657,51.439999979920685,0.05999992601573467,true],
                [1460540116224657,51.47999997250736,0.04999998025596142,false],
                [1460540096224657,51.49999998975545,0.02999992109835148,true],
                [1460540076224657,51.51999996509403,0.019999975338578224,false],
                [1460540056224657,51.539999982342124,0.009999945759773254,true]
            ]},
            {"positions":[[51.5,-0.22],[51.46,-0.3],[51.42,-0.2]]},
            {"positions":[[51.2,-0.52,42],[51.36,-0.4,21],[51.32,-0.6,84]]},
            {"positions":[[51.1,-0.52,42,10],[51.56,-0.4,21,30],[51.42,-0.6,84,40],[51.3,-0.82,42,1],[51.76,-0.7,21,20],[51.62,-0.9,84,45]
        ]}],
        "params":[
            {"color":"#ff1010", "key":"path", "legend":"A", "displayDots": true},
            {"color":"#1010ff", "key":"path", "legend":"B"},
            {"key":"point", "render":"marker", "marker":"fuel", "color":"#ff0000"},
            {"key":"point", "render":"dot", "radius":5, "fillColor":"#ff0000", "fillOpacity":"0.9"},
            {"edgeColor":"#ffa", "radius":20, "fillColor":"#0f0"},
            {"fillColor":"#00f"},
            {}
        ]}]'
    heat-controls=true heat-data="[[51.4,-0.3, 0.3], [51.4,-0.32, 0.6], [51.1,-0.32, 0.4], [51.1,-0.315, 0.5], [51.105,-0.31, 0.9], [51.5,-0.3, 0.5], [51.6,-0.3, 0.7], [51.3, -0.3, 1]]"
    />
