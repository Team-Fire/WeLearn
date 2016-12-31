var wrapper = require('../tools/wrapper');
var Student = require('../Models/Student');
var Message = require('../Models/Message');
var Course = require('../Models/Course');
var utf8 = require('utf8');
var request = require('request');
var checker = require("./checkRequest");
var schedule = require("node-schedule");
var inform = require('./../tools/inform.js');
//var basicInfo = require("../weixin_basic/settings.js");
var menutmp=require("./../tools/menu_control");

var i = 0, courseName;
var setTime = false;    //是否开始定时判定是否绑定
var  reminder;    //提醒功能的实现
var reminderSet = false;    //是否已经开始提醒功能
var bind = false;

var firstGet = true;
var oldHomeWork = {}, oldNotice = {}, oldDocument = {};
var deadline_have_informed = [];

exports.checkBindAccount = function (msg) {
  if (msg.Content === 'bind' || checker.checkMenuClick(msg)==menutmp.WEIXIN_EVENT_KEYS['account_bind'])
    return true;
};

exports.handleBindAccount = function (req, res) {

  Student.findOne({openid: req.weixin.FromUserName}, function (err, student) {
    if(student){
      res.reply("已经绑定成功!");
    }
    else{
      res.reply([
        {
          title: '登录',
          description: '点击即可进入学生、老师（助教）登录界面',
          url: wrapper.urlStudentLogin() + '?openid=' + req.weixin.FromUserName
        }
      ]);
    }
  });

  //开始定时判别是否绑定成功
  if(setTime){
    //定时任务，查看用户是否绑定 绑定则开始定时推送
    var interval = setInterval(function() {
      Student.findOne({openid: req.weixin.FromUserName}, function (err, doc) {
        if (err) next(err);
        if (doc) {
          bind = true;
          //定时查看课程动态
          var rule = new schedule.RecurrenceRule();
          rule.minute = [0, 10, 20, 30, 40, 50];
          /*
           var times = [];
           for (i = 0; i < 60; ) {
           times.push(i);
           i += 1;
           }
           rule.second = times;
           */
          reminder = schedule.scheduleJob(rule, function () {
            reminderSet = true;
            var requestData = {
              apiKey: "",
              apisecret: ""
            };
            request({
              method: 'POST',
              url: 'http://se.zhuangty.com:8000/learnhelper/' + doc.studentnumber + '/courses',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(requestData)
            }, function (error, response, body) {
              //console.log(response.statusCode);
              if (response.statusCode === 200) {
                var lessons = JSON.parse(body);
                // 获取当前时间戳(以ms为单位)
                var timestamp = Date.parse(new Date());
                if (firstGet) {
                  firstGet = false;
                  for (i = 0; i < lessons.courses.length; i++) {
                    (lessons.courses)[i].coursename = (lessons.courses)[i].coursename.substring(0, (lessons.courses)[i].coursename.length - 15);
                    courseName = (lessons.courses)[i].coursename;
                    oldHomeWork[courseName] = (lessons.courses)[i].unsubmittedoperations;
                    oldNotice[courseName] = (lessons.courses)[i].unreadnotice;
                    oldDocument[courseName] = (lessons.courses)[i].newfile;
                  }
                }
                else {
                  var message;
                  for (i = 0; i < lessons.courses.length; i++) {
                    (lessons.courses)[i].coursename = (lessons.courses)[i].coursename.substring(0, (lessons.courses)[i].coursename.length - 15);
                    courseName = (lessons.courses)[i].coursename;

                    if ((lessons.courses)[i].unsubmittedoperations > oldHomeWork[courseName]) {
                      if(doc.no_hwk.indexOf(courseName) === -1){
                        message = "" + courseName + "刚刚发布一个新作业";
                        inform.newAssignmentInform(message);
                      }
                      oldHomeWork[courseName] = (lessons.courses)[i].unsubmittedoperations;
                    }
                    if ((lessons.courses)[i].unreadnotice > oldNotice[courseName]) {
                      if(doc.no_notice.indexOf(courseName) === -1){
                        message = "" + courseName + "刚刚发布一个新公告";
                        inform.newNoticeInform(message);
                      }
                      oldHomeWork[courseName] = (lessons.courses)[i].unsubmittedoperations;
                    }
                    if ((lessons.courses)[i].newfile > oldDocument[courseName]) {
                      if(doc.no_document.indexOf(courseName) === -1){
                        message = "" + courseName + "刚刚发布一个新文件";
                        inform.newDocumentInform(message);
                      }
                      oldDocument[courseName] = (lessons.courses)[i].newfile;
                    }

                    //deadline
                    if(doc.no_ddl.indexOf(courseName) === -1){
                      deadlineInform(doc.studentnumber, (lessons.courses)[i].courseid, courseName, requestData, timestamp);
                    }
                  }
                }

              }
              else {
                console.log(error);
              }

            });
          });
          clearInterval(interval);
        }
      });
    }, 1000 * 5);
    setTime = true;
  }

  //7天 定时清理deadline_have_informed
  setInterval(function () {
    var le = deadline_have_informed.length;
    var temp = [];
    var currtime = Date.parse(new Date());
    for(i = 0; i < le; i++){
      if(parseInt(deadline_have_informed[i].date) < parseInt(currtime)){
        temp.push({assid: deadline_have_informed[i].assid, date: deadline_have_informed[i].date});
      }
    }
    deadline_have_informed = temp;
  }, 1000 * 60 * 60 * 24 * 7);

};

