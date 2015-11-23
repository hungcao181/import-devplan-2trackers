// var moment = require('moment');
// var startDay = moment('2015-11-17');

/**
    To run from command line:

    node create-story username password projectId

    https://www.pivotaltracker.com/help/api/rest/v5#Story
 */
var secret = require('../client.secret');
var tracker  = require("pivotaltracker"),
    username = secret.pivotaltracker_username,
    password = secret.pivotaltracker_password,
    projectID = secret.pivotaltracker_projectID,
    projectStartDate = secret.projectStartDate;
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
    createStory: function (milestone, newStory, done) {
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
            console.log('story:', story? story.name : null);
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

        var startDate = new Date(projectStartDate);
        startDate.setTime( startDate.getTime() + parseInt(milestone.replace('#','')) * 604800000 );

        var data = {
            name: 'Sprint ' + milestone,
            description: '',
            storyType: 'release',
            // currentState: 'unscheduled',
            requestedById: REQUESTED_BY_ID,
            ownerIds: [OWNER_ID],
            deadline: startDate,
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
        // console.log('milestone:', data);
        client.project(projectID).stories.create(data, function(error, story) {
            if (error) {
                console.log(error);
                df.reject();
            } else {
                console.log('sprint:', story);
                df.resolve(story ? story.id : null);                
            };
        }); 
        return df.promise();
        
    }    
}