define(function() {
    return new (function() {
        var that = this;
        this.init = function() {

            executeMethod();

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

                require([controllerName],function(controller) {
                    if(controller.noTemplate.indexOf(method) == -1) {
                        // load template
                        var template = method;
                        that.makeRequest({
                            type:'post',
                            url:'/loadTemplate',
                            data: {
                                "templateName":template,
                                "controllerName":controllerName,
                                "method": method
                            }
                        },function(template) {
                            $('[main-template]').html(template);
                            controller[method](params);
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