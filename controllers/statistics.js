const Statistic = require('../models/Statistic')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function(req, res) {
  const query = {
    user: req.user.id
  }

  if (req.query.start) {
    query.date = {
      $gte: req.query.start
    }
  }

  if (req.query.end) {
    if (!query.date) {
      query.date = {}
    }

    query.date['$lte'] = req.query.end
  }

  if (req.query.statistics) {
    query.statistics = +req.query.statistics
  }

  try {
    const statistics = await Statistic
      .find(query)
      .sort({date: -1})
      .skip(+req.query.offset)
      .limit(+req.query.limit)

    res.status(200).json(statistics)

  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.create = async function(req, res) {
  try {
    const lastStatistic = await Statistic
      .findOne({user: req.user.id})
      .sort({date: -1})

    const maxStatistic = lastStatistic ? lastStatistic.statistics : 0

    const statistics = await new Statistic({
      list: req.body.list,
      user: req.user.id,
      statistics: maxStatistic + 1
    }).save()

    res.status(201).json(statistics)
  } catch (e) {
    errorHandler(res, e)
  }
}
