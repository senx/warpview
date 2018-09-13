# Line chart component

Displays a line chart

## CSS vars

- --quantum-chart-width : Width
- --quantum-chart-height : Height
- --quantum-font-color : Title font color
- --quantum-chart-label-color : Chart labels font color
- --quantum-chart-legend-bg : Legend popup background color
- --quantum-chart-legend-color : Legend popup font color


## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| theme | `string` | 'light' | Possible values are: 'light', 'dark' |
| type | `string` | 'line' | Possible values are: 'line', 'area', 'step' |
| unit | `string` | '' | Unit used |
| chartTitle | `string` | '' | Main title |
| showLegend | `boolean` | true | Shows a legend |
| standalone | `boolean` | false | If used with [quantum-annotation](../quantum-annotation/quantum-annotation.md) |
| responsive | `boolean` | false | Fit the parent space |
| hiddenData | `string[]` | List of concatenated class names and labels to hide. (ie: `com.class.name{label=a,label=b}` |
| options | `object` | | Serialized JSON representation of display options |
| data | `object` | | Serialized JSON representation of data to display |

## Data format


```json
{
  "data": [{
    "c": "class.name", 
    "l": { "label1": "label value"},  
    "a": { "attribute1": "attribute value"},
    "v" : [[0,0,0,4], [0,2]]
   }]
}
```
- **data**: data to be displayed as a GTS list.

## Option format

```json
{
  "time": "timestamp",
  "gridLineColor": "#001155",
  "showRangeSelector": false
}
```

- **time**: Scale either 'timestamp' or 'date', default is 'date' 
- **gridLineColor**: Grid line color and axis labels color. Default: #8e8e8e
- **showRangeSelector**: Show the range selector on the bottom of the chart, default is true