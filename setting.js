var siteDomain = 'http://101.5.212.21';
var token = 'ThisIsAWeChatTokenWhichCanBeARandomString';
var appid = 'wx8d7a006090c3ae66';
var appSecret = '85b8c974f08b5e62e38a8d8beec962bf';

/*
 * token
 * appid
 * appsecret
 * siteDomain 每次都有修改（如果用微信端的，浏览器调试直接用localhost）
 * teacherTextTemplateID      格式--标题：{{msgHead.DATA}} 内容：{{msgBody.DATA}}
 * studentTextTemplateID      格式--标题：{{msgHead.DATA}} 内容：{{msgBody.DATA}}
 * noticeTemplateID           格式--课名：{{course.DATA}} 标题：{{msgHead.DATA}} 内容：{{msgBody.DATA}}
 * 以上3个都是模板消息 id，要在测试号填写模板格式获得 id
*/
var settings = {
  token: token,
  appid: appid,
  appsecret: appSecret,
  siteDomain: siteDomain,
  noticeTemplateID: '6lQZOtEAQclvHlXRpWXxNoYtwsbjFB0uUGWjEefXoOw',
  teacherTextTemplateID: 'PnH0eplbIqPYfUBvbWNqWntDISa2w4ikBylZicl9X3U',
  studentTextTemplateID: 'PnH0eplbIqPYfUBvbWNqWntDISa2w4ikBylZicl9X3U'
  // yourOpenid: 'oBu1dv0TCi_9UEIHwqY4F0IbfX6E',
  // studentOpenid: 'oBu1dv5_0wvgk7U686jTHfs2oTsE',
  // teacherOpenid: 'oBu1dv0TCi_9UEIHwqY4F0IbfX6E'
};

module.exports = settings;

//o3HdVwQhhR9vV2MhK0zS6WruOLmE
//o3HdVwWHa0uJNuNLQ7u_1Tf0VEng