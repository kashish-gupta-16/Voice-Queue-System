const cron = require('node-cron');
const Token = require('../models/token');

// Runs every minute
const startExpiryJob = () => {
    cron.schedule('* * * * *', async () => {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60000);

        try {
            // Find tokens that were 'CALLED' but haven't started 'SERVING' within 10 mins
            const expiredTokens = await Token.updateMany(
                {
                    status: 'CALLED',
                    calledAt: { $lt: tenMinutesAgo }
                },
                { $set: { status: 'EXPIRED' } }
            );

            if (expiredTokens.modifiedCount > 0) {
                console.log(`[Job] Automatically expired ${expiredTokens.modifiedCount} tokens.`);
                // Here you could emit a socket event to update the dashboard live
            }
        } catch (err) {
            console.error("[Job Error]", err);
        }
    });
};

module.exports = startExpiryJob;