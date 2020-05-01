const notFound = (req, res, next) => {
  const err = {
    status: 404,
    message: 'Not found'
  }
  next(err);
};

const errorHandler = (err, req, res, next) => {

  // set locals, only providing error in development
  res.locals.status = err.status || 500;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? (err.stack || '') : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}

module.exports = {
  errorHandler,
  notFound
}