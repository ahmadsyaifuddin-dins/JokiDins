// utils/verification.js
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  function getVerificationCodeExpires(minutes) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }
  
  module.exports = { generateVerificationCode, getVerificationCodeExpires };
  