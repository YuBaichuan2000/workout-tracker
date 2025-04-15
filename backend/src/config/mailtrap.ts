import { MailtrapClient } from 'mailtrap';
import dotenv from 'dotenv';

dotenv.config();

// Type for email sender
export interface Sender {
  email: string;
  name: string;
}

// Check if environment variables are defined
const mailtrapToken = process.env.MAILTRAP_TOKEN;
const mailtrapEndpoint = process.env.MAILTRAP_ENDPOINT;

if (!mailtrapToken || !mailtrapEndpoint) {
  throw new Error('Mailtrap configuration is missing. Please check your .env file.');
}

// Create mailtrap client
export const client = new MailtrapClient({
  token: mailtrapToken,
  endpoint: mailtrapEndpoint
} as any);

// Email sender information
export const sender: Sender = {
  email: "hello@demomailtrap.com",
  name: "George Yu",
};