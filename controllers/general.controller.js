const { Board } = require('../models');

const getIndexPage = async (req, res, next) => {
  try {

    const boards = await Board.findAll({
      attributes: ['id', 'name', 'slug', 'description']
    });

    res.render('index', { title: 'Home', boards });
    return;
  } catch (e) {
    console.log(e)
    return res.send('b0rk')
  }
}

module.exports = {
  getIndexPage
}