const joi = require("joi");

const createPost = (req, res, next) => {
  const schema = joi.object({
    content: joi.string().required(),
    name: joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    console.log(error.details);
    req.flash(
      "error",
      error.details.map((err) => err.message),
    );
    res.render("new_post", {
      title: "New Post",
      body: req.body,
      flashes: req.flash(),
    });
    return;
  } else {
    req.xop = {
      content: value.content,
      name: value.name,
    };
    next();
  }
};

const updatePost = (req, res, next) => {
  const schema = joi.object({
    name: joi.string(), // will not be used in the update
    content: joi.string().required(),
  });

  const post = {
    id: req.params.post_id,
    content: req.body.content,
  };

  const { error, value } = schema.validate(req.body);

  if (error) {
    console.log(error.details);
    req.flash(
      "error",
      error.details.map((err) => err.message),
    );
    res.render("edit_post", { title: "Edit Post", post, flashes: req.flash() });
    return;
  } else {
    req.xop = {
      content: value.content,
    };
    next();
  }
};

module.exports = {
  createPost,
  updatePost,
};

