'use strict';

const { convertMdToHTML } = require('../helpers');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const posts = await queryInterface.sequelize.query(`SELECT Posts.content, Posts.id, Posts.slug from Posts;`)
    for (const p of posts[0]) { // posts[1] is the query that got executed
      const html = convertMdToHTML(p.content)
      const update_query = `UPDATE Posts SET renderedContent='${html}' where id=${p.id};`;
      console.log(`[*] updating -- ${p.id} -- ${p.slug}`)
      await queryInterface.sequelize.query(update_query);
    }
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.sequelize.query(`UPDATE Posts SET renderedContent='';`)
  }
};


