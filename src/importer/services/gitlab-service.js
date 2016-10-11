var secret = {gitlab: {}};

var nodeGitlab = require('node-gitlab');
var https = require('https');
// var fs = require('fs');
// var async = require('async');
var jQuery = require('jquery-deferred');
var apiPath;
var client;


var gitlabService = {
    config: function (options) {

        secret.gitlab.privatetoken = options.gitlab.privatetoken;
        secret.gitlab.apiversion =  options.gitlab.apiversion;
        secret.gitlab.hostname = options.gitlab.hostname;
        secret.gitlab.selfhosted = options.gitlab.selfhosted;

        secret.gitlab.projectID = encodeURIComponent(options.gitlab.project);

        console.log("name ",options.gitlab.project);
        console.log("encoded ",secret.gitlab.projectID);

        secret.gitlab.projectStartDate = options.startdate || new Date();

        if (secret.gitlab.selfhosted) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //resolve_selfSigned_issue
        };


        client = nodeGitlab.create({
            api: 'https://' + (secret.gitlab.selfhosted ? secret.gitlab.selfhosted : secret.gitlab.hostname) + secret.gitlab.apiversion,
            privateToken: secret.gitlab.privatetoken,
            requestTimeout: 15000,
        });
    },
    createMilestone: function (milestone) {
        var startDate = new Date(secret.gitlab.projectStartDate);
        startDate.setTime( startDate.getTime() + parseInt(milestone.replace(/[^0-9]/g,'')) * 604800000 );

        var dateStr = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();

        console.log('date ',dateStr);
        console.log(startDate);
        var aMilestone = {
            id: secret.gitlab.projectID,
            title: 'Sprint ' + milestone,
            description: '',
            // due_date: '2016-11-11',
            due_date: dateStr,
        }
        console.log("a milestone ", aMilestone);
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
                id: secret.gitlab.projectID,
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
            hostname: secret.gitlab.hostname,
            // port: 80,
            path: '/api/v3/projects',
            method: 'GET',
            headers: {
                'PRIVATE-TOKEN': secret.gitlab.privatetoken
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
}
export default gitlabService;
