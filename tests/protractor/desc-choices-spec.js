describe('sort list desc', function () {
  it('prioritizes the test column in descending order', function () {
    browser.ignoreSynchronization = true;
    protractor.accessFromChromeExtension.accessFromChromeExtension();
    browser.driver.sleep(1000);

    function nextChoice () {
      let leftButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#left_button .card__title')));
      browser.wait(leftButton, 20000).then(function () {
        let rightButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#right_button .card__title')));
        browser.wait(rightButton, 20000).then(function () {
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
    let recapDiv = element(by.css('div.order-recap'));
    let EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(recapDiv), 10000).then(function () {
      let foo = element(by.css('div.order-recap')).all(by.css('p'));
      expect(foo.getText()).toEqual(['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']);
    });
  });
});
