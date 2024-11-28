const { Board, Post, User, Reply } = require("../models");
const { makeSlug, displayDateTime, convertMdToHTML } = require("../helpers");

const getNewPostPage = async (req, res, next) => {
  try {
    const board = await Board.findOne({
      where: {
        slug: req.params.board_slug,
      },
      attributes: ["id", "name"],
    });

    if (!board) {
      const err = {
        message: "Board not found!",
        status: 404,
      };
      next(err);
      return;
    }

    const breadcrumbData = [
      { link: "/", name: "Index" },
      { link: `/b/${req.params.board_slug}`, name: board.name },
      { name: "New Post" },
    ];

    res.render("new_post", { title: "New Post", board, breadcrumbData });
    return;
  } catch (e) {
    console.log(e);
    next(e);
    return;
  }
};

const createPost = async (req, res, next) => {
  try {
    const board_id = req.params.board_id;
    const post = {
      name: req.body.name,
      content: req.body.content,
      renderedContent: "",
      slug: makeSlug(req.body.name),
      boardId: board_id,
      createdByUser: req.session.user.id,
    };

    post.renderedContent = convertMdToHTML(post.content);

    const newPost = await Post.create(post);

    if (!newPost) {
      req.flash("error", ["Could not create post"]);
      res.render("new_post", {
        title: "New Post",
        body: req.body,
        flashes: req.flash(),
      });
      return;
    }

    res.redirect(`/p/${post.slug}`);
    return;
  } catch (e) {
    console.log(e);
    next(e);
    return;
  }
};

const getPostPage = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: {
        slug: req.params.post_slug,
      },
      attributes: [
        "id",
        "name",
        "content",
        "renderedContent",
        "boardId",
        "createdByUser",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username"],
        },
        {
          model: Board,
          as: "board",
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    if (!post) {
      const err = {
        message: "Post not found!",
        status: 404,
      };
      next(err);
      return;
    }

    post.createdAtFormatted = displayDateTime(post.createdAt);
    post.updatedAtFormatted = displayDateTime(post.updatedAt);

    // get paginated replies in board too
    // console.log(JSON.stringify(post), displayDateTime(post.createdAt), '<<- post')
    const page = req.query.page || 1;
    const limit = 10;
    const skip = page * limit - limit;

    const repliesQuery = Reply.findAll({
      where: {
        postId: post.id,
      },
      attributes: ["id", "content", "createdAt", "createdByUser"],
      offset: skip,
      limit: limit,
      include: [
        {
          model: User,
          as: "replied_by",
          attributes: ["id", "username"],
        },
      ],
    });

    const countQuery = Reply.count({
      where: {
        postId: post.id,
      },
    });

    const [replies, count] = await Promise.all([repliesQuery, countQuery]);

    const pages = Math.ceil(count / limit); // no replies would make it 0

    const formattedReplies = replies.map((r) => {
      const replyObject = JSON.parse(JSON.stringify(r));
      const newReply = { ...replyObject };
      newReply.createdAtFormatted = displayDateTime(newReply.createdAt);
      return newReply;
    });
    // console.log(formattedReplies)
    // console.log(JSON.stringify(replies), '<<- replies')

    const breadcrumbData = [
      { link: "/", name: "Index" },
      { link: `/b/${post.board.slug}`, name: post.board.name },
      { name: post.name },
    ];

    res.render("post", {
      title: post.name,
      post,
      replies: formattedReplies,
      page,
      pages,
      count,
      skip,
      breadcrumbData,
    });
    return;
  } catch (e) {
    console.log(e);
    next(e);
    return;
  }
};

const getPostEditPage = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: {
        slug: req.params.post_slug,
      },
      attributes: [
        "id",
        "name",
        "content",
        "boardId",
        "createdByUser",
        "createdAt",
      ],
      include: [
        {
          model: Board,
          as: "board",
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    if (!post) {
      res.redirect("/");
      return;
    }

    if (post.createdByUser !== req.session.user.id) {
      res.redirect("/");
      return;
    }

    const breadcrumbData = [
      { link: "/", name: "Index" },
      { link: `/b/${post.board.slug}`, name: post.board.name },
      { name: "Edit Post" },
    ];

    res.render("edit_post", { title: "Edit Post", post, breadcrumbData });
    return;
  } catch (e) {
    console.log(e);
    next(e);
    return;
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.post_id,
        createdByUser: req.session.user.id,
      },
      attributes: ["id", "slug"],
    });

    if (!post) {
      res.redirect("/");
      return;
    }

    post.content = req.xop.content;
    post.renderedContent = convertMdToHTML(post.content);

    await post.save();

    res.redirect(`/p/${post.slug}`);
    return;
  } catch (e) {
    console.log(e);
    next(e);
    return;
  }
};

module.exports = {
  getNewPostPage,
  createPost,
  getPostPage,
  getPostEditPage,
  updatePost,
};

