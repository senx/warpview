# Warp View

This a collection of charting [web components](https://en.wikipedia.org/wiki/Web_Components) dedicated to [Warp 10™](https://www.warp10.io)

![WarpView](imgs/warpView.png)

- [Documentation](https://github.com/senx/warpview/wiki/)
- [Licence Apache 2](./LICENSE.md)
- [Contribute](./CONTRIBUTING.md)

## Getting started

    npm i @senx/warpview --save
    
    yarn add @senx/warpview

## Usage

```html
<html>
<head>
  <title>Test</title>
 
</head>
<body>
  <warp-view-spinner />
  
  <div style="width: 100%; height: 800px;">
    <warp-view-tile url="https:/warp10-backend/api/v0/exec" responsive="true" showLegend="false"
      chart-title="">
    
      // WARPSCRIPT
      
    </warp-view-tile>
  </div>
  <script src="https://unpkg.com/@senx/warpview/elements/warpview-elements.js"></script>
</body>
</html>
```

## Components

[See wiki](https://github.com/senx/warpview/wiki/)

## About

- [Warp 10™](https://www.warp10.io)
- [SenX](https://senx.io)
