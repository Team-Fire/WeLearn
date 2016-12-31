/**
 接口说明
 by 杨景
 2016/12/6

 get '/student/course'
 返回实例(课程动态信息)
 返回：
 {
   title: '我的课程',
   lessons: lessons
 }
 以上lessons具体为以下json数据:
 {
    "message": "Success",
    "username": "Request username",
    "courses": [
        {
            "coursename": "Course Name",
            "courseid": "Course ID",
            "unreadnotice": Unread Notice Number,
            "newfile": New File Number,
            "unsubmittedoperations": Unsubmitted Operations Number
        }
    ]
}

 get '/student/course/:lesson_id/notices'
 获得 courseid 为 lesson_id 的课程公告
 返回：
 {
    title: '课程公告',
    notices: notices
 }
 其中notices为以下json数据:
 {
    "message": "Success",
    "username": "Request username",
    "notices": [
        {
            "sequencenum": Sequence Number,
            "title": "Title",
            "publisher": "the person publishing the notice",
            "publishtime": "Publish Time",
            "state": "read/unread",
            "content": "Content"
        }
    ]
}
 */

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var utf8 = require('utf8');
var router = express.Router();
var Student = require('../../Models/Student');
var sd = require('silly-datetime');
var wrapper = require('../../tools/wrapper');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', urlencodedParser, function (req, res, next) {
  Student.findOne({openid: req.session.openid}, function (err, doc) {
    if (err) {
      next(err);
      return;
    }
    if (!doc){
      res.render('student/course', {
        title: '我的课程',
        lessons: {
          courses: []
        }
      });
    }
    var requestData = {
      apiKey: "camustest",
      apisecret: "camustest"
    };
    request({
      method: 'POST',
      url: 'http://se.zhuangty.com:8000/learnhelper/'+ doc.studentnumber +'/courses',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(requestData)
    }, function (error, response, body) {
      if(response.statusCode === 200){
        var lessons = JSON.parse(body);
        for(var i = 0; i < lessons.courses.length; i++){
          lessons.courses[i].coursename = lessons.courses[i].coursename.substring(0,lessons.courses[i].coursename.length - 15);
        }
        res.render('student/course', {
          title: '我的课程',
          lessons: lessons
        });
      }
    });
  })
});

router.get('/:lesson_id/notices', urlencodedParser, function (req, res, next) {
  var lesson_id = req.params.lesson_id;
  var requestData = {
    apikey: "camustest",
    apisecret: "camustest"
  };

  Student.findOne({openid: req.session.openid}, function(err,doc){
    if(err) {
      next(err);
      return;
    }
    if(!doc){
      remove([], 0, res, 0);
      return;
    }

    var username = doc.studentnumber;
    request({
      method: 'POST',
      url: 'http://se.zhuangty.com:8000/learnhelper/' + username + '/courses/' + lesson_id + '/notices',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    }, function (error, response, body) {
      if(response.statusCode === 200) {
        var notices = JSON.parse(body);

        var len = notices.notices.length;
        remove(notices, len, res, 0);
      }
    });
  });
});

router.get('/:lesson_id/documents', urlencodedParser, function (req, res, next) {
  var lesson_id = req.params.lesson_id;
  var requestData = {
    apikey: "camustest",
    apisecret: "camustest"
  };

  Student.findOne({openid: req.session.openid}, function(err,doc){
    if(err){
      next(err);
      return;
    }
    if(!doc){
      remove([], 0, res, 0);
      return;
    }
    var username = doc.studentnumber;
    request({
      method: 'POST',
      url: 'http://se.zhuangty.com:8000/learnhelper/' + username + '/courses/' + lesson_id + '/documents',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    }, function (error, response, body) {
      if(response.statusCode === 200) {
        var documents = JSON.parse(body);
        var len = documents.documents.length;
        remove(documents, len, res, 1);
      }
    });
  });
});

