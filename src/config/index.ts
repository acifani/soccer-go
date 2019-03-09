import { Fonts } from 'figlet';

export default {
  apiBaseUrl: 'https://api.football-data.org/v2',
  axiosConfig: {
    headers: {
      'X-Auth-Token': process.env.SOCCER_GO_API_KEY || apiKeyError(),
    },
  },
  cache: {
    expiry: {
      competition: 30 * 24 * 60 * 60 * 1000, // 1 month
      fixtures: 5 * 60 * 1000, // 5 minutes
      players: 7 * 24 * 60 * 60 * 1000, // 1 week
      standings: 60 * 60 * 1000, // 1 hour
      team: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
    fileName: '.cache',
  },
  figletFont: 'Slant' as Fonts,
};

function apiKeyError() {
  if (process.env.CI) {
    return;
  }

  console.error(`
  SOCCER_GO_API_KEY environment variable not set.

      $ export SOCCER_GO_API_KEY=<football_data_api_key>

  You can get your own API key over at
  https://www.football-data.org/client/register
  `);
  process.exit(1);
}
