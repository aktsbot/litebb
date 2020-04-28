const { Board, Post, User, Reply } = require('../models');
const { makeSlug, displayDateTime, displayDate } = require('../helpers');

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
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page * limit) - limit;

    const repliesQuery = Reply.findAll({
      where: {
        postId: post.id
      },
      attributes: ['id', 'content', 'createdAt', 'createdByUser'],
      offset: skip,
      limit: limit,
      include: [
        {
          model: User,
          as: 'replied_by',
          attributes: ['id', 'username']
        },
      ]
    });

    const countQuery = Reply.count({
      where: {
        postId: post.id
      }
    })

    const [replies, count] = await Promise.all([repliesQuery, countQuery])

    const pages = Math.ceil(count / limit); // no replies would make it 0 

    const formattedReplies = replies.map(r => {
      const replyObject = JSON.parse(JSON.stringify(r));
      const newReply = { ...replyObject };
      newReply.createdAtFormatted = displayDateTime(newReply.createdAt);
      return newReply;
    })
    console.log(formattedReplies)
    // console.log(JSON.stringify(replies), '<<- replies')

    res.render('post', { title: post.name, post, replies: formattedReplies, page, pages, count });
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