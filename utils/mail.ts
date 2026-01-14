import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { deleteScreenshots } from '../utils/screenshot';


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

function collectArtifacts(dir: string, attachments: any[] = []) {   //dir--path of the folder, attachments-stores the screenshot
  if (!fs.existsSync(dir)) return attachments;               //checks folder exist

  for (const item of fs.readdirSync(dir)) {         //Reads all files and folders inside dir
    const fullPath = path.join(dir, item);         //creates path

     if (fs.statSync(fullPath).isDirectory()) {    // gives true if folder and enters the folder
      collectArtifacts(fullPath, attachments);
    } else if (item.endsWith('.png')) {
      attachments.push({
        filename: item,
        path: fullPath,
      });
    }
  }

  return attachments;
}
export async function sendMail() {
  const rawLog = fs.existsSync(logFilePath)     //If terminal.log exists → read it
    ? fs.readFileSync(logFilePath, 'utf-8')
    : 'No terminal log found';

  const finalLog = extractImportantLogs(rawLog);
  const screenshotsDir = path.resolve('screenshots');
  const screenshotAttachments = collectArtifacts(
    path.resolve('screenshots')
  );
  console.log('📸 Screenshots found:', screenshotAttachments.length);
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

