const GameSave = require('../models/GameSave')
const errorHandler = require('../utils/errorHandler')

module.exports.create = async function(req, res) {
  try {
    const savedGame = await new GameSave({
      list: req.body.list,
      user: req.user.id,
    }).save()

    res.status(201).json(savedGame)
  } catch (e) {
    errorHandler(res, e)
  }
}


module.exports.getById = async function(req, res) {
  try {
    const savedGame = await GameSave.findOne({
      user: req.user.id
    })
    res.status(200).json(savedGame)
  } catch (e) {
    errorHandler(res, e)
  }
}


module.exports.update = async function(req, res) {
  try {
    const savedGame = await GameSave.findOneAndUpdate(
      {user: req.user.id},
      {$set: req.body},
      {new: true}
    )
    res.status(200).json(savedGame)
  } catch (e) {
    errorHandler(res, e)
  }
}