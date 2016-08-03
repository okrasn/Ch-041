angular.module('rss',['add_ctrl','add_service','ui.router'])
    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home',{
                url : '/home',
                templateUrl : 'partials/home.html',
                controller : 'MainCtrl'
            })
            .state('add',{
                url:'/add',
                templateUrl : 'partials/add.html',
                controller : 'AddCtrl'
            });
            /*
            .state('register',{
                url : '/register',
                templateUrl : 'partials/register.html',
                controller : 'RegCtrl',
                controllerAs : 'reg',
                onEnter : [$state,auth,function(){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }]
            })
            .state('login',{
                url : '/login',
                templateUrl : 'partials/login.html',
                controller : 'RegCtrl',
                controllerAs : 'reg',
                onEnter : [$state,auth,function(){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }]
            })
            .state('addFeed', {
                url: '/addFeed',
                templateUrl: 'partials/addFeed.html',
                controllerAs: "add",
                controller: 'addCtrl'
            })
            .state('editFeed',{
                url: '/editFeed',
                templateUrl: 'partials/editFeed.html',
                controllerAs: "edit",
                controller: 'editCtrl'
            })
            .state('feeds',{
                url : '/feeds/{id}',
                templateUrl : 'partials/feeds.html',
                controller : 'FeedsCtrl'
            })
            */
    });
