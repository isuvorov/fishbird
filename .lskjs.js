module.exports = process.env.USER === 'isuvorov' ? {
  pathexec: {
    paths: [__dirname + '/../lskjs/cli/cli-scripts']
  }
} : {}