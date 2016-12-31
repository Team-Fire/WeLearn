var wrapper = require('../../tools/wrapper');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var utf8 = require('utf8');
var router = express.Router();
var Student = require('../../Models/Student');
var Course = require('../../Models/Course');
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function (req, res, next) {
  res.render('admin/index', {
    status: 'notLogin'
  });
});

router.post('/', function (req, res, next) {
  if (req.body.name === 'admin' && req.body.password === 'admin'){
    res.json({status: 'loginSuccess'});
  }else{
    res.json({status: 'loginFail'});
  }
});

router.get('/students', function (req, res, next) {
  Student.find({position: ''}, function (err, students) {
    res.json({
      status: 'students',
      students: students
    })
  })
});

router.get('/teachers', function (req, res, next) {
  Student.find({position: 'teacher'}, function (err, teachers) {
    res.json({
      status: 'students',
      students: teachers
    })
  })
});

router.get('/course', function (req, res, next) {
  Student.find({}, function (err, courses) {
    res.json({
      status: 'courses',
      courses: courses
    })
  })
});