#!/usr/bin/env node
'use strict';
require('ts-node').register({
  transpileOnly: true,
  project: require('path').join(__dirname, '../tsconfig.json'),
});
require('../src/cli/main');
