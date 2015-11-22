var secret = require('./client.secret');
var gitlab = require('node-gitlab');
var client = gitlab.create({
  api: 'https://gitlab.com/api/v3',
  privateToken: secret.gitlab_private_token,
  requestTimeout: 15000,
});

var async = require('async');
var jQuery = require('jquery-deferred');

var projectID = client.id = '591075',
    projectStartDate = secret.projectStartDate;

module.exports = {
    id: projectID,
    createMilestone: function (milestone) {
        var startDate = new Date(projectStartDate);
        startDate.setTime( startDate.getTime() + parseInt(milestone.replace('#','')) * 604800000 );
        
        var dateStr = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();
        
        console.log('date ',dateStr);
        console.log(startDate);
        var aMilestone = {
            id: projectID,
            title: 'Sprint ' + milestone,
            description: '', 
            // due_date: '2016-11-11',
            due_date: dateStr,
        }
        var df = jQuery.Deferred();
        client.milestones.create(aMilestone, function (err, data) {
            console.log('milestone: ', data);
            if (err) {
                console.log(err);
                df.reject();
            } else {
                df.resolve(data.id);
            }
        });
        return df.promise();  
    },
    createStory: function (milestoneID, newStory, done) {
        client.issues.create(
            {
                id: projectID,
                title: newStory.title,
                description: '',
                labels: newStory.labels,
                milestone_id: milestoneID
            }, 
            function(err, story) {
                if (err) {
                    console.log(err);
                    done(err);
                } else {
                    console.log('story: ', story.title);
                    done();
                }
            }
        );
    },
    createLabel: function (name, color) {
        var epic = {"id": projectID, "name": name, "color": color};
        client.projects.createLabel(epic, function(err, data) {
            if (err && err.statusCode != 409 ) {//409: duplicate
                console.log(err);
                return;
            }
            console.log('label ', name, ' created');
        });
    },
    getProjects: function () {
        client.request('get', '/projects', {}, function (err, repos) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(repos);
        });
    }                
}