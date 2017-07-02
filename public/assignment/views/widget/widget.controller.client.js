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
        vm.widgets = [];
        vm.error = null;
        WidgetService.findWidgetsByPageId(vm.pid).then(
            function successCallback(res){
                vm.widgets = res.data;
            },
            function errorCallback(res){
                vm.widgets = [];
                vm.error = res.data;
            }
        );
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

        vm.size = null;
        vm.text = null;
        vm.width = null;
        vm.url = null;

        vm.error = null;

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
            WidgetService.createWidget(vm.pid, w).then(
                function successCallback(res){
                    vm.created = "Widget created!";
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

    function EditWidgetController($routeParams, $location, $timeout, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.wgid = $routeParams.wgid;

        vm.updated = null;
        vm.deleted = null;
        vm.error = null;

        vm.widgetType = null;
        vm.size = null;
        vm.text = null;
        vm.width = null;
        vm.url = null;

        vm.widget = null;
        vm.widgets = null;

        WidgetService.findWidgetById($routeParams.wgid).then(
            function successCallback(res){
                vm.widget = res.data;
                vm.widgetType = vm.widget.widgetType;
                vm.size = vm.widget.size == null ? null : vm.widget.size;
                vm.text = vm.widget.text == null ? null : vm.widget.text;
                vm.width = vm.widget.width == null ? null : vm.widget.width;
                vm.url = vm.widget.url == null ? null : vm.widget.url;
            },
            function errorCallback(res){
                vm.error = res.data;
            }
        );
        WidgetService.findWidgetsByPageId(vm.wid).then(
            function successCallback(res){
                vm.widgets = res.data;
            },
            function errorCallback(res){
                vm.error = res.data;
            }
        );

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
            WidgetService.updateWidget($routeParams.wgid, w).then(
                function successCallback(res){
                    vm.updated = "Widget updated!";
                },
                function errorCallback(res){
                    vm.error = res.data;
                }
            );

            $timeout(function () {
                vm.updated = null;
            }, 3000);
        }

        function deleteWidget() {
            WidgetService.deleteWidget($routeParams.wgid).then(
                function successCallback(res){
                    vm.deleted = "Widget deleted!";
                    $location.url("/user/" + vm.uid + "/website/" + vm.wid + "/page/" + vm.pid + "/widget");
                },
                function errorCallback(res){
                    vm.error = res.data;
                }
            );

            $timeout(function () {
                vm.deleted = null;
            }, 3000);
        }
    }


})();