/**获取考试列表信息的函数**/
let getExamData = (studentId, sessionKey, showLoading, examThis, pubStudentId, dataJson, app) => {
  let that = examThis;
  sessionKey = wx.getStorageSync("userInfo").session_key;
  wx.getStorage({
    key: `${studentId}exam`,
    success: function (res) {
      console.log("获取缓存成功");
      if (showLoading) {
        wx.hideLoading();
      }
      if (pubStudentId !== studentId) {
        return;
      }
      that.setData({
        examArr: res.data[0].examArr,
        grade: res.data[0].grade,
        shelterSwitch: true
      })
      let storeLastCache = res.data[0].lastCache;
      dataJson.getExam(studentId, sessionKey).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        if (res.data.status == 200 && !that.data.wrongSwitch) {
          that.setData({
            examArr: res.data.data,
            grade: res.data.data[0].level_desc,

          })
          //进行考试报告清理缓存的遍历 
          that.data.examArr.map(item => {
            if (item.last_cache - storeLastCache) {//当请求里面的last_cache有变化，就去更新报告的缓存
              try {
                var allStore = wx.getStorageInfoSync()
                allStore.map(storeItem => {
                  if (storeItem.split("report").length) {
                    wx.removeStorageSync(storeItem);
                  }
                })
              } catch (e) {
              }
            }
          })
          wx.setStorage({
            key: `${studentId}exam`,
            data: [{ examArr: that.data.examArr, grade: that.data.grade }],
          })
        }
      }).catch(() => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch,

        })
      })
    },
    /**首次的时候进行缓存数据**/
    fail: function () {
      console.log("获取缓存失败");
      if (showLoading) {
        wx.showLoading({
          title: '加载中',
        })
      }
      dataJson.getExam(studentId, sessionKey).then(res => {

        if (showLoading) {
          wx.hideLoading();
        }
        if (pubStudentId !== studentId) {
          return;
        }
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        if (res.data.status == 200 && !that.data.wrongSwitch) {
          that.setData({
            examArr: res.data.data,
            grade: res.data.data[0].level_desc,
            shelterSwitch: true
          });
          wx.setStorage({
            key: `${studentId}exam`,
            data: [{ examArr: that.data.examArr, grade: that.data.grade }],

          })
        }
      }).catch(() => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch,
          shelterSwitch: true
        })
      })
    }
  })
}
module.exports = {
  getExamData: getExamData
}