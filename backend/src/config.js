// config.js
const isDevelopment = window.location.hostname === 'localhost';

const API_URL = isDevelopment
  ? 'https://jokidins-production.up.railway.app'
  : 'https://jokidins-production.up.railway.app';

export default API_URL;