
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use(express.json({ limit: '10kb' }));

// Test whether the backend is running
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio backend is running!' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Server-side validation
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
        message: 'One or more fields are too long or invalid.'
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        message: 'Please provide a valid email address.'
      });
    }

    // Configure email delivery
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_RECEIVER,
      replyTo: email.trim(),
      subject: `Portfolio Contact: ${
        (subject || 'New message').trim().slice(0, 200)
      }`,
      text: [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Subject: ${(subject || 'Not provided').trim()}`,
        '',
        'Message:',
        message.trim()
      ].join('\n')
    });

    return res.status(200).json({
      message: 'Your message has been sent successfully!'
    });
  } catch (error) {
    console.error('Contact form error:', error.message);

    return res.status(500).json({
      message: 'Unable to send your message right now. Please try again later.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
