(function() {
	'use strict';
	angular.module('rssreader')
		.service('profileService', ['$window', 'Upload', 'accountInfo', '$auth',
			function($window, Upload, accountInfo, $auth) {
				var obj = this;

				this.image = "";
				this.setImagePath = function() {

					accountInfo.getProfile().then(function(response) {
						if ($auth.isAuthenticated()) {
							var lenght = response.data.user.length;
							for (var i = 0; i < lenght; i++) {
								if (response.data.user[i].email === $auth.getPayload().email) {
									obj.image = response.data.user[i].avatar;
								}
							}
						}
					});
				}

				this.getImage = function() {
					return this.image;
				}
				this.setImagePath();
			}
		]);
})();