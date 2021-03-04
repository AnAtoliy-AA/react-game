const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSaveSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  list: [
    {
      savedGame: {
       type: Array
      },
      bombsCount: {
        type: String
      },
      gameTime: {
        type: String
      },
    },
  ],
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
})

module.exports = mongoose.model('savedGame', gameSaveSchema)