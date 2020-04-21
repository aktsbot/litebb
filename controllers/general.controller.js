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

const getBoardIndexPage = async (req, res, next) => {
  try {

    const board = await Board.findOne({
      where: {
        slug: req.params.board_slug
      },
      attributes: ['id', 'name']
    });

    // get paginated posts in board too

    res.render('board', { title: board.name });
    return;
  } catch (e) {
    console.log(e)
    return res.send('b0rk')
  }
}

module.exports = {
  getIndexPage,
  getBoardIndexPage
}