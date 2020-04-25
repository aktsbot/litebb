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

const displayDateTime = (d) => {
  const dateUTC = new Date(d).toUTCString();
  const dateUTC_splits = dateUTC.split(' ');
  // [ "Sat,", "25", "Apr", "2020", "06:52:01", "GMT" ]
  const hm_splits = dateUTC_splits[4].split(':');
  hm_splits.pop() // 01 gone
  const hm = hm_splits.join(':');

  return `${dateUTC_splits[1]} ${dateUTC_splits[2]} ${dateUTC_splits[3]}, ${hm} ${dateUTC_splits[5]}`;
}

module.exports = {
  siteName,
  makeRandomId,
  makeSlug,
  displayDateTime,
}