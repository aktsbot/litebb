const siteName = 'liteBB';

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const makeRandomId = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const makeSlug = (name) => {
  const id = makeRandomId(5).toLowerCase();
  const urlName = name.toLowerCase().replace(/ /g, '-');

  return `${urlName}-${id}`;
}

module.exports = {
  siteName,
  makeRandomId,
  makeSlug
}