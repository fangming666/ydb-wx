
let dataJson = require("./../import/getData.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goBindImg: "./../../imgs/go-bind.svg"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  goBind() {
    let userId = wx.getStorageSync("user_id");
    if (!userId) {
      wx.navigateTo({
        url: '/pages/enroll/enroll',
      })
    } else {
      let sessionKey = wx.getStorageSync("userInfo").session_key;
      dataJson.childList(sessionKey).then(res => {
        if (res.status == 200) {
          if (res.data.length >= 3) {
            wx.showModal({
              title: '您的绑定尚未通过审核，请在通过审核后再使用此功能。',
              showCancel: false,
              confirmText: "我知道了",
              confirmColor: "#1AAD19"
            })
          } else {
            wx.navigateTo({
              url: '/pages/bind/bind',
            })
          }
        }
      })
    }


  }
})