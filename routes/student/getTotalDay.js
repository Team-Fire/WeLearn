//当年到此时的天数
exports.getTotalDay = function(year, month, day){
  var totalDays = 0;
  for(var i = 1; i < month; i++){
    if(i === 1 || i === 3 || i === 5 || i === 7 || i === 8 || i=== 10 || i === 12){
      totalDays += 31;
    }
    else if(i == 4 || i === 6 || i === 9 || i === 11){
      totalDays += 30;
    }
    else if(i === 2){
      if((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0){
        totalDays += 29;
      }
      else
        totalDays += 28;
    }
  }
  totalDays += day;
  return totalDays;
};