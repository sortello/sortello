describe('sorted list recap', function () {
  it('shows a recap after the choices', function () {
    browser.ignoreSynchronization = true
    protractor.accessFromChromeExtension.accessFromChromeExtension();
    browser.driver.sleep(1000);
    let EC = protractor.ExpectedConditions;

    function nextChoice () {
      let leftCard = element(by.css('#left_button .card__title'));
      let rightCard = element(by.css('#right_button .card__title'));

      browser.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 10000).then(function () {
        leftCard.getText().then(function (leftValue) {
          rightCard.getText().then(function (rightValue) {

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
    }

    let allLabel = element(by.css('.label__item.label__none'));
    browser.wait(EC.presenceOf(allLabel), 20000).then(function () {
      allLabel.click();
      nextChoice();
    })

    protractor.expectRecap.toBe(['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']);

  });
});
