var muk = require('muk');
var supertest = require("supertest");
should = require('should');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Student = require('../../Models/Student');
var Course = require('../../Models/Course');
var Message = require('../../Models/Message');
var dbURI    = 'mongodb://localhost/welearndb_test';
var clearDB  = require('mocha-mongoose')(dbURI);

var path = require('path');
var express = require('express');
var session = require('express-session');
var teacherMessage = require('../teacher/message');
var app = express();
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'ejs');
app.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
app.use(function (req, res, next) {
  req.session.openid = '-1';
  next();
});

app.use('/teacher/message', teacherMessage);
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

describe('GET /teacher/message/:courseid/:studentOpenid', function () {
  before(function () {
    muk(Student,  'findOne', function (query, callback) {
      if (query.openid === '1'){
        var result = {
          realname: 'zhx'
        };
        callback(undefined, result);
      }else {
        callback(new Error(), undefined);
      }
    });
    muk(Message, 'find', function (query, callback) {
      if (query.course === '1'){
        var result = [];
        callback(undefined, result);
      }else{
        callback(new Error(), undefined);
      }
    });
  });

  it('should return teacher messages', function (done) {
    var app1 = express();
    app1.set('views', path.join(__dirname, '../../views'));
    app1.set('view engine', 'ejs');
    app1.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
    app1.use(function (req, res, next) {
      req.session.openid = '1';
      next();
    });
    app1.use('/teacher/message', teacherMessage);
    app1.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app1)
      .get('/teacher/message/1/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.text.should.be.equal('{"messages":[],"student":"zhx","status":"messages"}');
        done();
      });
  });
  it('should return error page', function (done) {
    var app2 = express();
    app2.set('views', path.join(__dirname, '../../views'));
    app2.set('view engine', 'ejs');
    app2.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
    app2.use(function (req, res, next) {
      req.session.openid = '2';
      next();
    });
    app2.use('/teacher/message', teacherMessage);
    app2.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app2)
      .get('/teacher/message/1/0')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.status.should.be.equal(500);
        done();
      });
  });

  after(function () {
    muk.restore();
  });
});

describe('GET /teacher/message/:courseid/:studentOpenid', function () {
  it('should return return a render teacher message page', function (done) {
    var app1 = express();
    app1.set('views', path.join(__dirname, '../../views'));
    app1.set('view engine', 'ejs');
    app1.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
    app1.use(function (req, res, next) {
      req.session.studenid = '1';
      req.session.course = '0';
      next();
    });
    app1.use('/teacher/message', teacherMessage);
    app1.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app1)
      .get('/teacher/message/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.text.should.be.startWith('<!DOCTYPE html>');
        done();
      });
  });
});

describe('POST /teacher/message', function (done) {

  it('should return json with send message', function (done) {
    var app1 = express();
    app1.set('views', path.join(__dirname, '../../views'));
    app1.set('view engine', 'ejs');
    app1.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
    app1.use(function (req, res, next) {
      req.session.openid = '1';
      next();
    });
    app1.use('/teacher/message', teacherMessage);
    app1.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app1)
      .post('/teacher/message')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({student: '2014011909', course:'invalid', msgBody: 'balabala'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.text.should.be.equal('{"status":"msgSend"}');
        done();
      });
  });

});
