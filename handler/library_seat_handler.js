var wrapper = require('../tools/wrapper');
var Student = require('../Models/Student');
var checker = require("./checkRequest");
var request = require('request');
var utf8 = require('utf8');
var menutmp=require("./../tools/menu_control");

exports.checkListLibrarySeat = function (msg) {
  if (msg.Content === 'library seat' || checker.checkMenuClick(msg)==menutmp.WEIXIN_EVENT_KEYS['library_seat'])
    return true;
};

exports.handleListLibrarySeat = function (req, res) {
  var requestData = {
    apikey: "",
    apisecret: ""
  };
  request({
    method: 'POST',
    url: 'http://se.zhuangty.com:8000/library/hs',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  }, function (error, response, body) {
    if(response.statusCode === 200) {
      var seats = JSON.parse(body);
      var replyText = "";
      for(var i = 0; i < seats.areas.length; i++){
        replyText += "区域 | " + (seats.areas)[i].name + "\n";
        replyText += "        已使用：" + (seats.areas)[i].used + "    未使用：" + (seats.areas)[i]. left;
        replyText += '\n';
      }

      res.reply(replyText);
    }
    else {
      res.reply('error response.');
    }

  });
};