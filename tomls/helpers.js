const R = require('ramda')
const path = require('path')
const fs = require('fs-extra')
const toml = require('toml')
const { CYAN, MAGENTA, RED } = require('./colors')
const { CONFIG_DIR, OUTPUT_DIR } = require('./file-paths')
const { readdirSync } = require('fs')

// print :: string -> a -> a
const print = (msg) => (x) => {
  console.log(CYAN, msg)
  return x
}

// error :: string -> a -> a
const error = (msg) => (e) => {
  console.log(RED, msg)
  console.error(e)
}

// writeJSON :: object -> (undefined | string)
const writeJSON = R.tryCatch(
  R.converge(fs.writeFileSync, [
    R.pipe(R.prop('name'), R.concat(OUTPUT_DIR), R.concat(R.__, '.json')),
    (s) => JSON.stringify(s, null, 1),
  ]),
  error('Unable to writeJSON')
)

// runAllConfigFiles :: () -> undefined
const updateAllDirectories = () => {
  console.log(CYAN, '[ Scanning All Directories ]')
  fs.readdirSync(CONFIG_DIR).forEach(
    R.tryCatch(updateDirectory, error('updateDirectory failed'))
  )
}

// updateDirectory :: string -> undefined
const updateDirectory = (dir) =>
  R.pipe(
    (dir) => console.log(MAGENTA, `[ Updating Directory: ${dir} ]`) || dir,
    (dir) => path.join(CONFIG_DIR, dir),
    (path) => print(`[ Reading ${path}]`)(path),
    R.tryCatch(readdirSync, error('unable to read parent directory')),
    R.filter(R.compose(R.not, R.includes('README'))),
    R.map(
      R.pipe(
        (s) => [CONFIG_DIR, dir, s].join('/'),
        R.tryCatch(fs.readFileSync, error('Unable to read child directory'))
      )
    ),
    R.pipe(R.map(toml.parse), R.forEach(writeJSON))
  )(dir)

// readData :: string -> (buffer | string)
const readData = R.tryCatch(
  R.pipe(R.concat(CONFIG_DIR), R.concat(R.__, '.toml'), fs.readFileSync),
  error('readData failed')
)

// specifiedFiles :: string[] -> (undefined | string)[]
const specifiedFiles = R.pipe(
  print('[ Reading Specified TOML file(s) ]'),
  R.map(readData),
  print('[ Parsing TOML file(s) ]'),
  R.map(toml.parse),
  print('[ Writing Data ]'),
  R.map(writeJSON)
)

// runScript :: string[] -> undefined
const runScript = (input) => {
  console.log(CYAN, `[ Updating: ${input.length ? input : 'All'} ]`)
  return input.length ? specifiedFiles(input) : updateAllDirectories()
}

module.exports = {
  runScript,
}
