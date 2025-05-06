//
// Refer to the online docs for more details:
// https://nightwatchjs.org/guide/configuration/nightwatch-configuration-file.html
//
//  _   _  _         _      _                     _          _
// | \ | |(_)       | |    | |                   | |        | |
// |  \| | _   __ _ | |__  | |_ __      __  __ _ | |_   ___ | |__
// | . ` || | / _` || '_ \ | __|\ \ /\ / / / _` || __| / __|| '_ \
// | |\  || || (_| || | | || |_  \ V  V / | (_| || |_ | (__ | | | |
// \_| \_/|_| \__, ||_| |_| \__|  \_/\_/   \__,_| \__| \___||_| |_|
//             __/ |
//            |___/
//

const { log } = require('console');

module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  src_folders: ['tests/e2e'],
  output_folder: 'tests/output',

  // See https://nightwatchjs.org/guide/concepts/page-object-model.html
  page_objects_path: ['node_modules/nightwatch/examples/pages/'],

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-commands.html
  custom_commands_path: ['node_modules/nightwatch/examples/custom-commands/'],

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-assertions.html
  custom_assertions_path: '',

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-plugins.html
  plugins: [],
  
  // See https://nightwatchjs.org/guide/concepts/test-globals.html#external-test-globals
  globals_path : '',

  webdriver: {},
  
  test_workers: {
    enabled: true,
    workers: 'auto'
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        browserName : 'firefox',
        'moz:firefoxOptions': {
          binary: '/usr/bin/firefox',
          args: [ '-headless' ],
        }
      },
      webdriver: {
        start_process: true,
        server_path: "node_modules/.bin/geckodriver",
        port: 4444,
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: [ '--headless', '--disable-gpu', '--no-sandbox' ],
        }
      },
      webdriver: {
        start_process: true,
        server_path: "node_modules/.bin/chromedriver",
        port: 9515,
      }
    }

  }
};
