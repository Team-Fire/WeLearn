var wrapper = require('../tools/wrapper');
var Student = require('../Models/Student');
var checker = require("./checkRequest");
var menutmp=require("./../tools/menu_control");

exports.checkListSchedule = function (msg) {
  if (msg.Content === 'schedule' || checker.checkMenuClick(msg)==menutmp.WEIXIN_EVENT_KEYS['course_schedule'])
    return true;
  return false;
};

exports.handleListSchedule = function (req, res) {
  Student.findOne({openid: req.weixin.FromUserName}, function(err,doc) {
    if (!doc) {
      res.reply("请先进行绑定");
      return;
    }
    else {
      res.reply([
        {
          title: '我的课表',
          description: '点击即可查看我的课表',
          url: wrapper.urlScheduleInfo()
        }
      ]);
    }
  });
};
