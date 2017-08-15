exports.config = {
  specs: ['__tests__/protractor/*spec.js'],
  capabilities: {
    browserName: 'chrome'
  },
  baseUrl: 'http://localhost:4000',
  framework: 'jasmine',
  onPrepare: function() {
    browser.ignoreSynchronization = true;
  }
};