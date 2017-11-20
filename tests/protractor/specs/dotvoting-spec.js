describe('dotvoting', function () {
  it('prioritizes a list in ascending order with 1 host and 2 guests', function () {
    var browser2 = browser.forkNewDriverInstance();
    var browser3 = browser.forkNewDriverInstance();
    browser.ignoreSynchronization = true;
    browser2.ignoreSynchronization = true;
    browser3.ignoreSynchronization = true;

    // Bring up browser 1 and log in first user, will be the host
    var done1 = protractor.accessFromChromeExtension.accessFromChromeExtension();
    console.log(done1, "AAA");
    // Bring up browser 2 and log in as guest1
    var done2 = protractor.accessFromChromeExtension.accessFromChromeExtension(browser2, 2);
    console.log(done2, "BBB");
    //
    // browser.pause()
    // Bring up browser 3 and log in as guest2
    // var browser3 = browser.forkNewDriverInstance(true, false);
    // protractor.accessFromChromeExtension.accessFromChromeExtension(browser3);

    // On browser 1, select the board (if not already selected) and open a room
    // Get the room's url from browser 1 and open it on browsers 2 and 3

    // Choices start
    // Randomly select one of the three browsers, and make a choice on the selected browser
    // Repeat until the end


    // Check the results
    protractor.expectRecap.toBe(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
  });
});
