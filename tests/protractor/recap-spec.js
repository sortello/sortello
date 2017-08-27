describe('sorted list recap', function () {
  it('shows a recap after the choices', function () {
    browser.ignoreSynchronization = true
    protractor.accessFromChromeExtension.accessFromChromeExtension();
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
