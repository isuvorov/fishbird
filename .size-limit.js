const packages = ['delay', 'map', 'mapSeries', 'props', ]

module.exports = [
  ...['js', 'mjs'].map((ext) => ([
    {
      "path": `lib/index.${ext}`,
      "limit": "2kb"
    },
    ...packages.map((pkg) => ({
      "path": `lib/${pkg}.${ext}`,
      "limit": "1kb"
    }))
  ])).flat(),
]