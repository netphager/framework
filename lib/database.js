
var Database = function(){

    this.connect = function(host) {
        this.mongoose = require('mongoose');
        this.mongoose.connect('mongodb://'+host);
        this.mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    }

    if ( arguments.callee.instance )
        return arguments.callee.instance;
    arguments.callee.instance = this;
};



Database.getInstance = function() {
    var database = new Database();
    return database;
}


module.exports = Database;