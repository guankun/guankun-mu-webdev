module.exports = function(app){
    var users = [
        {_id: "123", username: "alice",    password: "alice",  email: "alice@neu.edu.cn",  firstName: "Alice",  lastName: "Wonder"  },
        {_id: "234", username: "bob",      password: "bob",    email: "bob@neu.edu.cn",  firstName: "Bob",    lastName: "Marley"  },
        {_id: "345", username: "charly",   password: "charly",  email: "charly@neu.edu.cn", firstName: "Charly", lastName: "Garcia"  },
        {_id: "456", username: "jannunzi", password: "jannunzi", email: "jannunzi@neu.edu.cn",firstName: "Jose",   lastName: "Annunzi" }
    ];

    // POST Calls.
    app.post('/api/user', createUser);

    // GET Calls.
    app.get('/api/user/:uid', findUserById);
    app.get('/api/user', findUserByUsernameOrCredentials);

    // PUT Calls.
    app.put('/api/user/:uid', updateUser);

    // DELETE Calls.
    app.delete('/api/user/:uid', deleteUser);


    function createUser(req,res){
        var user = req.body;
        var newUser = {
            _id: new Date().getTime(),
            username: user.username,
            password: user.password,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        };

        users.push(newUser);
        if(newUser){
            res.status(200).send(newUser);
        } else {
            res.sendStatus(500);
        }
    }

    function findUserById(req, res) {
        var uid = req.params.uid;
        for (var u in users){
            var user = users[u];
            if(parseInt(user._id) === parseInt(uid)){
                res.status(200).send(user);
                return;
            }
        }
        res.status(404).send("User not found!");
    }

    function findUserByUsernameOrCredentials(req, res){
        if(req.query.password){
            findUserByCredentials(req, res);
        }
        else{
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        for (var u in users){
            var user = users[u];
            if(user.username === username){
                res.status(200).send(user);
                return;
            }
        }
        res.status(404).send("User not found!");
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        for (var u in users){
            var user = users[u];
            if((user.username === username) && (user.password === password)){
                res.status(200).send(user);
                return;
            }
        }
        res.status(404).send("Wrong username or password!");
    }

    function updateUser(req, res){
        var uid = req.params.uid;
        var newUser = req.body;

        for (u in users){
            var user = users[u];
            if(parseInt(user._id) === parseInt(uid)){
                user.email = newUser.email;
                user.firstName = newUser.firstName;
                user.lastName = newUser.lastName;
                res.status(200).send(user);
                return;
            }
        }
        res.status(404).send("User not found and update failed!");
    }

    function deleteUser(req,res) {
        var uid = req.params.id;

        for (u in users){
            var user = users[u];
            if(parseInt(user._id) === parseInt(uid)){
                users.splice(u,1);
                res.sendStatus(200);
                return;
            }
        }
        res.status(404).send("not found!");
    }
}

