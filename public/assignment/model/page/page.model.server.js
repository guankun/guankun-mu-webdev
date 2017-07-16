module.exports = function(mongoose, conn) {
    var pageSchema = require('./page.schema.server.js')(mongoose);
    var pageModel = conn.model('Page', pageSchema);

    var api = {
        'createPage': createPage,
        'findAllPagesForWebsite': findAllPagesForWebsite,
        'findPageById': findPageById,
        'updatePage': updatePage,
        'deletePage': deletePage,
        'addWidgetToPage': addWidgetToPage,
        'removeWidgetFromPage': removeWidgetFromPage
    }

    return api;

    function createPage(websiteId, page){
        var newPage = {
            _website: websiteId,
            name: page.name,
            title: page.title,
            description: page.description,
            widgets: new Array(),
            dateCreated: Date.now()
        }
        return pageModel.create(newPage);
    }

    function findAllPagesForWebsite(websiteId){
        return pageModel.find({_website : websiteId});
    }

    function findPageById(pageId){
        return pageModel.findById(pageId);
    }

    function updatePage(pageId, page){
        return pageModel.update(
            {   _id: pageId
            }, {
                _website: page._website,
                name : page.name,
                title: page.title,
                description: page.description,
                widgets: page.widgets,
                dateCreated: page.dateCreated
            }
        );
    }

    function deletePage(pageId){
        return pageModel.remove({
            _id : pageId
        });
    }

    function addWidgetToPage(pid, wgid){
        pageModel.findById(pid).then(
            function(page){
                page.widgets.push(wgid);
                page.save();
            },
            function(error){
                console.log(error);
            }
        );
    }

    function removeWidgetFromPage(pid, wgid){
        pageModel.findById(pid).then(
            function(page){
                page.widgets.pull(wgid);
                page.save();
            },
            function(error){
                console.log(error);
            }
        );
    }
}