const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const getAllJobs = async (req, res) => {
    try {
      const jobs = await pool.query(
        "SELECT * FROM jobs ORDER BY created_at DESC"
      );
  
      res.status(200).json({
        success: true,
        jobs: jobs.rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };


  const getSingleJob = async (req, res) => {
    try {
      const { id } = req.params;
  
      const job = await pool.query(
        "SELECT * FROM jobs WHERE id = $1",
        [id]
      );
  
      res.status(200).json({
        success: true,
        job: job.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };


  const saveJob = async (req, res) => {
    try {
      const { jobId } = req.params;
  
      const savedJob = await pool.query(
        `INSERT INTO saved_jobs
        (id,user_id,job_id,created_at)
        VALUES ($1,$2,$3,NOW())
        RETURNING *`,
        [
          uuidv4(),
          req.user.id,
          jobId
        ]
      );
  
      res.status(201).json({
        success: true,
        savedJob: savedJob.rows[0]
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };

  const getSavedJobs = async (req, res) => {
    try {
      const jobs = await pool.query(
        `SELECT jobs.*
         FROM saved_jobs
         JOIN jobs ON jobs.id = saved_jobs.job_id
         WHERE saved_jobs.user_id = $1`,
        [req.user.id]
      );
  
      res.status(200).json({
        success: true,
        jobs: jobs.rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };

  module.exports = {
    getAllJobs,
    getSingleJob,
   saveJob,
    getSavedJobs
  };