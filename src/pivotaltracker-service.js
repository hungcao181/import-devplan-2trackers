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
// console.log('Project ', projectID);
var REQUESTED_BY_ID = 975547;
var OWNER_ID = 975547;
var token = secret.pivotaltracker_APItoken;

var async = require('async');
// var each = require('async-each-series');
function stringStartsWith (string, prefix) {
    return string.slice(0, prefix ? prefix.length : null) == prefix;
}
module.exports = {
    id: projectID,
    addStories: function (data) {
        // var arrayFuncs = [];
        // function createStories() {
        // }
        var stories = data.split(/\r?\n/).filter(function(story){ return story != '' }).reverse();
        var labels = data.split(/\r?\n/)
            .filter(function(story){ return stringStartsWith(story, 'EPIC:') })
            .map(function(epic) { return epic.replace('EPIC:','')})
            .reverse();
        console.log('array length:', stories.length);
        var client = new tracker.Client({trackerToken:token});
        var label = '', labelIndex = 0;
        async.eachSeries(stories, function(story, done) {
            var isEpic = stringStartsWith(story, 'EPIC:'); 
            label = labels[labelIndex];
            if (isEpic) {
                labelIndex += 1;
                done();
            }
            else {
                var aStory = {
                    name: story,
                    // description: '',
                    storyType: stringStartsWith(story, 'SPRINT:') ? 'release' : 'feature',
                    // currentState: 'unscheduled',
                    requestedById: REQUESTED_BY_ID,
                    ownerIds: [OWNER_ID],
                    labels: label ? [label] : null,
                };
                
                client.project(projectID).stories.create(aStory, function(error, response) {
                    if (error) {
                        console.log(error);
                        done();
                    }
                    else {
                        console.log('added ', response.id);
                        done();
                    }
                });
            }
        }, function(results) {
            console.log('all results: ',results);       
        }
        );
    },
    addMilestone: function (projectID, index, done) {
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
                done(error);
            }
            else {
                done();
            }
        }); 
        
    },
    addLabel: function (projectID, milestoneID, label, color, epicData) {
        var client = new tracker.Client({trackerToken:token});
    
        var data = {
            name: label, //epic
            description: '',
            // comments: [{
            //     personId: COMMENT_PERSON_ID,
            //     text: 'whoa, auto new epic comment!'
            // }]
        };
        client.project(projectID).epics.create(data, function(error, epic) {
            if (error) {
                console.log('add label error: ', error);
            }
            else {
                console.log(epic);
            }
        });
    },
    addStory: function (projectID, storyTitle, label, milestoneID, done) {
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
                done(error);
            }
            else {
                done();
            }
        });
    }    
}