// pages/my-item/myDirectory /directory.js
let dataJson = require("./../../import/getData.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wrongSwitch: false,
    directoryArr: []//使用指南的数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({
      wrongSwitch: false,
    })

    dataJson.help().then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        console.log(res);
        that.setData({
          directoryArr: res.data.data
        })
      }
    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
  },
  /**跳到内容上去**/
  toContent(e) {
    wx.navigateTo({
      url: `/pages/my-item/directoryContent/directoryContent?id=${e.currentTarget.dataset.id}`,
    })
  }
})