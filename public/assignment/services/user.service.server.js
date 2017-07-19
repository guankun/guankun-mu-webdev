module.exports = function(app, models){
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
        models.userModel.createUser(user).then(
            function successCallback(newUser){
                res.status(200).send(newUser);
            },
            function errorCallback(error){
                res.status(400).send("User creation failed. " + error);
            }
        );
    }

    function findUserById(req, res) {
        var uid = req.params.uid;
        models.userModel.findUserById(uid).then(
            function successCallback(user){
                if(user){
                    res.status(200).json(user);
                }else{
                    res.status(404).send("User not found by id!");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
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
        models.userModel.findUserByUsername(username).then(
            function successCallback(user){
                if(user){
                    res.status(200).json(user);
                } else{
                    res.status(404).send("User not found by username.");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        models.userModel.findUserByCredentials(username, password).then(
            function successCallback(user){
                if(user){
                    res.status(200).json(user);
                } else{
                    res.status(404).send("Wrong username or password!");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function updateUser(req, res){
        var uid = req.params.uid;
        var newUser = req.body;

        models.userModel.updateUser(uid, newUser).then(
            function successCallback(user){
                if(user){
                    res.status(200).json(user);
                } else{
                    res.status(404).send("User not found when update.");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function deleteUser(req,res) {
        var uid = req.params.id;
        if(uid){
            model
                .userModel
                .deleteUser(uid)
                .then(
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
    }
}

