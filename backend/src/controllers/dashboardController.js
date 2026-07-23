const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const savedJobs = await pool.query(
      `SELECT COUNT(*) FROM applications 
       WHERE user_id = $1 AND status = 'Saved'`,
      [userId]
    );

    const appliedJobs = await pool.query(
      `SELECT COUNT(*) FROM applications 
       WHERE user_id = $1 AND status = 'Applied'`,
      [userId]
    );

    const interviews = await pool.query(
      `SELECT COUNT(*) FROM applications 
       WHERE user_id = $1 AND status = 'Interview'`,
      [userId]
    );

    res.json({
      success: true,
      stats: {
        savedJobs: savedJobs.rows[0].count,
        appliedJobs: appliedJobs.rows[0].count,
        interviews: interviews.rows[0].count,
        matchScore: 88
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboardStats };