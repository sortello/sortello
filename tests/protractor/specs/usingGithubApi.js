describe('using Github Api', function () {
    it('sends data to board correctly', function () {
        browser.ignoreSynchronization = true;
        let EC = protractor.ExpectedConditions;

        function nextChoice() {
            let leftCard = element(by.css('#left_button .card__title'));
            let rightCard = element(by.css('#right_button .card__title'));
            browser.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function () {
                let leftCard = element(by.css('#left_button .card__title'));
                let rightCard = element(by.css('#right_button .card__title'));

                leftCard.getText().then(function (leftValue) {
                    rightCard.getText().then(function (rightValue) {
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
            })
        }

        browser.get('/app.html?extId=1939962&fw=g');
        let continueButton = element(by.css(".continue-to-choices--button"))
        browser.wait(EC.presenceOf(continueButton), 20000).then(function () {
            continueButton.click()
            let labelUsername = element(by.css("#login_field"))
            let labelPassword = element(by.css("#password"))
            browser.wait(EC.presenceOf(labelUsername), 20000).then(function () {
                labelUsername.sendKeys(browser.params.testGithubUsername)
                labelPassword.sendKeys(browser.params.testGithubPassword)
                let signInButton = element(by.css(".btn.btn-primary.btn-block"))
                signInButton.click()
                let containerCard = element(by.css('.container__card'))
                browser.wait(EC.presenceOf(containerCard), 20000).then(function () {
                    nextChoice()

                })
            })
        })
        let showRecapButton = element(by.css('.trigger-button__link'));
        browser.wait(EC.presenceOf(showRecapButton), 20000).then(function () {
            showRecapButton.click();
            let recapDiv = element(by.css('div.order-recap'));
            browser.wait(EC.presenceOf(recapDiv), 20000).then(function () {
                element.all(by.css('div.order-recap div.recap__item')).getText().then(function (text) {
                    recapListText = text;
                    let updateBoardButton = element(by.id('recap_update_board'));
                    browser.wait(EC.visibilityOf(updateBoardButton), 20000).then(function () {
                        browser.actions().mouseMove(updateBoardButton).click().perform();
                        browser.driver.sleep(1000);
                        updateBoardButton = element(by.id('update_board'));
                        browser.wait(EC.visibilityOf(updateBoardButton), 20000).then(function () {
                            browser.actions().mouseMove(updateBoardButton).click().perform();
                        });

                    });

                });
            });
        });
        let checkTrelloButton = element(by.css('.check-trello__button'));
        browser.wait(EC.visibilityOf(checkTrelloButton), 50000).then(function () {
            browser.actions().mouseMove(checkTrelloButton).click().perform();
        });

        browser.driver.sleep(2000);
        protractor.selectWindow.selectWindow(1, browser).then(function () {
            let githubList = element(by.css('.list-cards'));
            browser.wait(EC.visibilityOf(githubList), 50000).then(function () {
                let githubCards = element(by.css('.list-cards')).all(by.css('.list-card-details > span'));
                    expect(githubCards.getText()).toEqual(recapListText);
            });
        });
    });
})