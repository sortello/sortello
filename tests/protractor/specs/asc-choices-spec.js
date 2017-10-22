describe('sort list asc', function() {
  it('prioritizes the test column in ascending order', function() {
    browser.ignoreSynchronization = true;
    protractor.accessFromChromeExtension.accessFromChromeExtension();

    function nextChoice() {
      let EC = protractor.ExpectedConditions;
      let leftCard = element(by.css('#left_button .card__title'));
      let rightCard = element(by.css('#right_button .card__title'));

      browser.wait(EC.and(EC.presenceOf(leftCard), EC.presenceOf(rightCard)), 20000).then(function() {
        leftCard.getText().then(function(leftValue) {
          rightCard.getText().then(function(rightValue) {
            if (parseInt(rightValue) < parseInt(leftValue)) {
              element(by.css('#right_button .container__card')).click();
            } else {
              element(by.css('#left_button .container__card')).click();
            }
          });
        });
      });
      element
        .all(by.id('update_board'))
        .count()
        .then(function(size) {
          if (size == 0) {
            nextChoice();
          }
        });
    }

    nextChoice();

    protractor.expectRecap.toBe(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
  });
});
