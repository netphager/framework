module.exports = new (function() {
    var that = this;
    var EventEmitter = require(config.libDir+"/lib/emitter").getInstance();

    this.upload = function(req,res) {
        EventEmitter.emit('uploadComplete',req.files.attachments);

        res.send({"success": true});
    }
});