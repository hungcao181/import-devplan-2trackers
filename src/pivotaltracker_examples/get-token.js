/**
    To run from command line:

    node get-token username password

    https://www.pivotaltracker.com/help/api/rest/v5#Me
*/
var secret = require('../client.secret');
var tracker  = require("pivotaltracker"),
    username = secret.pivotaltracker_username,
    password = secret.pivotaltracker_password,
    projectId = secret.pivotaltracker_projectID;

var REQUESTED_BY_ID = 975547;
var OWNER_ID = 975547;
var token = secret.pivotaltracker_APItoken;

tracker.getToken(username, password, function(err, token) {

    if(err){
        console.error("Could not retrieve token");
        console.log(err);
    }
    else {
        console.log("Token: ", token);
    }
});
