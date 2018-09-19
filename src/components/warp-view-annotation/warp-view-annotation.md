# Bubble chart component

Displays a bubble chart

## CSS vars

- --warp-view-chart-width : Width
- --warp-view-chart-height : Height
- --warp-view-font-color : Title font color


## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| timeMin | `number` | | Minimum in the time range |
| timeMax | `number` | | Maximum in the time range |
| showLegend | `boolean` | true | Shows a legend |
| responsive | `boolean` | false | Fit the parent space |
| hiddenData | `string[]` | List of concatenated class names and labels to hide. (ie: `com.class.name{label=a,label=b}` |
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
    "v" : [[0,0,0,true], [0,"a"]]
   }]
}
```
- **data**: data to be displayed as a GTS list.

## Option format

```json
{
  "gridLineColor": "#ffee77",
  "timeMode" : "date"
}
```

- **gridLineColor**: Grid line color and axis labels color. Default: #8e8e8e
- **timeMode**: Scale either 'timestamp' or 'date', default is 'date' 

## Events

### pointHover

Emit mouse position

```json
{
  "x": 123,
  "y": 456
}
```
