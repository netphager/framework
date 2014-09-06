var fs = require('fs');
var path = require('path');

module.exports = new (function(url){
    var that = this;
    this.controller = null;
    this.template = null;

    this.loadLayout = function() {
        var layoutPath = config.appDir+'layout.html';

        try {
            return fs.readFileSync(layoutPath, 'utf-8');
        } catch (e) {
            debug.error(e);
            debug.error('File ' + layoutPath + ' not found',404);
            return false;
        }

    };
    this.loadTemplate = function(templateName,controllerName) {
        var templatesPath = config.templatesDir;
        if(templatesPath.indexOf('controller') != -1) {
            templatesPath = config.templatesDir.replace('{controller}',controllerName);
        }
        var templatePath = templatesPath+templateName+'.html';

        // load templates
        try {
            template = fs.readFileSync(templatePath,'utf-8');
        } catch (e) {
            debug.error('File ' + templatePath + ' not found',404);
            template = false;
        }

        this.template = templateName;
        return template;
    };
    this.loadController = function(controllerName) {
        var controller;
        try {
            controller = require(config.appDir+controllerName);
        } catch(e) {
            debug.error('Module ' + config.appDir+controllerName + ' not found',404);
            controller = false;
        }

        this.controller = controllerName;
        return controller;
    };


});