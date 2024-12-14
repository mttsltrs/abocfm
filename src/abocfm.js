import { SpotifyClient } from './service/spotify.js';
import { buildPage } from './service/builder.js';
import { config } from './service/config.js';

const abocfm = async () => {
  try {
    const date = new Date();
    console.log(`⏰ ${date}`);

    const client = await SpotifyClient.init(
      config.CLIENT_ID,
      config.CLIENT_SECRET
    );

    const { name, trackCount } = await client.getPlaylist(config.PLAYLIST_ID);

    const tracks = await client.getTracks(config.PLAYLIST_ID, trackCount);

    date.setDate(date.getDate() - config.OFFSET);
    console.log(`🔍 finding songs added after ${date}`);

    const newTracks = tracks.filter((s) => s.added.getTime() >= date.getTime());
    console.log(`🎉 ${newTracks.length} new songs added`);

    if (newTracks.length === 0) {
      return;
    }

    const sortedTracks = newTracks.sort(
      (a, b) => a.added.getTime() - b.added.getTime()
    );

    const tracksWithUsers = await client.combineWithUsers(sortedTracks);

    console.log('📝 building page...');
    buildPage(name, tracksWithUsers, date);

    console.log('🎉 done!');
  } catch (e) {
    console.log('❌', e.message);
  }
};

abocfm();
