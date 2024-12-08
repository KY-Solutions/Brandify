const newsletterService = require('../services/newsletterService');

// Subscribe to the newsletter
async function subscribe(req, res) {
    const { email } = req.body;

    try {
        const subscriber = await newsletterService.addSubscriber(email);
        res.status(201).json({
            message: 'Successfully subscribed to the newsletter!',
            subscriber,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Unsubscribe from the newsletter
async function unsubscribe(req, res) {
    const { email } = req.body;

    try {
        const result = await newsletterService.removeSubscriber(email);
        res.status(200).json({
            message: 'Successfully unsubscribed from the newsletter.',
            result,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get all subscribers (admin use)
async function getSubscribers(req, res) {
    try {
        const subscribers = await newsletterService.getAllSubscribers();
        res.status(200).json({ subscribers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Send a newsletter to all subscribers
async function sendNewsletter(req, res) {
    const { subject, content, htmlContent } = req.body;

    if (!subject || !content) {
        return res.status(400).json({ error: 'Subject and content are required' });
    }
    console.log(subject);

    try {
        const result = await newsletterService.sendNewsletter(subject, content, htmlContent);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    subscribe,
    unsubscribe,
    getSubscribers,
    sendNewsletter,
};
