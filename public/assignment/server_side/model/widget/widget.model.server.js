module.exports = function(mongoose, conn) {
    var widgetSchema = require('./widget.schema.server.js')(mongoose);
    var widgetModel = conn.model('Widget', widgetSchema);

    var api = {
        'createWidget': createWidget,
        'findAllWidgetsForPage': findAllWidgetsForPage,
        'findWidgetById': findWidgetById,
        'updateWidget': updateWidget,
        'deleteWidget': deleteWidget
    }
    return api;

    function createWidget(pageId, widget){
        var newWidget = {
            _page: pageId,
            type: widget.type,
            name: widget.name,
            text: widget.text,
            placeholder: widget.placeholder,
            description: widget.description,
            url: widget.url,
            width: widget.width,
            height: widget.height,
            rows: 0,
            size: 10,
            class: widget.class,
            icon: widget.icon,
            deletable: widget.deletable,
            formatted: widget.formatted,
            dateCreated: Date.now()
        }
        return widgetModel.create(newWidget);
    }

    function findAllWidgetsForPage(pageId){
        return widgetModel.find({_page : pageId});
    }

    function findWidgetById(widgetId){
        return widgetModel.findById(widgetId);
    }

    function updateWidget(widgetId, widget){
        return widgetModel.update(
            {   _id: widgetId
            }, {
                _page: widget._page,
                type: widget.type,
                name: widget.name,
                text: widget.text,
                placeholder: widget.placeholder,
                description: widget.description,
                url: widget.url,
                width: widget.width,
                height: widget.height,
                rows: widget.rows ? widget.rows : 0,
                size: widget.size ? widget.size : 0,
                class: widget.class,
                icon: widget.icon,
                deletable: widget.deletable,
                formatted: widget.formatted,
                dateCreated: widget.dateCreated
            }
        );
    }

    function deleteWidget(widgetId){
        return widgetModel.remove({
            _id : widgetId
        });
    }
}