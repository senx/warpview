# Image component

Displays Base64 image

## CSS vars
 
- --warp-view-chart-width : Width
- --warp-view-chart-height : Height
- --warp-view-font-color : Font color (title and value)

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