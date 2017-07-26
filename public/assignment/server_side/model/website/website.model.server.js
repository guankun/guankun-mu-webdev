module.exports = function(mongoose, conn) {
    var websiteSchema = require('./website.schema.server.js')(mongoose);
    var websiteModel = conn.model('Website', websiteSchema);

    var api = {
        'createWebsiteForUser': createWebsiteForUser,
        'findAllWebsitesForUser': findAllWebsitesForUser,
        'findWebsiteById': findWebsiteById,
        'updateWebsite': updateWebsite,
        'deleteWebsite': deleteWebsite,
        'addPageToWebsite': addPageToWebsite,
        'removePageFromWebsite': removePageFromWebsite
    }

    return api;

    function createWebsiteForUser(userId, website){
        var newWebsite = {
            _user : userId,
            name : website.name,
            description: website.description,
            pages: new Array(),
            dateCreated: Date.now()
        }
        return websiteModel.create(newWebsite);
    }

    function findAllWebsitesForUser(userId){
        return websiteModel.find({_user : userId});
    }

    function findWebsiteById(websiteId){
        return websiteModel.findById(websiteId);
    }

    function updateWebsite(websiteId, website){
        return websiteModel.update(
            {   _id: websiteId
            }, {
                _user: website._user,
                name : website.name,
                description: website.description,
                pages: website.pages,
                dateCreated: website.dateCreated
            }
        );
    }

    function deleteWebsite(websiteId){
        return websiteModel.remove({
            _id : websiteId
        });
    }

    function addPageToWebsite(websiteId, pageId){
        websiteModel.findById(websiteId).then(
            function(website){
                website.pages.push(pageId);
                website.save();
            },
            function(error){
                console.log(error);
            }
        );
    }

    function removePageFromWebsite(websiteId, pageId){
        websiteModel.findById(websiteId).then(
            function(website){
                website.pages.pull(pageId);
                website.save();
            },
            function(error){
                console.log(error);
            }
        );
    }

}