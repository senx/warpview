# Image component

Displays BAs 64 image

## CSS vars
 
- --quantum-chart-width : Width
- --quantum-chart-height : Height
- --quantum-font-color : Font color (title and value)

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| responsive | `boolean` | false | Fit the parent space |
| width | `string` | '' | Fixed width |
| height | `string` | '' | Fixed height |
| options | `object` | | Serialized JSON representation of display options |
| data | `object` | | Serialized JSON representation of data to display |

## Data format

```json
{
  "data": "data:image/png;base64,iVBOR[...]ky1P3"
}
```
- **data**: Base 64 image to be displayed (could be array of) 

## Option format

```json
{
  "bgColor": "#ffee77",
  "fontColor": "#994477"
}
```

- **bgColor**: Background color (Default: transparent) 
- **fontColor**: Font color for title, unit and value