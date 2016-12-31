var WechatAPI = require('wechat-api');
var setting = require('../setting');

exports.deadlineInform = function (message) {
    var url;
    var api = new WechatAPI(setting.appid, setting.appsecret);
    var msgData = {
        'msg':{
            'value': message,
            color: '#771523'
        }
    };

    api.sendTemplate(setting.yourOpenid, setting.deadlineInformID, url, msgData);
};

exports.newDocumentInform = function (message) {
    var url;
    var api = new WechatAPI(setting.appid, setting.appsecret);
    var msgData = {
        'msg':{
            'value': message,
            color: '#771523'
        }
    };

    api.sendTemplate(setting.yourOpenid, setting.newDocumentID, url, msgData);
};

exports.newNoticeInform = function (message) {
    var url;
    var api = new WechatAPI(setting.appid, setting.appsecret);
    var msgData = {
        'msg':{
            'value': message,
            color: '#771523'
        }
    };

    api.sendTemplate(setting.yourOpenid, setting.newNoticeID, url, msgData);
};

exports.newAssignmentInform = function (message) {
    var url;
    var api = new WechatAPI(setting.appid, setting.appsecret);
    var msgData = {
        'msg':{
            'value': message,
            color: '#771523'
        }
    };

    api.sendTemplate(setting.yourOpenid, setting.newAssignmentID, url, msgData);
};