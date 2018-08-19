const path = require('path');

const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

let videoURL = "ws://192.168.1.71:8000/live/monitor.flv";

module.exports = (app) => {

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_SESSION_KEY || 'cookie-session-key']
  }));

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../../views'));

  app.get('/', (req, res) => {
    if (process.env.MAIN_USER_USERNAME && (req.session.username === process.env.MAIN_USER_USERNAME)) {
      res.render('index', {videoURL});
      return;
    }
    res.render('login', {badDetails: false});
  });

  app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userPassword = process.env.MAIN_USER_PASSWORD;
    const userUsername = process.env.MAIN_USER_USERNAME;
    console.log(username, userUsername, password, userPassword);
    if (userUsername && userPassword && username === userUsername && bcrypt.compareSync(password, userPassword)) {
      req.session.username = username;
      res.redirect('/');
      return;
    }

    res.render('login', {badDetails: true});
  });

  app.post('/video-url', (req, res) => {
    // The pi will have to send this url to the server when it start streaming
    videoURL = req.body.wsURL;
    res.send({videoURL});
  });
};