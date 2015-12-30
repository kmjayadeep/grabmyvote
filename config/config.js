var config = {
  'local' : {
      'dbUrl' : 'mongodb://localhost/votingapp'
  },
  'production' : {
    'dbUrl' : 'mongodb://localhost/votingapp1'
  }
}

module.exports = function(mode){
  return config[mode || process.argv[2] || 'local']
}
