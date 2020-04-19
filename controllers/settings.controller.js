
const getSettingsPage = (req, res) => {
  res.render('settings', { title: 'Settings' });
}

module.exports = {
  getSettingsPage
}