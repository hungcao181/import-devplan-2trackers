/**
    To run from command line:

    node get-project username password projectId

    https://www.pivotaltracker.com/help/api/rest/v5#Project
 */
var secret = require('../client.secret');
var tracker  = require("pivotaltracker"),
    username = secret.pivotaltracker_username,
    password = secret.pivotaltracker_password,
    projectId = secret.pivotaltracker_projectID;

var REQUESTED_BY_ID = 975547;
var OWNER_ID = 975547;

        var client = new tracker.Client({trackerToken:secret.pivotaltracker_APItoken});

        client.project(projectId).get(function(error, project) {
            if (error) {
                console.log(error);
            }
            else {
                console.log(project);
            }
        });


// tracker.getToken(username, password, function(err, token) {

//     if (err) {
//         console.log(err);
//     }
//     else {
//         var client = new tracker.Client({trackerToken:token});

//         client.project(projectId).get(function(error, project) {
//             if (error) {
//                 console.log(error);
//             }
//             else {
//                 console.log(project);
//             }
//         });
//     }
// });
