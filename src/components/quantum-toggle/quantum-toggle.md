# Toggle between date and timestamp

## CSS vars
 
- --quantum-font-color : labels font color
- --quantum-switch-width : Switch width
- --quantum-switch-height : Switch Height
- --quantum-switch-radius : Switch inset radius
- --quantum-switch-inset-color : Inset base color
- --quantum-switch-inset-checked-color : Inset checked color
- --quantum-switch-handle-color : Handle base color
- --quantum-switch-handle-checked-color : Handle checked color

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