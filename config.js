var path = require('path');
module.exports = new (function(){

    var that = this;
    /* PATHS */
    this.rootDir = '/store/Dropbox/www/node';
    this.appDir = '/store/Dropbox/www/node/app/';
/*    this.rootDir = 'D:\\work\\node';
    this.appDir = 'D:\\work\\node\\app\\';*/
    this.databaseDir = path.join(that.appDir,'database/');
    this.libDir = path.join(that.rootDir, 'lib/');
    this.templatesDir = path.join(that.appDir, 'templates/{controller}/');

    /* PROPERTIES */
    this.mainApp = 'app';
    this.controllers = ['user','article'];

});