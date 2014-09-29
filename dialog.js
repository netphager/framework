define(function() {
    return new (function() {
        var that = this;
        var router = require('helper/router');
        this.init = function() {};

        this.open = function(templateName,params) {
            // load dialog template
            router.render('dialog',{},'[dialog-template]');
            router.render('add',params,'#dialog');
        };
    });
});