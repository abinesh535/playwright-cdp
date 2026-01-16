import { sendMail } from './mail';
import fs from 'fs';

export default async function globalTeardown() {   //runs once after all test suites finish, regardless of whether tests pass or fail.
 // await sendMail();
 fs.appendFileSync('teardown.log', 'Global teardown executed\n');
}
