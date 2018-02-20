export default {
  axiosConfig: {
    headers: {
      'X-Response-Control': 'full',
      'X-Auth-Token': process.env.SOCCER_CLI_API_KEY || '',
    },
  },
  apiBaseUrl: 'http://football-data.org/v1/teams/',
};
