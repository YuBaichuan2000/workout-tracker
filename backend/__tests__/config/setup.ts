// __tests__/config/setup.ts
import { setupDB } from './mongoTestSetup';

export default async (): Promise<void> => {
  await setupDB();
  console.log('Test database initialized');
};