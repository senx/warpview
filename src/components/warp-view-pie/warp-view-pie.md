# Pie, doughnut an gauge chart

## CSS vars

- --warp-view-chart-width : Width
- --warp-view-chart-height : Height
- --warp-view-font-color : Title font color

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
  "data": [["key", 54], ["key 2", 45]]
}
```

- **data**: data to be displayed as tuples.

## Option format

```json
{
  "type": "pie"
}
```

- **type**: chart type, possible values are 'pie', 'gauge' and 'doughnut'