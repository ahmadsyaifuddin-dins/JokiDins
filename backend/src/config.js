// config.js
const isDevelopment = window.location.hostname === 'localhost';

const API_URL = isDevelopment
  ? 'http://localhost:5000'
  : 'https://jokidins-production.up.railway.app';

export default API_URL;