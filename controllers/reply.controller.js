const { Board, Post, User, Reply } = require('../models');
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

const createNewReply = async (req, res, next) => {
  try {

    const post = await Post.findOne({
      where: {
        id: req.xop.postId
      },
      attributes: ['id', 'slug']
    })

    const url = `/p/${post.slug}`;

    const newReply = await Reply.create({
      postId: req.xop.postId,
      content: req.xop.content,
      createdByUser: req.session.user.id
    });

    // check if creating reply failed

    res.redirect(url);
    return;

  } catch (e) {
    console.log(e)
    return res.send('b0rk')
  }
}

module.exports = {
  getNewReplyPage,
  createNewReply
}