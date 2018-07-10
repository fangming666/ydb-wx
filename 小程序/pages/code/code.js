
const dataJson = require("./../import/getData.js");
const app = getApp();
const baseUrl = app.globalData.baseUrl;
const login = require("./../import/login.js").login;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    codeImg: "./../../imgs/code.svg",
    wrongSwitch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.codeSwitch = true;
  },
  onHide: function () {
    app.globalData.codeSwitch = false;
  },
  onShow: function () {
    if (!app.globalData.codeSwitch) {
      this.setData({
        wrongSwitch: false
      });
      login();
    }
  },


})