
const getSettingsPage = (req, res) => {
  res.render('settings', { title: 'Settings' });
}

const getNewBoardPage = (req, res) => {
  res.render('new_board', { title: 'New Board' });
}

module.exports = {
  getSettingsPage,
  getNewBoardPage
}