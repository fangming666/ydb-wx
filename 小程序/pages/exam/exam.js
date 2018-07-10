const app = getApp();
const baseUrl = app.globalData.baseUrl;
const baseImgUrl = app.globalData.baseImgUrl;
const dataJson = require("./../import/getData.js");
const showpageData = require("./showpageData.js");
const getExamData = require("./getExamData.js").getExamData;
let sessionKey = "";//就是session_key
let studentId = "";
let result = 0;
let pubStudentId = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    examArr: [],//考试列表的数组
    childIndex: 0,//孩子列表头部的active效果
    childArr: [],//绑定孩子列表的数组
    childName: "",//孩子名字
    schoolType: "",//学生学校是否可以进行缴费
    user_id: "",//登录后的数据的状态
    examBtnArr: [{ "text": "查看报告", "url": "/pages/exam-item/report/report" }, { "text": "成绩穿越", "url": "/pages/exam-item/through/through" }],//按钮数组
    // examBtnArr: [{ "text": "查看报告", "url": "/pages/exam-item/report/report" }, { "text": "成绩穿越", "url": "/pages/exam-item/through/through" }, { "text": "错题解析", "url": "/pages/exam-item/respondence/respondence" }],//按钮数组
    noVipIcon: "./../../imgs/vip.svg", //不是VIP的图标
    vipIcon: "./../../imgs/vip_bing.svg",//是VIP的图标
    goalIcon: "./../../imgs/fen.svg",//分数的小图标
    noVipImage: "./../../imgs/server-head.svg",//需要开通vip的时候的头部的图片
    examNoImage: "./../../imgs/server-no.svg",//考试为空时候的图片
    vipTime: "",//会员有效时间
    shelterSwitch: false,//加载的时候的遮挡
    grade: "",//孩子第一次考试的等级
    wrongSwitch: false,//出错页面是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      wrongSwitch: false,
    })
    app.globalData.examLoadSwitch = false;
    let that = this;
    sessionKey = "";
    studentId = "";
    wx.removeStorageSync("studentId");
    //获取user_id
    if (app.globalData.employId && app.globalData.employId != '') {
      showpageData.showpageData(sessionKey, studentId, pubStudentId, dataJson, this, app);
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          showpageData.showpageData(sessionKey, studentId, pubStudentId, dataJson, this, app);
        }
      }
    }
  },

  onShow: function () {
    app.globalData.examVipSwitch = false;
    if (app.globalData.examLoadSwitch) {
      this.setData({
        wrongSwitch: false
      })
      wx.showLoading({
        title: '加载中',
      })
      this.onLoad();
    }
  },


  /**点击孩子头部时候的事件**/
  childChange(e) {
    pubStudentId = e.currentTarget.dataset.student.student_id;
    app.globalData.examStudentId = "";
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    that.setData({
      wrongSwitch: false,
      shelterSwitch: false,
    })
    this.setData({
      childIndex: e.currentTarget.dataset.index,
    })
    studentId = e.currentTarget.dataset.student.student_id;
    this.setData({
      childName: e.currentTarget.dataset.student.real_name,
      schoolType: e.currentTarget.dataset.student.school_type
    })
    if (app.globalData.currentExam !== null) {
      app.globalData.currentExam.abort();
    }
    getExamData(studentId, sessionKey, true, this, pubStudentId, dataJson, app);
  },
  /**跳转到报告或者成绩穿越等页面**/
  toPage(e) {
    if (app.globalData.currentExam !== null) {
      app.globalData.currentExam.abort();
    }
    studentId = app.globalData.examStudentId ? app.globalData.examStudentId : studentId;
    let examName = e.currentTarget.dataset.examname;//考试名称
    let schoolType = e.currentTarget.dataset.schooltype;//学校是否能进行收费
    let examId = e.currentTarget.dataset.examid;//examId
    let payStatus = e.currentTarget.dataset.paystatus;//支付的状态(1为是，0为否)
    let levelDesc = e.currentTarget.dataset.leveldesc; //等级描述（不为空的时候展示）
    let viewDelay = e.currentTarget.dataset.viewdelay;//时间戳，开放家长查看日期，当前时间大于改时间时可以查看报告
    let reportStatus = e.currentTarget.dataset.reportstatus;//1：报告分析完成，0：未分析完成
    let permissionParentScore = e.currentTarget.dataset.permissionparentscore;//1：可以展示原始分，0：不能展示原始分
    let permissionParentLevel = e.currentTarget.dataset.permissionparentlevel;//1：可以展示等级，0：不能展示等级
    let permissionOriginRank = e.currentTarget.dataset.permissionoriginrank;//1：可以展示原始排名，0：不能展示排名
    let permissionJointData = e.currentTarget.dataset.permissionjointdata;//	1：可以展示联考排名，0：不展示联考排名
    let schoolId = e.currentTarget.dataset.schoolid;//schoolId
    let permissionStudentRank = e.currentTarget.dataset.permissionstudentrank;//是否可以进行学校穿越（1/0）
    let reportFree = e.currentTarget.dataset.reportfree;//0免费看全部报告1付费看全部报告
    let joint = e.currentTarget.dataset.joint;//是否展示区的联考排名
    let winningRate = e.currentTarget.dataset.winningrate; //0：不显示战胜率1：显示战胜率
    if (!e.currentTarget.dataset.index) {//当点击报告的时候路由传参
      wx.navigateTo({
        url: `${e.currentTarget.dataset.url}?studentId=${studentId}&examId=${examId}&payStatus=${payStatus}&childname=${this.data.childName}&levelDesc=${levelDesc}&viewDelay=${viewDelay}
        &reportStatus=${reportStatus}&permissionParentScore=${permissionParentScore}&permissionParentLevel=${permissionParentLevel}&permissionOriginRank=${permissionOriginRank}&permissionJointData=${permissionJointData}&schoolType=${schoolType}&examName=${examName}&reportFree=${reportFree}&joint=${joint}&winningRate=${winningRate}`,
      })
    } else {//成绩穿越或者错题解析时候的路由传参
      if (!+e.currentTarget.dataset.magicstatus) {
        wx.showToast({
          title: '成绩穿越不可用',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: `${e.currentTarget.dataset.url}?studentId=${studentId}&examId=${examId}&payStatus=${payStatus}&examName=${examName} &reportStatus=${reportStatus}&permissionParentScore=${permissionParentScore}&permissionParentLevel=${permissionParentLevel}&viewDelay=${viewDelay}&schoolId=${schoolId}&permissionStudentRank=${permissionStudentRank}`,
        })
      }

    }

  },



  /*绑定孩子的组件事件*/
  goBind() {
    app.globalData.examLoadSwitch = true;
    let that = this;
    let userId = wx.getStorageSync("userInfo").user_id;
    if (!userId) {
      wx.navigateTo({
        url: '/pages/enroll/enroll?link=1',
      })
    } else {
      let sessionKey = wx.getStorageSync("userInfo").session_key;
      dataJson.childList(sessionKey).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        if (res.status == 200) {
          if (res.data.length >= 3) {
            wx.showModal({
              title: '您的绑定尚未通过审核，请在通过审核后再使用此功能。',
              showCancel: false,
              confirmText: "我知道了",
              confirmColor: "#1AAD19"
            })
          } else {
            wx.navigateTo({
              url: '/pages/bind/bind',
            })
          }
        }
      }).catch(() => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
      })
    }


  }
})