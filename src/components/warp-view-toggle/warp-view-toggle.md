# Toggle between date and timestamp

## CSS vars
 
- --warp-view-font-color : labels font color
- --warp-view-switch-width : Switch width
- --warp-view-switch-height : Switch Height
- --warp-view-switch-radius : Switch inset radius
- --warp-view-switch-inset-color : Inset base color
- --warp-view-switch-inset-checked-color : Inset checked color
- --warp-view-switch-handle-color : Handle base color
- --warp-view-switch-handle-checked-color : Handle checked color

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| checked | `boolean` | false | Initial state of the toggle | 
| text1 | `string` | '' | Left label for the un-checked state | 
| text2 | `string` | '' | Right label for the checked state |


## Events

### stateChange

Emits the state of the toggle

```json
{ "state": true }
``` 