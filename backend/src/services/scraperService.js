const axios = require("axios");
const cheerio = require("cheerio");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");


const scrapeJobs = async () => {
    try {
        logger.info("Starting job scraping...");
  
      const response = await axios.get("https://remoteok.com");
  
      const $ = cheerio.load(response.data);
  
      const jobs = [];
  
      $("tr.job").each((index, element) => {
        const title = $(element).find("h2").text().trim();
        const company = $(element).find("h3").text().trim();
  
        if (title && company) {
          jobs.push({
            title,
            company,
            location: "Remote",
            source: "RemoteOK"
          });
        }
      });
  
      return jobs;
  
    } catch (error) {
        logger.error(error.message);
      return [];
    }
  };




  const saveJobsToDB = async (jobs) => {
    try {
      for (const job of jobs) {
        const existing = await pool.query(
          "SELECT * FROM jobs WHERE title=$1 AND company=$2",
          [job.title, job.company]
        );
  
        if (existing.rows.length > 0) continue;
  
        await pool.query(
          `INSERT INTO jobs
          (id,title,company,location,source,created_at,updated_at)
          VALUES ($1,$2,$3,$4,$5,NOW(),NOW())`,
          [
            uuidv4(),
            job.title,
            job.company,
            job.location,
            job.source
          ]
        );
      }
  
      console.log("Jobs inserted successfully");
  
    } catch (error) {
      console.error(error);
    }
  };


  module.exports = {
    scrapeJobs,
    saveJobsToDB
  };