import { sendMail } from './mail';

export default async function globalTeardown() {
  await sendMail();
}
