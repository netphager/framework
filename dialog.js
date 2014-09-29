define(function() {
    return new (function() {
        var that = this;
        var router = require('helper/router');
        this.init = function() {};

        this.open = function(templateName,params) {
            // load dialog template
            var dialogHtml = router.render('dialog');
            dialogHtml = dialogHtml.replace('class="dialog"','class="dialog '+templateName+'"');
            $('[dialog-template]').after(dialogHtml);
            $('.dialog.'+templateName+' .content').html(router.render(templateName,params));
            $('.dialog.'+templateName+' .close').click(function() {that.close(templateName)});
        };

        this.close = function(dialogName) {
            var $dialog = $('.dialog.'+dialogName);
            $dialog.remove();
            window.location = '/app/#/article/home';
        };

    });
});