'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-fresh-library:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
      name: 'test-library',
      description: 'My test library',
      license: 'MIT',
      stage: 'babel-stage-2',
      react: false,
      yarn: true
    });
  });

  it('creates files', () => {
    assert.file([
      'package.json',
      '.gitignore',
      'src/index.js',
      '__tests__/index.test.js'
    ]);
  });
});
