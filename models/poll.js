var mongoose = require('mongoose')

var schema = new mongoose.Schema({
    question: String,
    options: [{
        option: String,
        noVotes: {
            type: Number,
            default: 0
        }
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    vote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
})

module.exports = mongoose.model('poll', schema)
