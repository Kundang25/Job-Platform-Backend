const OpenAI = require("openai");
const pool = require("../config/db");
const logger = require("../utils/logger");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


const resumeScore = async (req, res) => {
    try {
      const resume = await pool.query(
        "SELECT * FROM resumes WHERE user_id=$1 LIMIT 1",
        [req.user.id]
      );
  
      const parsedText = resume.rows[0]?.parsed_text || "";
  
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Analyze resume and score out of 100."
          },
          {
            role: "user",
            content: parsedText
          }
        ]
      });
  
      res.json({
        success: true,
        result: completion.choices[0].message.content
      });
  
    } catch (error) {
        logger.error(error.message);
      res.status(500).json({
        success: false,
        message: "Resume scoring failed"
      });
    }
  };



  const skillGapAnalysis = async (req, res) => {
    try {
      const { jobDescription } = req.body;
  
      const profile = await pool.query(
        "SELECT * FROM profiles WHERE user_id=$1",
        [req.user.id]
      );
  
      const skills = profile.rows[0]?.skills || "";
  
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Compare skills and find missing skills."
          },
          {
            role: "user",
            content: `Skills: ${skills}\nJob: ${jobDescription}`
          }
        ]
      });
  
      res.json({
        success: true,
        result: completion.choices[0].message.content
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Skill analysis failed"
      });
    }
  };


  const generateCoverLetter = async (req, res) => {
    try {
      const { company, role } = req.body;
  
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Generate cover letter for ${role} at ${company}`
          }
        ]
      });
  
      res.json({
        success: true,
        coverLetter: completion.choices[0].message.content
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Cover letter generation failed"
      });
    }
  };


  const interviewPrep = async (req, res) => {
    try {
      const { role } = req.body;
  
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Generate interview questions for ${role}`
          }
        ]
      });
  
      res.json({
        success: true,
        questions: completion.choices[0].message.content
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Interview prep failed"
      });
    }
  };


  module.exports = {
    resumeScore,
    skillGapAnalysis,
    generateCoverLetter,
    interviewPrep
  };