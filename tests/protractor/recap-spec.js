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

    let EC = protractor.ExpectedConditions;
    let continueButton = element(by.css('.continue-to-choices--button'));
    browser.wait(EC.visibilityOf(continueButton), 10000);
    browser.actions().mouseMove(continueButton).click().perform();
    browser.driver.sleep(200);
    selectWindow(1);

    EC = protractor.ExpectedConditions;
    let acceptButton = element(by.css('#surface form a.button.primary'));
    browser.wait(EC.visibilityOf(acceptButton), 10000);
    browser.actions().mouseMove(acceptButton).click().perform();

    EC = protractor.ExpectedConditions;
    let submitButton = element(by.css('input#user'));
    browser.wait(EC.visibilityOf(submitButton), 10000);

    let loginButton = element(by.css('input#login'));
    element(by.css('input#user')).sendKeys(browser.params.username);
    element(by.css('input#password')).sendKeys(browser.params.password);
    browser.actions().mouseMove(loginButton).click().perform().then(function () {
      let EC = protractor.ExpectedConditions;
      let approveButton = element(by.css("input.primary[name='approve']"));
      browser.wait(EC.visibilityOf(approveButton), 10000);
      browser.actions().mouseMove(approveButton).click().perform();
      selectWindow(0);
    });
  }

  it('shows a recap after the choices', function () {
    accessFromChromeExtension();
    browser.driver.sleep(1000);

    function nextChoice () {

      let EC = protractor.ExpectedConditions;
      let leftButton = element(by.css('#left_button .card__title:first-child'));
      browser.wait(EC.visibilityOf(leftButton), 10000).then(function () {
        EC = protractor.ExpectedConditions;
        let rightButton = element(by.css('#right_button .card__title:first-child'));
        browser.wait(EC.visibilityOf(rightButton), 10000).then(function () {
          rightButton.getText().then(function (rv) {
            let rightValue = rv;
            leftButton.getText().then(function (lv) {
              let leftValue = lv;

              if (parseInt(rightValue) > parseInt(leftValue)) {
                element(by.css('#right_button .container__card')).click()
              } else {
                element(by.css('#left_button .container__card')).click()
              }
              element.all(by.id("update_board")).count().then(function (size) {
                if (size == 0) {
                  nextChoice();
                }
              });
            });
          });
        });
      });
    }

    nextChoice();

    let recapDiv = element(by.css('div.order-recap'));
    let EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(recapDiv), 10000).then(function () {
      let foo = element(by.css('div.order-recap')).all(by.css('p'));
      expect(foo.getText()).toEqual( [ '10', '9', '8', '7', '6', '5', '4', '3', '2', '1' ] );
    });
  });
});
