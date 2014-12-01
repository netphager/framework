define(function(require) {
    return new (function() {
        var that = this;
        var router = require('helper/js/router');
        var templatesHelper = require('helper/js/templatesHelper');
        this.draggable = false;
        // var Draggable = require ('helper/node_modules/draggable/src/draggable');


        this.init = function() {};

        this.checkBaseTemplateLoaded = function(callback) {
            if(!('dialog' in templatesHelper.templates)) {
                templatesHelper.loadTemplate('dialog','/helper/templates/',function() {
                    if(typeof(callback) == 'function') {
                        callback();
                    }
                });
            } else {
                if(typeof(callback) == 'function') {
                    callback();
                }
            }

        }

        // open dialog
        this.open = function(templateName,params) {
            that.checkBaseTemplateLoaded(function() {
                // render dialog template
                $('[dialog-template]').after(templatesHelper.render('dialog').replace('class="dialog"','class="dialog '+templateName+'"'));
                $('.dialog.'+templateName+' .content').html(templatesHelper.render(templateName,params));
                $('.dialog.'+templateName).trigger('dialogOpened');

                // close dialog event listeners
                $('.dialog.'+templateName+' .close').on('click',function() {that.close(templateName)});
                // close dialog with esc key
                $(window).on('keyup',function(e) {
                    if(e.keyCode != 27) {
                        return;
                    }
                    that.close(templateName);
                });
                if(that.draggable) {
                    $('.dialog.'+templateName).on('mousedown',function() {that.startDrag(templateName)});
                    $('.dialog.'+templateName).on('mouseup',function() {that.stopDrag(templateName)});
                }
            });
        };

        this.startDrag = function(dialogName) {
            $('.dialog.'+dialogName).on('mousemove',function(e) {
                $(this).css('top',( e.pageY + ($(this).height() / 2) ) + 'px');
                $(this).css('left', e.pageX + 'px');
            });
        };

        this.stopDrag = function(dialogName) {
            $('.dialog.'+dialogName).off('mousemove');
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