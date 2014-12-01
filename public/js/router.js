define(['helper/js/templatesHelper'],function(templatesHelper) {
    return new (function() {
        var that = this;
        this.controllerName = null;
        this.templateName = null;
        this.method = null;
        this.config = {};


        this.init = function() {
            this.loadConfig(function() {
                executeMethod();
            });

            function executeMethod() {

                var hashArray = window.location.hash.split('/').splice(1)
                    , controllerName = hashArray[0]
                    , method = hashArray[1]
                    , params = that.parseGetParamteres(hashArray);

                var template = method;
                that.controllerName = controllerName;
                that.templateName = template;
                that.method = method;

                // loading controller
                require([controllerName],function(controller) {
                   // check for templates support in loaded template
                   if(!('noTemplate' in controller) || controller.noTemplate.indexOf(method) == -1) {
                        var templatesPath = that.config.templatesDir;
                        if(templatesPath.indexOf('controller') != -1) {
                            templatesPath = that.config.templatesDir.replace('{controller}',controllerName);
                        }
                        templatesHelper.loadTemplate(that.templateName,templatesPath, function() {
                            // execute method
                            controller[method](params,template);
                        });

                   } else {
                       controller[method](params);
                   }
                });
            }
            window.addEventListener("hashchange", function(e) {
                executeMethod();
            }, false);

        };

        this.parseGetParamteres = function(hashArray) {
            var paramsArray =  hashArray.splice(2)
                ,params = {}
                ,properties = []
                ,values = [];

            if(paramsArray.length > 0 && paramsArray.length % 2 == 0) {
                for(var i=0;i < paramsArray.length;i++) {
                    if(i % 2 == 0) {
                        properties.push(paramsArray[i]);
                    } else {
                        values.push(paramsArray[i]);
                    }
                }
                // pushing properties and values into params
                for(var i=0;i < properties.length;i++) {
                    if(properties[i].length > 0 && values[i].length > 0) {
                        params[properties[i]] = typeof(values[i]) != 'undefined' ? values[i]  : null;
                    }
                }
            } else {
                params.error = 'Invalid parameters';
            }
            return params;
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

        this.makeRequest =  function(req,callback) {
            if(!('contentType' in req)) {
                req.contentType = "application/json";
            }
           if(typeof(req.data) == 'object' && Object.keys(req.data).length > 0) {
               req.data = JSON.stringify(req.data);
           }

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