const dataJson = require("./../../import/getData.js");
const app = getApp();
let studentId = "";//学生的id
let examId = "";//考试的Id
let sessionKey = "";
let classArrAll = [];//班级的总数组
let classcolligateArr = [];//综合的班级
let subArrAll = [];//科目的总数组
let schoolArrAll = [];//学校的总数组
let scoreHeight = "";//输入的想提高的分数
let rateHeight = "";//输入的想提高的战胜率
let classId = "";//要穿越的班级的id
let courseId = "";//要穿越的科目的id
let schoolId = "";//schoolId
let optionS = "";//路由传过来的数值
Page({

  /**
   * 页面的初始数据
   */
  data: {
    examName: "",//考试的名称
    permissionParentScore: false,//是否展示原始分的开关
    permissionParentLevel: false,//是否展示等级的开关
    myMark: "",//我的分数
    myLevel: "",//我的等级
    myRate: "",//我的班级战胜率
    reportStatusImage: "./../../../imgs/reportStatusNo.svg",//暂无考试的图像
    viewDelayImage: "./../../../imgs/viewDelayNo.svg",//暂无权限的图像
    reportStatus: "",//1：报告分析完成，0：未分析完成
    viewDelay: "",//时间戳，开放家长查看日期，当前时间大于改时间时可以查看报告
    throughSelectArr: [1, 2],//穿越的数组（只用到了index）
    throughIndex: 0,//初始index
    classArr: ["班级"],//select选择班级的数组
    rate: "12",//提高的战胜率
    rateText: "",//穿越后的文字
    throughModalSwitch: false,//成绩穿越模态框的开关
    throughtModalImage: "",//穿越以后模态框的图片
    classIndex: 0,//select班级的初始index
    subArr: ["科目"],//select选择科目的数组
    schoolArr: ["学校"],//select选择学校的数组
    schoolIndex: 0,//些小的初始index
    subArrAll: [],//科目的总数组
    subIndex: 0,//sub科目的初始index
    throughFootImage: "./../../../imgs/btm_bg.png",//底部的图片
    markResult: "",//提高分数的结果
    rateResult: "",//提高战胜率的结果
    simulationIcon: "./../../../icon/row.svg",//向下的箭头
    vipSwitch: false,//vip的开关
    isVipShow: false,
    permissionStudentRank: 0,//是否可以进行学校穿越
    noExamInfo: {},//本次考试的考试价格
    noExamTimeInfo: [],//本次考试的时间价格
    scoreSwitch: false,//提高分数计算结果的开关
    rateSwitch: false,//提高班级战胜率计算结果的开关
    markPlaceholder:"",//计算想要提高的分数的placeholder
    ratePlaceholder:"",//计算想要提高的班级战胜率的placehold
    wrongSwitch:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    optionS = option
    let that = this;
    studentId = option.studentId;
    examId = option.examId;
    schoolId = option.schoolId;
   
    this.setData({
      wrongSwitch:false,
      examName: option.examName,
      reportStatus: +option.reportStatus,
      viewDelay: option.viewDelay,
      permissionParentScore: +option.permissionParentScore,//是否展示原始分的开关
      permissionParentLevel: +option.permissionParentLevel,//是否展示等级的开关
      vipSwitch: (option.payStatus == "true" ? true : false),//有没有进行支付
      permissionStudentRank: +option.permissionStudentRank//能否进行学校穿越
    })
    if (!that.data.reportStatus || !that.data.viewDelay) {
      wx.setNavigationBar({
        front: '#ffffff',
        background: '#28BCFF',
      })
    }
    sessionKey = wx.getStorageSync("userInfo").session_key;
    wx.getStorage({
      key: `${studentId}&${examId}through`,
      success: function (res) {
        that.setData({
          myMark: res.data[0].myMark,//我的分数
          myLevel: res.data[0].myLevel,//我的等级
          myRate: res.data[0].myRate,//我的班级战胜率
        })
      },
      fail: function () {
        
        that.getPageData(studentId, examId, sessionKey, false);
      }
    })
    /***得到科目信息***/
    dataJson.courses(studentId, examId, sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        let arr = [];
        subArrAll = res.data.data;
        subArrAll.unshift({ course_id: 0, course_name: "全部科目" })
        for (let i in subArrAll) {
          arr.push(res.data.data[i].course_name)
        }
        courseId = subArrAll[0].course_id
        that.setData({
          subArr: arr
        })
      }
    }).catch(() =>{
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
    /**得到班级(and学校)的信息**/
    dataJson.choolClass(studentId, examId, sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      classcolligateArr = res.data.classs;
      if (res.data.status == 200) {
        let arr = [], arr2 = [];
        for (let i in res.data.classs) {
          if (schoolId == res.data.classs[i].school_id) {
            arr2.push(res.data.classs[i])
          }
        }
        arr2.unshift({ id: 0, name: "全部班级" })
        classArrAll = arr2;
        for (let i in classArrAll) {
          arr.push(classArrAll[i].name);
        }
        classId = classArrAll[0].id;
        that.setData({
          classArr: arr
        })
        if (that.data.permissionStudentRank) {
          let arr3 = [];
          let mySchoolArr = [], mySchool = {};
          for (let i in res.data.schools) {
            if (schoolId != res.data.schools[i].id) {
              mySchoolArr.push(res.data.schools[i])
            } else {
              mySchool = res.data.schools[i]
            }
          }
          schoolArrAll = mySchoolArr;
          schoolArrAll.unshift(mySchool);
          for (let i in schoolArrAll) {
            arr3.push(schoolArrAll[i].name)
          }
          that.setData({
            schoolArr: arr3
          })
        }
      }
    }).catch(() =>{
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })



  },

  onUnload: function () {
    app.globalData.examLoadSwitch = false;
  },


  /*得到考试的信息*/
  getPageData(studentId, examId, sessionKey) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    dataJson.report(studentId, examId, 0, sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        wx.hideLoading();
        that.setData({
          myMark: res.data.data.exam_score,//我的分数
          myLevel: res.data.data.level,//我的等级
          myRate: res.data.data.class_percent,//我的班级战胜率
        })
        wx.setStorage({
          key: `${studentId}&${examId}through`,
          data: [{ myMark: that.data.myMark, myLevel: that.data.myLevel, myRate: that.data.myRate }],
        })


      }
    }).catch(() =>{
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    });
  },
  /*成绩模拟和成绩穿越的切换*/
  changeThrough(e) {
    this.setData({
      throughIndex: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index) {
      this.setData({
        scoreSwitch: false,
        rateSwitch: false,
        markPlaceholder: 0,
        ratePlaceholder: 0,
      })
    }
  },
  /**成绩穿越班级**/
  bindPickerChange: function (e) {
    this.setData({
      classIndex: +e.detail.value
    })
    classId = classArrAll[+e.detail.value].id
  },
  /**成绩穿越科目**/
  bindPickerChangeTwo: function (e) {
    this.setData({
      subIndex: +e.detail.value
    })
    courseId = subArrAll[+e.detail.value].course_id
  },

  /**成绩穿越学校**/
  bindPickerChangeThree: function (e) {
    let that = this;
    this.setData({
      schoolIndex: +e.detail.value
    })
    schoolId = schoolArrAll[+e.detail.value].id;
    let arr = [], arr2 = [];
    console.log(schoolId, schoolArrAll, classcolligateArr)
    for (let i in classcolligateArr) {
      if (schoolId == classcolligateArr[i].school_id) {
        arr2.push(classcolligateArr[i])
      }
    }
    arr2.unshift({ id: 0, name: "全部班级" });
    classArrAll = arr2;
    for (let i in classArrAll) {
      arr.push(classArrAll[i].name);
    }
    classId = classArrAll[0].id;
    that.setData({
      classArr: arr
    })
  },
  /**开通vip模态框的开关**/
  showOpenService() {
    let that = this;
    dataJson.nowPay(studentId, examId, sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        that.setData({
          isVipShow: true,
          noExamInfo: { price: res.data.price, examId: examId },
          noExamTimeInfo: res.data.schemes
        })
      }
    }).catch(() =>{
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })

  },

  /**vip弹窗进行付费**/
  goMoneyExam(e) {
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
          confirm: "#1AAD19"
        })
      } else {
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': res.data.data.signType,
          'paySign': res.data.data.paySign,
          'success': function (res) {
            that.setData({
              isVipShow: false
            });
            optionS.payStatus = "true";
            that.onLoad(optionS);
            wx.getStorage({
              key: `${studentId}exam`,
              success: function (res) {
                wx.removeStorageSync(`${studentId}exam`)
              },
            })
          },
          'fail': function (res) {
            that.setData({
              isVipShow: true,
              vipSwitch: false,
              wrongSwitch:true
            })
          }
        })
      }
    }).catch(() =>{
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    });
  },

  /*关闭VIP的开关*/
  _cancelEvent() {
    this.setData({
      isVipShow: false
    })
  },

  /**进行穿越**/
  goThrough() {
    let that = this;
    console.log(studentId, examId, schoolId, classId, courseId, sessionKey)
    dataJson.through(studentId, examId, schoolId, classId, courseId, sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        that.setData({
          throughModalSwitch: true,
          rate: res.data.percent,
          rateText: res.data.desc,
          throughtModalImage: res.data.change > 0 ? "./../../../imgs/happy.svg" : "./../../../imgs/no-happy.svg"
        })
      } else {
        wx.showModal({
          content: res.data.msg,
          showCancel: false,
          confirmText: "我知道了",
          confirm: "#1AAD19"
        })
      }
    }).catch(() =>{
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })

  },
  /**关闭成绩穿越**/
  closeThroughModal() {
    this.setData({
      throughModalSwitch: false
    })
  },

  /**得到输入的分数**/
  getScore(e) {
    scoreHeight = e.detail.value;
  },
  /**得到输入的战胜率**/
  getRate(e) {
    rateHeight = e.detail.value;//输入的想提高的战胜率
  },

  /**计算想要提高的分数**/
  throughScore() {
    let that = this;
    if (!scoreHeight) {
      wx.showModal({
        content: "请输入数字",
        showCancel: false,
        confirmText: "我知道了",
        confirm: "#1AAD19"
      })
    } else {
      dataJson.throughScore(studentId, examId, scoreHeight, sessionKey).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        if (res.data.status == 200) {
          that.setData({
            scoreSwitch: true,
            markResult: res.data.percent
          })
        } else {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            confirmText: "我知道了",
            confirm: "#1AAD19"
          })
        }
      }).catch(() =>{
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
      })
    }
  },

  /**计算想要提高的班级战胜率**/
  throughRate() {
    let that = this;
    console.log("rateHeight", rateHeight)
    if (!rateHeight) {
      wx.showModal({
        content: "请输入数字",
        showCancel: false,
        confirmText: "我知道了",
        confirm: "#1AAD19"
      })
    } else if ((+rateHeight) + (+that.data.myRate) >= 100) {
      wx.showModal({
        content: "要达到的战胜率超过100%，请重新输入",
        showCancel: false,
        confirmText: "我知道了",
        confirm: "#1AAD19"
      })
    } else {
      console.log(studentId, examId, rateHeight, sessionKey)
      dataJson.throughRate(studentId, examId, rateHeight, sessionKey).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        if (res.data.status == 200) {
          that.setData({
            rateSwitch: true,
            rateResult: res.data.score
          })
        } else {
          wx.showModal({
            title: res.data.msg,
            showCancel: false,
            confirmText: "我知道了",
            confirm: "#1AAD19"
          })
        }
      }).catch(() =>{
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
      })
    }
  },


})