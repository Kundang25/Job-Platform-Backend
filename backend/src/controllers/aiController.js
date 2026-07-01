const pool = require("../config/db");
const { calculateMatchScore } = require("../services/matchingService");

const generateInsights = async (req, res) => {
  try {
    const jobs = await pool.query("SELECT * FROM jobs LIMIT 20");
    const profile = await pool.query(
      "SELECT * FROM profiles WHERE user_id = $1",
      [req.user.id]
    );

    const userSkills = profile.rows[0]?.skills || "";

    const insights = jobs.rows.map(job => ({
      job_id: job.id,
      title: job.title,
      company: job.company,
      match_score: calculateMatchScore(
        userSkills,
        job.requirements || ""
      )
    }));

    res.status(200).json({
      success: true,
      insights
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "AI failed"
    });
  }
};

module.exports = {
  generateInsights
};