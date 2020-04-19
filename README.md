```
npm install -g express-generator
express litebb
npm install sequelize sequelize-cli sqlite3
npm i express-session connect-session-sequelize
```


To start in debug mode

```
$ DEBUG=litebb:* npm start
```

```
Commands:
  sequelize db:migrate                        Run pending migrations
  sequelize db:migrate:schema:timestamps:add  Update migration table to have timestamps
  sequelize db:migrate:status                 List the status of all migrations
  sequelize db:migrate:undo                   Reverts a migration
  sequelize db:migrate:undo:all               Revert all migrations ran
  sequelize db:seed                           Run specified seeder
  sequelize db:seed:undo                      Deletes data from the database
  sequelize db:seed:all                       Run every seeder
  sequelize db:seed:undo:all                  Deletes data from the database
  sequelize db:create                         Create database specified by configuration
  sequelize db:drop                           Drop database specified by configuration
  sequelize init                              Initializes project
  sequelize init:config                       Initializes configuration
  sequelize init:migrations                   Initializes migrations
  sequelize init:models                       Initializes models
  sequelize init:seeders                      Initializes seeders
  sequelize migration:generate                Generates a new migration file       [aliases: migration:create]
  sequelize model:generate                    Generates a model and its migration  [aliases: model:create]
  sequelize seed:generate                     Generates a new seed file            [aliases: seed:create]
```

https://handyman.dulare.com/session-management-in-express/
https://github.com/sequelize/express-example
https://www.npmjs.com/package/connect-session-sequelize

- Each user needs a unique username for signing up and that's it

```
Boards
------
id
name
description
createdAt
updatedAt

Posts
-----
id
name
content
boardId
createdByUser
createdAt
updatedAt

Replies
-------
id
postId
content
createdByUser
createdAt
updatedAt
```
