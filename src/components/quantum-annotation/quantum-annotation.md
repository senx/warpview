# Bubble chart component

Displays a bubble chart

## CSS vars

- --quantum-chart-width : Width
- --quantum-chart-height : Height
- --quantum-font-color : Title font color


## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| theme | `string` | 'light' | Possible values are: 'light', 'dark' |
| timeMin | `number` | | Minimum in the time range |
| timeMax | `number` | | Maximum in the time range |
| chartTitle | `string` | '' | Main title |
| showLegend | `boolean` | true | Shows a legend |
| responsive | `boolean` | false | Fit the parent space |
| hiddenData | `string[]` | List of concatenated class names and labels to hide. (ie: `com.class.name{label=a,label=b}` |
| width | `string` | '' | Fixed width |
| height | `string` | '' | Fixed height |
| options | `string` | '{}' | Serialized JSON representation of display options |
| data | `string` | '{}' | Serialized JSON representation of data to display |

## Data format


```json
{
  "data": [{
    "c": "class.name", 
    "l": { "label1": "label value"},  
    "a": { "attribute1": "attribute value"},
    "v" : [[0,0,0,true], [0,"a"]]
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