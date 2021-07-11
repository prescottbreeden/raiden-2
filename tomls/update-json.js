const yargs = require('yargs-parser');
const {createData} = require('./create-data');
const {Maybe} = require('fp-tools');
const {print, parseTomlFiles, readTomlFiles} = require('./helpers');

const {_: files} = yargs(process.argv.slice(2));

Maybe.of(files)
  .map(print('[ Reading TOML file(s) ]'))
  .map(readTomlFiles)
  .map(print('[ Parsing TOML file(s) ]'))
  .map(parseTomlFiles)
  .map(print('[ Writing Data ]'))
  .map(createData);
