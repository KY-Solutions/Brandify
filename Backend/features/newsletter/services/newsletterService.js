const Newsletter = require('../models/newsletterModel');
const emailService = require('../utils/emailService');

// Add a new subscriber
async function addSubscriber(email) {
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
        throw new Error('Email already subscribed');
    }

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();
    return newSubscriber;
}

// Get all subscribers (admin use)
async function getAllSubscribers() {
    return await Newsletter.find({}, 'email'); // Fetch only the email field
}

// Remove a subscriber
async function removeSubscriber(email) {
    const result = await Newsletter.findOneAndDelete({ email });
    if (!result) {
        throw new Error('Subscriber not found');
    }
    return result;
}

// Send a newsletter to all subscribers
async function sendNewsletter(subject, content, htmlContent) {
    const subscribers = await getAllSubscribers();
    if (!subscribers.length) {
        throw new Error('No subscribers found');
    }

    const recipientEmails = subscribers.map(subscriber => subscriber.email);

    for (const email of recipientEmails) {
        await emailService.sendEmail(email, subject, content, htmlContent);
    }

    return `${subscribers.length} emails sent successfully`;
}

module.exports = {
    addSubscriber,
    getAllSubscribers,
    removeSubscriber,
    sendNewsletter,
};
