(function() {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.uid = $routeParams.uid;

        vm.websites = [];
        vm.error = null;

        WebsiteService.findWebsitesByUser(vm.uid).then(
            function successCallback(res){
                vm.websites = res.data;
            },
            function errorCallback(res){
                vm.websites = [];
                vm.error = res.data;
            }
        );
    }

    function NewWebsiteController($routeParams, $timeout, WebsiteService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.name = "WebsiteName";
        vm.desc = "WebsiteDescription";

        vm.created = null;
        vm.error = null;

        vm.websites = null;

        WebsiteService.findWebsitesByUser(vm.uid).then(
            function successCallback(res){
                vm.websites = res.data;
            },
            function errorCallback(res){
                vm.error = res.data;
            }
        );

        vm.newWebsite = newWebsite;

        function newWebsite(){
            var website = {
                _user : $routeParams.uid,
                name: vm.name,
                description : vm.desc
            }
            WebsiteService.createWebsite(vm.uid, website).then(
                function successCallback(res){
                    vm.created = "Website created!";
                },
                function errorCallback(res){
                    vm.error = res.data;
                }
            );
            $timeout(function () {
                vm.created = null;
            }, 3000);
        }
    }

    function EditWebsiteController($routeParams, $location, $timeout, WebsiteService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;

        vm.updated = null;
        vm.deleted = null;
        vm.error = null;

        vm.website = null;
        vm.name = null;
        vm.desc = null;
        WebsiteService.findWebsiteById($routeParams.wid).then(
            function successCallback(res){
                vm.website = res.data;
                vm.name = vm.website.name;
                vm.desc = vm.website.description;
            },
            function errorCallback(res){
                vm.error = res.data;
            }
        );
        vm.websites = null;
        WebsiteService.findWebsitesByUser(vm.uid).then(
            function successCallback(res){
                vm.websites = res.data;
            },
            function errorCallback(res){
                vm.error = res.data;
            }
        );

        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function updateWebsite(){
            var updated_website = vm.website;
            updated_website.name = vm.name;
            updated_website.description = vm.desc;
            WebsiteService.updateWebsite($routeParams.wid, updated_website).then(
                function successCallback(res){
                    vm.updated = "Website updated!";
                },
                function errorCallback(){
                    vm.updated = null;
                    vm.error = "Website update failed!" + res.data;
                }
            );
            vm.updated = "Website updated!";

            $timeout(function () {
                vm.updated = null;
            }, 3000);
        }

        function deleteWebsite(){
            WebsiteService.deleteWebsite($routeParams.wid).then(
                function successCallback(res){
                    vm.deleted = "Website deleted!";
                    $location.url("/user/" + vm.uid + "/website");
                },
                function errorCallback(res){
                    vm.deleted = null;
                    vm.error = "Website deletion failed! " + res.data;
                }
            );

            $timeout(function () {
                vm.deleted = null;
            }, 3000);
        }

    }
}());