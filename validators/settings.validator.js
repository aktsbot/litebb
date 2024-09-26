const joi = require("joi");

const createNewBoard = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    console.log(error.details);
    req.flash(
      "error",
      error.details.map((err) => err.message),
    );
    res.render("new_board", {
      title: "New Board",
      body: req.body,
      flashes: req.flash(),
    });
    return;
  } else {
    req.xop = {
      name: value.name,
      description: value.description,
    };
    next();
  }
};

module.exports = {
  createNewBoard,
};

