(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.error = null;
        vm.login = login;
        function login(username, password) {
            UserService.findUserByCredentials(username, password).then(
                function successCallback(res) {
                    $location.url("/user/" + res.data._id);
                },
                function errorCallback(res){
                    vm.error = res.data;
                }
            );
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.error = null;
        vm.register = register;

        function register(username, password, vpassword) {
            if (username === undefined || username === null || username === "" || password === undefined || password === "") {
                vm.error = "Username and Passwords cannot be empty.";
                return;
            }
            if (password !== vpassword) {
                vm.error = "Password does not match.";
                return;
            }
            UserService.findUserByUsername(username).then(
                function successCallback(response){
                    vm.error = "Username already exists.";
                },
                function errorCallback(response) {
                    user = {
                        username: username,
                        password: password,
                        firstName: "",
                        lastName: "",
                        email: ""
                    };
                    UserService.createUser(user).then(
                        function successCallback(res) {
                            UserService.findUserByUsername(username).then(
                                function success(res) {
                                    user = res.data;
                                    $location.url("/user/" + user._id);
                                },
                                function errorCallback(res) {
                                    vm.error = "User created but cannot be found.";
                                }
                            );
                        },
                        function error(res) {
                            vm.error = "Create user failed.";
                        }
                    );
                }
            );
        }
    }

    function ProfileController($routeParams, $location, $timeout, UserService) {
        var vm = this;
        vm.updated = null;
        vm.error = null;

        UserService.findUserById($routeParams.uid).then(
            function successCallback(res){
                vm.user = res.data;
                vm.uid = $routeParams.uid;
                vm.username = vm.user.username;
                vm.firstName = vm.user.firstName;
                vm.lastName = vm.user.lastName;
                vm.email = vm.user.email;
                vm.updateUser = updateUser;
            },
            function errorCallback(res){
                vm.error = res.data;
            }
        );

        function updateUser() {
            var update_user = {
                _id: $routeParams.uid,
                username : vm.username,
                firstName: vm.firstName,
                lastName: vm.lastName,
                email: vm.email
            };
            UserService.updateUser($routeParams.uid, update_user).then(
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