var fs = require('fs');

export default function (ipc, dialog) {
    ipc.on('open-file-dialog', function (e) {
        dialog.showOpenDialog({
            properties: ['openFile', '']
        }, function (files) {
            if (files) e.sender.send('selected-file', files);
        })
    })

    ipc.on('save-dialog', (e) => {
        const options = {
            title: 'Save data to file',
            filters: [{name: 'text file', extensions: ['txt']}]
        };
        dialog.showSaveDialog(options, (fileName) => {
            e.sender.send('saved-file', fileName);
        })
    })

    ipc.on('document-ready', (e) => {
        // console.log("document ready, from main");

        fs.readFile('./config/client.secret', {'encoding': 'utf8'}, function (err, data) {
            if (err) return;
            savedConfig = JSON.parse(data);
            e.sender.send('config-available', savedConfig)
        });
    })


    //following functions are not used, just demo for it's capacity to open another window inside app
    function createExternalUrlWindow (anUrl) {
        // Create the browser window.
        let aWindow = new BrowserWindow({width: 800, height: 600})

        // and load the index.html of the app.
        aWindow.loadURL(anUrl)


        // Emitted when the window is closed.
        aWindow.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            aWindow = null
        })
    }
    //this is triggered from a renderer by issueing ipc.send(openExternalUrl, anUrl)
    ipc.on('openExternalUrl', (e, anUrl) => {
        createExternalUrlWindow(anUrl);
    })

    ipc.on('doimport', (e, options) => {
        console.log('yes, sir, import now');
        //importer(options);
    })

    ipc.on('importsprintdone', (e) => {
        e.sender.send('updateimportstatus');
    })
}
