/**
 * 清空数据库中所有的数据并且插入一些数据
 */

var Student = require('./../Models/Student');
var Course = require('./../Models/Course');
var setting = require('./../setting');

module.exports = function () {
  Student.remove({}, function (err, doc) {});
  Course.remove({}, function (err, doc) {});

  var student1 = {
    openid: setting.teacherOpenid,
    studentnumber: '2014444444',
    realname: '小号',
    position: 'teacher',
    department: '软件学院',
    email: 'xh@mails.tsinghua.edu.cn',
    course: ['计算机与网络体系结构(1)(0)(2016-2017秋季学期)']
  };
  var studentObj1 = new Student(student1);
  studentObj1.save();

  var student2 = {
    openid: setting.studentOpenid,
    studentnumber: '2014013420',
    realname: '秦堤',
    position: 'undergraduate',
    department: '软件学院',
    email: 'qd14@mails.tsinghua.edu.cn',
    course: ['计算机与网络体系结构(1)(0)(2016-2017秋季学期)']
  };
  var studentObj2 = new Student(student2);
  studentObj2.save();

  var course1 = {
    courseid: '136947',
    coursename: '计算机与网络体系结构(1)(0)(2016-2017秋季学期)',
    student: [{name: '秦堤', openid: setting.studentOpenid}],
    teacher: [{name: '小号', openid: setting.teacherOpenid}]
  };
  var courseObj1 = new Course(course1);
  courseObj1.save(function (err) {
    if (err){
      console.log(err);
    }
  });
};