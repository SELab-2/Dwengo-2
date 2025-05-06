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

module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  src_folders: ['tests/e2e'],
  output_folder: '/tests/output',
  // test_runner: 'mocha',

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
  
  test_settings: {
    debug: true,
    verbose: true,
    firefox: {
      launch_url: 'http://localhost:4200',
      desiredCapabilities: {
        browserName : 'firefox',
        'moz:firefoxOptions': {
          binary: '/usr/bin/firefox',
          args: [ 
            '--headless'
          ],
        }
      },
      webdriver: {
        start_process: true,
        server_path: "node_modules/.bin/geckodriver",
        port: 4444,
      }
    },

    chrome: {
      launch_url: 'http://localhost:4200',
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          binary: '/snap/bin/chromium',
          args: [ 
            '--headless',
            // Extra options because otherwise get that the ChromeDriver cannot create a session
            '--disable-gpu', 
            '--no-sandbox',
            '--disable-software-rasterizer',
            '--disable-dev-shm-usage',
            '--user-data-dir=/tmp/chrome-profile',
          ],
        }
      },
      webdriver: {
        start_process: true,
        server_path: '/usr/bin/chromedriver',
        port: 9515,
      }
    }

  }
};
