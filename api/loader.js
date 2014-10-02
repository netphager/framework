var fs = require('fs');

module.exports = new (function(url){
    var that = this;
    this.controller = null;

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