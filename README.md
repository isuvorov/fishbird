# Fishbird

[![NPM version](https://badgen.net/npm/v/fishbird)](https://www.npmjs.com/package/fishbird)
[![Tests](https://github.com/isuvorov/fishbird/actions/workflows/release.yml/badge.svg)](https://github.com/isuvorov/fishbird/actions/workflows/npm-publish.yml)
[![Install size](https://packagephobia.now.sh/badge?p=fishbird)](https://packagephobia.now.sh/result?p=fishbird)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/fishbird.svg)](https://bundlephobia.com/result?p=fishbird)
[![License](https://badgen.net//github/license/isuvorov/fishbird)](https://github.com/isuvorov/fishbird/blob/master/LICENSE)
[![Ask me in Telegram](https://img.shields.io/badge/Ask%20me%20in-Telegram-brightblue.svg)](https://t.me/isuvorov)
<!-- [![NPM Package size](https://badgen.net/bundlephobia/minzip/fishbird)](https://bundlephobia.com/result?p=fishbird) -->

<img src="https://isuvorov.github.io/fishbird/fishbird.png" align="right" width="120" height="120">

Fishbird is a simple, lightweight, and fast *Promise* utility library.

- **Small**. Less 1Kb (minified and gzipped). No dependencies.
- **Fast**. Its 2 times faster than Bluebird by benchmarkes.
- **ES modules** and **tree-shaking** support.
- **TypeScript** friendly.
- **Portable** Supports modern browsers, IE with Babel, Node.js and React Native.
- **Compatible** with Bluebird API.

```ts
import { map } from 'fishbird';

const res = map([1 ,2, 3], async (id) => {
  const res = await fetch(id);
  return res.json();
});
```

## Installation

```bash
npm i fishbird
```

```bash
yarn i fishbird
```

```bash
pnpm i fishbird
```

## Usage

### map

```ts
import { map } from 'fishbird';

const res = map([1 ,2, 3], async (id) => {
  const res = await fetch(id);
  return res.json();
});

// map with concurrency

const res2 = map([1 ,2, 3], async (id) => {
  const res = await fetch(id);
  return res.json();
}, { concurrency: 2 });


```

### props

```ts
import { props } from 'fishbird';
const users = {
  john: { id: 1 },
  bob: { id: 2 },
  alice: { id: 3 },
}
const res = await props(users, async ({ id }) => {
  const res = await fetch(id);
  return res.json();
});

// res = {
//   john: { name: 'John', ... },
//   bob: { name: 'Bob', ... },
//   alice: { name: 'Alice', ... },
// }


// Props with concurrency and Map
const users2 = new Map([
  ['john', { name: 'John' }],
  ['bob', { name: 'Bob' }],
  ['alice', { name: 'Alice' }],
]);
const res = await props(users, async (user) => {
  const res = await fetch(user.name);
  return res.json();
}, { concurrency: 2 });

```


## Inspired by  

- [Bluebird](https://github.com/petkaantonov/bluebird)


<!-- ## Reading for developers

- https://dev.to/orabazu/how-to-bundle-a-tree-shakable-typescript-library-with-tsup-and-publish-with-npm-3c46
- https://tsup.egoist.dev/
- https://blog.theodo.com/2021/04/library-tree-shaking/#:~:text=ESM%20is%20a%20requirement%20for,them%20both%20through%20the%20package. -->