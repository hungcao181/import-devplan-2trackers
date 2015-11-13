// var moment = require('moment');
// var startDay = moment('2015-11-17');

/**
    To run from command line:

    node create-story username password projectId

    https://www.pivotaltracker.com/help/api/rest/v5#Story
 */
var secret = require('./client.secret');
var tracker  = require("pivotaltracker"),
    username = secret.pivotaltracker_username,
    password = secret.pivotaltracker_password,
    projectID = secret.pivotaltracker_projectID;
console.log('Project ', projectID);
var REQUESTED_BY_ID = 975547;
var OWNER_ID = 975547;
var token = secret.pivotaltracker_APItoken;

module.exports = {
    id: projectID,
    addMilestone: function (projectID, sprintData, index, fnProcessData) {
        var client = new tracker.Client({trackerToken:token});
        var data = {
            name: 'Sprint #' + index,
            description: '',
            storyType: 'release',
            // currentState: 'unscheduled',
            requestedById: REQUESTED_BY_ID,
            ownerIds: [OWNER_ID],
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
        
        client.project(projectID).stories.create(data, function(error, story) {
            if (error) {
                console.log('Project id=', projectID, ' add release error', error);
            }
            else {
                console.log(story);
                fnProcessData(projectID, sprintData,story.id);
            }
        }); 
        
    },
    addLabel: function (projectID, milestoneID, label, color, epicData , fnProcessData) {
        var client = new tracker.Client({trackerToken:token});
    
        var data = {
            name: label, //epic
            description: '',
            // comments: [{
            //     personId: COMMENT_PERSON_ID,
            //     text: 'whoa, auto new epic comment!'
            // }]
        };
        fnProcessData(projectID, milestoneID, label, epicData);
        // client.project(projectID).epics.create(data, function(error, epic) {
        //     if (error) {
        //         console.log('add label error: ', error);
        //     }
        //     else {
        //         console.log(epic);
        //         fnProcessData(projectID, milestoneID, label, epicData);
        //     }
        // });
    },
    addStory: function (projectID, storyTitle, label, milestoneID) {
        var client = new tracker.Client({trackerToken:token});
        
        var data = {
            name: storyTitle,
            description: '',
            storyType: 'feature',
            currentState: 'unscheduled',
            requestedById: REQUESTED_BY_ID,
            ownerIds: [OWNER_ID],
            labels: [label],
            // estimate: 2,
            // comments: [{
            //     personId: REQUESTED_BY_ID,
            //     text: 'whoa, auto new story comment!'
            // }],
            // tasks: [{
            //     description: 'wow, auto new story task!!'
            // }],
        };
        
        client.project(projectID).stories.create(data, function(error, story) {
            if (error) {
                console.log('add story error:',error);
            }
            else {
                console.log('added: ', story, projectID, storyTitle, label, milestoneID);
            }
        });
    }    
}