var fs = require('fs');
var filepath = './src/data.js';
var epicColor = "#5CB85C";
// var secret = require('./client.secret');

var client = require('./pivotaltracker-service')
// var projectId = secret.pivotaltracker_projectID;
// console.log(client);
loadData();

function loadData() {
  fs.readFile(filepath, {'encoding': 'utf8'}, function (err, data) {
    if (err) throw err;
    
    var sprints = data.split('SPRINT:').filter(function(s) {return s != ''});
    
    sprints.forEach(function(sprint, index) {
      // console.log(sprint);
      if (index == 0) {
        client.addMilestone(client.id, sprint, index, processMilestoneData);  
      }      
      
      // console.log(epics);
      // getStories(sprint);
    })
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
      epics.forEach(function(epic) {
        var name = getEpicName(epic);
        // epic.split(/\r?\n/).forEach(function(story, storyIndex) {
        //   if (storyIndex == 0) {
        //     var currentEpic = story;
        //     console.log('Adding Epic:', story);
            
        //   }
        //   if (storyIndex > 0) {
        //     console.log('Adding ', story);
        //     addStory(story.replace('story:', ''), currentEpic, milestoneID);
        //   }
        // })
        console.log('label: ',name);
        console.log(epic);
        client.addLabel(projectID, milestoneID, name, epicColor, epic, processEpicData)
      })  
}

function getEpicName(epic) {
  var arr = epic.split(/\r?\n/);
  if (arr.length>0) {
    return arr[0];
  }
  return '';
}

function processEpicData(projectID, milestoneID, name, epic) {
        epic.split(/\r?\n/).filter(function(story){ return story != '' }).forEach(function(story, storyIndex) {
          var currentEpic;
          if (storyIndex == 0) {
            currentEpic = story;
            console.log('Adding Epic:', story);
            
          }
          if (storyIndex > 0) {
            console.log('Adding ',projectID, story.replace('story:', ''), name, milestoneID);
            client.addStory(projectID, story.replace('story:', ''), name, milestoneID);
          }
        })
}

