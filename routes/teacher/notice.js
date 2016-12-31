/**
 接口说明
 by 周焕祥
 2016/12/6

 这是老师发布图文公告的地方
 路由到 'teacher/notice.ejs'

 get '/teacher/notice'
 返回实例(课程列表)
   返回：
   {
     status: 'courses'，
     courses: ['软工3（第xx 学期）'，'计网1（第xx 学期）']    //课程数组
   }

 post '/teacher/notice'
 发送消息
   表单输入：
   {
     course,     //课程名
     msgHead,    //消息标题
     msgBody，   //消息内容
     photo       // <input type="file" name="photo">
   }
   返回：
   {
     status: 'msgSend'
   }

 */

var express = require('express');
var router = express.Router();
var Student = require('../../Models/Student');
var Course = require('../../Models/Course');
var Notice = require('../../Models/Notice');
var noticeMessage = require('../../tools/notice_message');
//以下三行处理带文件表单的依赖
var multer = require('multer');
var path = require('path');
var upload = multer({ dest: path.join(__dirname, '../../public/photos') });
var fs = require('fs');

router.get('/', function (req, res, next) {
  Student.findOne({openid: req.session.openid}, function (err, doc) {
    if (err){
      next(err);
    }else{
      //TODO
      //var courses = doc? (doc.course) : [];
      var courses = doc.course;
      res.render('teacher/notice', {
        courses: courses,
        status: 'courses'
      })
    }
  });
});

router.post('/', upload.array('photo', 1), function (req, res, next) {
  var notice = {
    course:  req.body.course,
    msgHead: req.body.msgHead,
    msgBody: req.body.msgBody,
    photo: (req.files[0])? req.files[0].filename : ''
  };
  var noticeObj = new Notice(notice);
  noticeObj.save(function (err, doc) {
    if (err){
      next(err);
    }
    noticeMessage(notice, doc._id);
    res.json({
      status: 'noticeSend'
    });
  });
});

module.exports = router;
