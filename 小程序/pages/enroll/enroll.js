let dataJson = require("./../import/getData.js");
const app = getApp();
let sessionKey = "";
let phoneNum = "";//输入的手机号码
let identifying = "";//输入的验证码
let result = "";//用来区分注册还是修改（1）手机号
let childCode = "";//用来区分是不是扫码进来然后进行注册
Page({
  /**
   * 页面的初始数据
   */
  data: {
    disabledSwitch: true,//按钮的点击状态
    sendSwitch: false,//获取验证码的点击状态
    errInfo: "确认密码输入错误",
    errSwitch: false,
    countNum: 90,//倒计时
    plaInfo: "填写手机号",//手机号码输入框的文字
    wrongSwitch: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {

    childCode = "", phoneNum = "", identifying = "";
    this.setData({
      wrongSwitch: false
    })
    if (option.result) {
      result = option.result;
      wx.setNavigationBarTitle({
        title: '修改手机号'
      })
      this.setData({
        plaInfo: "请输入新手机号"
      })
    } else {
      childCode = +option.result;
      wx.setNavigationBarTitle({
        title: '注册手机号'
      })
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow: function () {
    /**扫码进行邀请的时候的show周期**/
    if (childCode) {
      wx.login({
        success: res => {
          wx.request({
            url: `${baseUrl}/login`,
            data: {
              code: res.code
            },
            method: "POST",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {
              if (res.data.data.user_id) {
                /**当已经注册了，就自动跳到扫码邀请进来的页面**/
                let studentId = wx.getStorageSync("studentId")
                wx.redirectTo({
                  url: `/pages/my-item/childCode/childCode?studentId=${studentId}`
                });
              }

            }
          })
        }
      })
    }
  },
  /**获得输入的手机号码**/
  getPhone(e) {
    phoneNum = +e.detail.value;
    if (phoneNum && identifying) {
      this.setData({
        disabledSwitch: false
      })
    }
  },
  /**点击获取验证码**/
  getCode() {
    let that = this;
    if (!(/^[1][3,4,5,7,8][0-9]{9}$/).test(phoneNum)) {
      this.setData({
        errInfo: "手机号码格式错误",
        errSwitch: true
      });
      setTimeout(() => {
        that.setData({
          errSwitch: false
        });
      }, 5000)

    } else {
      sessionKey = wx.getStorageSync("userInfo").session_key;
      let userId = wx.getStorageSync("userInfo").user_id
      if (result) {
        console.log(sessionKey, phoneNum)
        dataJson.reviseSend(sessionKey, phoneNum).then(phoneRes => {
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch
          })
          if (app.globalData.wrongSwitch) {
            return
          };
          if (phoneRes.data.status == 200) {
            that.setData({
              sendSwitch: true
            });
            let countFun = setInterval(() => {
              if (that.data.countNum === 0) {
                clearInterval(countFun);
                that.setData({
                  sendSwitch: false
                })
              } else {
                that.setData({
                  countNum: that.data.countNum - 1
                })
              }
            }, 1000);

          } else if (res.data.status == 303) {
            wx.showModal({
              title: "请更改手机号",
              content: phoneRes.data.msg,
              showCancel: false,
              confirmText: "我知道了",
              confirmColor: "#1AAD19"
            })
          } else {
            wx.showModal({
              title: phoneRes.data.msg,
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
      } else {
        dataJson.getPhoneCode(phoneNum, userId).then(phoneRes => {
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch
          })
          if (phoneRes.data.status != 200) {
            that.setData({
              errInfo: phoneRes.data.msg,
              errSwitch: true
            });
            setTimeout(() => {
              that.setData({
                errSwitch: false
              });
            }, 5000)
          } else {
            that.setData({
              errSwitch: false,
              sendSwitch: true
            });
            let countFun = setInterval(() => {
              if (that.data.countNum === 0) {
                clearInterval(countFun);
                that.setData({
                  sendSwitch: false
                })
              } else {
                that.setData({
                  countNum: that.data.countNum - 1
                })
              }
            }, 1000);
          }
        }).catch(() => {
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch
          })
        })
      }
    }

  },

  /**开始输入验证码**/
  startValidate() {
    if (phoneNum && identifying) {
      this.setData({
        disabledSwitch: false
      })
    }
  },

  /**输入的验证码**/
  getIdentifying(e) {
    identifying = +e.detail.value;
    if (phoneNum && identifying) {
      this.setData({
        disabledSwitch: false
      })
    }
  },

  /***提交验证码***/
  submitIdentifying() {
    let that = this;
    //修改手机号码时候的操作 
    if (result) {
      console.log(sessionKey, phoneNum, identifying);
      dataJson.reviseUpdatePhone(sessionKey, phoneNum, identifying).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        if (res.data.status == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          let userInfo = wx.getStorageSync("userInfo");
          userInfo.phone = phoneNum;
          wx.setStorageSync("userInfo", userInfo)
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

        } else {
          wx.showModal({
            title: res.data.msg,
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
    } else {
      dataJson.submitIdentifying(phoneNum, identifying).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        if (res.data.status !== 200) {
          that.setData({
            errInfo: res.data.msg,
            errSwitch: true
          });
          setTimeout(() => {
            that.setData({
              errSwitch: false
            });
          }, 5000)
        } else {
          that.setData({
            errSwitch: false
          });
          wx.getStorage({
            key: 'userInfo',
            success: function (userInfo) {
              dataJson.register(phoneNum, userInfo.data.open_id, userInfo.data.union_id, userInfo.data.session_key).then(res => {
                that.setData({
                  wrongSwitch: app.globalData.wrongSwitch
                })
                if (res.data.status === 200) {
                  wx.showToast({
                    title: '验证成功',
                    icon: 'success',
                    duration: 2000
                  });
                  let userInfo = wx.getStorageSync("userInfo");
                  userInfo.user_id = res.data.data.user_id;
                  wx.setStorageSync("userInfo", userInfo)
                  wx.setStorage({
                    key: 'user_id',
                    data: res.data.data.user_id,
                  });
                  if (childCode) {
                    setInterval(() => {
                      let studentId = wx.getStorageSync("studentId")
                      wx.redirectTo({
                        url: '/pages/my-item/childCode/childCode?studentId=studentId'
                      });
                    }, 2000)
                  } else {
                    dataJson.childList(userInfo.data.session_key).then(res => {
                      that.setData({
                        wrongSwitch: app.globalData.wrongSwitch
                      })
                      if (!res.length) {
                        wx.navigateTo({
                          url: '/pages/bind/bind?result=1',
                        })
                      } else {
                        wx.navigateTo({
                          url: '/pages/exam/exam',
                        })
                      }
                    })
                  }

                }
              })
            },
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