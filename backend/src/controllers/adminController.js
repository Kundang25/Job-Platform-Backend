const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");


const getAllUsers = async (req, res) => {
    try {
      const users = await pool.query(
        "SELECT id,name,email,role,created_at FROM users"
      );
  
      res.json({
        success: true,
        users: users.rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch users"
      });
    }
  };



  const getAllJobs = async (req, res) => {
    try {
      const jobs = await pool.query(
        "SELECT * FROM jobs ORDER BY created_at DESC"
      );
  
      res.json({
        success: true,
        jobs: jobs.rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch jobs"
      });
    }
  };




  const getAnalytics = async (req, res) => {
    try {
      const users = await pool.query("SELECT COUNT(*) FROM users");
      const jobs = await pool.query("SELECT COUNT(*) FROM jobs");
      const applications = await pool.query("SELECT COUNT(*) FROM applications");
      const resumes = await pool.query("SELECT COUNT(*) FROM resumes");
  
      res.json({
        success: true,
        analytics: {
          totalUsers: users.rows[0].count,
          totalJobs: jobs.rows[0].count,
          totalApplications: applications.rows[0].count,
          totalResumes: resumes.rows[0].count
        }
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Analytics failed"
      });
    }
  };


  const deleteUser = async (req, res) => {
    try {
      await pool.query(
        "DELETE FROM users WHERE id=$1",
        [req.params.id]
      );
  
      res.json({
        success: true,
        message: "User deleted"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Delete failed"
      });
    }
  };


  const deleteJob = async (req, res) => {
    try {
      await pool.query(
        "DELETE FROM jobs WHERE id=$1",
        [req.params.id]
      );
  
      res.json({
        success: true,
        message: "Job deleted"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Delete failed"
      });
    }
  };


  const createJob = async (req, res) => {
    try {
      const {
        title,
        company,
        location,
        description,
        requirements
      } = req.body;
  
      const job = await pool.query(
        `INSERT INTO jobs
        (id,title,company,location,description,requirements,created_at,updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
        RETURNING *`,
        [
          uuidv4(),
          title,
          company,
          location,
          description,
          requirements
        ]
      );
  
      res.json({
        success: true,
        job: job.rows[0]
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Job creation failed"
      });
    }
  };


  module.exports = {
    getAllUsers,
    getAllJobs,
    getAnalytics,
    deleteUser,
    deleteJob,
    createJob
  };