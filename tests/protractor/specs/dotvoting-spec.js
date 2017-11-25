describe('dotvoting', function () {
  it('prioritizes a list in ascending order with 1 host and 2 guests', function () {
    browser.ignoreSynchronization = true;
    browser.driver.manage().window().setSize(840, 540);
    browser.driver.manage().window().setPosition(0, 0);

    let browser2 = browser.forkNewDriverInstance();
    browser2.ignoreSynchronization = true;
    browser2.driver.manage().window().setSize(840, 540);
    browser2.driver.manage().window().setPosition(840, 0);
    //
    let browser3 = browser.forkNewDriverInstance();
    browser3.ignoreSynchronization = true;
    browser3.driver.manage().window().setSize(840, 540);
    browser3.driver.manage().window().setPosition(0, 540);

    protractor.accessFromChromeExtension.accessFromChromeExtension(browser).then(function () {
      protractor.accessFromChromeExtension.accessFromChromeExtension(browser2,browser.params.testTrello2Username, browser.params.testTrello2Password).then(function () {
        protractor.accessFromChromeExtension.accessFromChromeExtension(browser3,browser.params.testTrello3Username, browser.params.testTrello3Password).then(function () {

          let EC = protractor.ExpectedConditions;
          let allLabel = element(by.css('.label__item.label__none'))
          browser.wait(EC.presenceOf(allLabel), 20000).then(function () {
            allLabel.click();
            let newRoomButton = element(by.css('#new-room-button'))
            browser.wait(EC.presenceOf(newRoomButton), 20000).then(function () {
              newRoomButton.click();

              let roomLinkElement = element(by.css('#room-link'))
              browser.wait(EC.presenceOf(roomLinkElement), 20000).then(function () {
                roomLinkElement.getAttribute('href').then(function (link) {
                  link = link.replace("localhost/", "localhost:4000")
                  browser2.get(link)
                  browser3.get(link)
                  startChoices()
                })
              })
            })
          })

          function startChoices () {
            console.log("start choices");
            browser.element.all(by.id("update_board")).count().then(function (size) {
              if (size == 0) {
                let browsersArray = [browser, browser2, browser3]
                let randNum = Math.floor(Math.random() * browsersArray.length)
                let randomBrowser = browsersArray[randNum]
                console.log("selected browser " + randNum);
                makeChoice(randomBrowser);
              } else {
                checkResults()
              }
            });
          }

          function makeChoice (b) {
            b.driver.sleep(200)
            console.log("make a choice ");
            let leftCard = b.element(by.css('#left_button .card__title'));
            let rightCard = b.element(by.css('#right_button .card__title'));

            b.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function () {
              leftCard.getText().then(function (leftValue) {
                rightCard.getText().then(function (rightValue) {
                  if (parseInt(rightValue) < parseInt(leftValue)) {
                    b.element(by.css('#right_button .container__card')).click()
                    startChoices()
                  } else {
                    b.element(by.css('#left_button .container__card')).click()
                    startChoices()
                  }
                });
              });
            });
          }

          function checkResults(){
            console.log("Checking results");
            protractor.expectRecap.toBe(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
          }
        });
      });
    });
  });
});
