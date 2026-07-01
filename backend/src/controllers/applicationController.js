const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");


const applyJob = async (req, res) => {
    try {
      const { jobId } = req.params;
  
      const existing = await pool.query(
        "SELECT * FROM applications WHERE user_id = $1 AND job_id = $2",
        [req.user.id, jobId]
      );
  
      if (existing.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Already applied"
        });
      }
  
      const application = await pool.query(
        `INSERT INTO applications
        (id,user_id,job_id,status,applied_at,created_at,updated_at)
        VALUES ($1,$2,$3,$4,NOW(),NOW(),NOW())
        RETURNING *`,
        [
          uuidv4(),
          req.user.id,
          jobId,
          "applied"
        ]
      );
  
      res.status(201).json({
        success: true,
        message: "Applied successfully",
        application: application.rows[0]
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };


  const getApplications = async (req, res) => {
    try {
      const applications = await pool.query(
        `SELECT applications.*, jobs.title, jobs.company, jobs.location
         FROM applications
         JOIN jobs ON jobs.id = applications.job_id
         WHERE applications.user_id = $1`,
        [req.user.id]
      );
  
      res.status(200).json({
        success: true,
        applications: applications.rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };

  module.exports = {
    applyJob,
    getApplications
  };