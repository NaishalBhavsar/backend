const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { user: req.user.id };  // Admins see all, users see own
  const tasks = await Task.find(query);
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const task = new Task({ ...req.body, user: req.user.id });
  await task.save();
  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || (req.user.role !== 'admin' && task.user.toString() !== req.user.id)) {
    return res.status(403).json({ error: 'Access denied.' });
  }
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || (req.user.role !== 'admin' && task.user.toString() !== req.user.id)) {
    return res.status(403).json({ error: 'Access denied.' });
  }
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted.' });
};
