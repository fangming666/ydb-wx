// pages/my-item/myServer/myServer.js
let dataJson = require("./../../import/getData.js");
let studentId = "";
let sessionKey = "";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childArr: [],//绑定孩子列表的数组
    childIndex: 0,//孩子列表头部的active效果
    vipTime: "",
    serverHeadImg: "./../../../imgs/server-head.svg",//个性化服务头部的图片
    serverHaveHeadImg: "./../../../imgs/server-have-bg.svg",//个性化服务付费以后的头部图片
    imperialCrownImage: "./../../../imgs/imperial_crown.svg",//皇冠的图片
    serevrSekectIndex: 0,//头部select的初始index
    selectArr: ["按考试付费", "按时间付费"],//头部的显示文字
    examNoImage: "./../../../imgs/server-no.svg",//考试为空时候的图片
    examArr: [],//考试列表
    timeArr: [],//考试时间列表
    noExamSwitch: false,//有无考试的开关
    wrongSwitch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let that = this;
    if (option.studentId) {
      studentId = option.studentId;
    }
    sessionKey = wx.getStorageSync("userInfo").session_key;
    dataJson.childList(sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.status == 200) {
        let arr = [];
        for (let i in res.data) {
          if ((res.data[i].school_type == "pay" || res.data[i].school_type == "customer") && res.data[i].status) {
            arr.push(res.data[i])
          }
        }
        for (let i in arr) {
          if (arr[i].student_id == studentId) {
            that.setData({
              childIndex: i
            })
          }
        }
        if (arr[0].endtime) {
          that.setData({
            vipTime: arr[0].enddate
          })
        }
        that.setData({
          childArr: arr
        })
        /*获取按考试付费的列表*/
        that.examList(studentId, sessionKey);
      }
    }).catch(() =>{
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })


  },

  onUnload: function () {
    app.globalData.examLoadSwitch = true;
  },
  /*改变头部的样式*/
  changeSelect(e) {
    let that = this;
    this.setData({
      serevrSekectIndex: e.currentTarget.dataset.index
    })
    if (this.data.serevrSekectIndex) {
      dataJson.timeServerList(studentId, sessionKey).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        if (res.data.status == 200) {
          that.setData({
            timeArr: res.data.data
          })
        }
      }).catch(() =>{
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
      })
    } else {
      this.examList(studentId, sessionKey);
    }
  },
  /**孩子的头部点击事件**/
  childChange(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    this.setData({
      childIndex: index,
    });
    if (this.data.childArr[index].endtime) {
      that.setData({
        vipTime: this.data.childArr[index].enddate
      })
    } else {
      that.setData({
        vipTime: ""
      })
    }
    studentId = e.currentTarget.dataset.id;
    if (this.data.serevrSekectIndex) {
      dataJson.timeServerList(studentId, sessionKey).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        if (res.data.status == 200) {
          that.setData({
            timeArr: res.data.data
          })
        }
      }).catch(() =>{
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
      })
    } else {
      this.examList(studentId, sessionKey);
    }
  },
  /**获取考试列表的封装函数**/
  examList(studentId, sessionKey) {
    let that = this;
    dataJson.examServerList(studentId, sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        console.log(res)
        this.setData({
          examArr: res.data.data,
          noExamSwitch: false
        })
      } else if (res.data.status == 408) {
        that.setData({
          noExamSwitch: true
        })
      }
    }).catch(() =>{
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
  },


  /***进行付费***/
  goMoney(e) {
    let that = this;
    dataJson.goMoney(studentId, e.currentTarget.dataset.type, e.currentTarget.dataset.examid, e.currentTarget.dataset.scheme, sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status != 200) {
        wx.showModal({
          title: res.data.msg,
          showCancel: false,
          confirmText: "我知道了",
          confirmColor: "#1AAD19"
        })
      } else {
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': res.data.data.signType,
          'paySign': res.data.data.paySign,
          'success': function (res) {
            wx.getStorage({
              key: `${studentId}exam`,
              success: function (res) {
                wx.removeStorageSync(`${studentId}exam`)
              },
            })
            if (!that.data.serevrSekectIndex) {
              let arr = [];
              for (let i in that.data.examArr) {
                arr.push(that.data.examArr[i]);
                if (that.data.examArr[i].exam_id == e.currentTarget.dataset.examid) {
                  arr[i].switchS = true
                }
              }
              that.setData({
                examArr: arr
              })
            } else {
              dataJson.childList(sessionKey).then(res => {
                that.setData({
                  wrongSwitch: app.globalData.wrongSwitch
                })
                if (res.status == 200) {
                  let arr = [];
                  for (let i in res.data) {
                    if (res.data[i].school_type == "pay" || res.data[i].school_type == "customer") {
                      arr.push(res.data[i])
                    }
                  }
                  for (let i in arr) {
                    if (arr[i].student_id == studentId) {
                      that.setData({
                        childIndex: i
                      })
                    }
                  }
                  if (arr[that.data.childIndex].endtime) {
                    that.setData({
                      vipTime: arr[that.data.childIndex].enddate
                    })
                  }

                }
              }).catch(() =>{
                that.setData({
                  wrongSwitch: app.globalData.wrongSwitch
                })
              })
            }

          },
          'fail': function (res) {
          }
        })
      }
    }).catch(() =>{
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    });
  }
})