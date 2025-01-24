import { SpotifyClient } from './service/spotify.js';
import { buildPage } from './service/builder.js';
import { config } from './service/config.js';

const abocfm = async () => {
  try {
    const now = new Date();
    console.log(`⏰ ${now}`);

    const client = await SpotifyClient.init(
      config.CLIENT_ID,
      config.CLIENT_SECRET
    );

    const { name, trackCount } = await client.getPlaylist(config.PLAYLIST_ID);

    const tracks = await client.getTracks(config.PLAYLIST_ID, trackCount);

    const sortedTracks = tracks.sort(
      (a, b) => b.added.getTime() - a.added.getTime()
    );

    const tracksWithUsers = await client.combineWithUsers(sortedTracks);

    const OFFSET_IN_MS = config.OFFSET * 24 * 60 * 60 * 1000;
    const start = tracksWithUsers[tracksWithUsers.length - 1].added;

    const catalogue = Array.from(
      {
        length: Math.ceil((now - start) / OFFSET_IN_MS)
      },
      (_, i) => {
        const end = new Date(now - i * OFFSET_IN_MS);
        return {
          start: new Date(Math.max(end - OFFSET_IN_MS, start)),
          end,
          tracks: []
        };
      }
    );

    let week = 0;
    tracksWithUsers.forEach((track) => {
      let pushed = false;
      while (!pushed) {
        const segment = catalogue[week];
        if (track.added >= segment.start && track.added <= segment.end) {
          segment.tracks.push(track);
          pushed = true;
        } else {
          week++;
        }
      }
    });

    const years = Array.from(
      { length: now.getFullYear() - start.getFullYear() + 1 },
      (_, i) => {
        return now.getFullYear() - i;
      }
    );

    console.log('📝 building page...');
    buildPage(name, catalogue, years);

    console.log('🎉 done!');
  } catch (e) {
    console.log('❌', e.message);
  }
};

abocfm();
