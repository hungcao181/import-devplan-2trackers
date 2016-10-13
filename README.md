# Trackers Importer Tool
This is make to build a desktop app to import text based development plan into tracker tools 
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

### Limitation / Known issues
- You just only add your plan as a whole in one round.
- You can stop current process. However, already imported sprints/epics/tickets is intact (no rollback). Next push action will start from the begining. 
- Code smelt: I integrate my old cmd program into electron boilerplate, not all legacy code are re-written in es6. 

### Road map: Below are what would be added in the future:
- Integrate react
- Integrate redux
- Remove jquery-deffered dependency
- Allow user to load existing project's tickets
- Allow user to edit/delete existing project's tickets
- Tracker admin tool: Allow admin user to:
-- create/remove project
-- Add/delete group
-- Add/delete user to project

## This project make use of following awesome projects:
* Electron boilerplate: szwacz's awesome [boilerplate](https://github.com/szwacz/electron-boilerplate).
* [Node.js wrapper for the Gitlab REST API](https://github.com/repo-utils/gitlab)
* [Node.js wrapper for the Pivotal Tracker REST API](https://github.com/generalui/pivotaltracker)
