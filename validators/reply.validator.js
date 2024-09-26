const joi = require("joi");

const createNewReply = (req, res, next) => {
  const payload = {
    content: req.body.content,
    postId: req.params.post_id,
  };

  const schema = joi.object({
    content: joi.string().required(),
    postId: joi.number().required(),
  });

  const { error, value } = schema.validate(payload);

  if (error) {
    console.log(error.details);
    req.flash(
      "error",
      error.details.map((err) => err.message),
    );
    res.render("new_reply", {
      title: "New Reply",
      body: req.body,
      flashes: req.flash(),
    });
    return;
  } else {
    req.xop = {
      content: value.content,
      postId: value.postId,
    };
    next();
  }
};

module.exports = {
  createNewReply,
};

