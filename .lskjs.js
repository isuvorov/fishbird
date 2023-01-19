module.exports = {
  pathexec: process.env.USER === 'isuvorov' ? {
    paths: [__dirname + '/../lskjs/cli/cli-scripts']
  } : {}
}