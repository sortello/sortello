describe('sort list asc', function () {
  /**
   * [selectWindow Focus the browser to the index window. Implementation by http://stackoverflow.com/questions/21700162/protractor-e2e-testing-error-object-object-object-has-no-method-getwindowha]
   * @param  {[Object]} index [Is the index of the window. E.g., 0=browser, 1=FBpopup]
   * @return {[!webdriver.promise.Promise.<void>]}       [Promise resolved when the index window is focused.]
   */
  selectWindow = function (index) {
    browser.driver.wait(function () {
      return browser.driver.getAllWindowHandles().then(function (handles) {
        if (handles.length > index) {
          return true;
        }
      });
    });
    return browser.driver.getAllWindowHandles().then(function (handles) {
      return browser.driver.switchTo().window(handles[index]);
    });
  };

  accessFromChromeExtension = function () {
    browser.get('/?extId=' + browser.params.extId);
    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.css('.continue-to-choices--button'))), 10000).then(
      function () {
        $(".continue-to-choices--button").click();
      });
    selectWindow(1);

    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.css('#surface form a.button.primary'))), 10000).then(
      function () {
        $("#surface form a.button.primary").click();
      });

    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.css('input#user'))), 10000).then(
      function () {
        $('input#user').sendKeys(browser.params.username);
        $('input#password').sendKeys(browser.params.password);
        $('input#login').click().then(function () {
          browser.driver.sleep(1000);
          $("input.primary[name='approve']").click();
          selectWindow(0);
        });
      });
  }

  it('shows a recap after the choices', function () {
    accessFromChromeExtension();
    browser.driver.sleep(1000);

    function nextChoice () {
      let leftButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#left_button .card__title')));
      browser.wait(leftButton, 10000).then(function () {
        let rightButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#right_button .card__title')));
        browser.wait(rightButton, 10000).then(function () {
          let rightValue = rightButton.value_;
          let leftValue = leftButton.value_;
          if (parseInt(rightValue) > parseInt(leftValue)) {
            element(by.css('#right_button .container__card')).click()
          } else {
            element(by.css('#left_button .container__card')).click()
          }
        });
      })
      element.all(by.id("update_board")).count().then(function (size) {
        if (size == 0) {
          nextChoice();
        }
      });
    }

    nextChoice();

    browser.driver.sleep(2000);
    let cards = browser.executeScript("return arguments[0].innerHTML;", element(by.css('div.order-recap')));
    browser.wait(cards, 10000).then(function (html) {
      expect(html.indexOf('<p>10</p><p>9</p><p>8</p><p>7</p><p>6</p><p>5</p><p>4</p><p>3</p><p>2</p><p>1</p>') !== -1).toBe(true);
    });
  });
});
