# Contributing

## Prerequisites

- [NodeJS](https://nodejs.org/en/download/) > 8
- [Yarn](https://yarnpkg.com/docs/install/)

## Run and build

### Run in dev mode

```
$ yarn install
$ yarn dev 
```


### Build

```
$ yarn install
$ yarn build 
```

## Naming Components

When creating new component tags, we recommend _not_ using `stencil` in the component name (ex: `<stencil-datepicker>`). This is because the generated component has little to nothing to do with Stencil; it's just a web component!

Instead, use a prefix that fits your company or any name for a group of related components. For example, all of the Ionic generated web components use the prefix `ion`.