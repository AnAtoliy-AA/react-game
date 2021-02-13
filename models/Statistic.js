const mongoose = require('mongoose')
const Schema = mongoose.Schema

const statisticsSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  statistics: {
    type: Number,
    required: true
  },
  list: [
    {
      level: {
        type: String
      },
      statusWin: {
        type: String
      },
      statusLost: {
        type: String
      },
      gameMoves: {
        type: Number
      },
      time: {
        type: Number
      },
      date: {
        type: Date,
        default: Date.now
      },
    },
  ],
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
})

module.exports = mongoose.model('statistics', statisticsSchema)