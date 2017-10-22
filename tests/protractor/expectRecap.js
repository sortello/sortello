module.exports.toBe = function(recapArray) {
  let showRecapButton = element(by.css('.trigger-button__link'));
  let EC = protractor.ExpectedConditions;
  browser.wait(EC.presenceOf(showRecapButton), 20000).then(function() {
    element(by.css('.trigger-button__link')).click();
    let recapDiv = element(by.css('div.order-recap'));
    browser.wait(EC.presenceOf(recapDiv), 20000).then(function() {
      let recap = element.all(by.css('div.order-recap div.recap__item'));
      expect(recap.getText()).toEqual(recapArray);
    });
  });
};
