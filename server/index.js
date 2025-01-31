import express from 'express';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/send-emails', upload.single('file'), async (req, res) => {
  try {
    const { recipients, subject, content } = req.body;
    const parsedRecipients = JSON.parse(recipients);

    const results = {
      success: [],
      failed: []
    };

    for (const recipient of parsedRecipients) {
      const personalizedContent = content
        .replace(/\{name\}/g, recipient.name)
        .replace(/\{company\}/g, recipient.company || 'your company');

      // Convert line breaks to HTML and wrap content in proper HTML structure
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            ${personalizedContent.split('\n').join('<br>')}
          </body>
        </html>
      `;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: recipient.email,
          subject: subject,
          html: htmlContent,
          // Also include plain text version for email clients that don't support HTML
          text: personalizedContent
        });
        
        results.success.push(recipient.email);
      } catch (error) {
        results.failed.push({
          email: recipient.email,
          error: error.message
        });
      }
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});