const { Board, Post, User } = require('../models');
const { displayDateTime } = require('../helpers');

const getNewReplyPage = async (req, res, next) => {
  try {

    const post = await Post.findOne({
      where: {
        slug: req.params.post_slug
      },
      attributes: ['id', 'name', 'content', 'createdAt'],
      include: [
        {
          model: Board,
          as: 'board',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        },
      ]
    })

    post.createdAtFormatted = displayDateTime(post.createdAt);

    res.render('new_reply', { title: 'New Reply', post });
    return;
  } catch (e) {
    console.log(e)
    return res.send('b0rk')
  }
}

module.exports = {
  getNewReplyPage
}