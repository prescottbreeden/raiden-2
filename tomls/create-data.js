const R = require('ramda');
const fs = require('fs-extra');
const {compose, map, trace} = require('fp-tools');
const {entityName} = require('./helpers');
const {OUTPUT_DIR} = require('./file-paths');

// buildData :: object -> string
const buildData = data => {
  return JSON.stringify(data, null, 1);
};

// createType :: object[] -> (undefined | null)[]
const createData = map(
  R.tryCatch(
    R.converge(fs.writeFileSync, [
      compose(R.concat(R.__, '.json'), R.concat(OUTPUT_DIR), entityName),
      buildData,
    ]),
    e => trace('errored', e)
  )
);

module.exports = {
  createData,
};
