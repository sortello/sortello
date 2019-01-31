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
                        if (parseInt(leftValue) < parseInt(rightValue)) {
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


        function chooseLabels() {
            let chooselabels = element(by.css('.label__none'))
            browser.wait(EC.presenceOf(chooselabels), 2000).then(function () {
                chooselabels.click()
                waitContainerCards()
            }).catch(function () {
                waitContainerCards()
            })
        }

        function waitContainerCards() {
            let containerCard = element(by.css('.container__card'))
            browser.wait(EC.presenceOf(containerCard), 20000).then(function () {
                nextChoice()
            })
        }

        protractor.accessFromChromeExtensionGithub.accessFromChromeExtensionGithub(browser).then(function () {
                chooseLabels()
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
                            });
                        });
                    });
                });
                let checkTrelloButton = element(by.css('.check-sortello__button'));
                browser.wait(EC.visibilityOf(checkTrelloButton), 50000).then(function () {
                    browser.actions().mouseMove(checkTrelloButton).click().perform();
                });

                protractor.selectWindow.selectWindow(1, browser).then(function () {
                    let githubCards = element(by.css('.js-project-column-cards.js-card-drag-container')).all(
                        by.css('.js-comment-body > p'));
                    browser.wait(EC.presenceOf(githubCards), 50000).then(function () {
                        expect(githubCards.getText()).toEqual(recapListText);
                    });
                });
            }
        );
    })
})