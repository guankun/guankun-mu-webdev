module.exports = function(app) {
    var websites = [
        {_id: "123", name: "Facebook", developerId: "456", desc: "Test01"},
        {_id: "234", name: "Tweeter", developerId: "456", desc: "Test02"},
        {_id: "456", name: "Gizmodo", developerId: "456", desc: "Test03"},
        {_id: "567", name: "Tic Tac Toe", developerId: "123", desc: "Test04"},
        {_id: "678", name: "Checkers", developerId: "123", desc: "Test05"},
        {_id: "789", name: "Chess", developerId: "234", desc: "Test06"}
    ];

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
            _id: new Date().getTime(),
            name: website.name,
            desc: website.desc,
            developerId: uid
        };
        websites.push(newWebsite);

        if(newWebsite){
            res.status(200).send(newWebsite);
        } else {
            res.sendStatus(500).send("Website creat failed.");
        }
    }

    function findAllWebsitesForUser(req, res){
        var uid = req.params.uid;
        var result = [];

        for(var w in websites){
            var website = websites[w];
            if (parseInt(website.developerId) === parseInt(uid)) {
                result.push(website);
            }
        }

        if(result.length > 0){
            res.status(200).send(result);
        } else{
            res.status(404).send("No websites for this user.");
        }
    }

    function findWebsiteById(req, res){
        var wid = req.params.websiteId;

        for(var w in websites){
            var website = websites[w];
            if (parseInt(website._id) === parseInt(wid)) {
                res.status(200).send(website);
                return;
            }
        }
        res.status(404).send("Website not found");
    }

    function updateWebsite(req, res){
        var wid = req.params.websiteId;
        var newWebsite = req.body;
        var oldWebsite = null;

        for(var w in websites){
            var website = websites[w];
            if (parseInt(website._id) === parseInt(wid)) {
                oldWebsite = website;
            }
        }

        if(oldWebsite){
            var index = websites.indexOf(oldWebsite);
            websites[index].name = newWebsite.name;
            websites[index].desc = newWebsite.desc;
            res.status(200).send(websites[index]);
        } else{
            res.status(404).send("Website not found");
        }
    }

    function deleteWebsite(req, res){
        var wid = req.params.websiteId;

        for(var i = 0; i < websites.length; i++){
            var website = websites[i];
            if (parseInt(website._id) === parseInt(wid)) {
                websites.splice(i, 1);
                res.status(200);
                return;
            }
        }
        res.status(404).send("Website not found");
    }

}