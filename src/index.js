var fs = require('fs');
var moment = require('moment');
var gitlab = require('node-gitlab');
var filepath = './src/data.js';
var epicColor = "#5CB85C";
var secret = require('./secret.js');
console.log('Token:',secret.private_token);
var client = gitlab.create({
  api: 'https://gitlab.com/api/v3',
  privateToken: secret.private_token,
  requestTimeout: 15000,
});

var startDay = moment('2015-11-09');
// console.log(startDay.add(7, 'days').format());

// client.id = '590790';
client.id = '591075';

// getProjects();

// addMilestone(client.id,'-',1,console.log);

// addLabel(client.id, '-' , 'alabel', epicColor, '-' , console.log);

loadData();

function loadData() {
  fs.readFile(filepath, {'encoding': 'utf8'}, function (err, data) {
    if (err) throw err;
    
    var sprints = data.split('SPRINT:').filter(function(s) {return s != ''});
    
    sprints.forEach(function(sprint, index) {
      // console.log(sprint);
      if (index == 0) {
        addMilestone(client.id, sprint, index, addMilestoneData);  
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

function addMilestone(projectID, sprintData, index, processData) {
    // var sprintIndex = getSprintIndex(sprintData); //need to check if it's numeric
    var aMilestone = {
        id: client.id,
        title: 'Sprint #' + index,
        description: '', due_date: '2016-11-11'
        // due_date: startDay.add((index-1)*7, 'days'),
      }
    // console.log(aMilestone);
    client.milestones.create(aMilestone, function (err, data) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('milestone ', aMilestone.title, ' created');
        processData(projectID, sprintData,data.id);
        return data.id; //return milestone id
      });  
}

function addMilestoneData(projectID, sprintData, milestoneID) {
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
        addLabel(projectID, milestoneID, name, epicColor, epic, processEpicData)
      })  
}

function getEpicName(epic) {
  var arr = epic.split(/\r?\n/);
  if (arr.length>0) {
    return arr[0];
  }
  return '';
}

function addLabel(projectID, milestoneID, name, color, epicData , processData) {
  var epic = {"id": projectID, "name": name, "color": color};
  client.projects.createLabel(epic, function(err, data) {
   if (err && err.statusCode != 409 ) {
      console.log(err);
      return;
   }
   console.log('label ', name, ' created');
   processData(projectID, milestoneID, name, epicData);
  });
}

function processEpicData(projectID, milestoneID, name, epic) {
        epic.split(/\r?\n/).filter(function(story){ return story != '' }).forEach(function(story, storyIndex) {
          var currentEpic;
          if (storyIndex == 0) {
            currentEpic = story;
            console.log('Adding Epic:', story);
            
          }
          if (storyIndex > 0) {
            console.log('Adding ', story);
            addStory(projectID, story.replace('story:', ''), name, milestoneID);
          }
        })
}

function addStory(projectID, story, epic, milestoneID) {
  client.issues.create({
    id: projectID,
    title: story,
    description: '',
    labels: epic,
    milestone_id: milestoneID
  }, function(err, data) {
    if (err) {
      console.log(err);
      return;
      }
      console.log('issue ', story, ' created');
     return data.id;
  });
}

function getProjects() {
  client.request('get', '/projects', {}, function (err, repos) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(repos);
    // for (var i = 0; i < repos.length; i++) {
    //   if (repos[i].name === 'node-gitlab-test') {
    //     client.id = repos[i].id;
    //     return callback();
    //   }
    //}  
  });
}


