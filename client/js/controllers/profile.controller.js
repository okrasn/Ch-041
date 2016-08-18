(function () {
'use strict';
	angular.module('rssreader')
		.controller('ProfileController', ['Upload', '$http', '$state', 'profileService', '$scope',
        'authService', '$window', 'themeService', 'dashboardService', '$auth', 'accountInfo', 'transfer',
        function (Upload, $http, $state, profileService, $scope,
		authService, $window, themeService, dashboardService, $auth, accountInfo, transfer) {
			$scope.getProfile = function () {
				accountInfo.getProfile().then(function (response) {
					for (var i = 0; i < response.data.length; i++) {
						if (response.data[i].email === transfer.getObj()) {
							$scope.profile = response.data[i].email;
						}
					}
						console.log($scope.profile);
				})
			};

			$scope.updateProfile = function () {
				accountInfo.updateProfile($scope.profile)
					.then(function () {
						console.log('Profile has been updated');
					})
				};
			$scope.getProfile();


			$scope.submit = function () {
				console.log($scope.file);
				if ($scope.upload_form.file.$valid && $scope.file) { //check if from is valid
					$scope.upload($scope.file); //call upload function
				}
			}
			$scope.url = 'http://localhost:8080/upload';	
			$scope.upload = function (file) {
				Upload.upload({
					url: $scope.url ,
					headers: {
						Authorization: 'Bearer ' + authService.getToken()
					},
					data: {
						file: file
					} //pass file as data, should be user ng-model
				}).then(function (resp) { //upload function returns a promise
					if (resp.data.error_code === 0) { //validate success
						$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
					} else {
						$window.alert('an error occured');
					}
				}, function (resp) { //catch error
					console.log('Error status: ' + resp.status);
					$window.alert('Error status: ' + resp.status);
				}, function (evt) {
					console.log(evt);
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
					$scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
				});
			};

			$scope.newUserData = {
				email: authService.currentUser(),
				currentPass: "",
				newPass: "",
				newPassRepeat: ""
			}

			$scope.changePass = function () {
				console.log("Submit change password");
				return $http.post('/changePassword', $scope.newUserData, {
					headers: {
						Authorization: 'Bearer ' + authService.getToken()
					}
				}).success(function (data) {
					authService.saveToken(data.token);
					$state.go('dashboard.' + dashboardService.getViewMode(), {
						id: authService.userID()
					});
				}).error(function (err) {
					$scope.err = err;
					console.log(err.message);
				});
			}

			$scope.user = authService.currentUser;
			$scope.updateTheme = function () {
				themeService.layout = $scope.layout;
				console.log("Theme update");
				console.log("Theme:" + themeService.layout);
			};
			$scope.layout = themeService.layout;
			$scope.layouts = themeService.layouts;
        }]);
})();