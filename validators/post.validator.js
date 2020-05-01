const joi = require('joi')

const createPost = (req, res, next) => {

  const schema = {
    content: joi
      .string()
      .required(),
    name: joi
      .string()
      .required(),
  };

  const { error, value } = joi.validate(req.body, schema);

  if (error) {
    console.log(error.details)
    req.flash('error', error.details.map(err => err.message));
    res.render('new_post', { title: 'New Post', body: req.body, flashes: req.flash() });
    return;
  } else {
    req.xop = {
      content: value.content,
      name: value.name,
    };
    next();
  }
};

module.exports = {
  createPost,
}