var muk = require('muk');
var supertest = require("supertest");
should = require('should');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Student = require('../../Models/Student');
var Course = require('../../Models/Course');
var path = require('path');
var express = require('express');
var session = require('express-session');
var studentCourse = require('../student/course');
var app = express();
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'ejs');
app.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
app.use(function (req, res, next) {
    req.session.openid = '-1';
    next();
});
app.use('/student/course', studentCourse);
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

describe('GET /student/course', function () {
    before(function () {
        muk(Student,  'findOne', function (query, callback) {
            if (query.openid === '1'){
                callback(undefined, {studentnumber: '2014013412'});
            }else if (query.openid === '2'){
                callback(new Error(), undefined);
            }
        });
    });

    it('should return course page', function (done) {
        var app1 = express();
        app1.set('views', path.join(__dirname, '../../views'));
        app1.set('view engine', 'ejs');
        app1.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
        app1.use(function (req, res, next) {
            req.session.openid = '1';
            next();
        });
        app1.use('/student/course', studentCourse);
        app1.use(function(err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });
        supertest(app1)
            .get('/student/course')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.text.should.be.startWith('<!DOCTYPE html>');
                done();
            });
    });

    it('should return error with some error happen', function (done) {
        var app2 = express();
        app2.set('views', path.join(__dirname, '../../views'));
        app2.set('view engine', 'ejs');
        app2.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
        app2.use(function (req, res, next) {
            req.session.openid = '2';
            next();
        });
        app2.use('/student/course', studentCourse);
        app2.use(function(err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });
        supertest(app2)
            .get('/student/course')
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

describe('GET /student/notice', function () {
    before(function () {
        muk(Student,  'findOne', function (query, callback) {
            if (query.openid === '1'){
                callback(undefined, {studentnumber: '2014013412'});
            }else if (query.openid === '2'){
                callback(new Error(), undefined);
            }
        });
    });

    it('should return error with some error happen', function (done) {
        var app2 = express();
        app2.set('views', path.join(__dirname, '../../views'));
        app2.set('view engine', 'ejs');
        app2.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
        app2.use(function (req, res, next) {
            req.session.openid = '2';
            next();
        });
        app2.use('/student/course/', studentCourse);
        app2.use(function(err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });
        supertest(app2)
            .get('/student/course/2016-2017-1-34100294-0/notices')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.be.equal(500);
                done();
            });
    });

    it('should return notice page', function (done) {
        var app1 = express();
        app1.set('views', path.join(__dirname, '../../views'));
        app1.set('view engine', 'ejs');
        app1.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
        app1.use(function (req, res, next) {
            req.session.openid = '1';
            next();
        });
        app1.use('/student/course', studentCourse);
        app1.use(function(err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });
        supertest(app1)
            .get('/student/course/2016-2017-1-34100294-0/notices')
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

describe('GET /student/documents', function () {
    before(function () {
        muk(Student,  'findOne', function (query, callback) {
            if (query.openid === '1'){
                callback(undefined, {studentnumber: '2014013412'});
            }else if (query.openid === '2'){
                callback(new Error(), undefined);
            }
        });
    });

    it('should return error with some error happen', function (done) {
        var app2 = express();
        app2.set('views', path.join(__dirname, '../../views'));
        app2.set('view engine', 'ejs');
        app2.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
        app2.use(function (req, res, next) {
            req.session.openid = '2';
            next();
        });
        app2.use('/student/course/', studentCourse);
        app2.use(function(err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });
        supertest(app2)
            .get('/student/course/2016-2017-1-34100294-0/documents')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.be.equal(500);
                done();
            });
    });

    it('should return document page', function (done) {
        var app1 = express();
        app1.set('views', path.join(__dirname, '../../views'));
        app1.set('view engine', 'ejs');
        app1.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
        app1.use(function (req, res, next) {
            req.session.openid = '1';
            next();
        });
        app1.use('/student/course', studentCourse);
        app1.use(function(err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });
        supertest(app1)
            .get('/student/course/2016-2017-1-34100294-0/documents')
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

describe('GET /student/assignments', function () {
    before(function () {
        muk(Student,  'findOne', function (query, callback) {
            if (query.openid === '1'){
                callback(undefined, {studentnumber: '2014013412'});
            }else if (query.openid === '2'){
                callback(new Error(), undefined);
            }
        });
    });

    it('should return error with some error happen', function (done) {
        var app2 = express();
        app2.set('views', path.join(__dirname, '../../views'));
        app2.set('view engine', 'ejs');
        app2.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
        app2.use(function (req, res, next) {
            req.session.openid = '2';
            next();
        });
        app2.use('/student/course/', studentCourse);
        app2.use(function(err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });
        supertest(app2)
            .get('/student/course/2016-2017-1-34100294-0/assignments')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.be.equal(500);
                done();
            });
    });

    it('should return document page', function (done) {
        var app1 = express();
        app1.set('views', path.join(__dirname, '../../views'));
        app1.set('view engine', 'ejs');
        app1.use(session({ secret: 'keyboard cat', cookie: { secure: false }, resave: false, saveUninitialized: true}));
        app1.use(function (req, res, next) {
            req.session.openid = '1';
            next();
        });
        app1.use('/student/course', studentCourse);
        app1.use(function(err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });
        supertest(app1)
            .get('/student/course/2016-2017-1-34100294-0/assignments')
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