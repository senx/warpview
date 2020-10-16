# Warp View Editor

[![npm version](https://badge.fury.io/js/%40senx%2Fwarpview-editor.svg)](https://badge.fury.io/js/%40senx%2Fwarpview-editor) 

This [web components](https://fr.wikipedia.org/wiki/Composants_web) embed a WarpScript editor dedicated to [Warp 10™](https://www.warp10.io).

![Warp 10](https://blog.senx.io/wp-content/uploads/2018/10/warp10bySenx.png)

- [licence Apache 2](./LICENSE.md)
- [Contribute](./CONTRIBUTING.md)

Demo: https://senx.github.io/warpview-editor

## Getting started

    npm i @senx/warpview-editor --save

    yarn add @senx/warpview-editor

## Usage

```html
<html dir="ltr" lang="en">
  <head>
    <title>Test</title>
    <script src="https://unpkg.com/@senx/warpview-editor@x.x.x/elements/warpview-editor.js"></script>
  </head>
  <body>
    <warp-view-editor url="https://warp.senx.io/api/v0/exec" height-line=18 width-px=600 theme="dark" id="editor" show-dataviz="true" horizontal-layout="false" config='{"quickSuggestionsDelay":3000, "suggestOnTriggerCharacters": false}'>
      2 2 +
    </warp-view-editor>
  </body>
</html>
```


## CSS vars

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| url | `string` | | Warp 10 url, eg: `https://warp.senx.io/api/v0/exec` |
| theme | `string` | 'light' | Editor theme (`light` or `dark`) |
| warpscript | `string` | '' | WarpScript to edit (optional, could be inside HTML tag) |
| showDataviz | `boolean` | false | Display the "Show dataviz" button  |
| showExecute | `boolean` | true | Display the "Execute" button  |
| horizontalLayout | `boolean` | false | Horizontal or vertical layout  |
| config | `object` | default config | Configuration |
| displayMessages | `boolean` | true | Displays messages from WarpScript execution |
| widthPx | `number` | | Fixed width |
| heightPx | `number` | | Fixed height |
| heightLine | `number` | | Fixed number of lines |
| imageTab | boolean | false | Display the tab for image results |

## Data format

### Default config

```json
{
  "buttons" : {
    "class": ""
  },
  "execButton" : {
    "class": "",
    "label": "Execute"
  },
  "datavizButton" : {
    "class": "",
    "label": "Visualize"
  },
  "hover" : true,
  "readOnly" : false,
  "messageClass" : "",
  "errorClass" : "",
  "editor": {
    "quickSuggestionsDelay": 10,
    "quickSuggestions": true,
    "tabSize": 2,
    "minLineNumber": 10,
    "enableDebug": false
  }
}
```

## Events

### warpViewEditorStatusEvent

String execution status :

```text
Your script execution took 527.749 ms serverside, fetched 138156 datapoints and performed 21 WarpScript operations.
```

### warpViewEditorErrorEvent

String execution error :

```text
ERROR line #4 in section '[TOP]': Unknown symbol 'TOKEN2'
```

### warpViewEditorWarpscriptChanged

String representation of the WarpScript typed in the editor.

### warpViewEditorWarpscriptResult

Json of the the WarpScript execution result triggered by a click on the execute button.

### warpViewEditorDatavizRequested

Json of the the WarpScript execution result triggered by a click on the dataViz button

