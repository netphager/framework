define(function() {
    return new (function() {
        var that = this;
        this.controllerName = null;
        this.templateName = null;
        this.method = null;
        this.templates = {};
        that.config = {};

        this.init = function() {
            this.loadConfig(function() {
                that.loadDialogTemplate(function() {
                    executeMethod();
                });
            });

            function executeMethod() {
                var hashArray = window.location.hash.split('/').splice(1)
                    ,controllerName = hashArray[0]
                    ,method = hashArray[1]
                    ,paramsArray =  hashArray.splice(2)
                    ,params = {}
                    ,properties = []
                    ,values = [];

                if(paramsArray.length > 0 && paramsArray.length % 2 == 0) {
                    for(var i in paramsArray) {
                        if(i % 2 == 0) {
                            properties.push(paramsArray[i])
                        } else {
                            values.push(paramsArray[i]);
                        }
                    }
                    // pushing properties and values into params
                    for(var i in properties) {
                        if(properties[i].length > 0 && values[i].length > 0) {
                            params[properties[i]] = typeof(values[i]) != 'undefined' ? values[i]  : null;
                        }
                    }
                } else {
                    params.error = 'Invalid parameters';
                }

                var template = method;

                this.controllerName = controllerName;
                this.templateName = template;
                this.method = method;
                // get config
                that.makeRequest({
                    type: 'get',
                    url: '/config'
                },function(config) {
                    config = JSON.parse(config);
                    // loading controller
                    require([controllerName],function(controller) {
                       if(controller.noTemplate.indexOf(method) == -1) {
                           var templatesPath = config.templatesDir;

                           if(templatesPath.indexOf('controller') != -1) {
                               templatesPath = config.templatesDir.replace('{controller}',controllerName);
                           }
                           var templatePath = templatesPath+templateName+'.hdb';
                           // loading template
                           require(['hb!'+templatePath], function(template) {
                                that.templates[templateName] = template;
                                controller[method](params,template);
                           });

                       } else {
                           controller[method](params);
                       }
                    });
                });
            }
            window.addEventListener("hashchange", function(e) {
                executeMethod();
            }, false);

        };

        this.loadConfig = function(callback) {
            that.makeRequest({
                type: 'get',
                url: '/config'
            },function(config) {
                that.config = JSON.parse(config);
                if(typeof(callback) == 'function') {
                    callback();
                }
            });
        };

        this.loadDialogTemplate = function(callback) {
            require(['hb!/helper/templates/dialog.hdb'], function(template) {
                that.templates['dialog'] = template
                if(typeof(callback) == 'function') {
                    callback();
                }
            });
        };

        this.render = function(templateName,params) {
            return that.templates[templateName](params);
        };

        this.makeRequest =  function(req,callback) {
            req.contentType = "application/json";
            req.data = JSON.stringify(req.data);
            if(typeof(callback) == 'function') {
                req.success = function(response,status) {
                    callback(response);
                };
                req.error = function(err,status) {
                    if(typeof(err.responseText) != 'undefined') {
                        var response = {};
                        try {
                            response = JSON.parse(err.responseText);
                        }
                        catch(err) {}

                        if('redirect' in response) {
                            window.location = response.redirect;
                        }

                    } else {
                        console.error(err);
                    }
                };
            }

            var promise = $.ajax(req);

            if(typeof(callback) != 'function') {
                return promise;
            }
        };
    })
});