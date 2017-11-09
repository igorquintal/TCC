/*This file is responsoble for starting the connection with the DataBase using Mongoose*/
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/server');

module.exports = {mongoose};
