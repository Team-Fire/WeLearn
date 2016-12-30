var wrapper = require('../wrapper');
var Student = require('../Models/Student');
var menutmp = require("./../tools/menu_control");
var checker = require("./checkRequest");

exports.checkRemindSettings = function (msg){
    if (msg.Content === 'rs' || checker.checkMenuClick(msg)==menutmp.WEIXIN_EVENT_KEYS['inform'])
        return true;

    return false;
};

exports.handleRemindSettings = function (req, res){
    Student.findOne({openid: req.weixin.FromUserName}, function (err, doc){
        if(!doc){
            res.reply("请先进行绑定");
            return;
        }
        else{
            res.reply([
                {
                    title: '提醒功能设置',
                    description:'点击即可对提醒功能进行设置',
                    url: wrapper.urlRemindSettings()
                }]);
        }
    });
};