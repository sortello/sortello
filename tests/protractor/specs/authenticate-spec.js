describe('authenticate', function() {
  it('authenticates on Trello', function() {
    browser.ignoreSynchronization = true;
    protractor.accessFromChromeExtension.accessFromChromeExtension();
    // browser.driver.sleep(1000);
    let EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(element(by.css('.container__choose-card'))), 5000).then(function() {
      element
        .all(by.css('.container__choose-card'))
        .count()
        .then(function(size) {
          expect(size).toBe(1);
        });
    });
  });
});
