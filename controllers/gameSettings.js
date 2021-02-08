const GameSettings = require('../models/GameSettings')
const errorHandler = require('../utils/errorHandler')

module.exports.create = async function(req, res) {
  try {
    const settingsList = await new GameSettings({
      list: req.body.list,
      user: req.user.id,
    }).save()

    res.status(201).json(settingsList)
  } catch (e) {
    errorHandler(res, e)
  }
}


module.exports.getById = async function(req, res) {
  try {
    const task = await GameSettings.findOne({
      user: req.user.id
    })
    res.status(200).json(task)
  } catch (e) {
    errorHandler(res, e)
  }
}


module.exports.update = async function(req, res) {
  try {
    const task = await GameSettings.findOneAndUpdate(
      {user: req.user.id},
      {$set: req.body},
      {new: true}
    )
    res.status(200).json(task)
  } catch (e) {
    errorHandler(res, e)
  }
}