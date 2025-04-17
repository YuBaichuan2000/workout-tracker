// __tests__/config/teardown.ts
import { teardownDB } from './mongoTestSetup';

export default async (): Promise<void> => {
  await teardownDB();
  console.log('Test database cleaned up');
};