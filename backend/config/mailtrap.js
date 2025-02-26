import { MailtrapClient } from 'mailtrap';
import dotenv from 'dotenv';

dotenv.config();

export const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
  endpoint: process.env.MAILTRAP_ENDPOINT
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "George Yu",
};

