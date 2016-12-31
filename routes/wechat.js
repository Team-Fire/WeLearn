var settings = require('../setting');
var wrapper = require('../tools/wrapper');
var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var handler = require('../handler/main_handler');

var config = {
  token: settings.token,
  appid: settings.appid
  //appsecret: settings.appsecret
};

router.use('/', wechat(config, function (req, res, next) {
  handler(req, res);
}));

module.exports = router;
