define(function() {
    return new (function() {
        var that = this;
        var router = require('helper/router');
        this.init = function() {};

        this.open = function(template) {
            // load dialog template
            router.makeRequest({
                type:'post',
                url:'/loadLibTemplate',
                data: {
                    "templateName": 'dialog'
                }
            },function(dialogTemplate) {
                $('body').prepend(dialogTemplate);
                $('#dialog').html(template);
            });
        };
    });
});