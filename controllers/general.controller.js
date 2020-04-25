const { Board, Post, User } = require('../models');
const { makeSlug, displayDateTime } = require('../helpers');

const getIndexPage = async (req, res, next) => {
  try {

    const boards = await Board.findAll({
      attributes: ['id', 'name', 'slug', 'description']
    });

    // get latest 15 posts and links to them
    const posts = await Post.findAll({
      attributes: ['id', 'slug', 'name'],
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 15
    })

    res.render('index', { title: 'Home', boards, posts });
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

const getPostPage = async (req, res, next) => {
  try {

    const post = await Post.findOne({
      where: {
        slug: req.params.post_slug
      },
      attributes: ['id', 'name', 'content', 'boardId', 'createdByUser', 'createdAt'],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        },
        {
          model: Board,
          as: 'board',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    post.createdAtFormatted = displayDateTime(post.createdAt)

    // get paginated replies in board too
    // console.log(JSON.stringify(post), displayDateTime(post.createdAt), '<<- post')
    res.render('post', { title: post.name, post });
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
  createPost,
  getPostPage
}