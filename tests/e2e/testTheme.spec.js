describe('change theme', function () {
	var host = 'http://rss-reader.azurewebsites.net',
		localhost = 'http://localhost:8080';
		email = 'eRR0R4ik@yandex.ru',
		password = 'qwertyQ1@',
		bgColor = element(by.css('.navbar'));
	it('login RSS|Reader', function () {
		browser.get(localhost ? localhost : host);
		element(by.id('login-btn')).click();
		element(by.id('InputEmail')).sendKeys(email);
		element(by.id('InputPassword')).sendKeys(password);
		element(by.id('submit-btn')).click();
	})
	it('click profile_menu + profile_btn + test navbar background-color', function () {
		element(by.css('.user-menu')).click();
		element(by.id('profile_btn')).click();
		expect(bgColor.getCssValue('background-color')).toBe('rgba(57, 73, 171, 1)');
		element(by.id('change_theme')).click();
	})
	it('change theme and test value of navbar background-color', function () {
		element(by.css('.carousel-control.right')).click();
		browser.sleep(2000);
		element(by.css('.carousel-control.right')).click();
		browser.sleep(2000);
		element(by.css('.carousel-control.right')).click();
		element(by.id('layout_4')).click();
		expect(bgColor.getCssValue('background-color')).toBe('rgba(6, 6, 6, 1)');
	})
})