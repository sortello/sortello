describe('sort list', function () {
  it('prioritizes the test column in defined order', function () {

    let targetOrder = ['6', '9', '5', '4', '1', '8', '3', '10', '2', '7']

    browser.ignoreSynchronization = true;
    protractor.simpleAccessFromChromeExtension.accessFromChromeExtension()
    let EC = protractor.ExpectedConditions;

    function nextChoice () {
      let leftCard = element(by.css('#left_button .card__title'));
      let rightCard = element(by.css('#right_button .card__title'));

      browser.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function () {
        leftCard.getText().then(function (leftValue) {
          rightCard.getText().then(function (rightValue) {
            if (targetOrder.indexOf(leftValue) < targetOrder.indexOf(rightValue)) {
              element(by.css('#left_button .container__card')).click()
            } else {
              element(by.css('#right_button .container__card')).click()
            }
          });
        });
      });
      element.all(by.id("update_board")).count().then(function (size) {
        if (size == 0) {
          nextChoice();
        }
      });
    }

    let allLabel = element(by.css('.label__item.label__none'));
    browser.wait(EC.presenceOf(allLabel), 20000).then(function () {
      allLabel.click();
      nextChoice();
    })

    protractor.expectRecap.toBe(targetOrder);
  });
});
