const R = require('ramda');
const fs = require('fs-extra');
const toml = require('toml');
const { compose, map, trace } = require('fp-tools');
const { Reset, FgCyan, FgRed, FgGreen } = require('./colors');
const { CONFIG_DIR } = require('./file-paths');

const GREEN = `${FgGreen}%s${Reset}`;
const RED = `${FgRed}%s${Reset}`;
const CYAN = `${FgCyan}%s${Reset}`;

const print = msg => x => {
  console.log(CYAN, msg);
  return x;
};

// status :: maybe[] -> void
const status = maybe => {
  const isJust = maybe ? maybe.isJust : false;
  if (isJust) {
    console.log(GREEN, '[ Operating within normal parameters ]');
  } else {
    console.log(RED, '[ AN ERROR ]');
  }
};

// continueIfTrue :: boolean -> f
const continueIfTrue = bool => (bool ? R.identity : R.always(null));

// entityName :: object -> string
const entityName = R.prop('name');

// readTomlFiles :: string[] -> (string | null)[]
const readTomlFiles = map(
  R.tryCatch(
    compose(fs.readFileSync, R.concat(R.__, '.toml'), R.concat(CONFIG_DIR)),
    () => null
  )
);

// parseTomlFiles :: string[] -> object[]
const parseTomlFiles = map(toml.parse);

module.exports = {
  continueIfTrue,
  entityName,
  parseTomlFiles,
  print,
  readTomlFiles,
  status,
};
