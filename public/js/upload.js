define(function(require) {
    return new (function() {
        var that = this;
        this.dropUpload = true;
        this.pasteUpload = true;
        var router = require('helper/js/router');

        this.init = function($fileInput,$dropingDiv) {
            this.fileApiSupported(function() {
                // file input change
                $fileInput.on('change',function() {that.readFiles($fileInput[0].files);});
                // drop upload listener
                if(that.dropUpload === true && $dropingDiv) {
                    $dropingDiv[0].addEventListener('dragover', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                    }, false);
                    $dropingDiv[0].addEventListener('drop', function(e) {
                        that.readFiles(e.dataTransfer.files)
                        e.stopPropagation();
                        e.preventDefault();
                    }, false);
                }
                // paste upload
                if(that.pasteUpload === true) {
                    document.onpaste = function(event){
                        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
                        that.readFiles([items[0].getAsFile()]);
                    }
                }
            });
        };

        this.readFiles = function(files) {
            for(var i in files) {
                var file = files[i];
                var reader = new FileReader();
                if(typeof(file) != 'object') {
                    continue;
                }
                if (file.type.match("image.*")) {
                   reader.readAsDataURL(file);
                }
                else {
                   reader.readAsText(file,"UTF-8");
                }

                reader.onload = that.readFileComplete;
            }
        };

        this.readFileComplete = function(file) {
            // TODO: append file to form
            router.makeRequest({
                type:'post',
                url:'/'+router.controllerName+'/upload',
                data: {"file": file.target.result}
            }, function(response) {
                console.log('okk');
            });
        };

        this.sendFiles = function() {
            // TODO: send form to the server
        };

        this.fileApiSupported = function(callback) {
            // check file api supported
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                if(typeof(callback) == 'function') {
                    callback();
                }
            } else {
                console.error('FILE API is not supported');
            }
        };
    });
});