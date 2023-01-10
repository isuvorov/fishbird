const { add, cycle, suite, save } = require('benny');
const { mapSeries } = require('bluebird');
const suitesConfig = require('./suites');

module.exports = mapSeries(
  suitesConfig
    .filter(({ skip }) => !skip)
    .map(
      ({ title, name, cases }) =>
        () =>
          suite(
            title,
            ...cases
              .filter(({ skip }) => !skip)
              // eslint-disable-next-line no-shadow
              .map(({ name, fn, args }) => add(name, () => fn(...args))),
            cycle(),
            // save({ file: name })
          )
    ),
  (fn) => fn()
);