exports.checkUnbindAccount = function (msg) {
  if (msg.Content === 'unbind' || checker.checkMenuClick(msg)==menutmp.WEIXIN_EVENT_KEYS['account_unbind'])
    return true;
};

exports.handleUnBindAccount = function (req, res) {
  Student.findOne({openid: utf8.encode(req.weixin.FromUserName)}, function (err, student) {
    if (err){
      res.reply('出了一些问题:(');
      return;
    }
    if (student === null){
      res.reply('本微信号未绑定:(');
      return;
    }

    res.reply('已经解除绑定');
    //将定时提醒取消 并且恢复一些初始值

    if(reminderSet){
      reminder.cancel();
      reminderSet = false;
    }

    bind = false;
    setTime = false;
    firstGet = true;
    oldHomeWork = {}, oldNotice = {}, oldDocument = {};
    deadline_have_informed = [];

    var courses = student.course;
    var openid = student.openid;

    var requestData = {
      apiKey: "camustest",
      apisecret: "camustest"
    };

    var username = student.username;
    request({
      method: 'POST',
      url: 'http://se.zhuangty.com:8000/students/'+username+'/cancel',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(requestData)
    }, function () {
      student.remove(function () {
        for(var i = 0; i < courses.length; i++) {
          (function (i) {
            Course.findOne({coursename: courses[i]}, function (err, course) {
              var j;
              for(j=0; j<course.teacher.length; j++) {
                if(course.teacher[j].openid === openid) {
                  course.teacher.splice(j, 1);
                  course.save();
                  return;
                }
              }
              for(j=0; j<course.student.length; j++) {
                if(course.student[j].openid === openid) {
                  course.student.splice(j, 1);
                  course.save();
                  return;
                }
              }
            })
          })(i);
        }
      })
    });
  });
};

var deadlineInform = function(studentnumber, courseid, coursename, requestData, timestamp){
  var message;
  request({
    method: 'POST',
    url: 'http://se.zhuangty.com:8000/learnhelper/' + studentnumber + '/courses/' + courseid + '/assignments',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(requestData)
  }, function (error, response, body) {
    if (response.statusCode === 200) {
      var assignments = JSON.parse(body);
      for(var num = 0; num < assignments.assignments.length; num++){
        if((assignments.assignments)[num].state === "尚未提交"){
          var interv = (parseInt((assignments.assignments)[num].duedate) - parseInt(timestamp)) / 1000 / 60 / 60 / 24;
          var len = deadline_have_informed.length;
          if(len === 0){
            if(parseInt(interv) <= 1){
              deadline_have_informed.push({assid: (assignments.assignments)[num].assignmentid, date: (assignments.assignments)[num].duedate});
              message = "SOS! " + coursename + " 作业: " + (assignments.assignments)[num].title + "dealine只剩下1天左右";
              inform.deadlineInform(message);
            }
          }
          else{
            for(i = 0; i < len; i++){
              if(deadline_have_informed[i].assid === (assignments.assignments)[num].assignmentid){
                break;
              }
              if(i === len - 1){
                if(parseInt(interv) <= 1){
                  deadline_have_informed.push({assid: (assignments.assignments)[num].assignmentid, date: (assignments.assignments)[num].duedate});
                  message = "SOS! " + coursename + "作业: " + (assignments.assignments)[num].title + "dealine只剩下1天左右";
                  inform.deadlineInform(message);
                }
              }
            }
          }

        }
      }

    }
  });
};



exports.updateCourseDb = function (student) {
  var requestData = { apiKey: "", apisecret: ""};
  request({
    method: 'POST',
    url: 'http://se.zhuangty.com:8000/learnhelper/'+ student.studentnumber +'/courses',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(requestData)
  }, function (error, response, body) {
    var courses = JSON.parse(body).courses;
    //console.log(body);
    var courseNames = [];
    for (var i = 0; i < courses.length; i++){
      courseNames.push(courses[i].coursename);
      (function (i) {
        Course.findOne({courseid: courses[i].courseid}, function (err, doc) {
          if (err) console.log(err);
          if (doc){
            if (student.position === 'teacher'){
              doc.teacher.push({name: student.realname, userid: student.openid});
              doc.save();
            }else{
              doc.student.push({name: student.realname, userid: student.openid});
              doc.save();
            }
          }else{
            var course = {
              courseid: courses[i].courseid, coursename: courses[i].coursename, teacher: [], student: [], message: []
            };
            if (student.position === 'teacher'){
              course.teacher.push({name: student.realname, userid: student.openid});
            }else{
              course.student.push({name: student.realname, userid: student.openid});
            }
            var courseObj = new Course(course);
            courseObj.save();
          }
        })
      })(i);
    }
    Student.findOne({openid: student.openid}, function (err, student) {
      if (err){
        console.log(err);
        return;
      }
      student.course = courseNames;
      student.save();
    })
  });
};