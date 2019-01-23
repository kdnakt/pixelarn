
Date.prototype.getWeek = function () {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

  var newYear = new Date(this.getFullYear(),0,1);
  var day = newYear.getDay(); //the day of week the year begins on
  day = (day >= 0 ? day : day + 7);
  var daynum = Math.floor((this.getTime() - newYear.getTime() - 
    (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if(day < 4) {
    weeknum = Math.floor((daynum+day-1)/7) + 1;
    if(weeknum > 52) {
      var nYear = new Date(this.getFullYear() + 1,0,1);
      var nday = nYear.getDay();
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
       the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
      if (weeknum === 1) {
        this.NEWYEAR = true;
      }
    }
  } else {
    weeknum = Math.floor((daynum+day-1)/7);
  }
  return weeknum;
};

Date.prototype.getWeekYear = function (callGetWeek) {
  if (callGetWeek) this.getWeek()//check NEWYEAR flg
  let year = this.getFullYear()
  if (this.NEWYEAR) {
    year++
  }
  return year
};

export default Date