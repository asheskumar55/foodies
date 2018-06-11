const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
	Idea.find({})
		.sort({date:'desc'})
		.then(ideas => {
			res.render('ideas/index', {
				ideas: ideas
			});
		});
});

// Edit page routes
router.get('/edit', ensureAuthenticated, (req, res) => {
	Idea.find({})
		.sort({date:'desc'})
		.then(ideas => {
			res.render('ideas/edit', {
				ideas: ideas
			});
		});
});

// Preview the items
router.get('/items', ensureAuthenticated, (req, res) => {
	Idea.find({})
		.sort({date:'desc'})
		.then(ideas => {
			res.render('ideas/items', {
				ideas: ideas
			});
		});
});

// Edit Idea Form
router.get('/edit/:id',ensureAuthenticated, (req,res) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		res.render('ideas/edit', {
			idea:idea
		});
	});
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
	let errors = [];

	if(!req.body.title){
		errors.push({text: 'Please add a title'});
	}
	if(!req.body.details){
		errors.push({text: 'Please add some details'});
	}

	if(errors.length > 0){
		res.render('/', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.details,
			user: req.user.id
		}
		new Idea(newUser) 
			.save()
			.then(idea => {
				req.flash('success_msg', 'Food item added');
				res.redirect('/ideas');
			})
	}
});

// Order the item
router.post('/', ensureAuthenticated, (req, res) => {
	let errors = [];

	if(!req.body.title){
		errors.push({text: 'Please add a title'});
	}
	if(!req.body.details){
		errors.push({text: 'Please add some details'});
	}

	if(errors.length > 0){
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.details,
			user: req.user.id
		}
		new Idea(newUser) 
			.save()
			.then(idea => {
				req.flash('success_msg', 'Food item added');
				res.redirect('/ideas');
			})
	}
});


// Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		// new values
		idea.title = req.body.title;
		idea.details = req.body.details;
		
		idea.save()
		  .then(idea => {
		  	req.flash('success_msg', 'Food item updated');
		  	res.redirect('/ideas');
		  })
	});
});

// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
	Idea.remove({_id: req.params.id})
	  .then(() => {
	  	req.flash('success_msg', 'Food item removed');
	  	res.redirect('/ideas');
	  });
});

module.exports = router;


