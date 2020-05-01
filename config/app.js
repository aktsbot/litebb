module.exports = {
  "development": {
    "dialect": "sqlite",
    "storage": "./dbs/litebb.app.db.development.sqlite"
  },
  "test": {
    "dialect": "sqlite",
    "storage": "./dbs/litebb.app.db.test.sqlite"
  },
  "production": {
    "dialect": "sqlite",
    "storage": "./dbs/litebb.app.db.production.sqlite"
  }
};
