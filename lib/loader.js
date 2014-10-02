var fs = require('fs');

module.exports = new (function(url){
    var that = this;
    this.controller = null;

    this.loadController = function(controllerPath,controllerName) {
        var controller;
        try {
            controller = require(controllerPath);
        } catch(e) {
            debug.error('Module ' + controllerPath + ' not found',404);
            controller = false;
        }

        this.controller = controllerName;
        return controller;
    };

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

});