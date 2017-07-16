module.exports = function(app, models){
    /*var pages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
        { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
        { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
    ];*/

    // POST Calls.
    app.post('/api/website/:websiteId/page', createPage);

    // GET Calls.
    app.get('/api/website/:websiteId/page', findAllPagesForWebsite);
    app.get('/api/page/:pageId', findPageById);

    // PUT Calls.
    app.put('/api/page/:pageId', updatePage);

    // DELETE Calls.
    app.delete('/api/page/:pageId', deletePage);

    function createPage(req, res){
        var wid = req.params.websiteId;
        var page = req.body;

        var newPage = {
            _website: wid,
            name: page.name,
            title: page.title,
            description: page.description
        };
        models.pageModel.createPage(wid, newPage).then(
            function successCallback(newPage){
                models.websiteModel.addPageToWebsite(newPage._website, newPage._id);
                res.status(200).send(newPage);
            },
            function errorCallback(error){
                res.status(500).send("Page careation failed. " + error);
            }
        );
    }

    function findAllPagesForWebsite(req, res){
        var wid = req.params.websiteId;

        models.pageModel.findAllPagesForWebsite(wid).then(
            function successCallback(pages){
                res.status(200).send(pages);
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function findPageById(req, res){
        var pid = req.params.pageId;
        models.pageModel.findPageById(pid).then(
            function successCallback(page){
                if(page){
                    res.status(200).json(page);
                }else{
                    res.status(404).send("Page not found by id!");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function updatePage(req, res){
        var pid = req.params.pageId;
        var newPage = req.body;

        models.pageModel.updatePage(pid, newPage).then(
            function successCallback(page){
                if(page){
                    res.status(200).json(page);
                } else{
                    res.status(404).send("Page not found when update.");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function deletePage(req, res){
        var pid = req.params.pageId;
        var wid = null;

        models.pageModel.findPageById(pid).then(
            function successCallback(page){
                if(page){
                    wid = page._website;
                    if(wid){
                        models.websiteModel.removePageFromWebsite(wid, pid);
                    }
                    if(pid){
                        models.pageModel.deletePage(pid).then(
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
                    res.status(404).send("Page not found when delete.");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }
}