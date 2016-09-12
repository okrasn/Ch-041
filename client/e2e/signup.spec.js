describe('Sign up a new user account', function () {
	it('should go to register page and register new user account', function () {
		browser.get('http://localhost:8080/#/register');
		element(by.model('user.email')).sendKeys('gemyni85@gmail.com');
    	element(by.model('user.password')).sendKeys('123456789aA!');
    	element(by.model('user.repPassword')).sendKeys('123456789aA!');
    	element(by.model('agreeWith')).click().then(function () {
    		element(by.id('sub_btn')).click();
    	});
		expect(element(by.binding('error.message')).getText()).toEqual('First you have to approve you email. We are send verification link to your email'); // This is wrong!
    });
    it('should approve email and return link from email', function () {
    	browser.get('http://localhost:8080/#/verify/');
    	element(by.model('user.email')).sendKeys('gemyni85@gmail.com');
    	element(by.model('user.password')).sendKeys('123456789aA!');
    	element(by.model('user.repPassword')).sendKeys('123456789aA!');
    	element(by.model('agreeWith')).click().then(function () {
    		element(by.id('sub_btn')).click();
    	});
    	expect(browser.get('http://localhost:8080/#/dashboard/add'));
    });
});