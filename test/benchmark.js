#!/usr/bin/env node

const { map, mapSeries, props } = require('../lib/index.js');

const benchmark = require('benchmark');
const Bluebird = require('bluebird');
const pico = require('picocolors');

const suite = new benchmark.Suite();

// const mapper = (a) => Math.sqrt(a);
const mapper = (a) => a * 2;
const inputArray = Array.from({ length: 1_000 }, (_, i) => Math.random());
const inputObject = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i])
);

function formatNumber(number) {
  return String(number)
    .replace(/\d{3}$/, ',$&')
    .replace(/^(\d|\d\d)(\d{3},)/, '$1,$2');
}

suite
  .add('Fishbird.map', {
    defer: true,
    fn(defer) {
      map(inputArray, mapper, {concurrency: 80}).then(() => {
        defer.resolve();
      });
    },
  })
  .add('Bluebird.map', {
    defer: true,
    fn(defer) {
      Bluebird.map(inputArray, mapper).then(() => {
        defer.resolve();
      });
    },
  })
  .add('Fishbird.props', {
    defer: true,
    fn(defer) {
      props(inputObject, mapper).then(() => {
        defer.resolve();
      });
    },
  })
  .add('Bluebird.props', {
    defer: true,
    fn(defer) {
      Bluebird.props(inputObject, mapper).then(() => {
        defer.resolve();
      });
    },
  })

  .on('cycle', (event) => {
    const name = event.target.name.padEnd('async secure-random-string'.length);
    // if (event.target.name === 'nanoid/async') {
    //   name = `\nAsync:\n${name}`;
    // } else if (event.target.name === 'uid') {
    //   name = `\nNon-secure:\n${name}`;
    // }
    const hz = formatNumber(event.target.hz.toFixed(0)).padStart(10);
    process.stdout.write(`${name}${pico.bold(hz)}${pico.dim(' ops/sec')}\n`);
  })
  .run();
