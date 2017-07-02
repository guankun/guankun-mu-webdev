(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, $timeout, PageService){
        var vm = this;
        vm.wid = $routeParams.wid;
        vm.uid = $routeParams.uid;
        vm.pages = [];
        PageService.findPageByWebsiteId(vm.wid).then(
            function successCallback(res){
                vm.pages = res.data;
            },
            function errorCallback(res){
                vm.pages = [];
                vm.error = res.data;
            }
        );
    }

    function NewPageController($routeParams, $timeout, PageService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.name = "PageName";
        vm.description = "WebsiteDescription";

        vm.created = null;
        vm.error = null;

        vm.newPage = newPage;
        function newPage(){
            var page = {
                name: vm.name,
                websiteId : vm.wid,
                description : vm.description
            }
            PageService.createPage(vm.wid, page).then(
                function successCallback(res){
                    vm.created = "Page created!";
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

    function EditPageController($routeParams, $location, $timeout, PageService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.name = null;
        vm.desc = null;

        vm.updated = null;
        vm.deleted = null;
        vm.error = null;


        vm.page = null;
        vm.pages = null;

        PageService.findPageById($routeParams.pid).then(
            function successCallback(res){
                vm.page = res.data;
                vm.name = vm.page.name;
                vm.desc = vm.page.description;
            },
            function errorCallback(res){
                vm.error = res.data;
            }
        );
        PageService.findPageByWebsiteId(vm.wid).then(
            function successCallback(res){
                vm.pages = res.data;
            },
            function errorCallback(res){
                vm.error = res.data;
            }
        );

        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function updatePage() {
            var page = {
                name: vm.name,
                websiteId : vm.wid,
                description : vm.description
            }
            PageService.updatePage($routeParams.pid, page).then(
                function successCallback(res){
                    vm.updated = "Page updated!";
                },
                function errorCallback(res){
                    vm.updated = null;
                    vm.error = "Page update failed! " + res.data;
                }
            );

            $timeout(function () {
                vm.updated = null;
            }, 3000);
        }

        function deletePage() {
            PageService.deletePage($routeParams.pid).then(
                function successCallback(res){
                    vm.deleted = "Website deleted!"
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page");
                },
                function errorCallback(res){
                    vm.deleted = null;
                    vm.error = "Page deletion failed! " + res.data;
                }
            );

            $timeout(function () {
                vm.deleted = null;
            }, 3000);
        }
    }


})();