let dataJson = require("./../../import/getData.js");
const app = getApp();
let sessionKey = "";//就是session_key
let studentId = "";
let studentName = "";//学生的姓名
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childArr: [],//绑定孩子列表的数组
    childIndex: 0,//孩子列表头部的active效果
    userId: "",//我自己的userId
    familyArr: [],//家庭成员的列表
    audytingArr: [],//待审核的数组
    primaryContact: "",//管理员ID
    inviteSwitch: false,//邀请家庭成员模态框的开关
    bindVerify: false,//自动审核的开关
    inviteIcon: "./../../../icon/invite.svg",//邀请家庭成员模态框的小小人
    inviteName: "",//邀请人的姓名
    inviteCodeImage: "./../../../imgs/code.jpg",//二维码
    closeImg: "./../../../imgs/close.png",//模态框的关闭按钮
    arrowDownIcon: "./../../../icon/down-arrowhead.svg",//展开的下箭头
    arrowUpIcon: "./../../../icon/up-arrowhead.svg",//展开的上箭头
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    sessionKey = wx.getStorageSync("userInfo").session_key,
      that.setData({
        userId: wx.getStorageSync("userInfo").user_id,
        inviteName: wx.getStorageSync("userInfo").nick_name,
        wrongSwitch: false
      })
    //获取孩子列表
    dataJson.childList(sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.status == 200) {
        let arr = [];
        for (let i in res.data) {
          if (res.data[i].status) {
            arr.push(res.data[i])
          }
        }
        that.setData({
          childArr: arr,
          bindVerify: arr[0].bind_verify
        })
        studentId = res.data[0].payService.studentId;
        studentName = res.data[0].real_name;
        that.getFamily(studentId, sessionKey);
      }
    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })

  },
  /**获得家庭成员信息**/
  getFamily(studentId, sessionKey) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    dataJson.getFamily(studentId, sessionKey).then(res => {
      console.log(res);
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      wx.hideLoading();
      console.log(res)
      if (res.status == 200) {
        let num = 0;
        let content = "";
        for (let i in res.data) {
          res.data[i].branchSwitch = false;
          // if (res.data[i].parent_id == that.data.userId && res.primary_contact == that.data.userId) {
          //   num = i;
          //   content = res.data[i];
          // }
          if (res.data[i].parent_id == res.primary_contact || (res.data[i].parent_id == that.data.userId && res.primary_contact == that.data.userId)) {
            num = i;
            content = res.data[i];
          }
        }
        if (num) {
          res.data.splice(num, 1);
          res.data.unshift(content)
        }
        that.setData({
          familyArr: res.data,
          primaryContact: res.primary_contact,
        })
        let arr = [];
        for (let i in res.data) {
          if (!res.data[i].status) {
            arr.push(res.data[i])
          }
        }
        that.setData({
          audytingArr: arr
        })

      }

    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
  },
  /**点击孩子头部时候的事件**/
  childChange(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    this.setData({
      childIndex: index,
      wrongSwitch: false
    });
    dataJson.childList(sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.status == 200) {
        that.setData({
          bindVerify: res.data[index].bind_verify
        })
      }
    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
    studentId = e.currentTarget.dataset.id;
    studentName = this.data.childArr[index].real_name;
    that.getFamily(studentId, sessionKey);
  },

  /**点击每一项出现下面子选项的box**/
  targetBranch(e) {
    this.data.familyArr[e.currentTarget.dataset.index].branchSwitch = !this.data.familyArr[e.currentTarget.dataset.index].branchSwitch;
    this.setData({
      familyArr: this.data.familyArr
    })
  },
  /**点击出现举报冒领的模态框**/
  openReport(e) {
    let that = this;
    wx.showModal({
      title: '确定此人冒领了您的孩子吗？',
      success: function (res) {
        if (res.confirm) {
          dataJson.reportParent(studentId, e.currentTarget.dataset.parent, sessionKey).then(res => {
            that.setData({
              wrongSwitch: app.globalData.wrongSwitch
            })
            if (res.data.status == 200) {
              wx.showToast({
                title: '举报成功',
                icon: "success",
                duration: 1500
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
  },

  /***switch组件的事件**/
  voluntarilyChange(e) {
    let num = e.detail.value ? 1 : 0;
    let that = this;
    dataJson.verify(studentId, num, sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        dataJson.childList(sessionKey).then(res => {
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch
          })
          if (res.status == 200) {
            that.getFamily(studentId, sessionKey)
          }
        }).catch(() => {
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch
          })
        })
      }
    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
  },

  /**转让管理员的事件**/
  attorn(e) {
    let that = this;
    wx.showModal({
      title: "转让管理员",
      content: `确定将您的管理员身份转让给${e.currentTarget.dataset.username}？`,
      success: function (res) {
        if (res.confirm) {
          console.log(studentId, e.currentTarget.dataset.parent, sessionKey)
          dataJson.transfer(studentId, e.currentTarget.dataset.parent, sessionKey).then(res => {
            that.setData({
              wrongSwitch: app.globalData.wrongSwitch
            })
            if (res.data.status == 200) {
              that.getFamily(studentId, sessionKey);
              wx.showToast({
                title: '转让成功',
                icon: "success",
                duration: 1500
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
  },

  /***删除家庭成员***/
  deleteLeaguer(e) {
    let that = this;
    wx.showModal({
      title: "删除",
      content: `确定解除${e.currentTarget.dataset.username}对${studentName}的绑定关系？`,
      confirmText: "确定",
      confirmColor: "#1AAD19",
      cancelText: "取消",
      cancelColor: "#000000",
      success: function (res) {
        if (res.confirm) {
          dataJson.deleteTwo(studentId, e.currentTarget.dataset.parent, sessionKey).then(res => {
            that.setData({
              wrongSwitch: app.globalData.wrongSwitch
            })
            if (res.data.status == 200) {
              that.getFamily(studentId, sessionKey)
              wx.showToast({
                title: '删除成功',
                icon: "success",
                duration: 1500
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

  },

  /**打开邀请成员的模态框**/
  openInvite() {
    let that = this;
    dataJson.qrCode(sessionKey, studentId).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        that.setData({
          inviteSwitch: true,
          inviteCodeImage: res.data.url
        })
      }

    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })

  },
  /**关闭邀请成员的模态框**/
  closeInvite() {
    this.setData({
      inviteSwitch: false
    })
  },

  /***同意审核***/
  agreeAudyting(e) {
    let that = this;
    console.log(studentId, e.currentTarget.dataset.parent, sessionKey)
    dataJson.agreeAudyting(studentId, e.currentTarget.dataset.parent, sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        let arr = that.data.audytingArr;
        arr.splice(e.currentTarget.dataset.index, 1);
        that.setData({
          audytingArr: arr
        })
        that.getFamily(studentId, sessionKey)
        wx.showToast({
          title: '已同意',
          icon: "success",
          duration: 2000
        })
      }
    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
  },

  /****拒绝审核***/
  refuseAudyting(e) {
    let that = this;
    dataJson.refuseAudyting(studentId, e.currentTarget.dataset.parent, sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        let arr = that.data.audytingArr;
        arr.splice(e.currentTarget.dataset.index, 1);
        that.setData({
          audytingArr: arr
        })
        that.getFamily(studentId, sessionKey)
        wx.showToast({
          title: '已拒绝',
          icon: "success",
          duration: 1500
        })
      }
    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
  }
})