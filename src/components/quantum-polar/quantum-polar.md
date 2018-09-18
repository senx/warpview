# Polar chart


## CSS vars

- --quantum-chart-width : Width
- --quantum-chart-height : Height
- --quantum-font-color : Title font color


## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| showLegend | `boolean` | true | Shows a legend |
| responsive | `boolean` | false | Fit the parent space |
| width | `string` | '' | Fixed width |
| height | `string` | '' | Fixed height |
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
  "gridLineColor": "#ffee77"
  }
```

- **gridLineColor**: Grid line color and axis labels color. Default: #8e8e8e