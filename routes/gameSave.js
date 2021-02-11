const express = require('express')
const passport = require('passport')
const controller = require('../controllers/gameSave')
const router = express.Router()

router.get('/', passport.authenticate('jwt', {session: false}), controller.getById)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.patch('/', passport.authenticate('jwt', {session: false}), controller.update)

module.exports = router
