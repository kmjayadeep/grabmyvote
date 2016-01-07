var config = {
  'local' : {
      'dbUrl' : 'mongodb://localhost/votingapp',
      'facebookAppId':'441823086011703',
      'facebookAppSecret':'334c6f8ecceff1e9564d9302eb6e8642',
      'facebookCallbackUrl':'http://localhost:3000/auth/facebook/callback',
      'googleClientId':'286842112271-lhosmci1jt3no481feqc1mehleap53ja.apps.googleusercontent.com',
      'googleClientSecret':'XKqXnXvhJuBoUZDKbw9PYGvn',
      'googleCallbackUrl':'http://localhost:3000/auth/google/callback'
  },
  'production' : {
    'dbUrl' : 'mongodb://localhost/votingapp1'
  }
}

module.exports = function(mode){
  return config[mode || process.argv[2] || 'local']
}
