(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, $rootScope, $window, UserService) {
        var vm = this;
        vm.error = null;
        vm.user = {};
        vm.login = login;
        function login(user) {
            if(!user.username || !user.password){
                vm.error = "Username and password cannot be empty!";
                return;
            }
            UserService
                .login(user)
                .then(
                    function (res) {
                        var user = res.data;
                        //$rootScope.currentUser = user;
                        $window.localStorage.setItem("currentUser", angular.toJson(user));
                        $location.url("/profile");
                    },
                    function (res) {
                        vm.error = res.data;
                    }
                );
        }
            /*function login(username, password) {
                UserService.findUserByCredentials(username, password).then(
                    function successCallback(res) {
                        $location.url("/user/" + res.data._id);
                    },
                    function errorCallback(res){
                        vm.error = res.data;
                    }
                );
            }*/
    }

    function RegisterController($location, $rootScope, $window, UserService) {
        var vm = this;
        vm.user = {};
        vm.error = null;
        vm.register = register;

        /*function register(username, password, vpassword) {
            if (username === undefined || username === null || username === "" || password === undefined || password === "") {
                vm.error = "Username and Passwords cannot be empty.";
                return;
            }
            if (password !== vpassword) {
                vm.error = "Password does not match.";
                return;
            }
            user = {
                username: username,
                password: password,
                firstName: "",
                lastName: "",
                email: "",
                phone: ""
            };
            UserService.createUser(user).then(
                function successCallback(res) {
                    var newUser = res.data;
                    if(newUser == undefined || newUser == null || newUser == ""){
                        vm.error = "Username already exists.";
                    }
                    else{
                         return UserService.findUserByUsername(username).then(
                            function success(res) {
                                var userCreated = res.data;
                                $location.url("/user/" + userCreated._id);
                            },
                            function errorCallback(res) {
                                vm.error = "User created but cannot be found.";
                            }
                        );
                    }

                },
                function error(res) {
                    vm.error = "Create user failed." + res.data;
                }
            );
        }*/

        function register(user){
            var username = user.username;
            var password = user.password;
            var vpassword = user.vpassword;
            if (username === undefined || username === null || username === "" || password === undefined || password === "") {
                vm.error = "Username and Passwords cannot be empty.";
                return;
            }
            if (password !== vpassword) {
                vm.error = "Password does not match.";
                return;
            }
            var newUser = {
                username: username,
                password: password
            }
            UserService.register(newUser).then(
                function(res) {
                    var userCreated = res.data;
                    //$rootScope.currentUser = userCreated;
                    $window.localStorage.setItem("currentUser", angular.toJson(userCreated));
                    $location.url("/profile");
                },
                function error(res) {
                    vm.error = "User Register failed. " + res.data;
        }
            );
        }
    }

    function ProfileController($routeParams, $location, $timeout, $rootScope, $window, UserService) {
        var vm = this;
        vm.updated = null;
        vm.logout = logout;
        vm.error = null;
        //vm.user = $rootScope.currentUser;
        vm.user = JSON.parse($window.localStorage.getItem("currentUser"));
        UserService.findUserById(vm.user._id).then(
            function successCallback(res){
                vm.user = res.data;
                vm.uid = $routeParams.uid;
                vm.password = vm.user.password;
                vm.username = vm.user.username;
                vm.firstName = vm.user.firstName;
                vm.lastName = vm.user.lastName;
                vm.email = vm.user.email;
                vm.phone = vm.user.phone;
                vm.websites = vm.user.websites;
                vm.updateUser = updateUser;
            },
            function errorCallback(res){
                vm.error = res.data;
            }
        );

        function logout() {
            UserService
                .logout()
                .then(
                    function(res) {
                        //$rootScope.currentUser = null;
                        $window.localStorage.setItem("currentUser", null);
                        $location.url("/");
                    },
                    function (response) {
                        vm.error = res.data;
                    }
                );
        }

        function updateUser() {
            var update_user = vm.user;
            update_user.username = vm.username;
            update_user.email = vm.email;
            update_user.firstName = vm.firstName;
            update_user.lastName = vm.lastName;
            UserService.updateUser(update_user._id, update_user).then(
                function successCallback(res){
                    vm.updated = "Profile changes saved!";
                },
                function errorCallback(res){
                    vm.error = res.data;
                }
            );

            $timeout(function () {
                vm.updated = null;
            }, 3000);
        }
    }
})();