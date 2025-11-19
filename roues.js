const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validation');
const Joi = require('joi');
const router = express.Router();

router.get('/', auth, getTasks);
router.post('/', auth, validate(Joi.object({ title: Joi.string().required(), description: Joi.string() })), createTask);
router.put('/:id', auth, validate(Joi.object({ title: Joi.string(), description: Joi.string(), completed: Joi.boolean() })), updateTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;
