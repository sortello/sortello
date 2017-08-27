describe('sort list asc', function () {
  it('sends data to board correctly', function () {
    browser.ignoreSynchronization = true;
    protractor.accessFromChromeExtension.accessFromChromeExtension();
    browser.driver.sleep(1000);

    function nextChoice () {
      let leftButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#left_button .card__title')));
      browser.wait(leftButton, 10000).then(function () {
        let rightButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#right_button .card__title')));
        browser.wait(rightButton, 10000).then(function () {
          if (Math.random() >= 0.5) {
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
    let recapListText;
    browser.wait(EC.visibilityOf(recapDiv), 10000).then(function () {
      element(by.css('div.order-recap')).all(by.css('p')).getText().then(function (text) {
        recapListText = text;
      });
    });

    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.id('update_board'))), 50000).then(
      function () {
        $("#update_board").click();
      });
    browser.driver.sleep(5000);

    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.css('.check-trello__button'))), 50000).then(
      function () {
        $(".check-trello__button").click();
      });
    browser.driver.sleep(2000);
    protractor.selectWindow.selectWindow(1).then(function () {


      let trelloList = element(by.css('.list-cards'));
      EC = protractor.ExpectedConditions;
      browser.wait(EC.visibilityOf(trelloList), 10000).then(function () {
        let trelloCards = element(by.css('.list-cards')).all(by.css('.list-card-details > span'));
        expect(trelloCards.getText()).toEqual(recapListText);
      });
    });
  });

});
