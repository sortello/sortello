describe('sort list forget', function () {
  it('prioritizes the test column in ascending order blacklisting the cards "2" and "7"', function () {
    browser.ignoreSynchronization = true;
    protractor.accessFromChromeExtension.accessFromChromeExtension();

    function nextChoice () {
      let leftButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#left_button .card__title')));
      browser.wait(leftButton, 20000).then(function () {
        let rightButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#right_button .card__title')));
        browser.wait(rightButton, 20000).then(function () {
          let rightValue = rightButton.value_;
          let leftValue = leftButton.value_;
          let autoclicked = false;

          if (parseInt(rightValue) === 2 || parseInt(rightValue) === 7) {
            element(by.css('#right_button .button-blacklist')).click();
            autoclicked = true;
          }
          if (parseInt(leftValue) === 2 || parseInt(leftValue) === 7) {
            element(by.css('#left_button .button-blacklist')).click();
            autoclicked = true;
          }

          if (!autoclicked) {
            if (parseInt(rightValue) < parseInt(leftValue)) {
              element(by.css('#right_button .container__card')).click()
            } else {
              element(by.css('#left_button .container__card')).click()
            }
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
    browser.wait(EC.visibilityOf(recapDiv), 20000).then(function () {
      let recap = element(by.css('div.order-recap')).all(by.css('p'));
      recap.getText().then(function (text) {
        let firstPart = text.splice(0,8);
        let lastPart = text;
        expect(firstPart).toEqual( [ '1', '3', '4', '5', '6', '8', '9', '10' ] );
        expect(lastPart.indexOf('2')).toBeGreaterThan(-1);
        expect(lastPart.indexOf('7')).toBeGreaterThan(-1);
        expect(lastPart.length).toEqual(2);
      });
    });
  });

});
