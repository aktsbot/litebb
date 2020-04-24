const { Board, Post } = require('../models');
const { makeSlug } = require('../helpers');

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

const getNewPostPage = async (req, res, next) => {
  try {

    const board = await Board.findOne({
      where: {
        slug: req.params.board_slug
      },
      attributes: ['id', 'name']
    });

    // get paginated posts in board too

    res.render('new_post', { title: 'New Post', board });
    return;
  } catch (e) {
    console.log(e)
    return res.send('b0rk')
  }
}

const createPost = async (req, res, next) => {
  try {
    const board_id = req.params.board_id;
    const post = {
      name: req.body.name,
      content: req.body.content,
      slug: makeSlug(req.body.name),
      boardId: board_id,
      createdByUser: req.session.user.id
    };

    const newPost = await Post.create(post);

    if (!newPost) {
      req.flash('error', ['Could not create post']);
      res.render('new_post', { title: 'New Post', body: req.body, flashes: req.flash() });
      return;
    }

    res.redirect(`/p/${post.slug}`);
    return;
  } catch (e) {
    console.log(e)
    return res.send('b0rk')
  }
}

module.exports = {
  getIndexPage,
  getBoardIndexPage,
  getNewPostPage,
  createPost
}