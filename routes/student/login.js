/**
 * 用例说明
 * by 周焕祥
 * 2016/12/6
 *
 * get '/student/login'
 *   若没有登录
 *   返回
 *   {
 *      status: 'login'
 *   }
 *   若已经登录(重复登录)
 *   {
 *      status: 'loginTwice'
 *   }
 *
 * post '/student/login'
 *   输入的表单
 *   {
 *      username,
 *      password
 *   }
 *   验证成功，返回
 *   {
 *      status: 'success'
 *   }
 *   验证失败，返回
 *   {
 *      status: 'failed'
 *   }
 *
 */

var wrapper = require('../../tools/wrapper');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var utf8 = require('utf8');
var router = express.Router();
var Student = require('../../Models/Student');
var Course = require('../../Models/Course');
var accountHandler = require('../../handler/account_handler');
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });


router.get('/', function (req, res, next) {
  Student.findOne({openid: req.session.openid}, function (err, doc) {
    if (err){
      next(err);
      return;
    }
    if (doc){
      res.render('student/login', {
        status: 'loginTwice'
      });
    }
    else{
      res.render('student/login', {
        status: 'login'
      });
    }
  });
});

router.post('/', urlencodedParser, function (req, res, next) {
  var requestData = {
    apikey: "",
    apisecret: "",
    username: utf8.encode(req.body.studentId),
    password: utf8.encode(req.body.password)
  };
  request({
    method: 'POST',
    url: 'http://se.zhuangty.com:8000/users/register',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(requestData)
  }, function (err, response, body) {
    if (err){
      next(err);
      return;
    }
    if (response.statusCode === 200){
      var jsonBody = JSON.parse(body);
      var student = {
        openid: req.session.openid,
        studentnumber: jsonBody.information.studentnumber,
        realname: jsonBody.information.realname,
        position: jsonBody.information.position,
        department: jsonBody.information.department,
        email: jsonBody.information.email,
        course: [],
        no_ddl: [],
        no_document: [],
        no_notice: [],
        no_hwk: []
      };
      var studentObj = new Student(student);
      studentObj.save(function (err) {
        if (err){
          next(err);
          return;
        }
        accountHandler.updateCourseDb(student);
      });
      res.render('student/login', {
        status: 'success'
      });
    } else {
      res.render('student/login', {
        status: 'failed'
      });
    }
  });
});

module.exports = router;