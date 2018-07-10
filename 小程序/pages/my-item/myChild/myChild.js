let sessionKey = "";
let dataJson = require("./../../import/getData.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myChildArr: [],//孩子的列表
    userId: "",//登陆者的userId
    wrongSwitch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    sessionKey = wx.getStorageSync("userInfo").session_key;
    that.setData({
      userId: wx.getStorageSync("user_id"),
      wrongSwitch: false
    })
    //获取孩子列表
    wx.showLoading({
      title: '加载中',
    })
    dataJson.childList(sessionKey).then(res => {
      console.log("child", res)
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      wx.hideLoading();
      if (res.status == 200) {
        let arr = [];
        for (let i in res.data) {
          arr.push(res.data[i])
        }
        that.setData({
          myChildArr: arr
        })
      }
    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })




  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    this.onLoad();
  },
  onUnload: function () {
    app.globalData.examLoadSwitch = true;
    app.globalData.myLoadSwitch = true;
  },
  /**跳转到绑定孩子**/
  toBind() {
    if (this.data.myChildArr.length < 3) {
      wx.navigateTo({
        url: '/pages/bind/bind',
      })
    } else {
      wx.showToast({
        title: '已达到绑定限额',
        icon: "none",
        duration: 2000
      })
    }

  },
  /*跳转到修改密码*/
  toPassword(e) {
    wx.navigateTo({
      url: `/pages/my-item/password/password?index=${e.currentTarget.dataset.index}`,
    })
  },

  /**解除绑定**/
  contactBinding(e) {
    let that = this;
    let student_id = e.currentTarget.dataset.studentid;
    let student_name = e.currentTarget.dataset.realname;
    console.log(student_id, student_name)
    dataJson.delteChildProving(student_id, sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        wx.showModal({
          title: `是否解除对${student_name}的绑定`,
          confirmText: "确定",
          confirmColor: "#1AAD19",
          cancelText: "取消",
          cancelColor: "#000000",
          success: function (res) {
            if (res.confirm) {
              dataJson.delteChild(student_id, sessionKey).then(res => {
                that.setData({
                  wrongSwitch: app.globalData.wrongSwitch
                })
                if (res.data.status == 200) {
                  dataJson.childList(sessionKey).then(res => {
                    that.setData({
                      wrongSwitch: app.globalData.wrongSwitch
                    })
                    if (res.status == 200) {
                      that.setData({
                        myChildArr: res.data
                      })
                      if (!res.data.length) {
                        setTimeout(() => {
                          wx.navigateTo({
                            url: '/pages/bind/bind?result=2',
                          })
                        }, 2000)
                      }
                      wx.showToast({
                        title: '解除成功',
                        icon: "success",
                        duration: 2000
                      })
                      wx.getStorage({
                        key: `${student_id}exam`,
                        success: function (res) {
                          wx.removeStorageSync(`${student_id}exam`)
                        },
                      })

                    }
                  }).catch(() => {
                    that.setData({
                      wrongSwitch: app.globalData.wrongSwitch
                    })
                  })
                } else if (res.data.status == 303) {
                  let parentId = res.data.data.parent_id ? res.data.data.parent_id : "";
                  wx.showModal({
                    content: res.data.msg,
                    confirmText: "确定",
                    confirmColor: "#1AAD19",
                    cancelText: "取消",
                    cancelColor: "#000000",
                    success: function (res) {
                      if (res.confirm) {
                        dataJson.transferDelete(student_id, parentId, sessionKey).then(res => {
                          that.setData({
                            wrongSwitch: app.globalData.wrongSwitch
                          })
                          if (res.data.status == 200) {
                            dataJson.childList(sessionKey).then(res => {
                              that.setData({
                                wrongSwitch: app.globalData.wrongSwitch
                              })
                              if (res.status == 200) {
                                that.setData({
                                  myChildArr: res.data
                                })
                                if (!res.data.length) {
                                  wx.navigateTo({
                                    url: '/pages/bind/bind?result=2',
                                  })
                                }
                                wx.showToast({
                                  title: '操作成功',
                                  icon: "success",
                                  duration: 2000
                                })

                              }
                            }).catch(() => { })
                            that.setData({
                              wrongSwitch: app.globalData.wrongSwitch
                            })
                          }
                        }).catch(() => {
                          that.setData({
                            wrongSwitch: app.globalData.wrongSwitch
                          })
                        })
                      }
                    }
                  })
                } else {
                  wx.showModal({
                    content: res.data.msg,
                    showCancel: false,
                    confirmText: "我知道了",
                    confirmColor: "#1AAD19"
                  })
                }
              }).catch(() => {
                that.setData({
                  wrongSwitch: app.globalData.wrongSwitch
                })
              })
            }
          }
        })
      } else if (res.data.status == 303) {
        let parentId = res.data.data.parent_id ? res.data.data.parent_id : "";
        wx.showModal({
          content: res.data.msg,
          confirmText: "确定",
          confirmColor: "#1AAD19",
          cancelText: "取消",
          cancelColor: "#000000",
          success: function (res) {
            if (res.confirm) {
              dataJson.transferDelete(student_id, parentId, sessionKey).then(res => {
                that.setData({
                  wrongSwitch: app.globalData.wrongSwitch
                })
                if (res.data.status == 200) {
                  dataJson.childList(sessionKey).then(res => {
                    that.setData({
                      wrongSwitch: app.globalData.wrongSwitch
                    })
                    if (res.status == 200) {
                      that.setData({
                        myChildArr: res.data
                      })
                      if (!res.data.length) {
                        wx.navigateTo({
                          url: '/pages/bind/bind?result=2',
                        })
                      }
                      wx.showToast({
                        title: '操作成功',
                        icon: "success",
                        duration: 2000
                      })

                    }
                  }).catch(() => {
                    that.setData({
                      wrongSwitch: app.globalData.wrongSwitch
                    })
                  })
                }
              }).catch(() => { })
              that.setData({
                wrongSwitch: app.globalData.wrongSwitch
              })
            }
          }
        })
      } else {
        wx.showModal({
          content: res.data.msg,
          showCancel: false,
          confirmText: "我知道了",
          confirmColor: "#1AAD19"
        })
      }
    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })





  }
})