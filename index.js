const cron = require('node-cron');
const { checkAvailability } = require('./utils');

const main = () => {
  cron.schedule('*/15 * * * * *', async () => {
    await checkAvailability();
  });
};
main();
