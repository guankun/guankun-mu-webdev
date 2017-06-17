(function() {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
    }

    function NewWebsiteController($routeParams, WebsiteService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.name = "WebsiteName";
        vn.desc = "WebsiteDescription";
        vm.newWebsite = newWebsite;
        function newWebsite(){
            var website = {
                name: vm.name,
                developerId : $routeParams.uid,
                desc : vm.desc
            }
            WebsiteService.createWebsite(vm.uid, website);
            vm.created = "Website created!";

            $timeout(function () {
                vm.created = null;
            }, 3000);
        }
    }

    function EditWebsiteController($routeParams, WebsiteService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.website = WebsiteService.findWebsiteById($routeParams.wid);
        vm.websites = WebsiteService.findWebsitesByUser(vm.uid);
        vm.wid = $routeParams.wid;
        vm.name = vm.website.name;
        vm.desc = vm.website.desc;
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function updateWebsite(){
            var updated_website = {
                _id : $routeParams.wid,
                name : vm.name,
                developerId : $routeParams.uid,
                desc : vm.desc
            }
            WebsiteService.updateWebsite($routeParams.wid, updated_website);
            vm.updated = "Website updated!";

            $timeout(function () {
                vm.updated = null;
            }, 3000);
        }

        function deleteWebsite(){
            WebsiteService.deleteWebsite($routeParams.wid);
        }

    }
}());