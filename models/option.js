var mongoose = require('mongoose')

module.exports = mongoose.model('option',{
  option : String,
  vote : [{
    type : mongoose.Schema.Type.ObjectId,
    ref : 'user'
  }]
});
