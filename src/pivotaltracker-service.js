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
var jQuery = require('jquery-deferred');
function stringStartsWith (string, prefix) {
    return string.slice(0, prefix ? prefix.length : null) == prefix;
}
module.exports = {
    id: projectID,
    addStories: function (data) {
        // the easiest way to create stories for Pivotal tracker
        var stories = data.replace(/sprint:|epic:/gi, function myFunction(x){return x.toUpperCase();})
        .split(/\r?\n/).filter(function(story){ return story != '' }).reverse();
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
                var storyType = stringStartsWith(story, 'SPRINT:') ? 'release' : 'feature'; 
                var aStory = {
                    name: story,
                    // description: '',
                    storyType: storyType,
                    // currentState: 'unscheduled',
                    requestedById: REQUESTED_BY_ID,
                    ownerIds: [OWNER_ID],
                    labels: label && storyType == 'feature' ? [label] : null,
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
    createStory: function (newStory, done) {
        var client = new tracker.Client({trackerToken:token});
        
        var data = {
            name: newStory.title,
            description: '',
            storyType: 'feature',
            currentState: 'unscheduled',
            requestedById: REQUESTED_BY_ID,
            ownerIds: [OWNER_ID],
            labels: newStory.labels,
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
            console.log('story:', story.name);
            if (error) {
                done(error);
            }
            else {
                done();
            }
        });
    },
    createMilestone: function (milestone) {
        var client = new tracker.Client({trackerToken:token});
        var data = {
            name: 'Sprint ' + milestone,
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
        // return client.project(projectID).stories.create(data).promise();
        var df = jQuery.Deferred();
        console.log('milestone:', milestone);
        client.project(projectID).stories.create(data, function(error, story) {
            console.log('sprint:', story.name);
            if (error) {
                console.log(error);
                df.reject();
            };
            df.resolve(story);
        }); 
        return df.promise();
        
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