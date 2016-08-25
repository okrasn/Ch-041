# "RSS|READER" master branch

## Basic application deployment
1. Install [NodeJs](https://nodejs.org/en/) (v4 or above)
2. Install [MongoDB](https://www.mongodb.com/)
3. If you run Windows machine, add MongoDB __"mongod"__ command as PATH variable like shown below or watch this [tutorial](https://www.youtube.com/watch?v=sBdaRlgb4N8&feature=youtu.be&t=120)
  1. Right click on __Computer__
  2. Click on __Properties__
  3. Click on __Advanced System Settings__ which opens up a pop up box as below
  4. Click on __Environment__ variables and do as shown in Fig. 2
  [![Install](http://www.acemyskills.com/wp-content/uploads/2015/08/Environment-Variables-1024x497.png?resize=50%)](http://www.acemyskills.com/wp-content/uploads/2015/08/Environment-Variables.png)
4. Create folder for DB temp files in the root,  if (_'projectRoot'/data_)
5. Run next command via __cmd__ in project folder
```
$ npm start
```
6. Visit __localhost:8080__ in your browser
