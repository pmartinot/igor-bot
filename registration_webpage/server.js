var express = require('express');
var bodyParser = require('body-parser');
var register = require('./app/routes/register.js');
var fs = require('fs');
var flash = require('connect-flash');
var session = require('express-session');
var path = require ('path');
var app = express();

const PORT = 8080;

var path = require('path');

app.use(session({ secret: 'keyboard cat' }))
app.use(flash());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(function(req, res, next){
  res.locals.messages = req.flash();
  next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/register', register);



app.use(express.static(path.join(__dirname , 'app/view/css')));
app.use(express.static(path.join(__dirname , 'app/view/html')));




app.set('views', path.join(__dirname, 'app/view/html'));

app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res) {
  fs.readFile('/opt/chat-ops-common/c66-token.json', 'utf8', function (err,data) {
    if (err){
      res.render(__dirname + '/app/view/html/register.html', {info: req.flash("info")});
      //res.sendFile(__dirname + '/app/view/html/register.html');
    }
    else{
      fs.readFile('/opt/chat-ops-common/slack-token.json', 'utf8', function (err,data) {
        if (err) res.render(__dirname + '/app/view/html/register.html', {info: req.flash("info")});
        else res.sendfile(__dirname + '/app/view/html/success.html');
      });
    }
  });
});

app.listen(PORT);
console.log('Running on http://localhost' + PORT);
