define(function() {
    return new (function() {
        var that = this;
        var router = require('helper/router');
        this.init = function() {};

        // open dialog
        this.open = function(templateName,params) {
            // load dialog template
            $('[dialog-template]').after(router.render('dialog').replace('class="dialog"','class="dialog '+templateName+'"'));
            $('.dialog.'+templateName+' .content').html(router.render(templateName,params));

            // close dialog event listeners
            $('.dialog.'+templateName+' .close').on('click',function() {that.close(templateName)});
            // close dialog with esc key
            $(window).on('keyup',function(e) {
                if(e.keyCode != 27) {
                    return;
                }
                that.close(templateName);
            });
        };

        // close dialog
        this.close = function(dialogName) {
            var $dialog = $('.dialog.'+dialogName);
            $(window).off('keyup');
            $dialog.remove();
            window.location = '/app/#/article/home';
        };

    });
});