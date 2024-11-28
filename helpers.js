const siteName = "liteBB";

// markdown to html conversion is done
// with showdown and then passing the html
// generated to xss
const showdown = require("showdown");
const xss = require("xss");
const converter = new showdown.Converter();
// prevent a # foo from becoming <h1 id="foo">foo</h1>
converter.setOption("noHeaderId", true);
// # foo -> <h3 id="foo">foo</h3>
converter.setOption("headerLevelStart", 3);

const convertMdToHTML = (content) => {
  let html = converter.makeHtml(content);
  html = xss(html);
  return html;
};

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const makeRandomId = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const makeSlug = (name) => {
  const id = makeRandomId(5).toLowerCase();
  const urlName = name.replace(/\W+/g, " ").toLowerCase().replace(/ /g, "-");

  return `${urlName}-${id}`;
};

const displayDateTime = (d) => {
  const dateUTC = new Date(d).toUTCString();
  const dateUTC_splits = dateUTC.split(" ");
  // [ "Sat,", "25", "Apr", "2020", "06:52:01", "GMT" ]
  const hm_splits = dateUTC_splits[4].split(":");
  hm_splits.pop(); // 01 gone
  const hm = hm_splits.join(":");

  return `${dateUTC_splits[1]} ${dateUTC_splits[2]} ${dateUTC_splits[3]}, ${hm} ${dateUTC_splits[5]}`;
};

const displayDate = (d) => {
  const dateUTC = new Date(d).toUTCString();
  const dateUTC_splits = dateUTC.split(" ");
  // [ "Sat,", "25", "Apr", "2020", "06:52:01", "GMT" ]
  return `${dateUTC_splits[1]} ${dateUTC_splits[2]} ${dateUTC_splits[3]}`;
};

const truncateTitleString = (title) => {
  if (title.length <= 12) {
    return title;
  }
  let newTitle = title.substr(0, 12).trim();
  newTitle += "...";
  return newTitle;
};

module.exports = {
  siteName,
  makeRandomId,
  makeSlug,
  displayDateTime,
  displayDate,
  convertMdToHTML,
  truncateTitleString,
};

