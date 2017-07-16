module.exports = function(app, models) {
    /*var websites = [
        {_id: "123", name: "Facebook", developerId: "456", desc: "Test01"},
        {_id: "234", name: "Tweeter", developerId: "456", desc: "Test02"},
        {_id: "456", name: "Gizmodo", developerId: "456", desc: "Test03"},
        {_id: "567", name: "Tic Tac Toe", developerId: "123", desc: "Test04"},
        {_id: "678", name: "Checkers", developerId: "123", desc: "Test05"},
        {_id: "789", name: "Chess", developerId: "234", desc: "Test06"}
    ];*/

    // POST Calls.
    app.post('/api/user/:uid/website', createWebsite);

    // GET Calls.
    app.get('/api/user/:uid/website', findAllWebsitesForUser);
    app.get('/api/website/:websiteId', findWebsiteById);

    // PUT Calls.
    app.put('/api/website/:websiteId', updateWebsite);

    // DELETE Calls.
    app.delete('/api/website/:websiteId', deleteWebsite);

    function createWebsite(req, res){
        var uid = req.params.uid;
        var website = req.body;
        var newWebsite = {
            _user: uid,
            name: website.name,
            description: website.description
        };
        models.websiteModel.createWebsiteForUser(uid, newWebsite).then(
            function successCallback(newWebsite){
                models.userModel.addWebsiteToUser(newWebsite._user, newWebsite._id);
                res.status(200).send(newWebsite);
            },
            function errorCallback(error){
                res.status(500).send("Website careation failed. " + error);
            }
        );
    }

    function findAllWebsitesForUser(req, res){
        var uid = req.params.uid;
        models.websiteModel.findAllWebsitesForUser(uid).then(
            function successCallback(websites){
                res.status(200).send(websites);
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function findWebsiteById(req, res){
        var wid = req.params.websiteId;

        models.websiteModel.findWebsiteById(wid).then(
            function successCallback(website){
                if(website){
                    res.status(200).json(website);
                }else{
                    res.status(404).send("Website not found by id!");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function updateWebsite(req, res){
        var wid = req.params.websiteId;
        var newWebsite = req.body;

        models.websiteModel.updateWebsite(wid, newWebsite).then(
            function successCallback(website){
                if(website){
                    res.status(200).json(website);
                } else{
                    res.status(404).send("Website not found when update.");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function deleteWebsite(req, res){
        var wid = req.params.websiteId;
        var uid = null;
        models.websiteModel.findWebsiteById(wid).then(
            function successCallback(website){
                if(website){
                    uid = website._user;
                    if(uid){
                        models.userModel.removeWebsiteFromUser(uid, wid);
                    }
                    if(wid){
                        models.websiteModel.deleteWebsite(wid).then(
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
                    res.status(404).send("Website not found when delete.");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );

    }

}