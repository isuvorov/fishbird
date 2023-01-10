const { map, props } = require('../../lib/index.js');
// const { map2 } = require('../../lib/map2.js');
const Bluebird = require('bluebird');
const pMap = require('p-map');
const pProps = require('p-props');

const {
  PromiseMap,
  PromiseProps,
  ForPushMap,
  ForOfPushMap,
  ForInPushMap,
} = require('./promise');
const {
  randomInput1k,
  randomInputObject1k,
  syncMapper,
  asyncMapper,
  options,
  isWatch,
} = require('./config');

module.exports = [
  {
    name: 'map-random1k-syncMapper-concurrency80',
    title: 'Map - random array[1k] - sync mapper - {concurrency: 80}',
    skip: isWatch,
    cases: [
      {
        name: 'ForPushMap',
        fn: ForPushMap,
        args: [randomInput1k, syncMapper, options],
      },
      {
        name: 'ForOfPushMap',
        fn: ForOfPushMap,
        args: [randomInput1k, syncMapper, options],
      },
      {
        name: 'ForInPushMap',
        fn: ForInPushMap,
        args: [randomInput1k, syncMapper, options],
      },
      {
        name: 'Fishbird.map',
        fn: map,
        args: [randomInput1k, syncMapper, options],
      },
      {
        name: 'pMap',
        fn: pMap,
        args: [randomInput1k, syncMapper, options],
      },
      {
        name: 'Bluebird.map',
        fn: Bluebird.map,
        args: [randomInput1k, syncMapper, options],
      },
      {
        name: 'Promise.all map',
        fn: PromiseMap,
        args: [randomInput1k, syncMapper, options],
      },
    ],
  },
  {
    name: 'map-random1k-asyncMapper-concurrency80',
    title: 'Map - random array[1k] - async mapper - {concurrency: 80}',
    cases: [
      // {
      //   name: 'Fishbird.map2',
      //   fn: map2,
      //   args: [randomInput1k, asyncMapper, options],
      // },
      {
        name: 'Fishbird.map',
        fn: map,
        args: [randomInput1k, asyncMapper, options],
      },
      {
        name: 'pMap',
        fn: pMap,
        args: [randomInput1k, asyncMapper, options],
      },
      {
        name: 'Bluebird.map',
        fn: Bluebird.map,
        args: [randomInput1k, asyncMapper, options],
      },
      {
        name: 'Promise.all map',
        fn: PromiseMap,
        args: [randomInput1k, asyncMapper, options],
      },
    ],
  },
  {
    name: 'props-random1k-asyncMapper-concurrency80',
    title: 'Props - random object[1k] - async mapper - {concurrency: 80}',
    cases: [
      {
        name: 'Fishbird.props',
        fn: props,
        args: [randomInputObject1k, asyncMapper, options],
      },
      {
        name: 'pProps',
        fn: pProps,
        args: [randomInputObject1k, asyncMapper, options],
      },
      {
        name: 'Bluebird.props',
        fn: Bluebird.props,
        args: [randomInputObject1k, asyncMapper, options],
      },
      {
        name: 'Promise.all props',
        fn: PromiseProps,
        args: [randomInputObject1k, asyncMapper, options],
      },
    ],
  },
];
