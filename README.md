# liteBB

liteBB is a very tiny BBS/forum written in Node.js. 

It's goals are
- To have **No frontend JavaScript**. Everything is server-side rendered.
- To be small and fast.
- To have a code-base that can be easily understood by newcomers to the 
language.
- To be easy to deploy. ie. less or no moving parts.

**Note:** The choice of sequelize is that, if you, the user 
decide, you want a bigger database powering your community 
discussions, you can change it just like that, in the config.
SQLite was chosen because its fits my
needs perfectly. 

P.S the name `liteBB` comes from SQ`Lite` and oh! there's a live instance running
on https://litebb.aktsbot.in/

## Warning:

- This is very much pre-pre-pre-alpha software. It is incomplete!
- Editing posts and replies have yet to be done.
- Forgot password is yet to be done. I have an idea of setting up my own
email server. If that fails, I'll choose any one of the commonly available
methods. If you have a suggestion, holla over at the Issues tab.
- This was hacked together over at weekends, so expect things to break!
- Thank you for not closing your browser tab.
- The Issue tab will be filled with leftover TODOs in a few days.

## Installation

```
$ git clone --depth=1 https://github.com/aktsbot/litebb litebb
$ cd litebb
$ npm i
$ ./node_modules/.bin/sequelize db:migrate  
$ cp example.env .env
$ # change the values in .env
$ npm start 
```

## The idea and the first run

### The idea / walkthrough

- The forum has boards.
- Boards have posts.
- Posts have replies.
- Every user has a unique `username`.
- Only `admin` users can create Boards.
- `regular` users can create posts and replies.
- `admin`s have access to the Settings page.
- From the settings page, one can control the world.

### The first run

- In the `.env` file, if there is a `FIRST_RUN=1` entry,
then users created while the app is running are `admin`s.
- So ideally when you set the forum up, have `FIRST_RUN=1` in 
the `.env` file. Then create your admin user.
- Stop the server. Comment out `FIRST_RUN=1` or remove it and then
restart the server.
- I understand, this isn't ideal, but the software will be improved on.  

## Hacking

0.  SQLite is the star here. So have the `sqlite3` binary installed on our 
    machine. For a GUI tool, there's [sqlitebrowser](https://sqlitebrowser.org/). 
    If you're using the `sqlite3` binary, having the following in 
    `$HOME/.sqliterc` helps.
    ```
    .header on
    .mode column  
    ```

1.  We'll need node.js installed on our machine. This is a node
    project after all. Also it helps, to install some tools like the 
    `sequelize` cli globally.

    ```
    export NPM_PACKAGES=$HOME/.npm                                                  
    export NODE_PATH="$NPM_PACKAGES/lib/node_modules:$NODE_PATH"                    
    export PATH=$NPM_PACKAGES/bin:$HOME/bin:$PATH 
    ```

    I don't like to `sudo npm i -g package`. With the above 3 lines in our `$HOME/.profile`, we could do the same without sudo. `$ npx sequelize` works too, but hey!

2.  We make use of the `sequelize` cli, if one does not like installing packages
    globally, just add an alias to our `$HOME/.bashrc`. This is what I have

    ```
    alias sequelize="node_modules/.bin/sequelize" 
    ```

3.  To start the app in debug mode

    ```
    $ DEBUG=litebb:* npm start
    ```

4. Sequelize cheatsheet, shamelessly ripped off from their [README](https://github.com/sequelize/cli#usage)
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
5.  The app and session databases will be generated in `./dbs`.

## Models/Schema

```
Boards
------
id
name
description
slug
createdAt
updatedAt


Posts
-----
id
name
content
slug
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


Users
-----
id
username
email
passwordHash
role
createdAt
updatedAt
```


## Thanks
- This software was influenced by writings of [Nikita Prokopov](https://tonsky.me/blog/disenchantment/) and [Matt Reyer](https://javascript.works-hub.com/learn/a-javascript-free-frontend-61275). Thank you both for the teachings.
- The styling of the forum is borrowed from [Slimvoice](https://slimvoice.co/), with accents from [ubuntu](https://design.ubuntu.com/brand/colour-palette/). Without them, liteBB wouldn't exist.
- This project was generated with the wonderful [express-generator](https://expressjs.com/en/starter/generator.html) cli.
- The amazing wesbos for his [Learn-Node](https://github.com/wesbos/Learn-Node) repo.
- https://handyman.dulare.com/session-management-in-express/
- https://github.com/sequelize/express-example
- https://www.npmjs.com/package/connect-session-sequelize


