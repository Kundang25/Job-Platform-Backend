const cron = require("node-cron");

const {
  scrapeJobs,
  saveJobsToDB
} = require("../services/scraperService");

const startJobScraper = () => {
  cron.schedule("0 */6 * * *", async () => {
    console.log("Running job scraper...");

    const jobs = await scrapeJobs();

    await saveJobsToDB(jobs);
  });
};

module.exports = {
  startJobScraper
};