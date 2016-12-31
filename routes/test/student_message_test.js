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
var studentMessage = require('../student/message');
var app = express();
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'ejs');
app.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
app.use(function (req, res, next) {
  req.session.openid = '-1';
  next();
});

app.use('/student/message', studentMessage);
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

describe('GET /student/message', function () {
  before(function () {
    muk(Student,  'findOne', function (query, callback) {
      if (query.openid === '1'){
        var result = {
          course: ['course1', 'course2']
        };
        callback(undefined, result);
      }else if (query.openid === '2'){
        callback(new Error(), undefined);
      } else if (query.openid === '3'){
        callback(undefined, undefined);
      }
    })
  });

  it('should return login page', function (done) {
    var app1 = express();
    app1.set('views', path.join(__dirname, '../../views'));
    app1.set('view engine', 'ejs');
    app1.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
    app1.use(function (req, res, next) {
      req.session.openid = '1';
      next();
    });
    app1.use('/student/message', studentMessage);
    app1.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app1)
      .get('/student/message')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.text.should.be.startWith('<!DOCTYPE html>');
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
    app2.use('/student/message', studentMessage);
    app2.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app2)
      .get('/student/message')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.status.should.be.equal(500);
        done();
      });
  });
  it('should return error page', function (done) {
    var app3 = express();
    app3.set('views', path.join(__dirname, '../../views'));
    app3.set('view engine', 'ejs');
    app3.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
    app3.use(function (req, res, next) {
      req.session.openid = '3';
      next();
    });
    app3.use('/student/message', studentMessage);
    app3.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app3)
      .get('/student/message')
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


describe('GET student/message/course_list', function () {
  before(function () {
    muk(Student,  'findOne', function (query, callback) {
      if (query.openid === '1'){
        var result = {
          course: ['course1', 'course2']
        };
        callback(undefined, result);
      }else if (query.openid === '2'){
        callback(new Error(), undefined);
      } else if (query.openid === '3'){
        callback(undefined, undefined);
      }
    })
  });

  it('should return course list', function (done) {
    var app1 = express();
    app1.set('views', path.join(__dirname, '../../views'));
    app1.set('view engine', 'ejs');
    app1.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
    app1.use(function (req, res, next) {
      req.session.openid = '1';
      next();
    });
    app1.use('/student/message/course_list', studentMessage);
    app1.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app1)
      .get('/student/message/course_list')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.text.should.be.startWith('<!DOCTYPE html>');
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
    app2.use('/student/message', studentMessage);
    app2.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app2)
      .get('/student/message/course_list')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.status.should.be.equal(500);
        done();
      });
  });
  it('should return error page', function (done) {
    var app3 = express();
    app3.set('views', path.join(__dirname, '../../views'));
    app3.set('view engine', 'ejs');
    app3.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
    app3.use(function (req, res, next) {
      req.session.openid = '3';
      next();
    });
    app3.use('/student/message', studentMessage);
    app3.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app3)
      .get('/student/message/course_list')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.text.should.be.equal('{"courses":[],"status":"courses"}');
        done();
      });
  });

  after(function () {
    muk.restore();
  })
});


describe('GET student/message/msg_list/:coursename', function () {
  before(function () {
    muk(Message,  'find', function (query, callback) {
      if (query.student === '1'){
        var result = {
          course: []
        };
        callback(undefined, result);
      }else if (query.student === '2'){
        callback(new Error(), undefined);
      }
    })
  });

  it('should return message list', function (done) {
    var app1 = express();
    app1.set('views', path.join(__dirname, '../../views'));
    app1.set('view engine', 'ejs');
    app1.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
    app1.use(function (req, res, next) {
      req.session.openid = '1';
      next();
    });
    app1.use('/student/message', studentMessage);
    app1.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app1)
      .get('/student/message/msg_list/coursename')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.text.should.be.startWith('{"messages":{"course":[]},"status":"messages"}');
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
    app2.use('/student/message', studentMessage);
    app2.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app2)
      .get('/student/message/msg_list/coursename')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.status.should.be.equal(500);
        done();
      });
  });

  after(function () {
    muk.restore();
  })
});

describe('POST /student/message', function (done) {
  before(function () {
    muk(Student,  'findOne', function (query, callback) {
      if (query.openid === '1'){
        var result = {
          course: []
        };
        callback(undefined, result);
      }else{
        callback(new Error(), undefined);
      }
    })
  });

  it('should return json with send message', function (done) {
    var app1 = express();
    app1.set('views', path.join(__dirname, '../../views'));
    app1.set('view engine', 'ejs');
    app1.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
    app1.use(function (req, res, next) {
      req.session.openid = '1';
      next();
    });
    app1.use('/student/message', studentMessage);
    app1.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app1)
      .post('/student/message')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({course: '2014011909', msgBody:'invalid'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.text.should.be.equal('{"status":"msgSend"}');
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
    app2.use('/student/message', studentMessage);
    app2.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });
    supertest(app2)
      .post('/student/message')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({course: '2014011909', msgBody:'invalid'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        res.status.should.be.equal(500);
        done();
      });
  });

  after(function () {
    muk.restore();
  })
});
