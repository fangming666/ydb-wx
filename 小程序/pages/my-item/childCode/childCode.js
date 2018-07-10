const app = getApp();
const baseUrl = app.globalData.baseUrl;
const dataJson = require("./../../import/getData.js");
let studentId = "", session_key = "", roleId = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childSwitch: true,//孩子列表的显示开关
    roleSwitch: true,//选择角色的开关
    bindSuccessSwitch: false,//绑定成功的开关
    feedbackSwitch: false,//需要审核的开关
    bindErrSwitch: false,//绑定失败的开关
    roleArr: [],//家庭角色的数组
    childName: "",//学生的姓名
    Childclass: "",//学生的班级
    childSchool: "",//学生的学校
    roleIndex: -1,//选择角色的index
    protocol: false,//协议的开关
    closeImg: "./../../../imgs/close.png",//关闭的图片
    agreeSwitch: true,//同意协议并绑定的按钮disabled开关
    roleArr: ["爸爸", "妈妈", "爷爷", "奶奶", "外公", "外婆", "其他"],//家庭角色的数组
    bindSuccessImage: "./../../../imgs/bind-success.svg",//绑定成功的图片
    bindWorngImg: "./../../../imgs/worng.svg",//进行审核的图片
    bindErrImage: "./../../../imgs/bindErr.svg",//绑定失败的图片
    alertIcon: "./../../../icon/alert.svg",//重要提示的小图标
    reportBtnSwitch: true,//举报按钮的开关
    norm: false,//绑定限额的开关
    internalError: false,//服务器内部错误
    newly: false,//验证错误
    feedbackFamilyText: "",//反馈的孩子的内容
    wrongSwitch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let that = this;
    studentId = option.student_id;
    wx.setStorageSync("studentId", studentId);
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
            if (res.statusCode == 200) {
              that.setData({
                wrongSwitch: false
              })
            } else {
              that.setData({
                wrongSwitch: true
              })
            }
            let userInfo = {
              "user_id": res.data.data.user_id, "nick_name": res.data.data.nick_name, "head_image_url": res.data.data.head_image_url, "open_id": res.data.data.open_id, "session_key": res.data.data.session_key, "union_id": res.data.data.union_id, "phone": res.data.data.phone
            }
            session_key = res.data.data.session_key;
            wx.setStorage({
              key: 'userInfo',
              data: userInfo
            });
            wx.setStorage({
              key: 'user_id',
              data: res.data.data.user_id,
            });
            if (!res.data.data.user_id) {
              wx.redirectTo({
                url: '/pages/enroll/enroll?childCode=1'
              });
            } else {
              dataJson.studentInfo(studentId, session_key).then(res => {
                that.setData({
                  wrongSwitch: app.globalData.wrongSwitch
                })
                that.setData({
                  childName: res.data.data.student_name,
                  childClass: res.data.data.class_name,
                  childSchool: res.data.data.school_name
                })
              }).catch(() => {
                that.setData({
                  wrongSwitch: app.globalData.wrongSwitch
                })
              })
              dataJson.getParentRoles(session_key).then(res => {
                that.setData({
                  wrongSwitch: app.globalData.wrongSwitch,
                  auditingWarningSwitch: false,
                  alreadyWarningSwitch: false,
                  roleArr: res.data.data
                })
              }).catch(() => {
                that.setData({
                  wrongSwitch: app.globalData.wrongSwitch
                })
              })
            }

          },
          fail: err => {
            that.setData({
              wrongSwitch: true
            })
          }
        })
      }
    });

  },
  onShow: function () {
    let that = this;
    if (this.data.wrongSwitch) {
      this.setData({
        wrongSwitch: false
      })
      this.onLoad({ "studendId": wx.getStorageSync("studentId") });
      return;
    }
    wx.getStorage({
      key: 'studentInfo',
      success: function (res) {
        if (res.data.switch) {
          that.bindAdd(res.data.studentId, res.data.roleId, session_key)
        }
      },
    })
  },
  /**选择角色**/
  selectRole(e) {
    this.setData({
      roleIndex: e.currentTarget.dataset.index,
      agreeSwitch: false
    })
    roleId = this.data.roleArr[e.currentTarget.dataset.index].role;
  },
  /*打开协议的开关*/
  openPro() {
    dataJson.protocol().then(res => {
      this.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (app.globalData.wrongSwitch) {
        return
      }
      if (res.data.status == 200) {
        this.setData({
          protocol: true,
          protocalInfo: res.data.msg
        })
      }

    }).catch(() => {
      this.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })

  },
  /**关闭协议的开关**/
  closePro() {
    this.setData({
      protocol: false
    })
  },
  /***绑定角色**/
  bindRole() {
    this.bindAdd(studentId, roleId, session_key)
  },
  /**绑定角色的函数**/
  bindAdd(studentId, roleId, session_key) {
    let that = this;
    dataJson.getBindAdd(studentId, roleId, session_key).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      that.setData({
        roleSwitch: false,
        childSwitch: false
      })
      if (res.data.status == 220) {
        that.setData({
          bindSuccessSwitch: true,
          firstSwitch: true,
          feedbackSwitch: false
        })
        wx.removeStorage({
          key: 'studentInfo',
        })
      } else if (res.data.status == 200) {
        that.setData({
          bindSuccessSwitch: true,
          firstSwitch: false,
          feedbackSwitch: false
        })
        wx.removeStorage({
          key: 'studentInfo',
        })
      } else if (res.data.status == 300) {
        that.setData({
          feedbackSwitch: true,
          feedbackFamilyText: res.data.msg
        })
        wx.setStorage({
          key: 'studentInfo',
          data: { "switch": true, "studentId": studentId, "roleId": roleId, "session_key": session_key },
        })
      } else if (res.data.status == 400) {
        wx.removeStorage({
          key: 'studentInfo',
        })
        that.setData({
          bindErrSwitch: true,
          norm: true,
          internalError: false,
          feedbackSwitch: false
        })
      } else if (res.data.status == 500) {
        wx.removeStorage({
          key: 'studentInfo',
        })
        that.setData({
          bindErrSwitch: true,
          norm: false,
          internalError: true,
          feedbackSwitch: false
        })
      }
    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
  },
  /**点击按钮查看成绩**/
  toExam() {
    wx.switchTab({
      url: '/pages/exam/exam',
      success: function (e) {
        var page = getCurrentPages().pop();
        console.log(page);
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },

  /***刷新本页面的界面***/
  toBind() {
    wx.redirectTo({
      url: '/pages/my-item/childCode/childCode?studentId=studentId'
    });
  },

  /**举报家庭管理员**/
  report() {
    let that = this;
    dataJson.reportManager(studentId, session_key).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        wx.showToast({
          title: '举报成功',
          icon: "success",
          duration: 2000
        })
        that.setData({
          reportBtnSwitch: false
        })
      }
    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
  },
})