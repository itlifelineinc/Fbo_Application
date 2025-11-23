const db = require('../db');

exports.login = (req, res) => {
  const { handle, password } = req.body;
  
  // Normalize handle
  const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;

  const user = db.students.find(s => 
    s.handle.toLowerCase() === formattedHandle.toLowerCase() && 
    s.password === password
  );

  if (user) {
    // Update login stats
    const today = new Date().toISOString().split('T')[0];
    let newStreak = user.learningStats.learningStreak;
    
    if (user.learningStats.lastLoginDate !== today) {
         const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
         if (user.learningStats.lastLoginDate === yesterday) {
             newStreak += 1;
         } else {
             newStreak = 1;
         }
         user.learningStats.learningStreak = newStreak;
         user.learningStats.lastLoginDate = today;
    }

    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};

exports.register = (req, res) => {
  const newStudent = req.body;
  
  // Simple validation
  if (!newStudent.handle || !newStudent.email) {
      return res.status(400).json({ message: "Missing required fields" });
  }

  // Check for duplicates
  if (db.students.some(s => s.handle === newStudent.handle)) {
      return res.status(400).json({ message: "Handle already exists" });
  }

  db.students.push(newStudent);
  res.status(201).json({ success: true, user: newStudent });
};