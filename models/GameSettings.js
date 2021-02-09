const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSettingsSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  list: [
    {
      name: {
        type: String
      },
      fieldSize: {
        type: String
      },
      fieldWidth: {
        type: Number
      },
      fieldHeight: {
        type: Number
      },
      bombsQuantity: {
        type: Number
      },
      fieldStyle: {
        type: String
      }
    },
  ],
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
})

module.exports = mongoose.model('gameSettings', gameSettingsSchema)