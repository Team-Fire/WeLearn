var wrapper = require('../tools/wrapper');
var Student = require('../Models/Student');
var checker = require("./checkRequest");
//var basicInfo = require("../weixin_basic/settings.js");
var menutmp=require("./../tools/menu_control");

exports.checkListLesson = function (msg) {
  if (msg.Content === 'lesson' || checker.checkMenuClick(msg)==menutmp.WEIXIN_EVENT_KEYS['course_info'])
    return true;

  return false;
};

exports.handleListLesson = function (req, res) {
  Student.findOne({openid: req.weixin.FromUserName}, function(err,doc){
    if(!doc){
      res.reply("请先进行绑定");
      return;
    }
    else{
      res.reply([
        {
          title: '课程信息',
          description: '点击即可查看课程信息',
          url: wrapper.urlLessonInfo()
        }
      ]);
    }
  });
};