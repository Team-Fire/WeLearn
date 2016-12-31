var wrapper = require('../tools/wrapper');
var utf8 = require('utf8');
var Student = require('../Models/Student');
var setting = require('../setting');
var checker = require("./checkRequest");
var menutmp=require("./../tools/menu_control");

exports.checkSendMessage = function (msg) {
  return (msg.Content === setting.messageContent ||
    checker.checkMenuClick(msg)==menutmp.WEIXIN_EVENT_KEYS['private_conversation']);
};

exports.handleSendMessage = function (req, res) {
  Student.findOne({openid: utf8.encode(req.weixin.FromUserName)}, function (err, student) {
    if(!student){
      res.reply("请先进行绑定");
      return;
    }
    if (student.position !== 'teacher'){
      res.reply([
        {
          title: '发消息给老师',
          description: '点击即可选择课程，并发送消息给老师',
          url: wrapper.urlStudentMessage()
        }
      ]);
    }else{
      res.reply([
        {
          title: '查看消息记录',
          description: '点击即可查看来自学生的消息',
          url: wrapper.urlTeacherMessage()
        }
      ]);
    }
  });
};

exports.checkSendNotice = function (msg) {
  if (msg.Content === setting.noticeContent)
    return true;
};

exports.handleSendNotice = function (req, res) {
  Student.findOne({openid: utf8.encode(req.weixin.FromUserName)}, function (err, student) {
    if (err) {
      res.reply('抱歉，出了点问题');
    } else if (student.position !== 'teacher'){
      res.reply('没有该权限:(');
    } else{
      res.reply([
        {
          title: '发送图文公告',
          description: '点击即可发送图文消息给学生',
          url: wrapper.urlTeacherNotice()
        }
      ]);
    }
  });
};