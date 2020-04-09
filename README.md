# Warp View

This a collection of charting [web components](https://en.wikipedia.org/wiki/Web_Components) dedicated to [Warp 10™](https://www.warp10.io)

![WarpView](imgs/warpView.png)

- [Demo & documentation](https://senx.github.io/warpview/)
- [licence Apache 2](./LICENSE.md)
- [Contribute](./CONTRIBUTING.md)

## Getting started

    npm i @senx/warpview@1.0.52 --save
    
    yarn add @senx/warpview@1.0.52
    
    bower install senx-warpview@1.0.52 --save

```html
<html>
<head>
  <title>Test</title>
  <script src="https://unpkg.com/@senx/warpview@1.0.52/dist/warpview.js"></script>
</head>
<body>
  <warp-view-spinner />
  
  <div style="width: 100%; height: 800px;">
    <warp-view-tile url="https:/warp10-backend/api/v0/exec" responsive="true" show-legend="false"
      chart-title="">
    
      // WARPSCRIPT
      
    </warp-view-tile>
  </div>
</body>
</html>
```

## Components

[See wiki](https://github.com/senx/warpview/wiki/)


## Integrations

[See here](https://stenciljs.com/docs/framework-integration)

## About

- [Warp 10™](https://www.warp10.io)
- [SenX](https://senx.io)
