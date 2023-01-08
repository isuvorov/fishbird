# Fishbird

<img src="https://isuvorov.github.io/fishbird/fishbird.png" align="right" 
     alt="Fishbird placeholder image by shutterstock" width="120" height="120">

Fishbird is a simple, lightweight, and fast *Promise* utility library.

## Features

- **Small**. Less 1Kb (minified and gzipped). No dependencies.
- **Fast**. Its 2 times faster than Bluebird by benchmarkes.
- **ES modules** and **tree-shaking** support.
- **TypeScript** friendly.
- **Portable** Supports modern browsers, IE with Babel, Node.js and React Native.
- **Compatible** with Bluebird API.

## Usage

```js
import { map } from 'bluefish';

const res = map([1 ,2 , 3], async (id) => {
    const res = await fetch(id);
    return res.json();
});
```

## Installation

```bash
npm i fishblue
```

```bash
yarn i fishblue
```

```bash
pnpm i fishblue
```

## Inspired by  

- [Bluebird](https://github.com/petkaantonov/bluebird)
- Lodash

## Reading for developers

- https://dev.to/orabazu/how-to-bundle-a-tree-shakable-typescript-library-with-tsup-and-publish-with-npm-3c46
- https://tsup.egoist.dev/
- https://blog.theodo.com/2021/04/library-tree-shaking/#:~:text=ESM%20is%20a%20requirement%20for,them%20both%20through%20the%20package.