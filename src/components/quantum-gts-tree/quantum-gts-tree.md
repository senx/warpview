# GTS Tree view

## CSS vars
 
- --gts-classname-font-color : Font color for class name
- --gts-labelname-font-color : Font color for label name
- --gts-separator-font-color : Font color for label separator
- --gts-labelvalue-font-color : Font color for label value
- --gts-stack-font-color : Font color for the stack level label
- --gts-tree-expanded-icon : Icon for the expanded state of the stack level
- --gts-tree-collapsed-icon : Icon for the collapsed state of the stack level (not implemented)

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| theme | `string` | 'light' | Possible values are: 'light', 'dark' |
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

## Events

### quantumSelectedGTS

Emit selected GTS.

```json
{
  "selected": true,
  "gts": {
   "c": "class.name", 
   "l": { "label1": "label value"},  
   "a": { "attribute1": "attribute value"},
   "v" : [[0,0,0,true], [0,"a"]]
  },
  "label": "class.name{label1=label value}"
}

``` 