// services/apolloService.js
import axios from 'axios';

const API_URL = 'https://apollo-api-pro.p.rapidapi.com/page';
const API_HOST = 'apollo-api-pro.p.rapidapi.com';

export const fetchLeads = async (params) => {
  const { apiKey, ...query } = params;

  if (!apiKey) {
    throw new Error('API key is required');
  }

  const res = await axios.get(API_URL, {
    headers: {
      'x-rapidapi-host': API_HOST,
      'x-rapidapi-key': apiKey,
    },
    params: query,
  });

  return res.data;
};
