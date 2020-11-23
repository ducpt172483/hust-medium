const express = require('express');
const router = express.Router();

const userController = require('../../app/controllers/UserController');
const utils = require('../../utils');

router.get('/', utils.auth.required, userController.show);

module.exports = router;