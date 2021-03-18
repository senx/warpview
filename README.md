changelog.js# Warp View

This a collection of charting [web components](https://en.wikipedia.org/wiki/Web_Components) dedicated to [Warp 10™](https://www.warp10.io)

![WarpView](imgs/warpView.png)

- [Demo](https://senx.github.io/warpview/)
- [Documentation](https://github.com/senx/warpview/wiki/)
- [licence Apache 2](./LICENSE.md)
- [Contribute](./CONTRIBUTING.md)

## Getting started

    npm i @senx/warpview --save
    
    yarn add @senx/warpview

```html
<html>
<head>
  <title>Test</title>
<script src="https://cdn.jsdelivr.net/npm/@senx/warpview/elements/warpview-elements.js"></script>
</head>
<body>
  
  <div style="width: 100%; height: 800px;">
    <warp-view-tile 
      url="https:/warp10-backend/api/v0/exec"
      options='{"showDots":false,"scheme":"WARP10"}' 
      type="line"
      responsive="true" 
      chart-title="Sample"
    >NEWGTS 'g' STORE
      0 9 <% 'ts' STORE $g $ts STU * NOW + NaN NaN NaN RAND ADDVALUE DROP %> FOR
      $g 
    </warp-view-tile>
  </div>
</body>
</html>
```

## Components

[See wiki](https://github.com/senx/warpview/wiki/)


## Integrations

[See here](https://stenciljs.com/docs/overview)

## About

- [Warp 10™](https://www.warp10.io)
- [SenX](https://senx.io)
