module.exports = function(mongoose, conn){
    var userSchema = require('./user.schema.server.js')(mongoose);
    var userModel = conn.model('User', userSchema);
    var ObjectId = mongoose.Types.ObjectId;

    var api = {
        'createUser': createUser,
        'findUserById': findUserById,
        'findUserByUsername': findUserByUsername,
        'findUserByCredentials': findUserByCredentials,
        'updateUser': updateUser,
        'deleteUser': deleteUser,
        'addWebsiteToUser': addWebsiteToUser,
        'removeWebsiteFromUser': removeWebsiteFromUser
    }
    return api;

    function createUser(user){
        var newUser = {
            username: user.username,
            password: user.password,
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            phone: user.phone,
            websites: new Array(),
            dateCreated: Date.now()
        }
        return userModel.findOne({username: user.username}).then(
            function(existingUser){
                if(existingUser == null || existingUser == undefined || existingUser == ""){
                    return userModel.create(newUser);
                }
                else{
                    return new Promise(function(resolve, reject){
                        resolve(undefined);
                    });
                }
            },
            function (err){
                return new Promise(function(resolve, reject){
                    reject(err);
                });
            }
        );
    }

    function findUserById(userId){
        return userModel.findById(userId);
    }

    function findUserByUsername(uname){
        return userModel.findOne({username : uname})
    }

    function findUserByCredentials(uname, pswrd){
        return userModel.findOne({
            username : uname,
            password : pswrd
        });
    }

    function updateUser(userId, user){
        return userModel.update(
            {   _id: user._id
            }, {
                username: user.username,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                websites: user.websites,
                dateCreated: user.dateCreated
            }
        );
    }

    function deleteUser(userId){
        return userModel.remove({
            _id : userId
        });
    }

    function addWebsiteToUser(userId, websiteId){
        userModel.findById(userId).then(
            function(user){
                user.websites.push(websiteId);
                user.save();
            },
            function(error){
                console.log(error);
            }
        );
    }

    function removeWebsiteFromUser(userId, websiteId){
        userModel.findById(userId).then(
            function(user){
                user.websites.pull(websiteId);
                user.save();
            },
            function(error){
                console.log(error);
            }
        );
    }
}