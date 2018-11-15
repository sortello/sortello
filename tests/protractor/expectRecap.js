module.exports.toBe = function (recapArray, b = null, cb = null) {
  if (b === null) {
    b = browser
  }
  return protractor.common.waitForElementAndClick('.trigger-button__link', b).then(() => {
    protractor.common.waitForElement('div.order-recap', b).then(function () {
      let recap = b.element.all(by.css('div.order-recap div.recap__item'))
      expect(recap.getText()).toEqual(recapArray)
      if(cb) cb();
    })
  })
}

