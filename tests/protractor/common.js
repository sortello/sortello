module.exports.clickElement = function (cssSelector, b) {
    return clickElement(cssSelector, b);
}

module.exports.selectOption = function (cssSelector, value, b) {
    return b.element(by.css(cssSelector)).element(by.cssContainingText('option', value)).click();
}

module.exports.waitForElement = function(cssSelector, b){
    return waitForElement(cssSelector, b);
}

module.exports.waitForElementAndClick = function(cssSelector, b) {
    return waitForElement(cssSelector, b).then(function () {
        return clickElement(cssSelector, b)
    })
}

function clickElement (cssSelector, b) {
    let item = b.element.all(by.css(cssSelector)).first()
    return b.actions().mouseMove(item).click().perform()
}

function waitForElement (cssSelector, b) {
    let EC = protractor.ExpectedConditions
    let item = b.element.all(by.css(cssSelector)).first()
    return b.wait(EC.presenceOf(item), 50000)
}
