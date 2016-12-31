/**
 * Created by FROST on 2016/12/5.
 */

var https = require('https');
var request = require('request');
var setting = require('../setting');


function getAccessToken(callback){
  var now = new Date();
  var access_token;
  var at_update_time;

  if(at_update_time != undefined && now.getYear() == at_update_time.getYear() && now.getMonth() == at_update_time.getMonth() && now.getDay() == at_update_time.getDay() && (now.getHours() - at_update_time.getHours()) <= 1){
    callback(access_token);
  }
  else{
    https.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+setting.appid+"&secret="+setting.appsecret, function (response) {
      response.on('data', function(d) {
        var obj = JSON.parse(d);
        access_token = obj.access_token;
        at_update_time = new Date();
        callback(access_token);
      });
    }).on('error', function(e) {
      console.error(e);
    });
  }
}

var WEIXIN_EVENT_KEYS = {
  'course_info':'COURSE_INFO',
  'private_conversation':'PRIVATE_CONVERSATION',
  'course_schedule':"COURSE_SCHEDULE",
  'account_bind':"ACCOUNT_BIND",
  'account_unbind':'ACCOUNT_UNBIND',
  'library_seat': 'LIBRARY_SEAT'
};

var WEIXIN_COSTUM_MENU_TEMPLATE = {
  "button": [
    {
      "name": "文图查座",
      "type": "click",
      "key": WEIXIN_EVENT_KEYS['library_seat'],
      "sub_button": []
    },
    {
      "name": "私信",
      "type": "click",
      "key": WEIXIN_EVENT_KEYS['private_conversation'],
      "sub_button": []
    },
    {
      "name": "个人中心",
      "sub_button": [
        {
          "type": "click",
          "name": "绑定",
          "key": WEIXIN_EVENT_KEYS['account_bind'],
          "sub_button": []
        },
        {
          "type": "click",
          "name": "解绑",
          "key": WEIXIN_EVENT_KEYS['account_unbind'],
          "sub_button": []
        },
        {
          "type": "click",
          "name": "今日课程",
          "key": WEIXIN_EVENT_KEYS['course_schedule'],
          "sub_button": []
        },
        {
          "type": "click",
          "name": "课程动态信息",
          "key": WEIXIN_EVENT_KEYS['course_info'],
          "sub_button": []
        }
      ]
    }
  ]
};

function create_menu(token) {

    var options = {
        url: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token='+ token,
        form: JSON.stringify(WEIXIN_COSTUM_MENU_TEMPLATE),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    request.post(options, function (err, res, body) {
        if (err) {
            console.log(err);
        }else {
            //console.log(body);
        }
    })
}

exports.WEIXIN_EVENT_KEYS = WEIXIN_EVENT_KEYS;

exports.update_menu = function () {
  getAccessToken(function (token) {
    create_menu(token);
  })
};
