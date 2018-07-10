// pages/my-item/directoryContent/directoryContent.js
let dataJson = require("./../../import/getData.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",//标题
    helpIcon: "./../../../imgs/help-icon.svg",
    nodes: "",
    wrongSwitch: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let that = this;
    this.setData({
      wrongSwitch: false
    })

    dataJson.helpContent(option.id).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      console.log(res.data.data.content)
      if (res.data.status == 200) {
        that.setData({
          title: res.data.data.title,
          nodes: res.data.data.content
        })
      }

    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
  },
  onShow: () => {
    // if (this.data.wrongSwitch) {
    //   this.onLoad();
    // }
  }

})