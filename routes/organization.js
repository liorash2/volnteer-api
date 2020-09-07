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

router.get('/:id', async function (req, res, next) {

	const getOrganization = await OrganizaionService.retrieve(req.params.id);
	if (getOrganization instanceof Error) {
		next(getOrganization);
	}
	return res.json(getOrganization);
});
router.post('/', async (req, res, next) => {

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

router.put('/:id', async function (req, res, next) {

	const body = req.body;
	try {
		const updatOrganizationResult = await OrganizaionService.update(req.params.id, req.body);
		return res.status(200).json({ success: true });

	} catch (err) {
		return res.status(400).json({ error: err.message });
	}

});

router.delete('/:id', async function (req, res, next) {
	try {
		const updatOrganizationResult = await OrganizaionService.delete(req.params.id);
		return res.status(200);
	} catch (e) {
		return res.status(400).json({ error: err.message });
	}
});

module.exports = router;
