const { Board } = require('../models');

const getSettingsPage = async (req, res, next) => {
  try {

    const boards = await Board.findAll({
      attributes: ['id', 'name', 'slug']
    });

    res.render('settings', { title: 'Settings', boards });
    return;
  } catch (e) {
    console.log(e)
    return res.send('b0rk')
  }
}

const getNewBoardPage = (req, res) => {
  res.render('new_board', { title: 'New Board' });
}

const createNewBoard = async (req, res, next) => {
  try {
    const slug = req.xop.name.toLowerCase();

    // check if name is already present
    const existingBoard = await Board.findAll({
      where: {
        slug
      }
    })

    if (existingBoard.length) {
      req.flash('error', ['Board name already in use']);
      res.render('new_board', { title: 'New Board', body: req.body, flashes: req.flash() });
      return;
    }

    const board = await Board.create({
      name: req.xop.name,
      description: req.xop.description,
      slug
    });
    res.redirect('/settings');
    return;
  } catch (e) {
    console.log(e)
    return res.send('b0rk')
  }
}

module.exports = {
  getSettingsPage,
  getNewBoardPage,
  createNewBoard
}