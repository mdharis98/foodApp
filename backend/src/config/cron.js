import cron from 'cron'
import https from 'https'

// -----------------send 1 GET request to the API every 14 minutes so that the server does not go to sleep

const job = new cron.CronJob("*/14 * * * *", function() {
    https
    .get('process.env.API_URL', (res) => {
        if(res.statusCode === 200) console.log('Get request sent successfully');
        else console.log('Get request failed', res.statusCode);
    })
    .on('error', (e) => {
        console.error("Error while sending request", e);
    });
});

export default job