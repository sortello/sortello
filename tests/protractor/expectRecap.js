module.exports.toBe = function (recapArray, b = null) {
  if (b == null) {
    b = browser
  }

  let showRecapButton = b.element(by.css('.trigger-button__link'));
  let EC = protractor.ExpectedConditions;
  b.wait(EC.presenceOf(showRecapButton), 20000).then(function () {
    b.element(by.css('.trigger-button__link')).click();
    let recapDiv = b.element(by.css('div.order-recap'));
    b.wait(EC.presenceOf(recapDiv), 20000).then(function () {
      let recap = b.element.all(by.css('div.order-recap div.recap__item'));
      expect(recap.getText()).toEqual(recapArray);
    });
  });
}

