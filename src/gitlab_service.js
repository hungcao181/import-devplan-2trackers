var secret = require('./client.secret');
var gitlab = require('node-gitlab');
var client = gitlab.create({
  api: 'https://gitlab.com/api/v3',
  privateToken: secret.gitlab_private_token,
  requestTimeout: 15000,
});

// client.id = '590790';
client.id = '591075';

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

function addStory(projectID, storyTitle, label, milestoneID) {
  client.issues.create({
    id: projectID,
    title: storyTitle,
    description: '',
    labels: label,
    milestone_id: milestoneID
  }, function(err, data) {
    if (err) {
      console.log(err);
      return;
      }
      console.log('issue ', storyTitle, ' created');
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
