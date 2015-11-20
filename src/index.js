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

loadData();

// loadDataSeries();

function loadDataSeries() {
  fs.readFile(filepath, {'encoding': 'utf8'}, function (err, data) {
    if (err) throw err;
    client.addStories(data);        
  });  
}

loadDataNew() {
    
}

function loadData() {
  fs.readFile(filepath, {'encoding': 'utf8'}, function (err, data) {
    if (err) throw err;
    var sprints = data.split('SPRINT:').filter(function(s) {return s != ''});
    async.each(
        sprints, 
        function (sprint, done) {
            jQuery.when(client.addMilestone(client.id, getSprintIndex(sprint), done)) {
                processMilestoneData(client.id, sprint, null);
            }
        },
        function(results) {
            console.log('added milestone ',results);
        }
    )
  });  
}

function getSprintIndex(sprint) {
  var beginSlice = sprint.indexOf('#') + 1;
  var endSlice = sprint.indexOf('\r\n');
  return sprint.slice(beginSlice, endSlice);
}

function processMilestoneData(projectID, sprintData, milestoneID) {
    var epics = sprintData.split('EPIC:').filter(function(e) {
    return e.slice(0,1) != "#" && e != '';
    });
    var funcArrays = [];
    epics.forEach(function(epic) {
        var name = getEpicName(epic);
        console.log('label: ',name);
        console.log(epic);
        funcArrays.push(
            function(done) {
                client.addLabel(projectID, milestoneID, name, epicColor, epic, processEpicData, done);
            }
        );        
    });
    async.series(funcArrays, console.log);
}

function getEpicName(epic) {
  var arr = epic.split(/\r?\n/);
  if (arr.length>0) {
    return arr[0];
  }
  return '';
}

function processEpicData(projectID, milestoneID, name, epic) {

        var funcArrays = [];
        epic.split(/\r?\n/).filter(function(story){ return story != '' }).forEach(function(story, storyIndex) {
          var currentEpic;
          if (storyIndex == 0) {
            currentEpic = story;
            console.log('Adding Epic:', story);
            
          }
          if (storyIndex > 0) {
            console.log('Adding ',projectID, story.replace('story:', ''), name, milestoneID);
            funcArrays.push(
                function(done) {
                    client.addStory(projectID, story.replace('story:', ''), name, milestoneID, done);
                }
            );            
          }
        });
        async.series(funcArrays, console.log);
}

