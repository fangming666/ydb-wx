// pages/my-item/myOrder/myOrder.js
let dataJson = require("./../../import/getData.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderArr: [],//订单的数组
    orderNoImg: "./../../../imgs/order-no.svg",
    wrongSwitch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({
      wrongSwitch: false
    })
    dataJson.order(wx.getStorageSync("userInfo").session_key).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        that.setData({
          orderArr: res.data.data
        })
      }
    }).catch(() =>{
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})