#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

const benchmark = require('benchmark');
const { mapSeries } = require('bluebird');
const pico = require('picocolors');

const suitesConfig = require('./suites');

function formatNumber(number) {
  return String(number)
    .replace(/\d{3}$/, ',$&')
    .replace(/^(\d|\d\d)(\d{3},)/, '$1,$2');
}

// function formatNumber(number) {
//   number = String(number).split('.');
//   return number[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',') +
//     (number[1] ? '.' + number[1] : '');
// }
module.exports = mapSeries(
  suitesConfig
    .filter(({ skip }) => !skip)
    .map(({ title, name: filename, cases }, i) => () => {
      let suite = new benchmark.Suite();
      const maxName = Math.max(...cases.map(({ name }) => name.length));
      return new Promise((resolve) => {
        if (i) console.log(`--------------------`);
        console.log(`Starting benchmark: ${title}...\n`);
        cases
          .filter(({ skip }) => !skip)
          // eslint-disable-next-line no-shadow
          .forEach(({ name, fn, args }) => {
            suite = suite.add(name, {
              defer: true,
              async fn(defer) {
                await fn(...args);
                defer.resolve();
              },
            });
          });
        suite
          .on('cycle', (event) => {
            // function toStringBench() {
            //   var bench = this,
            //       error = bench.error,
            //       hz = bench.hz,
            //       id = bench.id,
            //       stats = bench.stats,
            //       size = stats.sample.length,
            //       pm = '\xb1',
            //       result = bench.name || (_.isNaN(id) ? id : '<Test #' + id + '>');

            //   if (error) {
            //     var errorStr;
            //     if (!_.isObject(error)) {
            //       errorStr = String(error);
            //     } else if (!_.isError(Error)) {
            //       errorStr = join(error);
            //     } else {
            //       // Error#name and Error#message properties are non-enumerable.
            //       errorStr = join(_.assign({ 'name': error.name, 'message': error.message }, error));
            //     }
            //     result += ': ' + errorStr;
            //   }
            //   else {
            //     result += ' x ' + formatNumber(hz.toFixed(hz < 100 ? 2 : 0)) + ' ops/sec ' + pm +
            //       stats.rme.toFixed(2) + '% (' + size + ' run' + (size == 1 ? '' : 's') + ' sampled)';
            //   }
            //   return result;
            // }
            // console.log(`${String(event.target)}\n`);

            const { hz, name, stats, error } = event.target;
            if (error) {
              console.log(event.target);
              return;
            }
            const { rme } = stats;
            const size = stats.sample.length;
            const pm = '\xb1';

            const ops = formatNumber(hz.toFixed(hz < 100 ? 2 : 0)).padStart(10);
            console.log(
              [
                pico.blue(name.padEnd(maxName + 3)),
                pico.bold(String(ops).padStart(10)),
                pico.dim(' ops/sec'),
                `${pm}${rme.toFixed(2)}%`.padStart(7),
                pico.dim(`${size} run${size === 1 ? '' : 's'}`.padStart(10)),
              ].join('')
            );
            // console.log(`${name}${pico.bold(hz)}${pico.dim(' ops/sec')}\n`);
          })
          .on('complete', function () {
            console.log(
              `\nFastest is ${pico.green(this.filter('fastest').map('name'))}\n`
            );
            resolve();
          })
          .run();
      });
    }),
  (fn) => fn()
);
