require('ignore-styles');
require('@babel/register')({
  extensions: ['.js', '.jsx'],
  presets: ['@babel/preset-env', '@babel/preset-react'],
});
require('jsdom-global/register');

const mocha = require('mocha');
const glob = require('glob');
const mochaProcess = new mocha({
  reporter:'spec',
  require: []
});

const testFiles = glob.sync('src/tests/**/*.test.js');
testFiles.forEach((file) => mochaProcess.addFile(file));
mochaProcess.run((failures) => {
  process.exitCode = failures ? 1 : 0;
});