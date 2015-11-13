/**
 To run from command line:

 node create-epic username password epicId

 https://www.pivotaltracker.com/help/api/rest/v5#Epic
 */
var secret = require('../client.secret');
var tracker  = require("pivotaltracker"),
    username = secret.pivotaltracker_username,
    password = secret.pivotaltracker_password,
    projectId = secret.pivotaltracker_projectID;

var REQUESTED_BY_ID = 975547;
var OWNER_ID = 975547;
var token = secret.pivotaltracker_APItoken;

var COMMENT_PERSON_ID = 975547;

tracker.getToken(username, password, function(err, token) {

    if(err){
        console.error("Could not retrieve token");
        console.log(err);
    }
    else {
        var client = new tracker.Client({trackerToken:token});

        var data = {
            name: 'hay guyz, this is an epic test',
            description: 'super cool epic description',
            comments: [{
                personId: COMMENT_PERSON_ID,
                text: 'whoa, auto new epic comment!'
            }]
        };

        client.project(projectId).epics.create(data, function(error, epic) {
            if (error) {
                console.log(error);
            }
            else {
                console.log(epic);
            }
        });
    }
});