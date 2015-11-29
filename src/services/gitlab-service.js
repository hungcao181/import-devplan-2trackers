var secret = require('../client.secret');

var projectID = encodeURIComponent(secret.gitlab.gitlab_project),
    projectStartDate = secret.project_startdate;

var gitlab = require('node-gitlab');
var https = require('https');
var fs = require('fs');
var async = require('async');
var jQuery = require('jquery-deferred');
var apiPath;

var client = gitlab.create({
    api: 'https://' + (secret.gitlab.gitlab_selfhosted ? secret.gitlab.gitlab_selfhosted : secret.gitlab.gitlab_hostname) + secret.gitlab.gitlab_api_version,
    privateToken: secret.gitlab.gitlab_private_token,
    requestTimeout: 15000,
});    

if (secret.gitlab.gitlab_selfhosted) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //resolve_selfSigned_issue
};

module.exports = {
    createMilestone: function (milestone) {
        var startDate = new Date(projectStartDate);
        startDate.setTime( startDate.getTime() + parseInt(milestone.replace(/[^0-9]/g,'')) * 604800000 );
        
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
    getProjects: function() {
        //this is just to check connection without the wrapper
        var options = {
            hostname: secret.gitlab.gitlab_hostname,
            // port: 80,
            path: '/api/v3/projects',
            method: 'GET',
            headers: {
                'PRIVATE-TOKEN': secret.gitlab.gitlab_private_token
            },
            // rejectUnauthorized: false,
        };
        var req = https.request(options, function(res) {
            console.log("statusCode: ", res.statusCode);
            console.log("headers: ", res.headers);
            
            res.on('data', function(d) {
                console.log('data:', d);
            });
        });
        req.end();
        
        req.on('error', function(e) {
        console.error(e);
        });    
    },
    // resolve_selfSigned_issue: function() {
    //     process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    // }
}