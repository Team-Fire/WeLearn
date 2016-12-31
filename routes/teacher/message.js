/**
 接口说明
 by 周焕祥
 2016/12/7

 老师（总是接受并回复，不会主动发起一个私信，所以不选择课程）

get '/teacher/message/:courseid/:studentOpenid'
  返回数据
  {
    status: 'messages',
    messages: [{  _id: 5846299d02145b150c349fe0,
                  toTeacher: true,
                  student: 'o3HdVwWHa0uJNuNLQ7u_1Tf0VEng',
                  course: '136947',
                  msgBody: '老师我想问你一个问题.....',
                  __v: 0,
                  date: 2016-12-06T02:59:41.279Z }]
    student: {

             }
  }

 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Student = require('../../Models/Student');
var Course = require('../../Models/Course');
var Message = require('../../Models/Message');
var textMessage = require('../../tools/text_message');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/:courseid/:studentOpenid', urlencodedParser, function (req, res, next) {
  Message.find({course: req.params.courseid, student: req.params.studentOpenid}, function (err, messages) {
    if (err){
      next(err);
      return;
    }
    Student.findOne({openid: req.params.studentOpenid}, function (err, stu){
      res.json({
        messages: messages,
        student: stu.realname,
        status: 'messages'
      });
    });
  });
});

router.get('/', urlencodedParser, function (req, res, next){
  var roomID = req.session.studenid + req.session.course;
  //console.log(req.session.studentid);
  //console.log(req.session.course);
  res.render('teacher/message', {
    roomID: roomID
  });
});

router.post('/', urlencodedParser, function (req, res, next) {
  /**
   * TODO
   * student: 前段返回的值
   */
  var message = {
    toTeacher: false,
    student: req.body.student,
    course: req.body.course,
    //msgHead: req.body.msgHead,
    msgBody: req.body.msgBody
  };
  var messageObj = new Message(message);
  messageObj.save(function (err, doc) {
    if (err){
      next(err);
      return;
    }
    textMessage(message.student, message);
  });
  res.json({
    status: 'msgSend'
  });
});


module.exports = router;
