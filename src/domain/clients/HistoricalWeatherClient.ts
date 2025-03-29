import axios from 'axios';

export default axios.create({
  baseURL: 'https://archive-api.open-meteo.com/v1/archive',
  headers: {
    'Content-type': 'application/json',
  },
});
