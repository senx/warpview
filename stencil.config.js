const sass = require("@stencil/sass");
exports.config = {
  namespace: "quantumviz",
  plugins: [sass()],
  enableCache: true,
  bundles: [
    { components: ["quantum-annotation"] },
    { components: ["quantum-gts-tree", "quantum-chip", "quantum-tree-view"] },
    { components: ["quantum-heatmap", "quantum-heatmap-sliders"] },
    { components: ["quantum-tile"] },
    { components: ["quantum-toggle"] },
    {
      components: [
        "quantum-horizontal-zoom-slider",
        "quantum-vertical-zoom-slider"
      ]
    },
    {
      components: [
        "quantum-bubble",
        "quantum-chart",
        "quantum-pie",
        "quantum-polar",
        "quantum-radar",
        "quantum-scatter"
      ]
    }
  ],
  outputTargets: [
    {
      type: "dist"
    },
    {
      type: "www"
    }
  ]
};

exports.devServer = {
  root: "www",
  watchGlob: "**/**"
};
