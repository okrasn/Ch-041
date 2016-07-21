describe('Schedule App', function() {
    it('should have a title', function() {
        browser.get('http://192.168.1.100:3000');

        expect(browser.getTitle()).toEqual('Schedule App');
    });
});

describe('Schedule App', function() {
    it('should click on first group', function() {
        browser.get('http://192.168.1.100:3000');
        element(by.id('JavaScript developers')).click();
        element(by.id('select_box')).sendKeys('html');
        expect(element(by.binding('counter')).getText()).toEqual('6 hours');
    });
});