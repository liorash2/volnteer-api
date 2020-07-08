var express = require('express');
var router = express.Router();
const OrganizaionService = require('../services/services.organization');

/* GET orgniaztion listing. */
router.get('/', async function (req, res, next) {

    const getAllOrganizations = await OrganizaionService.retrieveAll();
    if (getAllOrganizations instanceof Error) {
        next(getAllOrganizations);
    }
    return res.json(getAllOrganizations);
});

router.post('/', async (req,res,next) => {

    const body = req.body;

	try {
		const organization = await OrganizaionService.create(body);
		// created the customer! 
		return res.status(201).json({ organization: organization });
	}
	catch (err) {
		if (['ValidationError', 'OperationError'].indexOf(err.name) !== -1) {
			return res.status(400).json({ error: err.message });
		}

		// unexpected error
		return next(err);
	}
});

module.exports = router;
