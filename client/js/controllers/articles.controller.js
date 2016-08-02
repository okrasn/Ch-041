angular.module('rssreader').controller('ArticlesController', ['$scope', '$state', 'articlesService', function ($scope, $state, articlesService) {
    $scope.articles = articlesService.articles;
    $scope.title = "All";
}]);