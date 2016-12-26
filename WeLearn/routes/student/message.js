/**
接口说明
 by 周焕祥
 2016/12/6

get '/student/message'          （有改动）
返回实例(课程列表)
  返回：
  {
    status: 'courses'，
    courses: ['软工3（第xx 学期）'，'计网1（第xx 学期）']    //课程数组
  }

post '/student/message'
发送消息
  表单输入：
  {
    course,     //课程名
    msgHead,    //消息标题
    msgBody     //消息内容
  }
  返回：
  {
    status: 'msgSend'
  }

get '/student/message/msg_list/123456'
获得 courseid 为 '123456' 的课程里, 该用户与老师的所有谈话记录
  返回：
  {
    status: 'messages',
    messages: [{  _id: 5846299d02145b150c349fe0,
                  toTeacher: true,
                  student: 'o3HdVwWHa0uJNuNLQ7u_1Tf0VEng',
                  course: '136947',
                  msgHead: '关于一个问题',
                  msgBody: '老师我想问你一个问题.....',
                  __v: 0,
                  date: 2016-12-06T02:59:41.279Z }]
  }

get '/student/message/course_list'
 与 get '/student/message' 相同返回信息
 get '/student/message/course_list'    只返回 json 格式的数据（有用）
 get '/student/message'                res.render返回

*/

var express = require('express');
var router = express.Router();
var Student = require('../../Models/Student');
var Course = require('../../Models/Course');
var Message = require('../../Models/Message');
var textMessage = require('../../handler/text_message');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function (req, res, next) {
  Student.findOne({openid: req.session.openid}, function (err, doc) {
    if (err){
      next(err);
      return;
    }
    var courses = doc? (doc.course) : [];
    res.render('student/message', {
      courses: courses,
      status: 'courses'
    })
  });
});

router.post('/', urlencodedParser, function (req, res, next) {
  var message = {
    toTeacher: true,
    student: req.session.openid,
    course: req.body.course,
    msgHead: req.body.msgHead,
    msgBody: req.body.msgBody
  };
  console.log(req.body.msgBody);
  console.log(req.body.msgHead);
  
  var messageObj = new Message(message);
  messageObj.save(function (err, doc) {
    if (err){
      next(err);
      return;
    }
    /**
     * TODO
    textMessage('o3HdVwQhhR9vV2MhK0zS6WruOLmE', message);
    */
    res.json({
      status: 'msgSend'
    });
  });
});

router.get('/msg_list/:coursename', urlencodedParser, function (req, res, next) {
  Message.find({student: req.session.openid,  course: req.params.coursename}, function (err, messages) {
    if (err){
      next(err);
      return;
    }
    res.json({
      messages: messages,
      status: 'messages'
    });
  });
});

router.get('/course_list', function (req, res, next) {
  Student.findOne({openid: req.session.openid}, function (err, doc) {
    if (err){
      next(err);
      return;
    }
    var courses = doc? (doc.course) : [];
    res.json({
      courses: courses,
      status: 'courses'
    });
  });
});

module.exports = router;