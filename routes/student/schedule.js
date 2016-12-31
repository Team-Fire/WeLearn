var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var utf8 = require('utf8');
var router = express.Router();
var Student = require('../../Models/Student');
var sd = require('silly-datetime');
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var getDay = require('./getTotalDay');

var startTime = getDay.getTotalDay(2016, 9, 12);

router.get('/', urlencodedParser, function (req, res, next) {
  Student.findOne({openid: req.session.openid}, function (err, doc) {
    if (err) {
      next(err);
      return;
    }

    var time = sd.format(new Date(), 'YYYY-MM-DD');
    time = time.split(/-/);
    var totalTime = 0;
    var year = parseInt(time[0]);
    for(var i = 0; i < year - 2016; i++){
      totalTime += getDay.getTotalDay(2016 + i, 12, 31);
    }
    totalTime += getDay.getTotalDay(year, parseInt(time[1]), parseInt(time[2]));
    var week = (parseInt((totalTime - startTime) / 7 + 1));
    var day = ((totalTime - startTime) % 7 + 1);

    var requestData = {
      apikey: "camustest",
      apisecret: "camustest"
    };

    if(!doc){
      res.render('student/schedule', {
        title: '今日课程',
        schedule: {
          classes: []
        },
        week:week,
        day:day
      });
    }
    var username = doc.studentnumber;
    request({
      method: 'POST',
      url: 'http://se.zhuangty.com:8000/curriculum/' + username,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    }, function (error, response, body) {
      if (response.statusCode === 200) {
        var schedule = JSON.parse(body);
        res.render('student/schedule', {
          title: '今日课程',
          schedule: schedule,
          week:week,
          day:day
        });
      }
    });
  });
});

module.exports = router;