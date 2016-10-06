// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
  'use strict';
  const ipc = require('electron').ipcRenderer;
  let loadButton = document.getElementById("load-button");
  let dataArea = document.getElementById("data");
  let workingFile = document.getElementById("working-file");
  let saveButton = document.getElementById("save-button");
  let saveasButton = document.getElementById("saveas-button");
  var fs = require('fs');

  loadButton.addEventListener('click', function (e) {
    ipc.send('open-file-dialog');
  });

  
  ipc.on('selected-file', function (e, path) {
    if (path) {
      let fileName = path[0];
      workingFile.innerHTML= fileName;
      fs.readFile(fileName, 'utf8', (err, data) => {
        if (data) dataArea.value = data;
      })
    }
  })

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

