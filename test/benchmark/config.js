const randomInput1k = Array.from({ length: 1_000 }, (_, i) => Math.random());
const randomInput10k = Array.from({ length: 10_000 }, (_, i) => Math.random());
const randomInputObject1k = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, i])
);
const syncMapper = (a) => a * 2;
const asyncMapper = async (a) =>
  Math.sqrt(
    Math.sqrt(
      Math.sqrt(
        Math.sqrt(
          Math.sqrt(
            Math.sqrt(
              Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(a) * 100) * 3)))
            )
          )
        )
      )
    )
  );
const options = { concurrency: 80 };

const isWatch = process.argv.includes('--watch');

module.exports = {
  randomInput1k,
  randomInput10k,
  randomInputObject1k,
  syncMapper,
  asyncMapper,
  isWatch,
  options,
};
