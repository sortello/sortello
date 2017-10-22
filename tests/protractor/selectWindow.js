/**
 * [selectWindow Focus the browser to the index window. Implementation by http://stackoverflow.com/questions/21700162/protractor-e2e-testing-error-object-object-object-has-no-method-getwindowha]
 * @param  {[Object]} index [Is the index of the window. E.g., 0=browser, 1=FBpopup]
 * @return {[!webdriver.promise.Promise.<void>]}       [Promise resolved when the index window is focused.]
 */

module.exports.selectWindow = function(index) {
  browser.driver.wait(function() {
    return browser.driver.getAllWindowHandles().then(function(handles) {
      if (handles.length > index) {
        return true;
      }
    });
  });
  return browser.driver.getAllWindowHandles().then(function(handles) {
    return browser.driver.switchTo().window(handles[index]);
  });
};
