import axios from 'axios';

const API_URL = 'https://api.spotify.com/v1';

export class SpotifyClient {
  constructor(token) {
    if (!token) {
      throw new Error('missing token, call init(id, secret) instead');
    }

    this.token = token;
  }

  getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${this.token}`
    }
  });

  getTracks = async (id, total) => {
    const url = `${API_URL}/playlists/${id}`;

    const requests = [...Array(Math.floor(total / 100) + 1).keys()].map((k) =>
      axios.get(`${url}/tracks?offset=${k * 100}&limit=100`, this.getHeaders())
    );

    const responses = await Promise.all(requests);

    return responses.flatMap(({ data }) =>
      data.items.map(({ track, added_at, added_by }) => ({
        artist: track.artists[0].name,
        title: track.name,
        url: track.external_urls.spotify,
        added: new Date(added_at),
        user: added_by.id
      }))
    );
  };

  getPlaylist = async (id) => {
    console.log('🍺 fetching playlist...');
    const url = `${API_URL}/playlists/${id}`;
    const { data } = await axios.get(url, this.getHeaders());

    return {
      name: data.name,
      trackCount: data.tracks.total,
      snapshot: data.snapshot_id
    };
  };

  combineWithUsers = async (tracks) => {
    console.log('🍺 fetching users...');

    const users = new Set(tracks.map((t) => t.user));

    const requests = Array.from(users).map((u) =>
      axios.get(`${API_URL}/users/${u}`, this.getHeaders())
    );

    const responses = await Promise.all(requests);

    const usersMap = responses.reduce((acc, { data }) => {
      acc[data.id] = data.display_name;
      return acc;
    }, {});

    return tracks.map((t) => ({ ...t, user: usersMap[t.user] }));
  };

  static init = async (id, secret) => {
    console.log('🍺 generating token...');
    const { data } = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(id + ':' + secret).toString(
            'base64'
          )}`
        }
      }
    );

    return new SpotifyClient(data.access_token);
  };
}
