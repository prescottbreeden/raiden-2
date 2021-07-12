const yargs = require('yargs-parser')
const { runScript } = require('./helpers')
const { _: files } = yargs(process.argv.slice(2))

// Call this script with either:
// Specified Paths: e.g. $ node update-json enemies/blackbird enemies/itemGiver
// No Arguments: e.g. $ node update-json
runScript(files)
