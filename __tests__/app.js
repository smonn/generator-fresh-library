'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-fresh-library:app', () => {
  let prompts;

  function run() {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts(prompts);
  }

  beforeAll(() => {
    prompts = {
      name: 'test-library',
      description: 'My test library',
      license: 'MIT',
      stage: 'babel-stage-2',
      react: false,
      yarn: true
    };
  });

  it('creates files with yarn', async () => {
    await run();

    assert.file([
      'package.json',
      '.gitignore',
      'src/index.js',
      '__tests__/index.test.js'
    ]);
  });

  it('creates files without yarn', async () => {
    prompts.yarn = false;

    await run();

    assert.file([
      'package.json',
      '.gitignore',
      'src/index.js',
      '__tests__/index.test.js'
    ]);
  });
});
