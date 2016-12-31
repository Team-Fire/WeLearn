var WechatAPI = require('wechat-api');
var wrapper = require('./wrapper');
var setting  =require('../setting');
var Course = require('../Models/Course');

var noticeMessage = function (notice, noticeid) {
  var url;
  var api = new WechatAPI(setting.appid, setting.appsecret);
  var msgData = {
    'course':{
      'value': notice.course,
      color: '#771523'
    },
    'msgHead':{
      'value': notice.msgHead,
      color: '#771523'
    },
    'msgBody':{
      'value': notice.msgBody,
      color: '#771523'
    }
  };
  /**
   * TODO 调试用，部署时删除
   */
  url = wrapper.urlStudentNotice(noticeid);
  api.sendTemplate(setting.yourOpenid, setting.noticeTemplateID, url, msgData);
  Course.findOne({coursename: notice.course}, function (err, course) {
    var students = course.student;
    for (var i = 0; i < students.length; ++i){
      (function () {
        var openid = students[i].openid;
        url = wrapper.urlStudentNotice(noticeid);
        api.sendTemplate(openid, setting.noticeTemplateID, url, msgData, function (err) {
          if (err){
            console.log(err);
          }
        });
      })(i);
    }
  });
};
module.exports = noticeMessage;