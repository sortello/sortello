describe('sort list asc', function () {
  /**
   * [selectWindow Focus the browser to the index window. Implementation by http://stackoverflow.com/questions/21700162/protractor-e2e-testing-error-object-object-object-has-no-method-getwindowha]
   * @param  {[Object]} index [Is the index of the window. E.g., 0=browser, 1=FBpopup]
   * @return {[!webdriver.promise.Promise.<void>]}       [Promise resolved when the index window is focused.]
   */
  selectWindow = function (index) {
    browser.driver.wait(function () {
      return browser.driver.getAllWindowHandles().then(function (handles) {
        if (handles.length > index) {
          return true;
        }
      });
    });
    return browser.driver.getAllWindowHandles().then(function (handles) {
      return browser.driver.switchTo().window(handles[index]);
    });
  };

  accessFromChromeExtension = function () {
    browser.get('/?extId=' + browser.params.extId);
    // browser.executeScript('window.localStorage.clear();');
    // browser.executeScript('window.sessionStorage.clear();');
    // browser.driver.manage().deleteAllCookies();
    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.css('.continue-to-choices--button'))), 10000).then(
      function () {
        $(".continue-to-choices--button").click();
      });
    selectWindow(1);

    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.css('#surface form a.button.primary'))), 10000).then(
      function () {
        $("#surface form a.button.primary").click();
      });

    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.css('input#user'))), 10000).then(
      function () {
        $('input#user').sendKeys(browser.params.username);
        $('input#password').sendKeys(browser.params.password);
        $('input#login').click().then(function () {
          browser.driver.sleep(1000);
          $("input.primary[name='approve']").click();
          selectWindow(0);
        });
      });
  }

  it('prioritizes the test column in ascending order', function () {
    accessFromChromeExtension();
    browser.driver.sleep(1000);

    function nextChoice () {
      let leftButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#left_button h1')));
      browser.wait(leftButton, 10000).then(function () {
        let rightButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#right_button h1')));
        browser.wait(rightButton, 10000).then(function () {
          let rightValue = rightButton.value_;
          let leftValue = leftButton.value_;
          if (parseInt(rightValue) < parseInt(leftValue)) {
            element(by.css('#right_button')).click()
          } else {
            element(by.css('#left_button')).click()
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
    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.id('update_board'))), 10000).then(
      function () {
        $("#update_board").click();
      });
    browser.driver.sleep(2000);

    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.id('check-board'))), 10000).then(
      function () {
        $("#check-board").click();
      });
    browser.driver.sleep(2000);
    selectWindow(1);

    browser.driver.sleep(2000);
    let cards = browser.executeScript("return arguments[0].innerHTML;", element(by.css('.list-cards')));
    browser.wait(cards, 10000).then(function (html) {
      expect(html.indexOf("</span>1</span>")).toBeLessThan(html.indexOf("</span>2</span>"));
      expect(html.indexOf("</span>2</span>")).toBeLessThan(html.indexOf("</span>3</span>"));
      expect(html.indexOf("</span>3</span>")).toBeLessThan(html.indexOf("</span>4</span>"));
      expect(html.indexOf("</span>4</span>")).toBeLessThan(html.indexOf("</span>5</span>"));
      expect(html.indexOf("</span>5</span>")).toBeLessThan(html.indexOf("</span>6</span>"));
      expect(html.indexOf("</span>6</span>")).toBeLessThan(html.indexOf("</span>7</span>"));
      expect(html.indexOf("</span>7</span>")).toBeLessThan(html.indexOf("</span>8</span>"));
      expect(html.indexOf("</span>8</span>")).toBeLessThan(html.indexOf("</span>9</span>"));
      expect(html.indexOf("</span>9</span>")).toBeLessThan(html.indexOf("</span>10</span>"));
    });
  });

  it('prioritizes the test column in descending order', function () {
    browser.get('/?extId=' + browser.params.extId);
    selectWindow(1);
    browser.driver.sleep(1000);

    function nextChoice () {
      let leftButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#left_button h1')));
      browser.wait(leftButton, 10000).then(function () {
        let rightButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#right_button h1')));
        browser.wait(rightButton, 10000).then(function () {
          let rightValue = rightButton.value_;
          let leftValue = leftButton.value_;
          if (parseInt(rightValue) > parseInt(leftValue)) {
            element(by.css('#right_button')).click()
          } else {
            element(by.css('#left_button')).click()
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
    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.id('update_board'))), 20000).then(
      function () {
        $("#update_board").click();
      });
    browser.driver.sleep(2000);

    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.id('check-board'))), 20000).then(
      function () {
        $("#check-board").click();
      });
    browser.driver.sleep(2000);
    selectWindow(2);

    browser.driver.sleep(2000);
    let cards = browser.executeScript("return arguments[0].innerHTML;", element(by.css('.list-cards')));
    browser.wait(cards, 10000).then(function (html) {
      expect(html.indexOf("</span>1</span>")).toBeGreaterThan(html.indexOf("</span>2</span>"));
      expect(html.indexOf("</span>2</span>")).toBeGreaterThan(html.indexOf("</span>3</span>"));
      expect(html.indexOf("</span>3</span>")).toBeGreaterThan(html.indexOf("</span>4</span>"));
      expect(html.indexOf("</span>4</span>")).toBeGreaterThan(html.indexOf("</span>5</span>"));
      expect(html.indexOf("</span>5</span>")).toBeGreaterThan(html.indexOf("</span>6</span>"));
      expect(html.indexOf("</span>6</span>")).toBeGreaterThan(html.indexOf("</span>7</span>"));
      expect(html.indexOf("</span>7</span>")).toBeGreaterThan(html.indexOf("</span>8</span>"));
      expect(html.indexOf("</span>8</span>")).toBeGreaterThan(html.indexOf("</span>9</span>"));
      expect(html.indexOf("</span>9</span>")).toBeGreaterThan(html.indexOf("</span>10</span>"));
    });
  });

  it('prioritizes the test column in ascending order blacklisting the cards "2" and "7"', function () {
      browser.get('/?extId=' + browser.params.extId);
      selectWindow(2);
    browser.driver.sleep(1000);

    function nextChoice () {
      let leftButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#left_button h1')));
      browser.wait(leftButton, 10000).then(function () {
        let rightButton = browser.executeScript("return arguments[0].innerHTML;", element(by.css('#right_button h1')));
        browser.wait(rightButton, 10000).then(function () {
          let rightValue = rightButton.value_;
          let leftValue = leftButton.value_;
          let autoclicked = false;

          if (parseInt(rightValue) === 2 || parseInt(rightValue) === 7) {
            element(by.css('#right_button .button-blacklist')).click();
            autoclicked = true;
          }
          if (parseInt(leftValue) === 2 || parseInt(leftValue) === 7) {
            element(by.css('#left_button .button-blacklist')).click();
            autoclicked = true;
          }

          if(!autoclicked){
            if (parseInt(rightValue) < parseInt(leftValue)) {
              element(by.css('#right_button')).click()
            } else {
              element(by.css('#left_button')).click()
            }
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

    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.id('update_board'))), 20000).then(
      function () {
        $("#update_board").click();
      });
    browser.driver.sleep(2000);

    browser.wait(browser.executeScript("return arguments[0].innerHTML;", element(by.id('check-board'))), 20000).then(
      function () {
        $("#check-board").click();
      });
    browser.driver.sleep(2000);
    selectWindow(3);

    browser.driver.sleep(2000);
    let cards = browser.executeScript("return arguments[0].innerHTML;", element(by.css('.list-cards')));
    browser.wait(cards, 10000).then(function (html) {
      expect(html.indexOf("</span>1</span>")).toBeLessThan(html.indexOf("</span>3</span>"));
      expect(html.indexOf("</span>3</span>")).toBeLessThan(html.indexOf("</span>4</span>"));
      expect(html.indexOf("</span>4</span>")).toBeLessThan(html.indexOf("</span>5</span>"));
      expect(html.indexOf("</span>5</span>")).toBeLessThan(html.indexOf("</span>6</span>"));
      expect(html.indexOf("</span>6</span>")).toBeLessThan(html.indexOf("</span>8</span>"));
      expect(html.indexOf("</span>8</span>")).toBeLessThan(html.indexOf("</span>9</span>"));
      expect(html.indexOf("</span>9</span>")).toBeLessThan(html.indexOf("</span>10</span>"));
      expect(html.indexOf("</span>10</span>")).toBeLessThan(html.indexOf("</span>2</span>"));
      expect(html.indexOf("</span>10</span>")).toBeLessThan(html.indexOf("</span>7</span>"));
    });
  });

});
