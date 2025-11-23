const db = require('../db');

exports.getMessages = (req, res) => {
  // In a real app, you'd filter based on the logged-in user ID
  res.json(db.messages);
};

exports.sendMessage = (req, res) => {
  const message = req.body;
  db.messages.push(message);
  res.status(201).json({ success: true, message });
};