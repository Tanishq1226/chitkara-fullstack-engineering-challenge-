require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

module.exports = {
  USER_ID: process.env.USER_ID || 'tanishq_2310991226',
  EMAIL_ID: process.env.EMAIL_ID || 'tanishq1226.be23@chitkara.edu.in',
  COLLEGE_ROLL_NUMBER: process.env.COLLEGE_ROLL_NUMBER || '2310991226',
  PORT: process.env.PORT || 3000
};
