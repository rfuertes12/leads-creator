import axios from 'axios';

const API_URL = 'https://apollo-api-pro.p.rapidapi.com/page';
const API_HOST = 'apollo-api-pro.p.rapidapi.com';
const API_KEY = process.env.APOLLO_API_KEY;

export const fetchLeads = async (params) => {
  const res = await axios.get(API_URL, {
    headers: {
      'x-rapidapi-host': API_HOST,
      'x-rapidapi-key': API_KEY,
    },
    params,
  });
  return res.data.people || [];
};