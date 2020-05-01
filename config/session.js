module.exports = {
  "development": {
    "database": "null",
    "username": "null",
    "password": "null",
    "sessionSecret": process.env.SESSION_SECRET,
    "dialect": "sqlite",
    "storage": "./dbs/litebb.session.db.development.sqlite"
  },
  "test": {
    "database": "null",
    "username": "null",
    "password": "null",
    "sessionSecret": process.env.SESSION_SECRET,
    "dialect": "sqlite",
    "storage": "./dbs/litebb.session.db.test.sqlite"
  },
  "production": {
    "database": "null",
    "username": "null",
    "password": "null",
    "sessionSecret": process.env.SESSION_SECRET,
    "dialect": "sqlite",
    "storage": "./dbs/litebb.session.db.production.sqlite"
  }
}
