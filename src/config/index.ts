import { Fonts } from 'figlet';

export default {
  apiBaseUrl: 'http://api.football-data.org/v1',
  axiosConfig: {
    headers: {
      'X-Auth-Token': process.env.SOCCER_GO_API_KEY || '',
      'X-Response-Control': 'full',
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
