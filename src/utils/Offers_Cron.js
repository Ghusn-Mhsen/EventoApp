const cron = require('node-cron');
const Product = require('../models/product/product'); // Adjust the path accordingly


// Define the cron job to run every day at 12pm
var task = cron.schedule('0 23 * * *', async () => {

    try {
        // Find products with active offers that have expired
        const expiredOffersProducts = await Product.find({
            'offers.endDateOfOffers': {
                $lt: new Date()
            },
            'offers.active': true,
        });

        // Update the active status of expired offers to false
        for (const product of expiredOffersProducts) {
            product.offers.forEach(offer => {
                if (offer.endDateOfOffers < new Date() && offer.active) {
                    offer.active = false;
                }
            });

            await product.save();
        }

    } catch (error) {
        console.error('Error in cron job:', error.message);
    }
});

// Keep the script running
task.start()