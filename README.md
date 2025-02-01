# Bulk Email Sender

A professional React application for sending personalized bulk emails using Excel/CSV files. Built with React, Redux, TypeScript, and Node.js.

## Features

- 📤 Send personalized bulk emails
- 📎 Import recipients from Excel (.xlsx, .xls) or CSV files
- 🔄 Real-time email preview
- 📝 Support for dynamic content using variables
- 💅 Modern UI with Tailwind CSS
- 🚀 Built with TypeScript for type safety

## Prerequisites

- Node.js 16.x or higher
- Gmail account (for sending emails)
- Enable "Less secure app access" or use App Password for your Gmail account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd mail-sender-app
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
npm install

# Install server dependencies
cd server
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the `server` directory
   - Add the following variables:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
```

4. Start the application:
```bash
# Start the server (from server directory)
npm run server

# Start the client (from root directory)
npm run dev
```

## Usage

1. **Prepare Your Data File**
   - Create an Excel (.xlsx, .xls) or CSV file with the following columns:
     - `name`: Recipient's name
     - `email`: Recipient's email address
     - `company`: Company name (optional)

2. **Upload Recipients**
   - Click the upload area or drag and drop your file
   - The application will automatically parse the data

3. **Compose Your Email**
   - Enter the email subject
   - Write your email content using variables:
     - Use `{name}` for recipient's name
     - Use `{company}` for company name
   - Preview your email using the "Preview" button

4. **Send Emails**
   - Click "Send Emails" to start the bulk send
   - Monitor the success/failure status

## Technical Stack

- **Frontend**
  - React 18
  - Redux Toolkit
  - TypeScript
  - Tailwind CSS
  - Vite
  - XLSX for Excel parsing
  - Papa Parse for CSV parsing

- **Backend**
  - Node.js
  - Express
  - Nodemailer
  - Multer

## Best Practices

- Space out bulk sends to avoid spam filters
- Keep email content professional and spam-trigger free
- Test with a small group before sending to a large list
- Regularly clean and validate your email list

## Security Notes

- Store sensitive information in environment variables
- Never commit `.env` files to version control
- Use App Passwords instead of account passwords for Gmail
- Keep dependencies updated for security patches

## License

MIT License