router.get('/:lesson_id/assignments', urlencodedParser, function (req, res, next) {
  var lesson_id = req.params.lesson_id;
  var requestData = {
    apikey: "camustest",
    apisecret: "camustest"
  };


  Student.findOne({openid: req.session.openid}, function(err,doc){
    if(err){
      next(err);
      return;
    }
    if(!doc){
      remove([], 0, res, 0);
      return;
    }

    var username = doc.studentnumber;
    request({
      method: 'POST',
      url: 'http://se.zhuangty.com:8000/learnhelper/' + username + '/courses/' + lesson_id + '/assignments',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    }, function (error, response, body) {
      if(response.statusCode === 200) {
        var assignments = JSON.parse(body);

        var len = assignments.assignments.length;
        remove(assignments, len, res, 2);
      }
    });
  });
});

function remove(notices, len, res, type){
  var title, content, msesInt;
  var i, j;
  switch (type){
    case 0:
      if(len === 0){
        var no = {};
        no.notices = [];
        res.render('student/course', {
          title: '未读公告',
          notices: no
        });
      }

      for(i = 0; i < len; i++){
        //处理时间
        msesInt = parseInt((notices.notices)[i].publishtime);
        (notices.notices)[i].publishtime = sd.format(new Date(msesInt), 'YYYY-MM-DD');

        title = (notices.notices)[i].title.split(/&nbsp;/);
        content = (notices.notices)[i].content.split(/&nbsp;/);
        var titlelen = title.length, contentlen = content.length, str = "";
        for(var j = 0; j < titlelen; j++){
          str += title[j];
        }
        (notices.notices)[i].title = str;
        str = "";
        for(j = 0; j < contentlen; j++){
          str += content[j];
        }
        (notices.notices)[i].content = str;

        if(i === len - 1){
          res.render('student/course', {
            title: '未读公告',
            notices: notices
          });
        }
      }
      break;
    case 1:
      if(len === 0){
        var no = {};
        no.documents = [];
        res.render('student/course', {
          title: '新文件',
          documents: no
        });
      }

      for(i = 0; i < len; i++){
        //处理时间
        msesInt = parseInt((notices.documents)[i].updatingtime);
        (notices.documents)[i].updatingtime = sd.format(new Date(msesInt), 'YYYY-MM-DD');

        title = (notices.documents)[i].title.split(/&nbsp;/);
        content = (notices.documents)[i].explanation.split(/&nbsp;/);
        var titlelen = title.length, contentlen = content.length, str = "";
        for(var j = 0; j < titlelen; j++){
          str += title[j];
        }
        (notices.documents)[i].title = str;
        str = "";
        for(j = 0; j < contentlen; j++){
          str += content[j];
        }

        if(str === ""){
          str = "课件";
        }
        (notices.documents)[i].explanation = str;

        if(i === len - 1){
          res.render('student/course', {
            title: '新文件',
            documents: notices
          });
        }
      }
      break;
    default:
      if(len === 0){
        var no = {};
        no.assignments = [];
        res.render('student/course', {
          title: '未交作业',
          assignments: no
        });
      }

      for(i = 0; i < len; i++){
        //处理时间
        msesInt = parseInt((notices.assignments)[i].duedate);
        (notices.assignments)[i].duedate = sd.format(new Date(msesInt), 'YYYY-MM-DD');

        title = (notices.assignments)[i].title.split(/&nbsp;/);
        content = (notices.assignments)[i].detail.split(/&nbsp;/);
        var titlelen = title.length, contentlen = content.length, str = "";
        for(var j = 0; j < titlelen; j++){
          str += title[j];
        }
        (notices.assignments)[i].title = str;
        str = "";
        for(j = 0; j < contentlen; j++){
          str += content[j];
        }
        if(str === ""){
          str = "暂无描述";
        }
        (notices.assignments)[i].detail = str;

        if(i === len - 1){
          res.render('student/course', {
            title: '未交作业',
            assignments: notices
          });
        }
      }
      break;
  }
}

router.post('/notice/redirect',urlencodedParser,function (req, res){
  var url = wrapper.urlCourseNewNotices(req.body.courseid);
  res.json({
    url: url
  });
});


router.post('/documents/redirect',urlencodedParser,function (req, res){
  var url = wrapper.urlCourseNewDocuments(req.body.courseid);
  res.json({
    url: url
  });
});

router.post('/assignments/redirect',urlencodedParser,function (req, res){
  var url = wrapper.urlCourseNewAssignments(req.body.courseid);
  res.json({
    url: url
  });
});

module.exports = router;

