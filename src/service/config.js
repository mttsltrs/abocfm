import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  PLAYLIST_ID: process.env.PLAYLIST_ID,
  OFFSET: process.env.OFFSET || 7
};

const missing = [];
if (!config.CLIENT_ID) missing.push('CLIENT_ID');
if (!config.CLIENT_SECRET) missing.push('CLIENT_SECRET');
if (!config.PLAYLIST_ID) missing.push('PLAYLIST_ID');

if (missing.length > 0) {
  throw new Error(`missing env vars: ${missing.join(', ')}`);
}

export { config };
