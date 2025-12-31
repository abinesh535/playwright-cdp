import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import  {deleteScreenshots} from '../utils/screenshot';


if (!process.env.GITHUB_ACTIONS) {
  dotenv.config({ path: '.env.staging' });
}

const logFilePath = path.resolve('terminal.log');

function extractImportantLogs(rawLog: string): string {
  // 1️⃣ Remove ANSI escape codes
  let cleaned = rawLog.replace(/\x1B\[[0-9;]*[A-Za-z]/g, '');

  // 2️⃣ Remove dotenv framework noise
  cleaned = cleaned
    .split('\n')
    .filter(line => !line.includes('[dotenv@'))
    .join('\n');

  // 3️⃣ Remove excessive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

async function sendMail() {
  const rawLog = fs.existsSync(logFilePath)     //If terminal.log exists → read it
    ? fs.readFileSync(logFilePath, 'utf-8')
    : 'No terminal log found';

  const finalLog = extractImportantLogs(rawLog);

  const screenshotsDir = path.resolve('screenshots');
  const screenshotAttachments: any[] = [];
  if (fs.existsSync(screenshotsDir)) {
    const files = fs.readdirSync(screenshotsDir);              
    for (const file of files) {              //Reads all files and take only .png files
      if (file.endsWith('.png')) {
        screenshotAttachments.push({
          filename: file,
          path: path.join(screenshotsDir, file),
        });
      }
    }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: 'agrant@kanrad.com',
    subject: 'Playwright Authorization Logs',
    text: 'Please find the attached auth log for test results.',
    attachments: [
      {
        filename: 'terminal.log',
        content: finalLog,
      },
            ...screenshotAttachments,

    ]
  });

  console.log('✅ Mail sent successfully');
  deleteScreenshots();
}

sendMail().catch(console.error);
