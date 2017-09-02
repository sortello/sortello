module.exports.toBe = function (recapArray) {
  let recapDiv = element(by.css('div.order-recap'));
  let EC = protractor.ExpectedConditions;
  browser.wait(EC.visibilityOf(recapDiv), 20000).then(function () {
    let recap = element(by.css('div.order-recap')).all(by.css('p'));
    expect(recap.getText()).toEqual(recapArray);
  });
}