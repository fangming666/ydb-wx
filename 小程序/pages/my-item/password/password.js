// pages/my-item/password/password.js
let dataJson = require("./../../import/getData.js");
const app = getApp();
let pwd = "";//输入的密码
let pwdAgain = "";//再次输入的密码
let studentId = "";//学生的id
let sessionKey = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wrongSwitch: false,
    pswDisabled: true,//按钮的状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let that = this;
    this.setData({
      wrongSwitch:false
    })
    sessionKey = wx.getStorageSync("userInfo").session_key;
    dataJson.childList(sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.status == 200) {
        studentId = res.data[option.index].student_id;
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

  /**获得输入的密码**/
  inputPwd(e) {
    pwd = e.detail.value;
    if (pwd && pwdAgain) {
      this.setData({
        pswDisabled: false
      })
    } else {
      this.setData({
        pswDisabled: true
      })
    }
  },

  /**获得再次输入密码**/
  inputPwdAgain(e) {
    pwdAgain = e.detail.value;
    if (pwd && pwdAgain) {
      this.setData({
        pswDisabled: false
      })
    } else {
      this.setData({
        pswDisabled: true
      })
    }
  },
  /**确定事件**/
  vaildate() {
    console.log(studentId, pwd, pwdAgain, sessionKey);
    let result = /^[a-zA-Z0-9]{6,}$/
    if (pwd.length < 6 || pwdAgain < 6) {

      wx.showToast({
        title: '请设置6位以上的密码',
        icon: 'none',
        duration: 1000
      })
    } else if (!result.test(pwd) || !result.test(pwdAgain)) {
      wx.showToast({
        title: '密码格式不正确',
        icon: 'none',
        duration: 1000
      })
    } else if (pwd != pwdAgain) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
        duration: 1000
      })
    } else {
      dataJson.setPwd(studentId, pwd, pwdAgain, sessionKey).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        if (res.status == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          app.globalData.myLoadSwitch = true
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }).catch(() =>{
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
      })
    }


  }
})