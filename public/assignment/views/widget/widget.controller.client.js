(function() {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController", NewWidgetController)
        .controller("EditWidgetController", EditWidgetController)
        .controller("CreateWidgetController", CreateWidgetController)
        .filter('trusted', ['$sce', function ($sce) {
            return $sce.trustAsResourceUrl;
        }]);



    function WidgetListController($routeParams, $timeout, WidgetService){
        var vm = this;
        vm.wid = $routeParams.wid;
        vm.uid = $routeParams.uid;
        vm.pid = $routeParams.pid;
        vm.widgets = WidgetService.findWidgetsByPageId(vm.pid);
    }

    function NewWidgetController($routeParams){
        var vm = this;
        vm.wid = $routeParams.wid;
        vm.uid = $routeParams.uid;
        vm.pid = $routeParams.pid;
    }

    function CreateWidgetController($routeParams, $timeout, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.widgetType = $routeParams.wtype;

        vm.newWidget = newWidget;
        function newWidget(){
            var w = {
                widgetType: vm.widgetType,
                pageId: vm.pid,
                size: vm.size,
                text: vm.text,
                width: vm.width,
                url: vm.url
            };
            WidgetService.createWidget(w);
            vm.created = "Widget created!";

            $timeout(function () {
                vm.created = null;
            }, 3000);
        }
    }

    function EditWidgetController($routeParams, $location, $timeout, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;
        vm.widget = WidgetService.findWidgetById($routeParams.wgid);
        vm.widgets = WidgetService.findWidgetsByPageId(vm.wid);
        vm.widgetType = vm.widget.widgetType;
        vm.size = vm.widget.size == null ? null : vm.widget.size;
        vm.text = vm.widget.text == null ? null : vm.widget.text;
        vm.width = vm.widget.width == null ? null : vm.widget.width;
        vm.url = vm.widget.url == null ? null : vm.widget.url;

        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        function updateWidget() {
            var w = {
                _id: vm.wgid,
                widgetType: vm.widgetType,
                pageId: vm.pid,
                size: vm.widget.size == null ? null : vm.size,
                text: vm.widget.text == null ? null : vm.text,
                width: vm.widget.width == null ? null : vm.width,
                url: vm.widget.url == null ? null : vm.url
            };
            WidgetService.updateWidget($routeParams.wgid, w);
            vm.updated = "Widget updated!";

            $timeout(function () {
                vm.updated = null;
            }, 3000);
        }

        function deleteWidget() {
            WidgetService.deleteWidget($routeParams.wgid);

            vm.deleted = "Widget deleted!";

            $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");

            $timeout(function () {
                vm.deleted = null;
            }, 3000);
        }
    }


})();