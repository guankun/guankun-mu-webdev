(function(){
    angular
        .module("WebAppMaker")
        .factory('WidgetService', WidgetService);

    function WidgetService($http, $q){

        var services = {
            "createWidget" : createWidget,
            "findWidgetsByPageId" : findWidgetsByPageId,
            "findWidgetById" : findWidgetById,
            "updateWidget" : updateWidget,
            "deleteWidget" : deleteWidget,
            "upload": upload
        };

        return services;


        function createWidget(pageId, widget) {
            var url = "/api/page/" + pageId + "/widget";
            return $http.post(url, widget);
        }

        function findWidgetsByPageId(pageId) {
            var url = "/api/page/" + pageId + "/widget";
            return $http.get(url);
        }

        function findWidgetById(widgetId) {
            var url = "/api/widget/" + widgetId;
            return $http.get(url);
        }

        function updateWidget(widgetId, widget) {
            var url = "/api/widget/" + widgetId;
            return $http.put(url, widget);
        }

        function deleteWidget(widgetId) {
            var url = "/api/widget/" + widgetId;
            return $http.delete(url);
        }

        function upload(file, userId, websiteId, pageId, widgetId){
            var url = "/api/upload";
            var fd = new FormData();
            fd.append('file', file);
            fd.append('userId', userId);
            fd.append("websiteId", websiteId);
            fd.append("pageId", pageId);
            fd.append("widgetId", widgetId);

            var defer = $q.defer();
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined},
                uploadEventHandlers: { progress: function(e) {
                    defer.notify(e.loaded * 100 / e.total);
                }}
            }).success(defer.resolve.bind(defer)).error(defer.reject.bind(defer));
/*            .success(function(data){
                defer.resolve(data);
            }.bind(defer))
            .error(function(err) {
                defer.reject(err);
            }.bind(defer));
  */          return defer.promise;
        }

    }
})();