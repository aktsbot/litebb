const loginForm = (req, res) => {
  res.render('login', { title: 'Log In' });
}

const signUpForm = (req, res) => {
  res.render('signup', { title: 'Sign Up' });
}

const forgotPasswordForm = (req, res) => {
  res.render('forgot_password', { title: 'Forgot Password' });
}


module.exports = {
  loginForm,
  signUpForm,
  forgotPasswordForm
}