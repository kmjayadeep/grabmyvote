var mongoose = require('mongoose')

var schema = new mongoose.Schema({
  question : String,
  options : [{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'option'
  }],
  creator : {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'user'
  }
  createdAt : {
    type : Date,
    default : Date.now()
  }
})

module.exports = mongoose.model('poll',pollSchema)
