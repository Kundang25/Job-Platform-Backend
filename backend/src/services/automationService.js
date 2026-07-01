const cron = require("node-cron");
const pool = require("../config/db");

const startAutomation = () => {
  cron.schedule("0 */6 * * *", async () => {
    console.log("Running Auto Apply Engine...");

    const users = await pool.query("SELECT * FROM users");

    for (const user of users.rows) {
      console.log(`Checking jobs for ${user.email}`);
    }
  });
};

module.exports = {
  startAutomation
};