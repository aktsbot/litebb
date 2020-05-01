const { Board, Post, User, Reply } = require('../models');
const { displayDate } = require('../helpers');

const getIndexPage = async (req, res, next) => {
  try {

    const boards = await Board.findAll({
      attributes: ['id', 'name', 'slug', 'description']
    });

    // get latest 15 posts and links to them
    const posts = await Post.findAll({
      attributes: ['id', 'slug', 'name', 'createdAt'],
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 15,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        },
        {
          model: Board,
          as: 'board',
          attributes: ['id', 'name']
        }
      ]
    })

    const results = JSON.parse(JSON.stringify(posts));
    const datedPosts = results.map(p => ({
      ...p,
      created_date_formatted: displayDate(p.createdAt)
    }))

    // console.log(datedPosts)
    res.render('index', { title: 'Home', boards, posts: datedPosts });
    return;
  } catch (e) {
    console.log(e);
    next(e);
    return;
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
    // wesbos :)
    const page = req.query.page || 1;
    const limit = 25;
    const skip = (page * limit) - limit;

    const postsQuery = Post.findAll({
      where: {
        boardId: board.id
      },
      attributes: ['id', 'slug', 'name', 'createdAt'],
      order: [
        ['createdAt', 'DESC']
      ],
      offset: skip,
      limit: limit,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        },
        {
          model: Board,
          as: 'board',
          attributes: ['id', 'name']
        }
      ]
    })

    const countQuery = Post.count({
      where: {
        boardId: board.id
      },
    })

    const [posts, count] = await Promise.all([postsQuery, countQuery])

    const pages = Math.ceil(count / limit);

    const results = JSON.parse(JSON.stringify(posts));
    const datedPosts = results.map(p => ({
      ...p,
      created_date_formatted: displayDate(p.createdAt)
    }))

    res.render('board', { title: board.name, posts: datedPosts, page, pages, count });
    return;
  } catch (e) {
    console.log(e)
    next(e);
    return;
  }
}


module.exports = {
  getIndexPage,
  getBoardIndexPage,
}