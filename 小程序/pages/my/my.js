
const app = getApp();
let dataJson = require("./../import/getData.js");
let openInvite = require("./openInvite.js").openInvite;
let sessionKey = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myArr: [{ img: "./../../imgs/my-child.svg", text: "我的孩子", src: "/pages/my-item/myChild/myChild" }, { img: "./../../imgs/my-family.svg", text: "家庭成员", src: "/pages/my-item/myFamily/myFamily" }, { img: "./../../imgs/my-serve.svg", text: "个性化服务", src: "/pages/my-item/server/server" }, { img: "./../../imgs/my-order.svg", text: "历史订单", src: "/pages/my-item/myOrder/myOrder", result: true }, { img: "./../../imgs/my-directory.svg", text: "使用指南", src: "/pages/my-item/myDirectory/myDirectory", result: true }, { img: "./../../imgs/my-suggestion.svg", text: "意见反馈", src: "pages/my-item/mySuggestion/mySuggestion", src: "/pages/my-item/mySuggestion/mySuggestion", result: true }],//个人中心列表
    childName: [],//孩子的姓名
    userId: "",//登陆者的userid
    rowImg: "./../../imgs/row.svg",//右边的箭头
    headPortrait: "./../../imgs/default-head.svg",//空头像的图片
    userInfo: {},//个人信息
    hasUserInfo: false,
    myPhone: "",//当前人的手机号
    inviteSwitch: false,//绑定孩子悬浮窗的开关
    degreeArr: [],//当前人对于孩子角色的数组
    redSwitch: false,//红点的显示开关
    wrongSwitch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.currentExam !== null) {
      app.globalData.currentExam.abort();
    }
    let that = this;
    app.globalData.myLoadSwitch = false;
    this.setData({
      inviteSwitch: false,
      redSwitch: false,
      wrongSwitch: false
    })
    sessionKey = wx.getStorageSync("userInfo").session_key;
    that.setData({
      nickName: wx.getStorageSync("userInfo").nick_name,
      headPortrait: wx.getStorageSync("userInfo").head_image_url,
      userId: wx.getStorageSync("userInfo").user_id,
      myPhone: wx.getStorageSync("userInfo").phone ? wx.getStorageSync("userInfo").phone : ""
    })
    /*获取孩子的列表*/
    dataJson.childList(sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (that.data.wrongSwitch) {
        app.globalData.myLoadSwitch = true
      }
      if (res.status == 200) {
        let arr = [];
        let degreeArr = [];
        for (let i in res.data) {
          if (res.data[i].status) {
            arr.push(res.data[i])
          }
        }
        for (let i in arr) {
          degreeArr.push({ "text": `${arr[i].real_name}的${arr[i].roleLabel}`, "primary_contact": arr[i].primary_contact })
        }
        that.setData({
          childName: res.data,
          degreeArr: degreeArr
        })
        if (res.data.length >= 3) {
          that.setData({
            inviteSwitch: false
          })
        } else {
          that.setData({
            inviteSwitch: true
          })
        }
        return arr
      }
    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (that.data.wrongSwitch) {
        app.globalData.myLoadSwitch = true
      }
    }).then(arr => {
      //当有审核的时候，个人中心出现红点
      arr.map(item => {
        dataJson.getFamily(item.student_id, sessionKey).then(res => {
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch
          })
          if (that.data.wrongSwitch) {
            app.globalData.myLoadSwitch = true
          }
          if (res.status == 200) {
            let arr = [];
            for (let i in res.data) {
              if (!res.data[i].status) {
                arr.push(res.data[i])
              }
            }
            if (arr.length) {
              wx.showTabBarRedDot({
                index: 2
              })
              that.setData({
                redSwitch: true
              })
            } else {
              wx.hideTabBarRedDot({
                index: 2
              })
              that.setData({
                redSwitch: false
              })
            }
          }
        }).catch(() => {
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch
          })
          if (that.data.wrongSwitch) {
            app.globalData.myLoadSwitch = true
          }
        })
      })
    })

  },

  onShow: function () {
    if (app.globalData.currentExam !== null) {
      app.globalData.currentExam.abort();
    }
    app.globalData.examLoadSwitch = true;
    if (app.globalData.myLoadSwitch) {
      this.onLoad();
    }
  },



  /**点击进行跳转**/
  toNav(e) {
    if (e.currentTarget.dataset.result || this.data.degreeArr.length || !e.currentTarget.dataset.index && this.data.childName.length) {
      wx.navigateTo({
        url: `${e.currentTarget.dataset.src}`,
      })
    } else {
      /**跳转到绑定孩子的页面**/
      openInvite(this.data.childName)
    }
  },
  openInviteFun(){
    openInvite(this.data.childName)
  }

})