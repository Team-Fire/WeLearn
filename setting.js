var siteDomain = 'http://183.173.50.32';
var token = 'RYhopG1zq6oan1toNtiHfcq96KHinZ90gpuKt8pEx3mEQPmz7T';
var appid = 'wx09a561e87eba34ed';
var appSecret = '3ab9db2f6a5a10f1c30b252faa5fb9c3';

/**
 * token
 * appid
 * appsecret
 * siteDomain 每次都有修改（如果用微信端的，浏览器调试直接用localhost）
 * teacherTextTemplateID      格式--标题：{{msgHead.DATA}} 内容：{{msgBody.DATA}}
 * studentTextTemplateID      格式--标题：{{msgHead.DATA}} 内容：{{msgBody.DATA}}
 * noticeTemplateID           格式--课名：{{course.DATA}} 标题：{{msgHead.DATA}} 内容：{{msgBody.DATA}}
 * 以上3个都是模板消息 id，要在测试号填写模板格式获得 id
 * deadlineInformID           格式-内容：{{msg.DATA}}
 * newDocumentID           格式-内容：{{msg.DATA}}
 * newNoticeID           格式-内容：{{msg.DATA}}
 * newAssignmentID           格式-内容：{{msg.DATA}}
*/
var settings = {
  token: token,
  appid: appid,
  appsecret: appSecret,
  siteDomain: siteDomain,
  noticeTemplateID: 'QHaABmPXr8d0_XXH6IYhnOSw6S_YzrWz3nLNRKp13u4',
  teacherTextTemplateID: 'AMx-DhYdngumTKUMRwgEPu6XG_F-YPgt6eTR3knWfUU',
  studentTextTemplateID: 'WLYiKCaSFMaet3vLJiQsjg430SUQkGjcEx04nOmEwyM',
  teacherMessageID: 'R_c_YYACNNO5P9ccoQg-FTt4jz9mUUfyQdcRWhDsC1c',
  studentMessageID: 'oZrLU__lg568RKc3txLK0Z8Fxv2ZKTKrerg5DYNXxic',
  yourOpenid: 'oVP35wC1bsdlsEmcBPVzbe5FkdrI',
  studentOpenid: 'oVP35wC1bsdlsEmcBPVzbe5FkdrI',
  teacherOpenid: 'oVP35wBPxW4z4nFlnsAsIw_NwaQA',

  messageContent: 'msg',
  noticeContent: 'notice'
};

module.exports = settings;

//o3HdVwQhhR9vV2MhK0zS6WruOLmE
//o3HdVwWHa0uJNuNLQ7u_1Tf0VEng