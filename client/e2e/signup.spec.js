describe('Sign up a new user account', function () {
	var mongoose = require('mongoose'),
		userPassword = '123456789aA!',
		userEmail = 'testemail@test.com';

	it('should go to register page and register new user account', function () {
		browser.get('http://localhost:8080/#/register');
		element(by.model('user.email')).sendKeys(userEmail);
		element(by.model('user.password')).sendKeys(userPassword);
		element(by.model('user.repPassword')).sendKeys(userPassword);
		element(by.model('agreeWith')).click().then(function () {
			element(by.id('sub_btn')).click();
		});
		expect(element(by.binding('error.message')).getText()).toEqual('First you have to approve you email. We are send verification link to your email');
	});
	it('should approve email and return link from email', function () {
		browser.get('http://localhost:8080/#/verify/');

		element(by.model('user.email')).sendKeys(userEmail);
		element(by.model('user.password')).sendKeys(userPassword);
		element(by.id('sub_btn')).click();
		expect(browser.get('http://localhost:8080/#/dashboard/add'));
	});
});