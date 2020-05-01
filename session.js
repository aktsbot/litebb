const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const env = process.env.NODE_ENV || 'development';
const config = require('./config/session.js')[env];

//
// Session configuration
//
const sequelizeSessionDB = new Sequelize(config.database, config.username, config.password, config);

const sessionStore = new SequelizeStore({
  db: sequelizeSessionDB
});

// make sure that Session tables are in place
sessionStore.sync();

module.exports = session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    // secure: true // requires HTTPS connection
  }
});
