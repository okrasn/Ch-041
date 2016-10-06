// describe('check language translation', function () {
// 	var host = 'http://rss-reader.azurewebsites.net',
// 		localhost = 'http://localhost:8080';
// 		email = 'gemyni85@gmail.com',
// 		pas = '741852963aA!';
// 	it('should click on language button and change language', function () {
// 		browser.get(localhost ? localhost : host);
// 		element(by.id('login-btn')).click();
// 		element(by.id('InputEmail')).sendKeys(email);
// 		element(by.id('InputPassword')).sendKeys(pas);
// 		element(by.id('submit-btn')).click();
// 		element(by.css('.user-menu')).click();
// 		element(by.id('profile_btn')).click();
// 		if(element(by.css('.ua'))) {
// 			element(by.css('.ua')).click();
// 			expect(element(by.css('.test-lang')).getText()).toEqual('ЗМІНА ТЕМИ');
// 		}
// 		if(element(by.css('.en'))) {
// 			element(by.css('.en')).click();
// 			expect(element(by.css('.test-lang')).getText()).toEqual('CHANGE THEME');
// 		}
// 	})
// })