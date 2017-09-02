describe('sort list asc', function () {
  it('prioritizes the test column using undo button', function () {
      browser.ignoreSynchronization = true;
      protractor.accessFromChromeExtension.accessFromChromeExtension();

      let shouldUndo = false;

      function nextChoice () {
        if (shouldUndo) {
          // browser.driver.sleep(500);
          element(by.css('#undo_button')).click();
          shouldUndo = false;
        }

        let EC = protractor.ExpectedConditions;
        let leftCard = element(by.css('#left_button .card__title'));
        let rightCard = element(by.css('#right_button .card__title'));

        browser.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function () {
          leftCard.getText().then(function (leftValue) {
            rightCard.getText().then(function (rightValue) {

              if (parseInt(rightValue) < parseInt(leftValue)) {
                if (Math.random() >= 0.2) {
                  element(by.css('#right_button .container__card')).click()
                } else {
                  element(by.css('#left_button .container__card')).click()
                  shouldUndo = true;
                }
              } else {
                if (Math.random() >= 0.2) {
                  element(by.css('#left_button .container__card')).click()
                } else {
                  element(by.css('#right_button .container__card')).click()
                  shouldUndo = true;
                }
              }
            });
          });
        });

        element.all(by.id("update_board")).count().then(function (size) {
          if (size == 0) {
            nextChoice();
          }
        });
      }

      nextChoice();

      protractor.expectRecap.toBe(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    }
  );

});
