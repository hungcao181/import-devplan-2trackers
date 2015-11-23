'use strict';
var fs = require('fs');
var filepath = './src/data.txt';
var epicColor = "#5CB85C";
// var secret = require('./client.secret');
var client;
var projectStartDate = new Date('2015-10-10'); //month start from 0, 10 is for nov

// var client = require('./pivotaltracker-service');
// var client = require('./gitlab-service');
// var projectId = secret.pivotaltracker_projectID;
// console.log(client);
var async = require('async');
var jQuery = require('jquery-deferred');
var readline = require('readline');

importer();

function importer () {
    
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    //we can input argument when run npm start and check process.argv[2] instead. Below is example of using readline
    rl.question("What's your tracker tool? 1: Pivotal Tracker, 2: Gitlab ", function(answer) {
        // TODO: Log the answer in a database
         
        console.log('You selected ',answer,". Here we go ");
        if (answer == 1) {
            
            client = require('./services/pivotaltracker-service');
            loadDataByStructure();
            
        };
        if (answer == 2)
        {
            client = require('./services/gitlab-service');
            loadDataByStructure();
        }
        rl.close();
    });
}


function loadDataByOrder() {
  fs.readFile(filepath, {'encoding': 'utf8'}, function (err, data) {
    if (err) throw err;
    client.addStories(data);        
  });  
}

function loadDataByStructure() {
    fs.readFile(filepath, {'encoding': 'utf8'}, function (err, data) {
        if (err) throw err;
        var formatedData = data.replace(/sprint:|epic:/gi, function myFunction(x){return x.toUpperCase();});
        var sprints = formatedData.split('SPRINT:').filter(function(s) {return s != ''}).reverse();
        async.eachSeries(
            sprints,
            processSprint,
            function(err) {
                if (err) console.log('error ',err);    
            }
        );
    });
}

function processSprint(sprint, done) {
    var epics = sprint.split('EPIC:').filter(function(e) { return e != ''; });
    var sprintName = epics.shift().replace(/(?:\r\n|\r|\n)/g, '');;
    console.log(sprintName);
    jQuery.when(createMilestone(sprintName)).done(
        function(milestoneID) {
            async.eachSeries(
                epics.reverse(),
                processEpic.bind(null, milestoneID), //thanks this post http://stackoverflow.com/questions/20882892/pass-extra-argument-to-async-map
                function(err) {
                    if (err) console.log('error ',err);
                    done();
                }
            );
        }
    );
}

function processEpic(milestone, epic, done) {
    // console.log('I got it here, milestoneID:', milestone);
    var stories = epic.split(/\r?\n/).filter(function(story){ return story != '' });
    var label = stories.shift();//first item is epic name
    async.eachSeries(
        stories.reverse().map(function(s) {return {'title':s, 'labels': [label]}}),
        createStory.bind(null, milestone),
        function(err) {
            if (err) console.log('error ',err);
            done();
        }
    );
}

function createMilestone(milestone) {
    return client.createMilestone(milestone);
}

function createStory(milestone, story, done) {
    // done();
    client.createStory(milestone, story,done);
}