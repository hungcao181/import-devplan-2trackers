'use strict';
var fs = require('fs');
var filepath = './src/data.txt';
var epicColor = "#5CB85C";
// var secret = require('./client.secret');

var client = require('./pivotaltracker-service')
// var projectId = secret.pivotaltracker_projectID;
// console.log(client);
var async = require('async');
var jQuery = require('jquery-deferred');
var readline = require('readline');

main();

function main () {
    
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    //we can input argument when run npm start and check process.argv[2] instead. Below is example of using readline
    rl.question("Which function do you want to run? 1: byOrder, 2: byStructure ", function(answer) {
        // TODO: Log the answer in a database
         
        console.log('You selected ',answer,". Here we go ");
        if (answer == 1) {
            loadDataByOrder();
        };
        if (answer == 2)
        {
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
        function() {
            async.eachSeries(
                epics.reverse(),
                processEpic,
                function(err) {
                    if (err) console.log('error ',err);
                    done();
                }
            );
        }
    );
}

function processEpic(epic, done) {
    var stories = epic.split(/\r?\n/).filter(function(story){ return story != '' });
    var label = stories.shift();//first item is epic name
    async.eachSeries(
        stories.reverse().map(function(s) {return {'title':s, 'labels': [label]}}),
        createStory,
        function(err) {
            if (err) console.log('error ',err);
            done();
        }
    );
}

function createMilestone(milestone) {
    return client.createMilestone(milestone);
}

function createStory(story, done) {
    client.createStory(story,done);
}

function getSprintIndex(sprint) {
  var beginSlice = sprint.indexOf('#') + 1;
  var endSlice = sprint.indexOf('\r\n');
  return sprint.slice(beginSlice, endSlice);
}


function getEpicName(epic) {
  var arr = epic.split(/\r?\n/);
  if (arr.length>0) {
    return arr[0];
  }
  return '';
}
