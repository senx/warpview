# Display component

Displays alphanumeric value

## CSS vars
 
- --quantum-chart-width : Width
- --quantum-chart-height : Height
- --quantum-font-color : Font color (title and value)

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| theme | `string` | 'light' | Possible values are: 'light', 'dark' |
| unit | `string` | '' | Unit used |
| displayTitle | `string` | '' | Main title |
| responsive | `boolean` | false | Fit the parent space |
| width | `string` | '' | Fixed width |
| height | `string` | '' | Fixed height |
| options | `string` | '{}' | Serialized JSON representation of display options |
| data | `string` | '{}' | Serialized JSON representation of data to display |

## Data format

```json
{
  "data": 42
}
```
- **data**: data to be displayed

## Option format

```json
{
  "bgColor": "#ffee77",
  "fontColor": "#994477"
}
```

- **bgColor**: Background color (Default: transparent) 
- **fontColor**: Font color for title, unit and value Default: 
  - dark theme: #ffffff
  - light theme: #000000