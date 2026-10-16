
const express = require('express');
const Form = require('../models/form');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: 'Name, email and message are required.'
      });
    }

    if (
      name.length > 100 ||
      email.length > 254 ||
      message.length > 5000 ||
      (subject != null &&
        (typeof subject !== 'string' || subject.length > 200))
    ) {
      return res.status(400).json({
        message: 'One or more fields exceed the allowed length.'
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        message: 'Please enter a valid email address.'
      });
    }

    const newForm = await Form.create({
      name: name.trim(),
      email: email.trim(),
      subject: typeof subject === 'string' ? subject.trim() : '',
      message: message.trim()
    });

    return res.status(201).json({
      message: 'Your message has been received successfully!',
      id: newForm._id
    });
  } catch (error) {
    console.error('Contact form error:', error.message);

    return res.status(500).json({
      message: 'Unable to submit your message. Please try again.'
    });
  }
});

module.exports = router;
