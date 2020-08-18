let express = require('express');
let router = express.Router();
let HobbiesService = require('../services/services.hobbies');

router.get('/', async function (req, res, next) {
  try {
    var hobbies = await HobbiesService.getAllHobbies();
    return res.status(200).json(hobbies);
  } catch (e) {
    return next(e);
  }

});

module.exports = router;
