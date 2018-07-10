const app = getApp();
const baseUrl = app.globalData.baseUrl;
const header = { 'content-type': 'application/x-www-form-urlencoded' };
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rowImg: "./../../imgs/row.svg",//右边的箭头
    toolArr: [{ image: "./../../imgs/mall.svg", title: "园丁邦商城", text: "将知识简单化，提升孩子学习力。" }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.currentExam !== null) { 
      app.globalData.currentExam.abort();
    }
    let sessionKey = wx.getStorageSync("userInfo").session_key;
  },
  onShow: function () {
    app.globalData.examLoadSwitch = true;
  },
  /***页面上那几个大块块的点击事件***/
  toTool(e) {
    console.log(e.currentTarget.dataset.index)
    if (!e.currentTarget.dataset.index) {
      console.log("打开新的小程序")
      wx.navigateToMiniProgram({
        appId: 'wx3536b3bbd1528ac4',
        path: 'pages/shelf/shelf?shelf_id=3',
        envVersion: 'release',
        success(res) {
          // 打开成功
        }
      })
    }
  },

})