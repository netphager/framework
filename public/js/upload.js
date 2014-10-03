define(function(require) {
    return new (function() {
        var that = this;
        this.dropUpload = true;
        this.pasteUpload = true;
        this.preivewFiles = false;

        var router = require('helper/js/router');
        var $fileInput;
        var formData  = new FormData();
        var filePreviews = [];

        this.init = function($input,$dropingDiv) {
            $fileInput = $input;
            this.fileApiSupported(function() {
                // file input change

                $fileInput.on('change',function() {that.addFilesToForm($fileInput[0].files);});
                // drop upload listener
                if(that.dropUpload === true && $dropingDiv) {
                    $dropingDiv[0].addEventListener('dragover', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                    }, false);
                    $dropingDiv[0].addEventListener('drop', function(e) {
                        that.addFilesToForm(e.dataTransfer.files)
                        e.stopPropagation();
                        e.preventDefault();
                    }, false);
                }
                // paste upload
                if(that.pasteUpload === true) {
                    document.onpaste = function(event){
                        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
                        that.addFilesToForm([items[0].getAsFile()]);
                    }
                }
            });
        };

        this.addFilesToForm = function(files) {

            for(var i = 0 ; i <  files.length; i++) {
                var file = files[i];
                var fileName = typeof(file.name) != 'undefined' ? file.name : 'Clipboard'+i;
                formData.append('attachments',file,file.name);

                if(that.preivewFiles === true) {
                    var reader = new FileReader();
                    if (file.type.match("image.*")) {
                       reader.readAsDataURL(file);
                    }
                    else {
                       reader.readAsText(file,"UTF-8");
                    }
                    reader.onload = that.readFileComplete.bind({allFilesDone: (files.length-1) == i});
                } else {
                    if((files.length-1) == i) {
                        that.sendFiles();
                    }
                }
            }
        };

        this.readFileComplete = function(file) {
            filePreviews.push(file.target.result);
            if(this.allFilesDone === true) {
                that.sendFiles();
            }
        };

        this.sendFiles = function() {
            // trigger upload complete
            $(window).trigger({
                type: 'uploadComplete',
                filePreviews: filePreviews
            });

            router.makeRequest({
                type:'post',
                url:'/api/upload/upload',
                contentType: false,
                processData: false,
                data: formData
            });
            // clear files from input and form
            $fileInput[0].val = null;
            $fileInput[0].files = [];
            formData  = new FormData();
            filePreviews = [];
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