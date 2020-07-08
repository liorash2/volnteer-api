var express = require('express');
var router = express.Router();
var CustomerService = require('../services/services.customer');

/* GET customer listing. */
router.get('/', async function (req, res, next) {
	try {
		const allCustomers = await CustomerService.retrieveAll();

		res.json(allCustomers);
	} catch (err) {
		next(err);
	}
});

/* adds a new customer to the list */
router.post('/', async (req, res, next) => {
	const body = req.body;

	try {
		const customer = await CustomerService.create(body);

		if (body.guid != null) {
			customer.guid = body.guid;
		}

		res.cookie('guid', customer.guid, { maxAge: 900000, httpOnly: true });

		// created the customer! 
		return res.status(201).json({ customer: customer });
	}
	catch (err) {
		if (['ValidationError', 'OperationError'].indexOf(err.name) !== -1) {
			return res.status(400).json({ error: err.message });
		}

		// unexpected error
		return next(err);
	}
});

/* retrieves a customer by uid */
router.get('/:id', async (req, res, next) => {
	try {
		const customer = await CustomerService.retrieve(req.params.id);

		return res.json({ customer: customer });
	}
	catch (err) {
		// unexpected error
		return next(err);
	}
});

/* updates the customer by uid */
router.put('/:id', async (req, res, next) => {
	try {
		const customer = await CustomerService.update(req.params.id, req.body);

		return res.json({ customer: customer });
	}
	catch (err) {
		// unexpected error
		return next(err);
	}
});

/* removes the customer from the customer list by uid */
router.delete('/:id', async (req, res, next) => {
	try {
		const customer = await CustomerService.delete(req.params.id);

		return res.json({ success: true });
	}
	catch (err) {
		// unexpected error
		return next(err);
	}
});

module.exports = router;