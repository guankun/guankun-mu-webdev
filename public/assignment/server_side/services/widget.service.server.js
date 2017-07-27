module.exports = function(app, models){
    /*var widgets = [
        { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://www.youtube.com/embed/AM2Ivdi9c4E" }
    ];*/

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../uploads' });
    // POST Calls.
    app.post('/api/page/:pageId/widget', createWidget);
    app.post('/api/upload', upload.single('file'), uploadImage);

    // GET Calls.
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);

    // PUT Calls.
    app.put('/api/widget/:widgetId', updateWidget);

    // DELETE Calls.
    app.delete('/api/widget/:widgetId', deleteWidget);

    function createWidget(req, res) {
        var pid = req.params.pageId;
        var widget = req.body;
        var newWidget = {
            _page: widget._page,
            type: widget.type,
            name: widget.name,
            text: widget.text,
            placeholder: widget.placeholder,
            description: widget.description,
            url: widget.url,
            width: widget.width,
            height: widget.height,
            rows: widget.rows,
            size: widget.size,
            class: widget.class,
            icon: widget.icon,
            deletable: widget.deletable,
            formatted: widget.formatted
        };
        models.widgetModel.createWidget(pid, newWidget).then(
            function successCallback(newWidget){
                models.pageModel.addWidgetToPage(newWidget._page, newWidget._id);
                res.status(200).send(newWidget);
            },
            function errorCallback(error){
                res.status(500).send("Widget creation failed. " + error);
            }
        );
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        models.widgetModel.findAllWidgetsForPage(pageId).then(
            function successCallback(widgets){
                res.status(200).send(widgets);
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function findWidgetById(req, res){
        var wgid = req.params.widgetId;
        models.widgetModel.findWidgetById(wgid).then(
            function successCallback(widget){
                if(widget){
                    res.status(200).json(widget);
                }else{
                    res.status(404).send("Widget not found by id!");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function updateWidget(req, res){
        var wgid = req.params.widgetId;
        var newWidget = req.body;

        models.widgetModel.updateWidget(wgid, newWidget).then(
            function successCallback(widget){
                if(widget){
                    res.status(200).json(widget);
                } else{
                    res.status(404).send("Widget not found when update.");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function deleteWidget(req, res){
        var wgid = req.params.widgetId;
        var pid = null;

        models.widgetModel.findWidgetById(wgid).then(
            function successCallback(widget){
                if(widget){
                    pid = widget._page;
                    if(pid){
                        models.pageModel.removeWidgetFromPage(pid, wgid);
                    }
                    if(wgid){
                        models.widgetModel.deleteWidget(wgid).then(
                            function (status){
                                res.status(200);
                            },
                            function (error){
                                res.status(400).send(error);
                            }
                        );
                    } else{
                        // Precondition Failed. Precondition is that the user exists.
                        res.status(412);
                    }
                } else{
                    res.status(404).send("Widget not found when delete.");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function uploadImage(req, res){
        var userId      = req.body.userId;
        var websiteId   = req.body.websiteId;
        var pageId      = req.body.pageId;
        var widgetId    = req.body.widgetId;
        var myFile      = req.file;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        var newUrl = '/assignment/uploads/'+filename;

        if(widgetId == -1){ // create new widget
            res.status(200).send(newUrl);
        } else{
            models.widgetModel.findWidgetById(widgetId).then(
                function successCallback(widget){
                    if(widget){
                        var newWidget = widget;
                        newWidget.url = newUrl;
                        models.widgetModel.updateWidget(widgetId, newWidget).then(
                            function successCallback(widget){
                                if(widget){
                                    res.status(200).send(newUrl);
                                } else{
                                    res.status(404).send("Widget not found when upload image.");
                                }
                            },
                            function errorCallback(error){
                                res.status(400).send(error);
                            }
                        );
                    }else{
                        res.status(404).send("Widget not found by id when upload image!");
                    }
                },
                function errorCallback(error){
                    res.status(400).send(error);
                }
            );
        }
    }

}