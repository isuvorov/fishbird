/* eslint-disable import/no-duplicates */
/* eslint-disable no-console */
import fishbird from 'fishbird';
import * as fishbird2 from 'fishbird';
import { map } from 'fishbird';
import delay from 'fishbird/delay';
import { mapSeries } from 'fishbird/mapSeries';


console.log('Hello World');
console.log('fishbird', fishbird);
console.log('fishbird2', fishbird2);
console.log('delay', delay);
console.log('map', map);
console.log('mapSeries', mapSeries);

async function main() {
  await delay(100);
  const input = [1, 2, 3];
  console.log('start', input);
  const temp = await map([1, 2, 3], (a) => a * 2);
  await delay(100);
  const result = await mapSeries(temp, (a) => a * 3);
  console.log('end', result);
}
main();
