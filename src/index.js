'use strict';
var fs = require('fs');
var filepath = './src/data.secret';
var client;

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
    rl.question("What's your tracker tool? 1: Pivotal Tracker, 2: Gitlab. default = Pivotal Tracker", function(answer) {
         
        console.log('You selected ',answer,". Here we go ");
        if (answer == 1 || answer == 0 || answer == null) {
            
            client = require('./services/pivotaltracker-service');
            loadDataByStructure();
            
        };
        if (answer == 2)
        {
            client = require('./services/gitlab-service');
            loadDataByStructure();
        }
        if (answer == 99) {
            console.log('listing your gitlab project');
            client = require('./services/gitlab-service');
            client.getProjects();
        }
        rl.close();
    });
}

function loadDataByStructure() {
    fs.readFile(filepath, {'encoding': 'utf8'}, function (err, data) {
        if (err) throw err;
        // var formatedData = data.replace(/sprint:|epic:/gi, function myFunction(x){return x.toUpperCase();});
        var sprints = data.split(/SPRINT[ ]*:?[ ]*/i).filter(function(s) {return s != ''}).reverse();
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
    var epics = sprint.split(/EPIC[ ]*:?[ ]*/i).filter(function(e) { return e != ''; });
    var sprintName = epics.shift();//.replace(/(?:\r\n|\r|\n)/g, '');
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
    var stories = epic.split(/\r?\n/).map(function(s) {return s.trim()}).filter(function(story){ return story != '' });
    var label = stories.shift();//first item is epic name
    // console.log('stories ', stories);
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