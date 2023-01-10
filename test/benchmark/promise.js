/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

const ForPushMap = (items, mapper) => {
  const res = [];
  for (let i = 0; i < items.length; i++) {
    res.push(mapper(items[i]));
  }
  return res;
};
const ForInPushMap = (items, mapper) => {
  const res = [];
  for (const i in items) {
    res.push(mapper(items[i]));
  }
  return res;
};
const ForOfPushMap = (items, mapper) => {
  const res = [];
  for (const item of items) {
    res.push(mapper(item));
  }
  return res;
};

const PromiseMap = (items, mapper) => Promise.all(items.map(mapper));
const PromiseProps = async (items, mapper) =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(items).map(async ([key, value]) => [
        key,
        await mapper(value, key),
      ])
    )
  );

module.exports = {
  ForPushMap,
  ForOfPushMap,
  ForInPushMap,
  PromiseMap,
  PromiseProps,
};
