exports.config = {
  specs: [
    'tests/protractor/asc-choices-spec.js',
    'tests/protractor/desc-choices-spec.js',
    'tests/protractor/forget-spec.js',
    'tests/protractor/undo-spec.js',
    'tests/protractor/recap-spec.js',
    'tests/protractor/send-to-board-spec.js'
  ],
  restartBrowserBetweenTests: true,
  capabilities: {
    browserName: 'chrome',
    // chromeOptions: {
      // args: [ "--headless", "--disable-gpu", "--window-size=1200,800" ]
      // args: [  "--headless", "--window-size=1200,800" ]
    // }
  },
  baseUrl: 'http://localhost:4000',
  framework: 'jasmine',
  onPrepare: function() {
    browser.ignoreSynchronization = true;
    protractor.accessFromChromeExtension = require('./tests/protractor/accessFromChromeExtension.js');
    protractor.selectWindow = require('./tests/protractor/selectWindow.js');
  }
};