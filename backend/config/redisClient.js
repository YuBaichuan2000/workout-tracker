// redisClient.js
import { createClient } from 'redis';

const redisClient = createClient({
  // Add config if deploying
  // url: 'redis://:yourpassword@your-redis-host:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect();

export default redisClient;
