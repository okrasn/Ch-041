/*
describe('Schedule App', function() {
    it('should have a title', function() {
        browser.get('http://192.168.1.100:3000');

        expect(browser.getTitle()).toEqual('Schedule App');
    });
});
*/



describe('Schedule App', function() {
    it('should click on first group', function() {
        browser.get('http://192.168.1.100:3000');
        element(by.binding('QA developers')).click();
        element(by.model('search_subject')).sendKeys('qa');

    });
});