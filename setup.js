import fs from 'fs';

const ENV_PATH = '.env';

const content = `CLIENT_ID=
CLIENT_SECRET=
PLAYLIST_ID=
`;

fs.writeFileSync(ENV_PATH, content);
