
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// 创建socket服务
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
// 房间用户名单
var roomList = {};


io.on('connection', function(socket){
  	var roomID;
  	var user;

	socket.on('connect', function(obj){
		roomID = obj.openid + obj.course;
	});

	socket.on('join', function(obj){
		roomID = obj.openid + obj.course;
		user = obj.openid;
		socket.join(roomID);
		socket.to(roomID).emit('join', {roomID:roomID, user:user});
	});

	socket.on('leave', function(){
		socket.emit('disconnect');
	});

	socket.on('message', function(msg){
		socket.in(roomID).emit('msg', user, msg);
	});

	socket.on('disconnect', function(){
		socket.leave(roomID);
	});
});

router.get('/', function (req, res, next){
	var roomID = req.session.openid + req.session.course;
	// console.log(req.session.openid);
	// console.log(req.session.course);
	res.render('message', {
		course: req.session.course,
		roomID: roomID
	});
});

router.get('/:course', function (req, res, next){
	var roomID = req.session.openid + req.body.course;
	res.redirect('/message');
	res.render('message', {
		course: req.body.course,
		roomID: roomID
	});
});

server.listen(4000, function () {
  console.log('server listening on port 4000');
});

module.exports = router;
