var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var url = require('url');
var cookieParser = require('cookie-parser');
var oauth = require('./handler/oauth_handler');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/welearndb');
mongoose.connection.on('open', function () {
  console.log('Mongodb is connected.');
});

var wechat = require('./routes/wechat');
var studentLogin = require('./routes/student/login');
var studentSchedule = require('./routes/student/schedule');
var studentLesson = require('./routes/student/course');
var studentMessage = require('./routes/student/message');
var teacherMessage = require('./routes/teacher/message');
var studentNotice = require('./routes/student/notice');
var teacherNotice = require('./routes/teacher/notice');
var message = require('./routes/message');
var getName = require('./routes/name');

var app = express();
app.listen(80);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.query());
app.use(session({
  maxAge: 18000000000,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(function (req, res, next) {
  if (req.session.openid){
    next();
  }else{
    var code = url.parse(req.url, true).query['code'];
    if (code){
      oauth.client.getAccessToken(code, function (err, result) {
        req.session.openid = result.data.openid;
        // console.log('---New Guest---');
        // console.log(req.session.openid);
        next();
      });
    }else{
      req.session.openid = 'invalid';
      next();
    }
  }
});

app.use('/wechat', wechat);
app.use('/name', getName);
app.use('/message', message);
app.use('/student/login', studentLogin);
app.use('/student/course', studentLesson);
app.use('/student/schedule', studentSchedule);
app.use('/student/message', studentMessage);
app.use('/teacher/message', teacherMessage);
app.use('/student/notice', studentNotice);
app.use('/teacher/notice', teacherNotice);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// var dataInsert = require('./tools/data_insert');
// dataInsert();

// 数据库操作
var Student = require('./Models/Student');
var Course = require('./Models/Course');
var Message = require('./Models/Message');
var Notice = require('./Models/Notice');
// Student.remove({}, function (err, doc) {});
// Course.remove({}, function (err, doc) {});
// Message.remove({}, function (err, doc) {});
// Notice.remove({}, function (err, doc) {});

// Student.find({}, function (err, doc) {
//   console.log('---Student---');
//   console.log(doc);
// });
// Course.find({}, function (err, doc) {
//   console.log('---Course---');
//   console.log(doc);
// });
// Notice.find({}, function (err, doc) {
//   console.log('---Notice---');
//   console.log(doc);
// });
// Message.find({}, function (err, doc) {
//   console.log('---Message---');
//   console.log(doc);
// });

//设置 menu
// var menu_control = require('./handler/menu_control');
// menu_control.update_menu();

