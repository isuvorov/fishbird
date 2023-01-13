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

const whileX2 = (items) => {
  const result = [];
  let i = 0;
  while (i < items.length) {
    result.push(items[i] * 2);
    i += 1;
  }
  return result;
};

module.exports = [
  {
    name: 'test1',
    title: 'test1',
    skip: isWatch,
    cases: [
      {
        name: 'while 1',
        fn: whileX2,
        args: [Array.from({ length: 1 }, (_, i) => i)],
      },
      {
        name: 'while 10',
        fn: whileX2,
        args: [Array.from({ length: 10 }, (_, i) => i)],
      },
      {
        name: 'while 100',
        fn: whileX2,
        args: [Array.from({ length: 100 }, (_, i) => i)],
      },
      {
        name: 'while 1k',
        fn: whileX2,
        args: [Array.from({ length: 1_000 }, (_, i) => i)],
      },
      {
        name: 'while 10k',
        fn: whileX2,
        args: [Array.from({ length: 10_000 }, (_, i) => i)],
      },
      {
        name: 'while 100k',
        fn: whileX2,
        args: [Array.from({ length: 100_000 }, (_, i) => i)],
      },
      {
        name: 'while 1kk',
        fn: whileX2,
        args: [Array.from({ length: 1_000_000 }, (_, i) => i)],
      },
    ],
  },
  {
    name: 'test2',
    title: 'test2',
    // skip: isWatch,
    cases: [
      {
        name: 'while 1k',
        fn: whileX2,
        args: [Array.from({ length: 1_000 }, (_, i) => i)],
      },
      {
        name: 'while without mapper',
        fn: (items) => {
          const result = [];
          let i = 0;
          while (i < items.length) {
            result.push(items[i] * 2);
            i += 1;
          }
          return result;
        },
        args: [randomInput1k, syncMapper, options],
      },
      {
        name: 'for++',
        fn: (items, mapper) => {
          const result = [];
          for (let i = 0; i < items.length; i += 1) {
            result.push(mapper(items[i]));
          }
          return result;
        },
        args: [randomInput1k, syncMapper, options],
      },
      {
        name: 'for--',
        fn: (items, mapper) => {
          const result = [];
          for (let i = items.length; i > 0; i -= 1) {
            result.push(mapper(items[i - 1]));
          }
          return result;
        },
        args: [randomInput1k, syncMapper, options],
      },
      {
        name: 'while',
        fn: (items, mapper) => {
          const result = [];
          let i = 0;
          while (i < items.length) {
            result.push(mapper(items[i]));
            i += 1;
          }
          return result;
        },
        args: [randomInput1k, syncMapper, options],
      },
      {
        name: 'async while',
        fn: async (items, mapper) => {
          const result = [];
          let i = 0;
          while (i < items.length) {
            // eslint-disable-next-line no-await-in-loop
            result.push(await mapper(items[i]));
            i += 1;
          }
          return result;
        },

        args: [randomInput1k, syncMapper, options],
      },
    ],
  },
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
