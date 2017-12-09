describe('dotvoting', function () {
  var originalTimeout;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it('prioritizes a list in ascending order with 1 host and 2 guests', function (done) {

    browser.ignoreSynchronization = true;
    browser.driver.manage().window().setSize(840, 524);
    browser.driver.manage().window().setPosition(0, 0);
    browser.driver.manage().window().toolbar = 0;
    browser.driver.manage().window().menubar = 0;

    let browser2 = browser.forkNewDriverInstance();
    browser2.ignoreSynchronization = true;
    browser2.driver.manage().window().setSize(840, 524);
    browser2.driver.manage().window().setPosition(840, 0);

    let browser3 = browser.forkNewDriverInstance();
    browser3.ignoreSynchronization = true;
    browser3.driver.manage().window().setSize(840, 524);
    browser3.driver.manage().window().setPosition(0, 524);

    let browser4 = browser.forkNewDriverInstance();
    browser4.ignoreSynchronization = true;
    browser4.driver.manage().window().setSize(840, 524);
    browser4.driver.manage().window().setPosition(840, 524);

    let browsersPriorities = [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
      ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']
    ]

    protractor.accessFromChromeExtension.accessFromChromeExtension(browser).then(function () {
      protractor.accessFromChromeExtension.accessFromChromeExtension(browser2, browser.params.testTrello2Username, browser.params.testTrello2Password).then(function () {
        protractor.accessFromChromeExtension.accessFromChromeExtension(browser3, browser.params.testTrello3Username, browser.params.testTrello3Password).then(function () {
          protractor.accessFromChromeExtension.accessFromChromeExtension(browser4, browser.params.testTrello4Username, browser.params.testTrello4Password).then(function () {

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
                    browser3.get('/?extId=' + browser.params.testTrelloExtId2)
                    let newRoomButton = browser3.element(by.css('#new-room-button'))
                    allLabel = browser3.element(by.css('.label__item.label__none'))
                    browser3.wait(EC.presenceOf(allLabel), 20000).then(function () {
                      allLabel.click();
                      browser3.wait(EC.presenceOf(newRoomButton), 20000).then(function () {
                        newRoomButton.click();
                        let roomLinkElement = browser3.element(by.css('#room-link'))
                        browser3.wait(EC.presenceOf(roomLinkElement), 20000).then(function () {
                          roomLinkElement.getAttribute('href').then(function (link) {
                            link = link.replace("localhost/", "localhost:4000")
                            browser4.get(link)
                            startChoices()
                          })
                        })
                      })
                    })
                  })
                })
              })
            })


            let previousSelectedBrowser = 0;

            function startChoices () {
              browser.element.all(by.id("update_board")).count().then(function (size) {
                browser3.element.all(by.id("update_board")).count().then(function (size2) {
                  if (size === 0 || size2 === 0) {
                    let browsersArray = [browser, browser2, browser3, browser4]
                    if (size > 0 && size2 === 0) {
                      browsersArray = [browser3, browser4]
                    }
                    if (size === 0 && size2 > 0) {
                      browsersArray = [browser, browser2]
                    }
                    let randNum = Math.floor(Math.random() * browsersArray.length)
                    while (previousSelectedBrowser === randNum) {
                      randNum = Math.floor(Math.random() * browsersArray.length)
                    }
                    previousSelectedBrowser = randNum;
                    let randomBrowser = browsersArray[randNum]
                    makeChoice(randomBrowser, browsersPriorities[randNum]);
                  } else {
                    checkResults()
                  }
                })
              });
            }

            function makeChoice (b, bPriorities) {
              b.element.all(by.id("left-continue-voting")).count().then(function (size) {
                if (size > 0) {
                  let leftContinue = b.element(by.id("left-continue-voting"));
                  let rightContinue = b.element(by.id("right-continue-voting"));
                  let leftCard = b.element(by.css('#left_button .card__title'));
                  let rightCard = b.element(by.css('#right_button .card__title'));
                  b.wait(EC.and(EC.presenceOf(leftContinue), EC.presenceOf(rightContinue)), 20000).then(function () {
                    b.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function () {
                      leftCard.getText().then(function (leftValue) {
                        rightCard.getText().then(function (rightValue) {
                          console.log("main browser is selecting the choice")
                          if (bPriorities.indexOf(rightValue) < bPriorities.indexOf(leftValue)) {
                            rightContinue.click()
                            startChoices()
                          } else {
                            leftContinue.click()
                            startChoices()
                          }
                        });
                      });
                    });
                  })
                }
                else {

                  let leftCard = b.element(by.css('#left_button .card__title'));
                  let rightCard = b.element(by.css('#right_button .card__title'));

                  b.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function () {
                    leftCard.getText().then(function (leftValue) {
                      rightCard.getText().then(function (rightValue) {
                        if (bPriorities.indexOf(rightValue) < bPriorities.indexOf(leftValue)) {
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
              })

            }

            function checkResults () {
              protractor.expectRecap.toBe(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], browser);
              protractor.expectRecap.toBe(['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'], browser3);
              browser.close()
              browser2.close()
              browser3.close()
              browser4.close()
              done();
            }
          });
        });
      });
    });
  });
});
