var muk = require('muk');
var request = require("supertest");
var should = require('should');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Student = require('../../Models/Student');
var Notice = require('../../Models/Notice');
var dbURI    = 'mongodb://localhost/welearndb_test';
var clearDB  = require('mocha-mongoose')(dbURI);

var path = require('path');
var express = require('express');
var session = require('express-session');
var teacherNotice = require('../teacher/notice');
var app = express();
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'ejs');
app.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
app.use(function (req, res, next) {
  req.session.openid = '-1';
  next();
});
app.use('/teacher/notice', teacherNotice);
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

describe('GET /teacher/notice', function () {
  before(function () {
    muk(Student,  'findOne', function (query, callback) {
      if (query.openid === '2014011909'){
        var result = {
          course: ['course1', 'course2']
        };
        callback(undefined, result);
      }else if (query.openid === '-1'){
        callback(new Error(), undefined);
      }
    })
  });

  it('should return error info', function (done) {
    var app1 = express();
    app1.set('views', path.join(__dirname, '../../views'));
    app1.set('view engine', 'ejs');
    app1.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
    app1.use(function (req, res, next) {
      req.session.openid = '-1';
      next();
    });
    app1.use('/teacher/notice', teacherNotice);
    app1.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    request(app1)
      .get('/teacher/notice')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.status.should.be.equal(500);
        done();
      });
  });
  it('should return rendered page', function (done) {
    var app2 = express();
    app2.set('views', path.join(__dirname, '../../views'));
    app2.set('view engine', 'ejs');
    app2.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
    app2.use(function (req, res, next) {
      req.session.openid = '2014011909';
      next();
    });
    app2.use('/teacher/notice', teacherNotice);
    app2.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    request(app2)
      .get('/teacher/notice/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.text.should.be.startWith('<!DOCTYPE html>');
        done();
      });
  });

  after(function () {
    muk.restore();
  })
});


describe('POST /teacher/notice', function () {
  before(function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  it('should return json (with photo)', function (done) {
    request(app)
      .post('/teacher/notice')
      .send({course: 'course1', msgHead:'balabala', msgBody:'balabala'})
      .attach('photo', 'test/fixtures/test.png')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.text.should.be.equal('{"status":"noticeSend"}');
        done();
      });
  });

  it('should return json (without photo)', function (done) {
    request(app)
      .post('/teacher/notice')
      .send({course: 'course1', msgHead:'balabala', msgBody:'balabala'})
      .attach('photo', 'test/fixtures/test.png')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.text.should.be.equal('{"status":"noticeSend"}');
        done();
      });
  });
});


