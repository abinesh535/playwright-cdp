import { sendMail } from './mail';

export default async function globalTeardown() {   //runs once after all test suites finish, regardless of whether tests pass or fail.
  await sendMail();
}
