/**初始的时候加载数据**/
const getExamData = require("./getExamData.js").getExamData;
let showpageData = (sessionKey, studentId, pubStudentId, dataJson, examThis, app) => {
  let userId = wx.getStorageSync("userInfo").user_id, that = examThis;
  app.globalData.examStudentId = "";
  if (userId == undefined) {
    return;
  }
  that.setData({
    user_id: userId,
    wrongSwitch: app.globalData.wrongSwitch
  })
  if (userId) {
    sessionKey = wx.getStorageSync("userInfo").session_key;
    dataJson.childList(sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch,
        childIndex: 0
      })
      if (res.status == 200) {
        let arr = [];
        for (let i in res.data) {
          if (res.data[i].status) {
            arr.push(res.data[i])
          }
        }
        that.setData({
          childArr: arr,
        })
        if (arr.length) {
          studentId = studentId ? studentId : arr[0].student_id;
          pubStudentId = studentId;
          app.globalData.examStudentId = studentId;
          that.setData({
            childName: arr[that.data.childIndex].real_name,
            schoolType: arr[that.data.childIndex].school_type
          })
          getExamData(studentId, sessionKey, true, that, pubStudentId, dataJson, app);
        }
      }
    })
  } else {
    that.setData({
      shelterSwitch: true,
    })
  }
  that.setData({
    wrongSwitch: app.globalData.wrongSwitch
  })

};
module.exports = {
  showpageData: showpageData,
}