import fs from 'fs';
import path from 'path';

const screenshotsDir = path.resolve('screenshots');

export function deleteScreenshots() {
  if (fs.existsSync(screenshotsDir)) {
    fs.rmSync(screenshotsDir, { recursive: true, force: true });
    console.log('📸 Screenshots folder deleted');
  } else {
    console.log('📂 No screenshots folder to delete');
  }
}
