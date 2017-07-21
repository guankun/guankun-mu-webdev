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

        vm.setStyle = function (widget) {
            return {
                "font-size": widget.size + 'px',
                "width": widget.width + 'px'
            }
        }

        vm.setHTML = function (widget){
            return widget.text;
        }

        vm.sortItems = function (start, end) {

            //console.log("start: " + start + " end: " + end);
            var item = vm.widgets[start];

            var del_index = start < end ? start:start+1;
            vm.widgets.splice(end, 0, item);
            vm.widgets.splice(del_index, 1);
        }
    }

    function NewWidgetController($routeParams){
        var vm = this;
        vm.wid = $routeParams.wid;
        vm.uid = $routeParams.uid;
        vm.pid = $routeParams.pid;
    }

    function CreateWidgetController($routeParams, $timeout, $location, WidgetService) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;
        vm.widgetType = $routeParams.wtype;

        vm.name = null;
        vm.size = null;
        vm.text = null;
        vm.width = null;
        vm.url = null;

        vm.error = null;
        vm.uploaded = null;
        vm.uploading = null;

        vm.newWidget = newWidget;
        vm.uploadFile = uploadFile;
        function newWidget(){
            if(!vm.name){
                vm.error = "Name cannot be empty!";
                return;
            }
            var w = {
                _page: vm.pid,
                type: vm.widgetType,
                name: vm.name,
                text: vm.text,
                placeholder: vm.placeholder,
                description: vm.description,
                url: vm.url,
                width: vm.width,
                height: vm.height,
                rows: vm.rows,
                size: vm.size,
                class: vm.class,
                icon: vm.icon
            };
            WidgetService.createWidget(vm.pid, w).then(
                function successCallback(res){
                    $location.url("/user/" + vm.uid + "/website/"+vm.wid +"/page/" + vm.pid + "/widget")
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

        function uploadFile(myFile){
            var file = myFile;
            var uploadUrl = "/api/upload";
            var fd = new FormData();
            fd.append('file', file);

            WidgetService.upload(file, vm.uid, vm.wid, vm.pid, -1).then(
                function successCallback(res){
                    vm.uploading = null;
                    vm.uploaded = "Upload Success!";
                    vm.url = res;
                },
                function errorCallback(res){
                    vm.uploading = null;
                    vm.error = res;
                },
                function progressCallback(progress){
                    vm.uploading = "Image uploading....." + Math.floor(progress) + '%';
                }
            );
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
        vm.uploaded = null;
        vm.uploading = null;

        vm.name = null;
        vm.widgetType = null;
        vm.width = null;
        vm.size = null;
        vm.text = null;
        vm.url = null;

        vm.widget = null;
        vm.widgets = null;

        WidgetService.findWidgetById($routeParams.wgid).then(
            function successCallback(res){
                vm.widget = res.data;
                vm.name = vm.widget.name;
                vm.widgetType = vm.widget.type;
                vm.size = vm.widget.size ? vm.widget.size : 10;
                vm.width = vm.widget.width;
                vm.text = vm.widget.text;
                vm.url = vm.widget.url;
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
        vm.uploadFile = uploadFile;

        function updateWidget() {
            if(!vm.name){
                vm.error = "Name cannot be empty!";
                return;
            }
            var updatedWidget = vm.widget;
            updatedWidget.text = vm.text;
            updatedWidget.size = vm.size;
            updatedWidget.url = vm.url;
            updatedWidget.width = vm.width;

            WidgetService.updateWidget($routeParams.wgid, updatedWidget).then(
                function successCallback(res){
                    $location.url("/user/" + vm.uid + "/website/"+vm.wid +"/page/" + vm.pid + "/widget")
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

        function uploadFile(myFile){
            var file = myFile;
            var uploadUrl = "/api/upload";
            var fd = new FormData();
            fd.append('file', file);

            WidgetService.upload(file, vm.uid, vm.wid, vm.pid, vm.wgid).then(
                function successCallback(res){
                    vm.uploading = null;
                    vm.widget.url = res;
                    vm.url = res;
                    vm.uploaded = "Upload Success!";
                },
                function errorCallback(res){
                    vm.uploading = null;
                    vm.error = res;
                },
                function progressCallback(progress){
                    vm.uploaded = null;
                    vm.uploading = "Image uploading....." + Math.floor(progress) + '%';
                }
            );
        }
    }

})();