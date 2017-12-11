describe('dotvoting', function () {
  let originalTimeout;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
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

    let browser1 = browser

    let browser2 = browser1.forkNewDriverInstance();
    browser2.ignoreSynchronization = true;
    browser2.driver.manage().window().setSize(840, 524);
    browser2.driver.manage().window().setPosition(840, 0);

    let browser3 = browser1.forkNewDriverInstance();
    browser3.ignoreSynchronization = true;
    browser3.driver.manage().window().setSize(840, 524);
    browser3.driver.manage().window().setPosition(0, 524);

    let browser4 = browser1.forkNewDriverInstance();
    browser4.ignoreSynchronization = true;
    browser4.driver.manage().window().setSize(840, 524);
    browser4.driver.manage().window().setPosition(840, 524);

    let browsersPriorities = [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
      ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']
    ]

    protractor.accessFromChromeExtension.accessFromChromeExtension(browser1).then(function () {
      protractor.accessFromChromeExtension.accessFromChromeExtension(browser2, browser1.params.testTrello2Username, browser1.params.testTrello2Password).then(function () {
        protractor.accessFromChromeExtension.accessFromChromeExtension(browser3, browser1.params.testTrello3Username, browser1.params.testTrello3Password).then(function () {
          protractor.accessFromChromeExtension.accessFromChromeExtension(browser4, browser1.params.testTrello4Username, browser1.params.testTrello4Password).then(function () {

            let EC = protractor.ExpectedConditions;
            let allLabel = element(by.css('.label__item.label__none'))

            browser1.wait(EC.presenceOf(allLabel), 20000).then(function () {
              allLabel.click();
              let newRoomButton = element(by.css('#new-room-button'))
              browser1.wait(EC.presenceOf(newRoomButton), 20000).then(function () {
                newRoomButton.click();
                let roomLinkElement = element(by.css('#room-link'))
                browser1.wait(EC.presenceOf(roomLinkElement), 20000).then(function () {
                  roomLinkElement.getAttribute('href').then(function (link) {
                    browser2.get(link.replace("localhost/app.html", "localhost:4000/app.html"))
                    browser3.get('/app.html?extId=' + browser1.params.testTrelloExtId2)
                    let newRoomButton = browser3.element(by.css('#new-room-button'))
                    allLabel = browser3.element(by.css('.label__item.label__none'))
                    browser3.wait(EC.presenceOf(allLabel), 20000).then(function () {
                      allLabel.click();
                      browser3.wait(EC.presenceOf(newRoomButton), 20000).then(function () {
                        newRoomButton.click();
                        let roomLinkElement = browser3.element(by.css('#room-link'))
                        browser3.wait(EC.presenceOf(roomLinkElement), 20000).then(function () {
                          roomLinkElement.getAttribute('href').then(function (link) {
                            browser4.get(link.replace("localhost/app.html", "localhost:4000/app.html"))
                            startChoices()
                          })
                        })
                      })
                    })
                  })
                })
              })
            })

            function startChoices () {
              browser1.element.all(by.id("update_board")).count().then(function (size) {
                browser3.element.all(by.id("update_board")).count().then(function (size2) {
                  if (size === 0 || size2 === 0) {
                    if (size2 === 0) {
                      makeChoice(browser4, browsersPriorities[3]);
                      makeChoice(browser3, browsersPriorities[2]);
                    }
                    if (size === 0) {
                      makeChoice(browser2, browsersPriorities[1]);
                      makeChoice(browser1, browsersPriorities[0]);
                    }
                    startChoices()
                  } else {
                    checkRoom1Results()
                    checkRoom2Results()
                    done();
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
                        } else {
                          b.element(by.css('#left_button .container__card')).click()
                        }
                      });
                    });
                  });
                }
              })

            }

            function checkRoom1Results () {
              console.log("checking results 1");
              protractor.expectRecap.toBe(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], browser1);
            }

            function checkRoom2Results () {
              console.log("checking results 2");
              protractor.expectRecap.toBe(['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'], browser3);
            }
          });
        });
      });
    });
  });
});
