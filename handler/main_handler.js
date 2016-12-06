var accountHandler = require('./account_handler');
var lessonHandler = require('./lesson_handler');
var messageHandler = require('./message_handler');
var scheduleHandler = require('./schedule_handler');
var librarySeatHandler = require('./library_seat_handler');
var accountUnbindHandler = require('./account_unbind_handler');

var checkEmpty = function (msg) {
  return true;
};

var handleEmpty = function (msg, res) {
  res.reply("抱歉，没有你想要的信息:(");
};

var pattern = [
  [accountHandler.checkBindAccount,           accountHandler.handleBindAccount],
  [accountUnbindHandler.checkUnbindAccount,  accountUnbindHandler.handleUnbindAccount],
  [lessonHandler.checkListLesson,             lessonHandler.handleListLesson],
  [scheduleHandler.checkListSchedule,         scheduleHandler.handleListSchedule],
  [librarySeatHandler.checkListLibrarySeat,  librarySeatHandler.handleListLibrarySeat],
  [messageHandler.checkSendMessage,           messageHandler.handleSendMessage],
  [checkEmpty,                                handleEmpty]
];

module.exports = function (req, res){
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
  // console.log(req.weixin);
  for(var i = 0; i < pattern.length; ++i){
    if (pattern[i][0](message)){
      pattern[i][1](req, res);
      return;
    }
  }
};