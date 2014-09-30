define(function() {
    return new (function() {

        var that = this;
        this.templates = {};

        this.loadTemplate = function(templateName,templatesPath,callback) {
            var templatePath = templatesPath+templateName+'.hdb';

            // loading template
            require(['hb!'+templatePath], function(template) {

                 that.templates[templateName] = template;
                 if(typeof(callback) == 'function') {
                    callback();
                 }
            });
        };

        this.render = function(templateName,params) {
            return that.templates[templateName](params);
        };

    });
});