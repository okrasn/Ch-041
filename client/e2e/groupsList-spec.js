//describe('Schedule App', function() {
//    it('should have a title', function() {
//        browser.get('http://localhost:8080/');
//        expect(browser.getTitle()).toEqual('Schedule App');
//    });
//});


describe('Schedule App', function() {

    it('Should enter lesson and return correct result', function() {
        var EC = protractor.ExpectedConditions;

        browser.get('http://localhost:8080/');
        element(by.css('[data-target="#Ch-035"]')).click();
        

        var input = element(by.id("lessonInput1"));
        browser.wait(EC.elementToBeClickable(input), 1000);
        input.sendKeys("UI\n");
        expect(element.all(by.binding('groupsCtrl.lessonCount')).get(0).getText()).toEqual('7');
    });
});