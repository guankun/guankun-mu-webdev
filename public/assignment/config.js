(function(){
    angular
        .module("WebAppMaker")
        .config(configuration);

    function configuration($routeProvider) {
        var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
            var deferred = $q.defer();
            $http.get('/api/loggedin').success(function(user) {
                $rootScope.errorMessage = null;
                if (user !== '0') {
                    deferred.resolve(user);
                } else {
                    deferred.reject();
                    alert("You are not logged in or unauthorised!");
                    $location.url('/');
                }
            });
            return deferred.promise;
        };

        $routeProvider
            .when('/', {
                 templateUrl : "client_side/views/user/login.view.client.html",
                 controller: "LoginController",
                 controllerAs: "model"
             })
            .when('/register', {
                templateUrl : "client_side/views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when('/login', {
                templateUrl : "client_side/views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when ("/profile", {
                templateUrl: "client_side/views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/user/:uid/website', {
                templateUrl : "client_side/views/website/website-list.view.client.html",
                controller: "WebsiteListController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/user/:uid/website/new', {
                templateUrl : "client_side/views/website/website-new.view.client.html",
                controller: "NewWebsiteController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/user/:uid/website/:wid', {
                templateUrl : "client_side/views/website/website-edit.view.client.html",
                controller: "EditWebsiteController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/user/:uid/website/:wid/page', {
                templateUrl : "client_side/views/page/page-list.view.client.html",
                controller: "PageListController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/user/:uid/website/:wid/page/new', {
                templateUrl : "client_side/views/page/page-new.view.client.html",
                controller: "NewPageController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/user/:uid/website/:wid/page/:pid', {
                templateUrl : "client_side/views/page/page-edit.view.client.html",
                controller: "EditPageController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/user/:uid/website/:wid/page/:pid/widget', {
                templateUrl : "client_side/views/widget/widget-list.view.client.html",
                controller: "WidgetListController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/user/:uid/website/:wid/page/:pid/widget/new', {
                templateUrl : "client_side/views/widget/widget-chooser.view.client.html",
                controller: "NewWidgetController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/user/:uid/website/:wid/page/:pid/widget/create/:wtype', {
                templateUrl : "client_side/views/widget/widget-new.view.client.html",
                controller: "CreateWidgetController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/user/:uid/website/:wid/page/:pid/widget/:wgid', {
                templateUrl : "client_side/views/widget/widget-edit.view.client.html",
                controller: "EditWidgetController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .otherwise({
                redirectTo : "/"
            });


    }
})();