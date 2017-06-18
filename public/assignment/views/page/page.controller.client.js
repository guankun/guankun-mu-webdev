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
        vm.pages = PageService.findPageByWebsiteId(vm.wid);
    }

    function NewPageController($routeParams, $timeout, PageService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.name = "PageName";
        vm.description = "WebsiteDescription";
        vm.newPage = newPage;
        function newPage(){
            var page = {
                name: vm.name,
                websiteId : vm.wid,
                description : vm.description
            }
            PageService.createPage(vm.uid, vm.wid, page);
            vm.created = "Page created!";

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
        vm.page = PageService.findPageById($routeParams.pid);
        vm.pages = PageService.findPageByWebsiteId(vm.wid);
        vm.name = vm.page.name;
        vm.desc = vm.page.description;
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function updatePage() {
            var page = {
                name: vm.name,
                websiteId : vm.wid,
                description : vm.description
            }
            PageService.updatePage($routeParams.pid, page);
            vm.updated = "Page updated!";

            $timeout(function () {
                vm.updated = null;
            }, 3000);
        }

        function deletePage() {
            PageService.deletePage($routeParams.pid);

            vm.deleted = "Website deleted!"

            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page");

            $timeout(function () {
                vm.deleted = null;
            }, 3000);
        }
    }


})();