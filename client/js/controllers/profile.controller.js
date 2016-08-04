/**
 * Created by olga on 02.08.16.
 */
angular.module('rssreader').controller('ProfileController', ['$scope', function ($scope) {
   $scope.stepsModel = [];
  
  $scope.imageUpload = function (el) {
    var imgreader = new FileReader();
    imgreader.onload = $scope.imageIsLoaded;
    imgreader.readAsDataURL(el.files[0]);
  };
  
  $scope.imageIsLoaded = function (e) {
    $scope.$apply(function () {
      $scope.stepsModel.push(e.target.result);
    })
  }
}]);