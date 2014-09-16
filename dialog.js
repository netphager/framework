define(function() {
    return new (function() {
        var that = this;

        this.init = function() {};

        this.open = function(template) {
            // load dialog template
            that.makeRequest({
                type:'post',
                url:'/loadTemplate',
                data: {
                    "templateName":'dialog'
                }
            },function(template) {

            });
        };

    });
});