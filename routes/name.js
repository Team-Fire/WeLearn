/*
by 秦堤
2016-12-27
get '/name/student' {openid: }
  返回：
  {
    name: ''        //学生的名字
  }

get '/name/teacher' {course: }
  返回：
  {
    teacher: [{
      name: ,       //老师的名字
      openid:       //老师的openid
    }]
  }
*/

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Student = require('../Models/Student');
var Course = require('../Models/Course');
var setting = require('../setting');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/student', function (req, res, next) {
  Student.findOne({openid: req.body.openid}, function (err, doc) {
    if (err){
      next(err);
      return;
    }
    var name = doc? (doc.realname) : [];
    res.json({
      name: name
    });
  });
});

router.get('/teacher', function (req, res, next) {
  Course.findOne({coursename: req.body.course}, function (err, doc) {
    if (err){
      next(err);
      return;
    }
    var teacher = doc? (doc.teacher) : [];
    res.json({
      teacher: teacher
    });
  });
});

module.exports = router;