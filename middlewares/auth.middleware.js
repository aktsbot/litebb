const isSessionActive = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    return res.redirect('/');
  }
};

const isAdmin = (req, res, next) => {
  return true; // for now
}

module.exports = {
  isSessionActive,
  isAdmin
}

