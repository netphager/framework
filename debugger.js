module.exports = new (function(){
    this.log = function() {};
    this.error = function() {};
    var that = this;
    var errors = [];
    var logs = [];

    this.init = function() {
        that.log = function(message) {
            logs.push(message);
            console.log(message);
        };
    };

    this.error = function(error,code) {
        errors.push({error:error, code:code});
        console.error(error);
    }

    this.getErrors = function() {
        return errors;
    }

    this.clearErrors = function() {
        errors = [];
    };

    this.getErrorsStr = function() {
        var errorsStr = '';
        for(var i in errors) {
            errorsStr += '<h1>'+errors[i].code+'</h1>'+'<p style="font-weight: bold;color: red;">'+errors[i].error + '</p>';
        }

        return errorsStr;
    };
});