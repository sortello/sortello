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
    browser.driver.manage().window().setSize(840, 1032);
    browser.driver.manage().window().setPosition(0, 0);
    browser.driver.manage().window().toolbar = 0;
    browser.driver.manage().window().menubar = 0;

    let browser1 = browser

    let browser2 = browser.forkNewDriverInstance();
    browser2.ignoreSynchronization = true;
    browser2.driver.manage().window().setSize(840, 524);
    browser2.driver.manage().window().setPosition(840, 0);

    let browser3 = browser.forkNewDriverInstance();
    browser3.ignoreSynchronization = true;
    browser3.driver.manage().window().setSize(840, 524);
    browser3.driver.manage().window().setPosition(840, 524);

    let browsersPriorities = [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      ['10', '1', '2', '9', '3', '4', '8', '5', '7', '6'],
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    ]

    protractor.accessFromChromeExtension.accessFromChromeExtension(browser).then(function () {
      protractor.accessFromChromeExtension.accessFromChromeExtension(browser2, browser.params.testTrello2Username, browser.params.testTrello2Password).then(function () {
        protractor.accessFromChromeExtension.accessFromChromeExtension(browser3, browser.params.testTrello3Username, browser.params.testTrello3Password).then(function () {

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
                  link = link.replace("localhost/app", "localhost:4000/app")
                  browser2.get(link)
                  browser3.get(link)
                  startChoices()
                })
              })
            })
          })

          function startChoices () {
            browser1.element.all(by.id("update_board")).count().then(function (size) {

              if (size === 0) {
                makeChoice(browser1, browsersPriorities[0])
                makeChoice(browser2, browsersPriorities[1])
                makeChoice(browser3, browsersPriorities[2])
                let leftContinue = browser1.element(by.id("left-continue-voting"));
                let rightContinue = browser1.element(by.id("right-continue-voting"));
                let leftCard = browser1.element(by.css('#left_button .card__title'));
                let rightCard = browser1.element(by.css('#right_button .card__title'));
                browser1.wait(EC.and(EC.presenceOf(leftContinue), EC.presenceOf(rightContinue)), 20000).then(function () {
                  browser1.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function () {
                    browser2.element.all(by.css(".card__voter")).count().then(function (visibleVotesCount) {
                      expect(visibleVotesCount).toEqual(3);
                      leftCard.getText().then(function (leftValue) {
                        rightCard.getText().then(function (rightValue) {
                          if (browsersPriorities[0].indexOf(rightValue) < browsersPriorities[0].indexOf(leftValue)) {
                            rightContinue.click()
                            startChoices()
                          } else {
                            leftContinue.click()
                            startChoices()
                          }
                        });
                      });

                    })

                  });
                })

              } else {
                checkResults()
              }
            });
          }

          function makeChoice (b, bPriorities) {
            let leftCard = b.element(by.css('#left_button .card__title'));
            let rightCard = b.element(by.css('#right_button .card__title'));

            b.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 2000).then(function () {
              leftCard.getText().then(function (leftValue) {
                rightCard.getText().then(function (rightValue) {
                  if (bPriorities.indexOf(rightValue) < bPriorities.indexOf(leftValue)) {
                    b.element(by.css('#right_button .container__card')).click()
                  } else {
                    b.element(by.css('#left_button .container__card')).click()
                  }
                });
              });
            }).catch(function () {
              startChoices();
            });
          }

          function checkResults () {
            console.log("Checking results");
            protractor.expectRecap.toBe(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], browser1);
            browser1.close()
            browser2.close()
            browser3.close()
            done();
          }
        });
      });
    });
  });
});
