const db = require('../db');

exports.getAllStudents = (req, res) => {
  // In a real app, filtering sensitive data (password) would happen here
  res.json(db.students);
};

exports.updateStudent = (req, res) => {
  const { studentId } = req.params;
  const updates = req.body;

  const index = db.students.findIndex(s => s.id === studentId);
  if (index !== -1) {
    db.students[index] = { ...db.students[index], ...updates };
    res.json({ success: true, user: db.students[index] });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
};

exports.submitSale = (req, res) => {
  const { studentId } = req.params;
  const saleRecord = req.body;
  
  const student = db.students.find(s => s.id === studentId);
  if (student) {
      // Add sale record
      if (!student.salesHistory) student.salesHistory = [];
      student.salesHistory.unshift(saleRecord);
      
      // Update CC
      student.caseCredits += saleRecord.ccEarned;
      
      // Check for promotion (Student -> Sponsor)
      if (student.role === 'STUDENT' && student.caseCredits >= 2) {
          student.role = 'SPONSOR';
      }

      res.json({ success: true, user: student });
  } else {
      res.status(404).json({ success: false, message: "User not found" });
  }
};