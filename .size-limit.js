module.exports = [
    {
      path: "lib/index.js",
      limit: "1kb"
    },
    {
      path: "lib/index.js",
      import: "{ map, mapSeries, delay }",
      limit: "1kb"
    },
    {
      path: "lib/index.js",
      import: "*",
      limit: "1kb"
    }
  ]