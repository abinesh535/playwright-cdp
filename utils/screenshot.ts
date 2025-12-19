import fs from 'fs';
import path from 'path';

const screenshotsDir = path.resolve('screenshots');    //converts folder name into path format like C:\project\playwright\screenshots

export function deleteScreenshots() {
  if (fs.existsSync(screenshotsDir)) {    //if folder exists, returns true
    fs.rmSync(screenshotsDir, { recursive: true, force: true });   //fs.rmSync() → deletes files/folders and recursive: true → deletes the folder and everything inside it
    console.log('📸 Screenshots folder deleted');
  } else {
    console.log('📂 No screenshots folder to delete');
  }
}
