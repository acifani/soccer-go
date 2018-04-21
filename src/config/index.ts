export default {
  apiBaseUrl: 'http://www.football-data.org/v1',
  axiosConfig: {
    headers: {
      'X-Auth-Token': process.env.SOCCER_GO_API_KEY || '',
      'X-Response-Control': 'full',
    },
  },
  figletFont: 'Slant',
};
