import dotenv from 'dotenv';
dotenv.config({ quiet: true });

export const loginTestData = {
  Url: process.env.BASE_URL || 'https://fastenerpilot.com/',
  customerLogin: {
    Email: process.env.TEST_USER_EMAIL || '',
    Password: process.env.TEST_USER_PASSWORD || '',
  },
};

export default loginTestData;
