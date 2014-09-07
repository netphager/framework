module.exports = new (function() {
    var that = this;
    this.eventEmitter = null;

    this.listen = function() {
        if(this.eventEmitter != null) {
            this.eventEmitter.on('request',that.validate);
        }
    }

    this.validate = function(requestData) {
        var isValidRequest = true;
        var req = requestData.req;
        var res = requestData.res;
            
        if(config.loginConfig.requireLogin === true) {
            var isLogged = req.session.isLogged;
            var requestedPage = requestData.requestedPage;

            if(!isLogged && config.loginConfig.freeLoginPages.indexOf(requestedPage) == -1) {
                isValidRequest = false;
            }
        }

        that.eventEmitter.emit('requestValidator',{isValidRequest: isValidRequest});
        console.log('isValidRequest',isValidRequest)
        if(isValidRequest === false) {
            res.status(303);
            res.send({'redirect': config.loginConfig.loginRedirect});
        }
    }

});