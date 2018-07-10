// pages/my-item/mySuggestion/mySuggestion.js
let dataJson = require("./../../import/getData.js");
const app = getApp();
let info = "";//输入的内容
let sessionKey = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wrongSwitch: false,
    suggestionImg: "./../../../imgs/suggest.svg",//头部的建议图像
    textInfo: ""//输入的内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wrongSwitch: false,
    })
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        sessionKey = res.data.session_key
      },
    })
  },

  //输入的内容
  inputInfo(e) {
    info = e.detail.value;
  },

  /*提交意见*/
  submitInfo() {
    let that = this;
    if (!info) {
      wx.showToast({
        title: '还没填写您的意见',
        icon: 'none',
        duration: 1000
      })
    } else {
      dataJson.feedBack(info, sessionKey).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        if (res.data.status == 200) {
          wx.showToast({
            title: '感谢您的意见',
            icon: 'success',
            duration: 2000
          })

          setTimeout(() => {
            wx.switchTab({
              url: '/pages/my/my',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          }, 2500)

        }
      }).catch(() =>{
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
      })

    }

  }
})