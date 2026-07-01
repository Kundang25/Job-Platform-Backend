const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");

const uploadResume = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded"
        });
      }
  
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        folder: "resumes"
      });
  
      const resume = await pool.query(
        `INSERT INTO resumes
        (id,user_id,resume_url,file_name,is_active,created_at,updated_at)
        VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
        RETURNING *`,
        [
          uuidv4(),
          req.user.id,
          result.secure_url,
          req.file.originalname,
          true
        ]
      );
  
      res.status(201).json({
        success: true,
        message: "Resume uploaded successfully",
        resume: resume.rows[0]
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Upload failed"
      });
    }
  };


  const getResume = async (req, res) => {
    try {
      const resume = await pool.query(
        "SELECT * FROM resumes WHERE user_id = $1",
        [req.user.id]
      );
  
      res.status(200).json({
        success: true,
        resume: resume.rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };

  module.exports = {
    uploadResume,
    getResume
  };