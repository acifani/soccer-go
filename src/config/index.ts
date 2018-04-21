export default {
  apiBaseUrl: 'http://www.football-data.org/v1',
  axiosConfig: {
    headers: {
      'X-Auth-Token': process.env.SOCCER_GO_API_KEY || '',
      'X-Response-Control': 'full',
    },
  },
  cache: {
    expiry: 24 * 60 * 1000, // 24 hours
    fileName: '.cache',
  },
  figletFont: 'Slant',
};
