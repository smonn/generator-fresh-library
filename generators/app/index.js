'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the mathematical ${chalk.red('fresh-library')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Name:',
        default: _.kebabCase(this.appname)
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description:'
      },
      {
        type: 'list',
        name: 'license',
        message: 'License:',
        choices: [
          'Apache-2.0',
          'BSD-2-Clause',
          'BSD-3-Clause',
          'CDDL-1.0',
          'EPL-1.0',
          'GPL-2.0',
          'GPL-3.0',
          'LGPL-2.0',
          'LGPL-2.1',
          'LGPL-3.0',
          'MIT',
          'MPL-2.0',
          'UNLICENSED'
        ],
        default: 10
      },
      {
        type: 'list',
        name: 'stage',
        message: 'Babel stage preset:',
        choices: [
          'babel-preset-stage-0',
          'babel-preset-stage-1',
          'babel-preset-stage-2',
          'babel-preset-stage-3',
          'babel-preset-stage-4'
        ],
        default: 2
      },
      {
        type: 'confirm',
        name: 'eslint',
        message: 'Use ESLint and Prettier?',
        default: true
      },
      {
        type: 'confirm',
        name: 'react',
        message: 'Use React?',
        default: true
      },
      {
        type: 'confirm',
        name: 'yarn',
        message: 'Use Yarn?',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const execScript = this.props.yarn ? 'yarn' : 'npm run';
    const packageJSON = {
      name: _.kebabCase(this.props.name),
      description: this.props.description,
      version: '0.0.0',
      license: this.props.license,
      main: 'dist/cjs/index.js',
      module: 'dist/esm/index.js',
      files: ['dist'],
      scripts: {
        test: 'jest',
        'build:cjs': 'BABEL_ENV=cjs babel src --out-dir dist/cjs --copy-files',
        'build:esm': 'BABEL_ENV=esm babel src --out-dir dist/esm --copy-files',
        build: `${execScript} build:cjs && ${execScript} build:esm`,
        clean: 'rimraf dist'
      },
      jest: {
        transform: {
          '^.+\\.jsx?$': 'babel-jest'
        }
      }
    };

    const babel = {
      presets: [(this.props.stage || '').substr(13)],
      ignore: [
        'src/**/*.test.js',
        'src/**/*.test.jsx',
        'src/**/*.spec.js',
        'src/**/*.spec.jsx'
      ],
      env: {
        cjs: {
          presets: [
            'minify',
            [
              'env',
              {
                modules: 'commonjs',
                targets: {
                  node: 'current',
                  browsers: 'defaults'
                }
              }
            ]
          ]
        },
        esm: {
          presets: [
            'minify',
            [
              'env',
              {
                modules: false,
                targets: {
                  node: 'current',
                  browsers: 'defaults'
                }
              }
            ]
          ]
        },
        test: {
          presets: [
            [
              'env',
              {
                modules: 'commonjs',
                targets: {
                  node: 'current',
                  browsers: 'defaults'
                }
              }
            ]
          ]
        }
      }
    };

    const eslint = {
      parser: 'babel-eslint',
      extends: ['eslint:recommended', 'plugin:prettier/recommended'],
      env: {
        jest: true,
        browser: true,
        node: true
      },
      plugins: ['prettier'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
            trailingComma: 'all',
            arrowParens: 'always'
          }
        ]
      }
    };

    if (this.props.react) {
      packageJSON.peerDependencies = {
        ...(packageJSON.peerDependencies || {}),
        react: '15.x || 16.x'
      };
      babel.presets.push('react');
      eslint.extends.push('plugin:react/recommended');
      eslint.plugins.push('react');
    }

    packageJSON.babel = babel;

    if (this.props.eslint) {
      packageJSON.scripts.lint = 'eslint src __tests__';
      packageJSON.eslintConfig = eslint;
    }

    this.fs.extendJSON(this.destinationPath('package.json'), packageJSON);
    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('src/index.js'), this.destinationPath('src/index.js'));
    this.fs.copy(
      this.templatePath('__tests__/index.test.js'),
      this.destinationPath('__tests__/index.test.js')
    );
  }

  install() {
    const devDependencies = [
      'babel-cli',
      'babel-core',
      'babel-preset-env',
      'babel-preset-minify',
      'babel-jest',
      this.props.stage,
      'jest',
      'rimraf'
    ];

    if (this.props.eslint) {
      devDependencies.push(
        'eslint',
        'babel-eslint',
        'prettier',
        'eslint-plugin-prettier',
        'eslint-config-prettier'
      );

      if (this.props.react) {
        devDependencies.push('eslint-plugin-react');
      }
    }

    if (this.props.react) {
      devDependencies.push('babel-preset-react', 'react');
    }

    this.log(chalk.green('   install dependencies'));
    if (this.props.yarn) {
      this.yarnInstall(devDependencies, { dev: true, silent: true, 'no-progress': true });
    } else {
      this.npmInstall(devDependencies, {
        'save-dev': true,
        'no-progress': true,
        silent: true
      });
    }
  }
};
