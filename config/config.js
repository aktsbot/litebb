module.exports = {
  port: process.env.PORT,
  sessionSecret: process.env.SESSION_SECRET,
  firstRun: process.env.FIRST_RUN || false,
  smtp: {
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    port: process.env.SMTP_PORT,
    host: process.env.SMTP_HOST,
  },
};
