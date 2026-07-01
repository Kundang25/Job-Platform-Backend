const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const createProfile = async (req, res) => {
    try {
      const {
        skills,
        preferred_roles,
        location,
        salary_expectation,
        phone,
        bio,
        linkedin_url,
        github_url,
        portfolio_url,
        experience_level
      } = req.body;
  
      const newProfile = await pool.query(
        `INSERT INTO profiles
        (id,user_id,skills,preferred_roles,location,salary_expectation,phone,bio,linkedin_url,github_url,portfolio_url,experience_level,created_at,updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW())
        RETURNING *`,
        [
          uuidv4(),
          req.user.id,
          skills,
          preferred_roles,
          location,
          salary_expectation,
          phone,
          bio,
          linkedin_url,
          github_url,
          portfolio_url,
          experience_level
        ]
      );
  
      res.status(201).json({
        success: true,
        profile: newProfile.rows[0]
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };

  const getProfile = async (req, res) => {
    try {
      const profile = await pool.query(
        "SELECT * FROM profiles WHERE user_id = $1",
        [req.user.id]
      );
  
      res.status(200).json({
        success: true,
        profile: profile.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };


  const updateProfile = async (req, res) => {
    try {
      const {
        skills,
        preferred_roles,
        location,
        salary_expectation,
        phone,
        bio,
        linkedin_url,
        github_url,
        portfolio_url,
        experience_level
      } = req.body;
  
      const updated = await pool.query(
        `UPDATE profiles
        SET skills=$1,
        preferred_roles=$2,
        location=$3,
        salary_expectation=$4,
        phone=$5,
        bio=$6,
        linkedin_url=$7,
        github_url=$8,
        portfolio_url=$9,
        experience_level=$10,
        updated_at=NOW()
        WHERE user_id=$11
        RETURNING *`,
        [
          skills,
          preferred_roles,
          location,
          salary_expectation,
          phone,
          bio,
          linkedin_url,
          github_url,
          portfolio_url,
          experience_level,
          req.user.id
        ]
      );
  
      res.status(200).json({
        success: true,
        profile: updated.rows[0]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };
  
  module.exports = {
    createProfile,
    getProfile,
    updateProfile
  };