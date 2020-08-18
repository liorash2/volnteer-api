let express = require('express');
let router = express.Router();
let RegionService = require('../services/services.regions');
router.get('/', async function (req, res, next) {
  try {
    let response = await RegionService.getAllRegions();
    return res.status(200).json(response);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
