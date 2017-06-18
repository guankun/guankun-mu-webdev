(function(){
    angular
        .module("WebAppMaker")
        .factory('WidgetService', WidgetService);

    function WidgetService(){
        var widgets = [
            { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
            { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                "url": "http://lorempixel.com/400/200/"},
            { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                "url": "https://youtu.be/AM2Ivdi9c4E" }
        ];

        var services = {
            "createWidget" : createWidget,
            "findWidgetsByPageId" : findWidgetsByPageId,
            "findWidgetById" : findWidgetById,
            "updateWidget" : updateWidget,
            "deleteWidget" : deleteWidget
        };

        return services;

        function getNextId() {
            function getMaxId(maxId, currentId) {
                var current = parseInt(currentId._id);
                if (maxId > current) {
                    return maxId;
                } else {
                    return current + 1;
                }
            }

            return widgets.reduce(getMaxId, 0).toString();
        }

        function createWidget(widget) {
            var newWidgetId = getNextId();
            var newWidget = {};
            if(widget.widgetType == "HEADING"){
                newWidget = {
                    _id: newWidgetId,
                    widgetType: widget.widgetType,
                    pageId: widget.pageId,
                    size: widget.size,
                    text: widget.text
                }
            }
            else if(widget.widgetType == "IMAGE"){
                newWidget = {
                    _id: newWidgetId,
                    widgetType: widget.widgetType,
                    pageId: widget.pageId,
                    width: widget.width,
                    url : widget.url
                }
            }
            else if(widget.widgetType == "YOUTUBE"){
                newWidget = {
                    _id: newWidgetId,
                    widgetType: widget.widgetType,
                    pageId: widget.pageId,
                    width: widget.width,
                    url : widget.url
                }
            }
            widgets.push(newWidget);
        }

        function findWidgetsByPageId(pageId) {
            var result = [];
            for (var w in widgets) {
                var widget = widgets[w];
                if (parseInt(widget.pageId) === parseInt(pageId)) {
                    result.push(widget);
                }
            }
            return result;
        }

        function findWidgetById(widgetId) {
            for (w in widgets) {
                var widget = widgets[w];
                if (parseInt(widget._id) === parseInt(widgetId)) {
                    return widget;
                }
            }
            return null;
        }

        function updateWidget(widgetId, widget) {
            var oldWidget = findWidgetById(widgetId);
            var index = widgets.indexOf(oldWidget);
            widgets[index].widgetType = widget.widgetType;
            widgets[index].pageId = widget.pageId;
            widgets[index].size = widget.size == null ? null : widget.size;
            widgets[index].text = widget.text == null ? null : widget.text;
            widgets[index].width = widget.width == null ? null : widget.width;
            widgets[index].url = widget.url == null ? null : widget.url;
        }

        function deleteWidget(widgetId) {
            var oldWidget = findWidgetById(widgetId);
            var index = widgets.indexOf(oldWidget);
            widgets.splice(index, 1);
        }


    }
})();