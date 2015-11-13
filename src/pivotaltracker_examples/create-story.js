/**
    To run from command line:

    node create-story username password projectId

    https://www.pivotaltracker.com/help/api/rest/v5#Story
 */
var secret = require('../client.secret');
var tracker  = require("pivotaltracker"),
    username = secret.pivotaltracker_username,
    password = secret.pivotaltracker_password,
    projectId = secret.pivotaltracker_projectID;

var REQUESTED_BY_ID = 975547;
var OWNER_ID = 975547;
var token = secret.pivotaltracker_APItoken;

var moment = require('moment');
var startDay = moment('2015-11-17');
var index = 2;
console.log('date:',startDay.add((index-1)*7, 'days'));
tracker.getToken(username, password, function(err, token) {

    if(err){
        console.error("Could not retrieve token");
        console.log(err);
    }
    else {
        var client = new tracker.Client({trackerToken:token});
        var data = {
            name: 'Sprint #' + index,
            description: 'arelease',
            storyType: 'release',
            // currentState: 'unscheduled',
            requestedById: REQUESTED_BY_ID,
            // ownerIds: [OWNER_ID],
            // deadline: startDay.add((index-1)*7, 'days')
            // estimate: 2,
            // comments: [{
            //     personId: REQUESTED_BY_ID,
            //     text: 'whoa, auto new story comment!'
            // }],
            // tasks: [{
            //     description: 'wow, auto new story task!!'
            // }],
        };
    
        // var data = {
        //     name: 'hay guyz, this is a test',
        //     description: 'super cool description',
        //     storyType: 'feature',
        //     currentState: 'started',
        //     estimate: 2,
        //     requestedById: REQUESTED_BY_ID,
        //     comments: [{
        //         personId: REQUESTED_BY_ID,
        //         text: 'whoa, auto new story comment!'
        //     }],
        //     tasks: [{
        //         description: 'wow, auto new story task!!'
        //     }],
        //     ownerIds: [OWNER_ID]
        // };

        client.project(projectId).stories.create(data, function(error, story) {
            if (error) {
                console.log(error);
            }
            else {
                console.log(story);
            }
        });
    }
});