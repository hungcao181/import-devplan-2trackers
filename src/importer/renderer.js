// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';
import fs from 'fs';
import {ipcRenderer as ipc, shell} from 'electron';

import importer from './index.js';
let tracker = 1;

let pushButton;
let trackers;

let loadButton;
let dataArea;
let workingFile;
let saveButton;
let saveasButton;
let stopButton;

ipc.on('selected-file', function (e, path) {
    if (path) {
        let fileName = path[0];
        workingFile.innerHTML= fileName;
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (data) dataArea.value = data;
        })
    }
})

ipc.on('saved-file', (e, path) => {
    if (path) {
        workingFile.innerHTML = path;
        let data = dataArea.value;
        fs.writeFile(path, data, 'utf8', (err) => {
            if (err) throw err;
            console.log(`It\' saved to ${path}`);
        })
    }
})

ipc.on('config-available', (e, savedConfig) => {
    if (savedConfig) {
        console.log("I get it, config is available");
        document.getElementById("prjid").value = savedConfig.pivotaltracker.project;
        document.getElementById("pttoken").value = savedConfig.pivotaltracker.apitoken;
    }
})

ipc.on('updateimportstatus', (e, status) => {
    document.getElementById('importstatus').innerHTML = status.description || "No description";
    if (status.code=='start') document.getElementById('stop-button').classList.remove('hidden');
})

document.addEventListener('DOMContentLoaded', function() {
    console.log("ready");
    pushButton = document.getElementById("push-button");
    trackers = document.getElementsByName("tracker");

    loadButton = document.getElementById("load-button");
    dataArea = document.getElementById("data");
    workingFile = document.getElementById("working-file");
    saveButton = document.getElementById("save-button");
    saveasButton = document.getElementById("saveas-button");
    stopButton = document.getElementById('stop-button');
    //inform the ready status to main (to load current setting)
    ipc.send('document-ready');

    stopButton.addEventListener('click', (e) => {
        ipc.send('stop-import');
        stopButton.classList.add('hidden');
    });

    loadButton.addEventListener('click', (e) => {
        ipc.send('open-file-dialog');
    });


    saveasButton.addEventListener('click', (e) => {
        ipc.send('save-dialog');
    });

    saveButton.addEventListener('click', (e) => {
        let fileName = workingFile.innerHTML;
        //if working on a file already, then save to that file. If not, let user get a file to save to
        if (fileName) {
        let data = dataArea.value;
        fs.writeFile(fileName, data, 'utf8', (err) => {
            if (err) throw err;
            console.log(`It\' saved to ${fileName}`);
        })
        } else {
        ipc.send('save-dialog');
        }
    });

    pushButton.addEventListener("click", (e) => {
        let options = {pivotaltracker:{}, gitlab:{}};
        options.tracker = tracker;
        options.data = document.getElementById("data").value;
        options.ipc = ipc;
        switch (options.tracker) {
            case 1: //pivotal tracker
            options.pivotaltracker.project = document.getElementById("prjid").value;
            options.pivotaltracker.apitoken = document.getElementById("pttoken").value;
            break;
            case 2: //gitlab
            options.gitlab.project = document.getElementById("prjname").value;
            console.log("get project ", options.gitlab.project);
            options.gitlab.privatetoken = document.getElementById("privatetoken").value;
            options.gitlab.apiversion = document.getElementById("apiversion").value;
            options.gitlab.hostname = document.getElementById("hostname").value;
            options.gitlab.selfhosted = document.getElementById("selfhosted").value;
            break;
        }
        // ipc.send('doimport', options);
        importer(options);
    });

    document.getElementById("getpttoken").addEventListener('click', (e) => {
        shell.openExternal('https://www.pivotaltracker.com/profile');
    });

    document.getElementById("getgitlabtoken").addEventListener('click', (e) => {
        shell.openExternal('https://gitlab.com/profile/personal_access_tokens');
    });

    document.getElementById("is-selfhosted").addEventListener('click', (e) => {
        document.getElementById("selfhosted").disabled = !Boolean(e.target.checked);
    });

    //hide/show the un/selected tracker panel content
    //set global tracker variant according to selected tracker tool
    for (let i=0;i<trackers.length; i++) {
    trackers[i].addEventListener('click', (e) => {
        let trackerpanels = document.getElementsByName("trackerpanel");
        for (let j=0;j<trackerpanels.length;j++) {
        //the panel content must contain a class that match relevant radio's id
        if (trackerpanels[j].classList.contains(e.target.id)) {
            trackerpanels[j].classList.remove("hidden");
            tracker = Number(e.target.value);
            console.log("tracker ", tracker);
        } else trackerpanels[j].classList.add("hidden");
        }
    })
    }

});
