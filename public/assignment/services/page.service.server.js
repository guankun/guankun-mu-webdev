module.exports = function(app){
    var pages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
        { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
        { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
    ];

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
            _id: new Date().getTime(),
            name: page.name,
            description: page.description,
            websiteId: wid
        };

        if(newPage){
            pages.push(newPage);
            res.status(200).send(newPage);
        } else{
            res.status(500).send("Page creation failed!");
        }
    }

    function findAllPagesForWebsite(req, res){
        var wid = req.params.websiteId;
        var result = [];

        for(var p in pages){
            var page = pages[p];
            if(parseInt(page.websiteId) === parseInt(wid)){
                result.push(page);
            }
        }

        res.status(200).send(result);
    }

    function findPageById(req, res){
        var pid = req.params.pageId;
        for(var p in pages){
            var page = pages[p];
            if(parseInt(page._id) === parseInt(pid)){
                res.status(200).send(page);
                return;
            }
        }
        res.status(404).send("Page not found!");
    }

    function updatePage(req, res){
        var pid = req.params.pageId;
        var oldPage = null;
        for(var p in pages){
            var page = pages[p];
            if(parseInt(page._id) === parseInt(pid)){
                oldPage = pages[p];
            }
        }
        if(oldPage){
            var index = pages.indexOf(oldPage);
            pages[index].name = page.name;
            pages[index].description = page.description;
            res.status(200).send(pages[index]);
        } else{
            res.status(404).send("Page not found!");
        }

    }

    function deletePage(req, res){
        var pid = req.params.pageId;
        for(var i = 0; i < pages.length; i++){
            var page = pages[i];
            if (parseInt(page._id) === parseInt(pid)) {
                pages.splice(i, 1);
                res.status(200);
                return;
            }
        }
        res.status(404).send("Page not found!");
    }
}