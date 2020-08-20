var express = require('express');
var router = express.Router();
const VolunteerService = require('../services/volunteer.service');

router.get('/', async function (req, res, next) {

	const getAll = await VolunteerService.retrieveAll();
	if (getAll instanceof Error) {
		next(getAll);
	}
	return res.json(getAll);
});

router.get('/:email', async function (req, res, next) {

	const getVolunteer = await VolunteerService.retrieve(req.params.email);
	if (getVolunteer instanceof Error) {
		next(getVolunteer);
	}
	return res.json(getVolunteer);
});
router.post('/', async (req, res, next) => {
	const body = req.body;
	try {		
		const createVolunteerRes = await VolunteerService.create(body);
		return res.status(201).json({ volunteer: createVolunteerRes });
	}
	catch (err) {
		if (['ValidationError', 'OperationError'].indexOf(err.name) !== -1) {
			return res.status(400).json({ error: err.message });
		}

		// unexpected error
		return next(err);
	}
});

router.put('/', async function (req, res, next) {

	const body = req.body;
	try {
		await VolunteerService.update(req.body);
		return res.status(200).json({ success: true });

	} catch (e) {
		return res.status(400).json({ error: err.message });
	}

});

router.delete('/:email', async function (req, res, next) {
	try {
		const updateVolunteerRes = await VolunteerService.delete(req.params.email);
		return res.status(200);
	} catch (e) {
		return res.status(400).json({ error: err.message });
	}
});

module.exports = router;
