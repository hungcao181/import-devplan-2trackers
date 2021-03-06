# Trackers Importer Tool
This is made to build a desktop app to import text based development plan into tracker tools 

This currently support: Pivotal Tracker and Gitlab (both gitlab.com and selfhosted domain)

### To start in development, open your terminal:
> git clone https://github.com/hungcao181/import-devplan-2trackers.git

> cd electron-boilerplate

> npm install

> npm start

### To make a installer for your platform, run command:
> npm run release

An installer for your platform will be found in *dist* folder.

You can create Windows installer only when running on Windows, the same is true for Linux and OSX. So to generate all three installers you need all three operating systems.

### An explaination for required format of your text-based plan

* The plan should be in form of hierarchical structure like this: Sprint > Epic > Tickets. Each type are on it's own line.
* Sprint line are in format: <'Sprint'+ delimiter + Sprint name>
* Epic line are in format: <'Epic'+ delimiter + Epic name>
* Eelimiter can be space or semi colon
* Sprint name should be number or contain number (i.g '2' or '#2' or 'week2') that represent the order it will be worked, start from 1

### Example text-based plan

To try import, input your project name or id, your token, and just copy below to text area and push:

    SPRINT #1

    EPIC:Analysis n Plan
    Developer analyze business requirements
    Developer identify gaps in business requirements

    EPIC:Infrastructure
    Client provides access to source code repository
    Developer setups development and staging environment

    SPRINT #2

    Epic: settings management
    user choose service to work with (Pivotal tracker / Gitlab.com / SelfHosted Gitlab)
    user input setting for selected tracker

    Epic: Data management
    user load stories from file
    user input/update stories on text area
    user save stories into file

    Epic: Push to remote trackers
    user push data to Pivotal tracker
    user push data to Gitlab

### Limitation / Known issues
* You just only add your plan as a whole in one round.
* You can stop current process. However, already imported sprints/epics/tickets are intact (no rollback). Next push action will start from the begining. 
* Code smelt: I integrate my old command line program into electron boilerplate, not all legacy code are re-written in es6. 

### Road map: Below are what would be added in the future:
* Integrate react
* Integrate redux
* Remove jquery-deffered dependency
* Allow user to load existing project's tickets
* Allow user to edit/delete existing project's tickets
* Tracker admin tool: Allow admin user to:
    *item create/remove project
    *item Add/delete group
    *item Add/delete user to project
### all my import code are under folder src/importer

## This project make directly use of following awesome projects:
* [Electron boilerplate: szwacz's awesome boilerplate](https://github.com/szwacz/electron-boilerplate).
* [Node.js wrapper for the Gitlab REST API](https://github.com/repo-utils/gitlab)
* [Node.js wrapper for the Pivotal Tracker REST API](https://github.com/generalui/pivotaltracker)
