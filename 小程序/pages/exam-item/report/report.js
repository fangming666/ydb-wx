import * as echarts from './../../../ec-canvas/echarts.js';//引进echarts的图表插件
const dataJson = require("./../../import/getData.js");
const getRing = require("./getRing.js").getRing;
const app = getApp();
app.globalData.examLoadSwitch;//load的开关
var studentId = "";//学生的Id 
var examId = "";//考试的Id
var sessionKey = "";
var allWith = 0;
var colorArr = ["#F768A3", "#EBC44F", "#9BCB0A", "#06C4EC", "#673AB7"];//圆环的颜色数组
var optionS = "";//路由传过来的数值
var impedeNum = 0;
var scorePortChart = null;
var courseStatusCharts = null;
let pubTimeOut = 1;
let pubCourseId = 0;
let childName = "";
let pubCourseName = "";
// var chart = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rankHistogramEc: {
      lazyLoad: true
    },//层次排名柱状图的初始
    windowHeight: "",
    reportArr: [],//报告数目的列表
    reportIndex: 0,//报告科目的初始index
    reportLeftIcon: "./../../../icon/angle-left.svg",//头部左边的图标
    reportRightIcon: "./../../../icon/angle-right.svg", //头部右边的图标
    reportStatusImage: "./../../../imgs/reportStatusNo.svg",//暂无考试的图像
    viewDelayImage: "./../../../imgs/viewDelayNo.svg",//暂无权限的图像
    leftSwitch: false,//头部左侧小图标出现的开关
    rightSwitch: true,//头部右边小图标出现的开关
    scrollLeft: 0,//头部科目移动的距离
    explainIcon: "./../../../icon/info1.svg",//说明的小图标1
    disIcon: "./../../../icon/info2.svg",//说明的小图标2
    proIcon: "./../../../icon/info3.svg",//说明的小图标3
    levelDesc: "",//等级描述（不为空的时候展示）
    viewDelay: "",//时间戳，开放家长查看日期，当前时间大于改时间时可以查看报告
    permissionParentScore: "",//1：可以展示原始分，0：不能展示原始分
    permissionParentLevel: "",//1：可以展示等级，0：不能展示等级
    reportStatus: "",//1：报告分析完成，0：未分析完成
    permissionOriginRank: "",//1：可以展示原始排名，0：不能展示排名
    permissionJointData: "",//	1：可以展示联考排名，0：不展示联考排名
    schoolType: "",//学校是否能显示收费（布尔类型）
    examName: "",//考试的名称
    courseId: "",//科目ID
    fullScore: "",//满分
    score: "",//我的得分
    level: "",//孩子的等级
    vipSwitch: false,//vip的开关
    shelterSwitch: false,//遮挡加载的盒子开关
    rate: {}, //每个战胜率
    levelProp: 0,//单科的时候孩子的位置挪啊挪
    subjectData: [],//列表科目的数据
    radarLength: "",//优劣学科雷达图的数组长度
    superiorityArr: [],//优势学科的数组
    inferiorArr: [], //劣势学科的数组
    school_highScore: "",//学校最高分
    class_highScore: "",//班级最高分
    school_average: "",//学校平均分
    class_average: "",//班级平均分
    rankaHistogramInfo: "",//层次排名的信息
    objectiveArr: [],//小题得分客观题
    subjectiveArr: [],//小题得分主观题
    raiseObj: [],//提分建议客观题数组
    raiseSub: [],//提分建议主观题数组
    improvePercent: "",//提分意见的战胜率
    pointsArr: [],//失分较多知识点的数组
    improvedArr: [],//待提高知识点的数组
    retaLineArr: [],//校战胜率折线图表格的数据
    explainIconOne: "",//校战胜率文字一
    explainIconTwo: "",//校战胜率文字二
    noVipImg: "./../../../imgs/report-no.svg",
    pointsSwitch: false,//失分较多知识点是否展示全部的开关
    pointsBtnSwitch: false,//展开开全部失分知识点的按钮开关
    improvedSwitch: false,//展开待提高知识点是否全部展示开关
    improvedBtnSwitch: false,//待提高知识点按钮的开关
    goalIcon: "./../../../imgs/fen.svg",//分数的小图标
    wrongIcon: "./../../../icon/wrong.svg",//出错的小图标
    isVipShow: false,
    noExamInfo: {},//本次考试的考试价格
    noExamTimeInfo: [],//本次考试的时间价格
    reportFree: "",//免费看报告
    wrongSwitch: false,
    winningRate: "",
    goTopImg: "http://home.dev.mschool.cn/static/mini/images/goTop.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {

    var that = this;
    optionS = option;
    pubCourseId = option.pubCourseId ? option.pubCourseId : 0;
    childName = option.childname;
    if (option.courseName) {
      if (option.courseName == "整体分析") {
        wx.setNavigationBarTitle({
          title: `${childName}-整体分析报告`
        });
      } else {
        wx.setNavigationBarTitle({
          title: `${childName}-${option.courseName}分析报告`
        });
      }

    } else {
      wx.setNavigationBarTitle({
        title: `${childName}-整体分析报告`
      });
    }

    studentId = option.studentId;
    examId = +option.examId;
    this.setData({
      wrongSwitch: false,
      examName: option.examName,//学校名称
      iosSwitch: false,
      schoolType: (option.schoolType == "pay" || option.schoolType == "customer") ? true : false,//学校的类型
      vipSwitch: (option.payStatus == "true" ? true : false),//是否付费
      levelDesc: option.levelDesc,//等级描述（不为空的时候展示）
      viewDelay: +option.viewDelay,//时间戳，开放家长查看日期，当前时间大于改时间时可以查看报告
      permissionParentScore: +option.permissionParentScore,//1：可以展示原始分，0：不能展示原始分
      permissionParentLevel: +option.permissionParentLevel,//1：可以展示等级，0：不能展示等级
      reportStatus: +option.reportStatus,//1：报告分析完成，0：未分析完成
      permissionOriginRank: +option.permissionOriginRank,//1：可以展示原始排名，0：不能展示排名
      permissionJointData: +option.permissionJointData,//	1：可以展示联考排名，0：不展示联考排名
      reportFree: +option.reportFree,//0付费看全部报告，1免费看全部报告
      winningRate: +option.winningRate//是否可以看战胜率
    })
    /**获取屏幕的宽度**/
    wx.getSystemInfo({
      success: res => {
        that.setData({
          windowHeight: res.windowHeight
        })
        if (res.platform == "ios") {
          that.setData({
            iosSwitch: true
          })
        } else {
          that.setData({
            iosSwitch: false
          })
        }
      }
    });
    sessionKey = wx.getStorageSync('userInfo').session_key;
    if (sessionKey) {
      that.setData({
        shelterSwitch: true
      })
      /**获取科目的列表**/
      if (that.data.viewDelay && that.data.reportStatus) {
        wx.getStorage({
          key: `${studentId}&${examId}course`,
          success: function (res) {
            that.setData({
              reportArr: res.data.reportArr,
              courseId: option.courseId ? option.courseId : res.data.reportArr[0].course_id
            })
            if (res.data.reportArr.length >= 5) {
              that.setData({
                rightSwitch: false
              })
            }
            that.getData(studentId, examId, that.data.courseId, sessionKey);
          },
          fail: function () {
            dataJson.courses(studentId, examId, sessionKey).then(res => {
              that.setData({
                wrongSwitch: app.globalData.wrongSwitch
              })
              if (res.data.status == 200) {
                var arr = res.data.data;
                arr.unshift({ course_id: 0, course_name: "整体分析" });
                if (arr.length >= 5) {
                  that.setData({
                    rightSwitch: false
                  })
                }
                that.setData({
                  reportArr: arr,
                  courseId: option.courseId ? option.courseId : arr[0].course_id
                })
                wx.setStorage({
                  key: `${studentId}&${examId}course`,
                  data: { reportArr: that.data.reportArr },
                })
                that.getData(studentId, examId, that.data.courseId, sessionKey);
              }
            }).catch(() => {
              that.setData({
                wrongSwitch: app.globalData.wrongSwitch
              })
            })
          }
        })
      }
    }

  },
  onUnload: function () {
    if (app.globalData.currentAjax) {
      app.globalData.currentAjax.abort();
    }
    if (!app.globalData.examVipSwitch){
      app.globalData.examLoadSwitch = false;
    }
   
  },

  init: function (nameData, numData, operateDemo, chartFun) {
    operateDemo.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      var chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chartFun(chart, nameData, numData);
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  /*******获得本页面的所有信息的函数*********/
  getData(studentId, examId, courseId, sessionKey, courseName = null) {
    var that = this;
    console.log(studentId, examId, courseId, sessionKey);
    try {
      var courseData = wx.getStorageSync(`${studentId}&${examId}&${courseId}report`);
      if (courseData) {
        console.log("123")
        if (courseId !== pubCourseId) {
          return;
        }
        console.log("456")
        app.globalData.reportFail = false;
        var getObj = {};
        if (app.globalData.currentAjax) {
          app.globalData.currentAjax.abort();
          wx.hideLoading();
        }
        for (var i in courseData) {
          for (var j in courseData[i]) {
            getObj[j] = courseData[i][j]
          }
        }
        that.setData({
          shelterSwitch: false,
          fullScore: getObj.fullScore,
          improvePercent: getObj.improvePercent,
          score: getObj.score,
          level: getObj.level,
          levelProp: getObj.levelProp,
          rate: getObj.rate,
          subjectData: getObj.subjectData,
          rankaHistogramInfo: getObj.rankaHistogramInfo,
          school_highScore: getObj.school_highScore ? getObj.school_highScore : '',//学校最高分
          class_highScore: getObj.class_highScore ? getObj.class_highScore : '',//班级最高分
          school_average: getObj.school_average ? getObj.school_average : '',//学校平均分
          class_average: getObj.class_average ? getObj.class_average : '',//班级平均分
          retaLineArr: getObj.retaLineArr ? getObj.retaLineArr : '',
          explainIconOne: getObj.explainIconOne ? getObj.explainIconOne : '',
          explainIconTwo: getObj.explainIconTwo ? getObj.explainIconTwo : '',
          radarLength: getObj.radarLength ? getObj.radarLength : '',
          superiorityArr: getObj.superiorityArr ? getObj.superiorityArr : '',
          inferiorArr: getObj.inferiorArr ? getObj.inferiorArr : '',
          pointsArr: getObj.pointsArr ? getObj.pointsArr : '',
          improvedArr: getObj.improvedArr ? getObj.improvedArr : '',
          objectiveArr: getObj.objectiveArr ? getObj.objectiveArr : '',//小题得分客观题
          subjectiveArr: getObj.subjectiveArr ? getObj.subjectiveArr : '',//小题得分主观题
          raiseSub: getObj.raiseSub ? getObj.raiseSub : '',
          raiseObj: getObj.raiseObj ? getObj.raiseObj : ''
        });
        that.getChartsData(getObj.scorePortNameArr, getObj.scorePortNumArr, getObj.rateLineNumArr, getObj.rateLineDateArr, getObj.rateMin, getObj.courseStatusNameArr, getObj.courseStatusNumArr, getObj.questionDixData, getObj.questionDimyRates, getObj.questionDischoolRates, getObj.questionDiMin, getObj.knowledge, getObj.skill);

      } else {
        /**获取列表啊排名啊等级啊图标数据啊的函数**/
        dataJson.report(studentId, examId, courseId, sessionKey).then(res => {
          if (courseId !== pubCourseId) {
            return;
          }
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch,
          })
          if (app.globalData.currentAjax !== null) {
            app.globalData.currentAjax.abort();
            that.setData({
              shelterSwitch: true,
            })
            return;
          } else {
            that.setData({
              shelterSwitch: false,
            })
          }
          var scorePortNameArr = [], scorePortNumArr = [], courseStatusNameArr = [], courseStatusNumArr = [], rateLineNumArr = [], rateLineNameArr = [], rateLineDateArr = [], rateMin = 0, questionDiMin = 0, questionDixData = [], questionDischoolRates = [], questionDimyRates = [], skill = [], knowledge = [];
          if (res.data.status == 200) {
            that.setData({
              fullScore: res.data.data.full_score,
              score: res.data.data.exam_score,
              level: res.data.data.level ? res.data.data.level : '',
              levelProp: res.data.data.level_prop ? res.data.data.level_prop : "",
              rate: { "class": res.data.data.class_percent, "school": res.data.data.school_percent, "classify": res.data.data.group_percent, "classRanking": res.data.data.class_rank, "schoolRanking": res.data.data.school_rank, "classifyRanking": res.data.data.group_rank },
              subjectData: res.data.data.exam_paper_data ? res.data.data.exam_paper_data : "",
              rankaHistogramInfo: res.data.data.partWhole ? res.data.data.partWhole.desc : "",
              pointsArr: [],
              improvedArr: [],
              objectiveArr: [],
              subjectiveArr: [],
              raiseSub: [],
              raiseObj: [],
            })
            /***获取层次排名的柱状图***/
            if (res.data.data.partWhole.data.length) {
              for (var i in res.data.data.partWhole.data) {
                scorePortNameArr.push(res.data.data.partWhole.data[i].cutStandard);
                scorePortNumArr.push(res.data.data.partWhole.data[i].num)
              }
              that.setData({
                school_highScore: res.data.data.partWhole.school_highScore,//学校最高分
                class_highScore: res.data.data.partWhole.class_highScore,//班级最高分
                school_average: res.data.data.school_score,//学校平均分
                class_average: res.data.data.class_score,//班级平均分
              })
            }
            /***获取学校战胜率变化的折线图***/
            if (res.data.data.trendData.data && res.data.data.trendData.data.length) {
              for (var i in res.data.data.trendData.data) {
                rateLineNumArr.push(res.data.data.trendData.data[i].school_percent);
                rateLineNameArr.push(res.data.data.trendData.data[i].exam_name);
                rateLineDateArr.push(res.data.data.trendData.data[i].exam_date)
              }
              rateMin = Math.floor(Math.min(...rateLineNumArr) / 10) * 10
              that.setData({
                retaLineArr: res.data.data.trendData.data,
                explainIconOne: res.data.data.trendData.promp_desc,
                explainIconTwo: res.data.data.trendData.promp_supp_desc
              })
            }
            if (!that.data.courseId) {
              /**获取优劣学科的雷达图**/
              if (res.data.data.courseStatus.x_data && res.data.data.courseStatus.x_data.length) {
                courseStatusNameArr = res.data.data.courseStatus.x_data;
                courseStatusNumArr = res.data.data.courseStatus.y_data;
                that.setData({
                  radarLength: courseStatusNameArr.length,
                  superiorityArr: res.data.data.courseStatus.odds,
                  inferiorArr: res.data.data.courseStatus.inferior
                })

              }
            } else {
              /**难易题目得分率的双折线图**/
              if (res.data.data.diffData.xData && res.data.data.diffData.xData.length) {
                /**难易题目双折线图**/
                questionDixData = res.data.data.diffData.xData;
                questionDimyRates = res.data.data.diffData.myRates;
                questionDischoolRates = res.data.data.diffData.schoolRates;
                questionDiMin = Math.floor(Math.min(...questionDimyRates) / 10) * 10 > (Math.floor(Math.min(...questionDischoolRates) / 10) * 10) ? (Math.floor(Math.min(...questionDischoolRates) / 10) * 10) : Math.floor(Math.min(...questionDimyRates) / 10) * 10;
              }
              /**失分较多知识点**/
              if (res.data.data.knowData.y_data && res.data.data.knowData.y_data.length) {
                var allArr = getRing(knowledge, res.data.data.knowData.y_data, true, colorArr);
                knowledge = allArr.oneArr
                that.setData({
                  pointsArr: allArr.twoArr
                })
              }
              /***代提高能力****/
              if (res.data.data.skillData.y_data && res.data.data.skillData.y_data.length) {
                var allArr2 = getRing(skill, res.data.data.skillData.y_data, false, colorArr)
                skill = allArr2.oneArr;
                that.setData({
                  improvedArr: allArr2.twoArr
                })
              }
              /**小题得分**/
              if (res.data.data.questionData) {
                var arr1 = [], arr2 = [];
                for (var i in res.data.data.questionData) {
                  if (res.data.data.questionData[i].type == 1) {
                    arr1.push(res.data.data.questionData[i])
                  } else {
                    arr2.push(res.data.data.questionData[i])
                  }
                }
                that.setData({
                  objectiveArr: arr1,//小题得分客观题
                  subjectiveArr: arr2,//小题得分主观题
                })
              }
              /**提分建议**/
              that.setData({
                improvePercent: res.data.data.improveData.improvePercent
              })
              if (res.data.data.improveData.structs && res.data.data.improveData.structs.length) {
                var arr1 = [], arr2 = [];
                for (var i in res.data.data.improveData.structs) {
                  if (res.data.data.improveData.structs[i].type == "objective") {
                    arr1.push(res.data.data.improveData.structs[i])
                  } else {
                    arr2.push(res.data.data.improveData.structs[i])
                  }
                }
                that.setData({
                  raiseSub: arr1,
                  raiseObj: arr2
                })
              }
            }
            /*缓存图表所有的数据*/
            wx.setStorageSync(`${studentId}&${examId}&${courseId}report`, [{ fullScore: that.data.fullScore },
            { score: that.data.score },
            { level: that.data.level },
            { levelProp: that.data.levelProp },
            { rate: that.data.rate },
            { subjectData: that.data.subjectData }, { scorePortNameArr: scorePortNameArr }, { scorePortNumArr: scorePortNumArr }, { school_highScore: that.data.school_highScore },
            { class_highScore: that.data.class_highScore },
            { school_average: that.data.school_average },
            { class_average: that.data.class_average }, { retaLineArr: that.data.retaLineArr }, { rankaHistogramInfo: that.data.rankaHistogramInfo },
            { explainIconOne: that.data.explainIconOne },
            { explainIconTwo: that.data.explainIconTwo }, { rateMin: rateMin }, { rateLineDateArr: rateLineDateArr }, { rateLineNameArr: rateLineNameArr }, { rateLineNumArr: rateLineNumArr }, {
              radarLength: courseStatusNameArr.length
            }, { questionDixData: questionDixData }, { questionDiMin: questionDiMin }, { questionDischoolRates: questionDischoolRates }, { questionDimyRates: questionDimyRates }, { pointsArr: that.data.pointsArr }, { knowledge: knowledge }, { improvedArr: that.data.improvedArr }, { skill: skill },
            { superiorityArr: that.data.superiorityArr }, { raiseSub: that.data.raiseSub }, { raiseObj: that.data.raiseObj }, { objectiveArr: that.data.objectiveArr }, { subjectiveArr: that.data.subjectiveArr },
            { inferiorArr: that.data.inferiorArr }, { courseStatusNameArr: courseStatusNameArr }, { improvePercent: that.data.improvePercent }, { courseStatusNumArr: courseStatusNumArr }]);
            /*绘制图表的函数*/
            that.getChartsData(scorePortNameArr, scorePortNumArr, rateLineNumArr, rateLineDateArr, rateMin, courseStatusNameArr, courseStatusNumArr, questionDixData, questionDimyRates, questionDischoolRates, questionDiMin, knowledge, skill);
            /*当有柱状图的时候加一遍防止重叠*/
            console.log(courseId);
            optionS.courseId = courseId;
            optionS.pubCourseId = pubCourseId;
            optionS.courseName = courseName;
            that.onLoad(optionS);
          }
        }).catch(() => {
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch,
          })
        });

      }
    } catch (err) {
      console.log("获取report缓存信息错误为：", err);
    }
  },


  /**头部科目的改变**/
  changeReport(e) {
    pubCourseId = this.data.reportArr[e.currentTarget.dataset.index].course_id;
    if (!pubCourseId) {
      wx.setNavigationBarTitle({
        title: `${childName}-整体分析报告`
      });
    } else {
      wx.setNavigationBarTitle({
        title: `${childName}-${e.currentTarget.dataset.coursename}分析报告`
      });
    }
    pubCourseName = e.currentTarget.dataset.coursename;
    var scrollLeftS = this.data.scrollLeft;
    if (e.currentTarget.dataset.index >= 4) {
      scrollLeftS = scrollLeftS + e.currentTarget.dataset.index * 30
    } else {
      scrollLeftS = 0
    }
    this.setData({
      shelterSwitch: true,
      wrongSwitch: false,
      reportIndex: e.currentTarget.dataset.index,
      scrollLeft: scrollLeftS,
      courseId: this.data.reportArr[e.currentTarget.dataset.index].course_id,
      pointsSwitch: false,
      pointsBtnSwitch: false,
      improvedSwitch: false,
      improvedBtnSwitch: false,
    });
    if (app.globalData.currentAjax !== null) {
      app.globalData.currentAjax.abort();
    }
    this.getData(studentId, examId, this.data.courseId, sessionKey, e.currentTarget.dataset.coursename);
  },
  /*头部科目移动时候左右图标的开关设置*/
  centerScroll(e) {
    if (e.detail.scrollLeft <= 20) {
      this.setData({
        leftSwitch: false,
        rightSwitch: false
      })
    } else if (e.detail.scrollLeft >= e.detail.scrollWidth / 2.5 - 70) {
      this.setData({
        leftSwitch: true,
        rightSwitch: true
      })
    } else {
      this.setData({
        leftSwitch: true,
        rightSwitch: false
      })
    }
  },

  /*设置失分较多知识点5个的时候显示隐藏的开关*/
  changePoints() {
    this.setData({
      pointsSwitch: true,
      pointsBtnSwitch: true
    })
  },
  //设置待提高知识点的开关
  changeImproved() {
    this.setData({
      improvedSwitch: true,
      improvedBtnSwitch: true
    })
  },

  /**开通vip模态框的开关**/
  showOpenService() {
    var that = this;
    dataJson.nowPay(studentId, examId, sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch,
      })
      if (res.data.status == 200 && !app.globalData.wrongSwitch) {
        that.setData({
          isVipShow: true,
          noExamInfo: { price: res.data.price, examId: examId },
          noExamTimeInfo: res.data.schemes.length ? res.data.schemes : ''
        })
      }
    })

  },

  /**vip弹窗进行付费**/
  goMoneyExam(e) {
    var that = this;
    dataJson.goMoney(studentId, e.currentTarget.dataset.type, e.currentTarget.dataset.examid, e.currentTarget.dataset.scheme, sessionKey).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch,
      })
      if (app.globalData.wrongSwitch) {
        that.setData({
          isVipShow: false
        });
        return;
      }
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
            that.setData({
              isVipShow: false
            });
            app.globalData.examVipSwitch = true;
            app.globalData.examLoadSwitch = true;
            optionS.payStatus = "true";
            optionS.courseId = that.data.courseId;
            optionS.pubCourseId = pubCourseId;
            optionS.courseName = pubCourseName;
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
              wrongSwitch: true,
              isVipShow: true,
              vipSwitch: false
            })
          }
        })
      }
    });
  },

  /*关闭VIP的开关*/
  _cancelEvent() {
    this.setData({
      isVipShow: false
    })
  },



  //图标解读的按钮点击事件
  showChartInfo(e) {
    wx.showModal({
      title: e.currentTarget.dataset.title,
      content: e.currentTarget.dataset.content,
      showCancel: false,
      confirmText: "我知道了",
      confirmColor: "#1AAD19"
    })
  },


  //图表函数的封装
  getChartsData(scorePortNameArr, scorePortNumArr, rateLineNumArr, rateLineDateArr, rateMin, courseStatusNameArr, courseStatusNumArr, questionDixData, questionDimyRates, questionDischoolRates, questionDiMin, knowledge, skill) {
    var that = this;
    //层次排名柱状图
    if (this.data.winningRate && this.data.permissionParentScore) {
      var rankHistogram = this.selectComponent('#rankHistogram');
      function setRank(chart, nameData, numData) {
        var option = {
          xAxis: {
            data: nameData,
            name: "(分数)",
            nameGap: 5,
            axisLine: {
              lineStyle: {
                color: '#888',
              },
            },
            axisTick: {
              alignWithLabel: true,
              interval: "auto",
            },
            axisLabel: {
              fontSize: 9,
              color: '#888',
            },
            nameTextStyle: {
              fontSize: 9,
              color: "#9DAEBF",
              verticalAlign: 'top',//文字垂直对齐方式，默认自动top,middle,bottom。
            },
          },
          yAxis: {
            name: '(人数)',
            triggerEvent: true,
            splitLine: { show: false },//去除网格线
            splitArea: {           // 分隔区域
              show: true,       // 默认不显示，属性show控制显示与否
              areaStyle: {       // 属性areaStyle（详见areaStyle）控制区域样式
                color: ['#FFFFFF', '#F4FBFF']
              }
            },
            axisLabel: {
              fontSize: 9,
              color: '#888',
            },
            nameTextStyle: {
              fontSize: 9,
              color: "#9DAEBF",
              verticalAlign: 'top',//文字垂直对齐方式，默认自动top,middle,bottom。
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
          },
          series: [{
            type: 'bar',
            data: numData,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',//数据在中间显示,
                  color: "#99A2AA",
                  fontSize: 8,
                },
                color: function (params) {
                  var numOne = params.name.split("[")[1].split("-")[0];
                  var numtwo = params.name.split(")")[0].split("-")[1];
                  if (numtwo.split("]").length) {
                    numtwo = numtwo.split("]")[0]
                  }
                  if (that.data.score >= +numOne && that.data.score <= +numtwo) {
                    return "#FAC102"
                  } else {
                    return '#3EBEEB'
                  }

                }
              }
            }
          }]
        };
        chart.setOption(option);
      }
      this.init(scorePortNameArr, scorePortNumArr, rankHistogram, setRank);
    }

    //学校战胜率折线图
    if (this.data.winningRate && rateLineNumArr && rateLineNumArr.length > 1) {
      this.rateLine = this.selectComponent('#rateLine');
      function setRateLine(chart, nameData, numData) {
        var option = {
          xAxis: {
            data: nameData,
            nameRotate: 90,
            splitNumber: 5,
            axisLine: {            // 坐标轴线
              lineStyle: {
                color: '#888',
              },
            },
            axisLabel: {
              fontSize: 9,
              color: '#888'
            }
          },
          yAxis: {
            triggerEvent: true,
            min: rateMin,
            name: "校战胜",
            nameTextStyle: {
              fontSize: 9,
              color: "#99A2AA",
              verticalAlign: 'top',//文字垂直对齐方式，默认自动top,middle,bottom。
            },
            splitLine: { show: false },//去除网格线
            splitArea: {           // 分隔区域
              show: true,       // 默认不显示，属性show控制显示与否
              areaStyle: {       // 属性areaStyle（详见areaStyle）控制区域样式
                color: ['#F4FBFF', '#FFFFFF']
              }
            },
            axisLine: {
              show: false
            },

            axisTick: {
              show: false
            },
            type: 'value',
            axisLabel: {
              formatter: '{value}%',
              color: '#888',
              fontSize: 9
            }
          },

          series: [{
            type: 'line',
            data: numData,
            symbolSize: 4,   //拐点圆的大小
            color: ['#3EBEEB'],  //折线条的颜色
            // smooth: true,   //是不是圆滑显示的
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1,
                  type: 'solid',  //'dotted'虚线 'solid'实线
                  color: "#3EBEEB"
                },
                label: {
                  show: true, color: "#3a3a3a",
                  fontSize: 12,
                  formatter: "{c}%",
                }
              }
            }
          }]
        };
        chart.setOption(option);
      }
      this.init(rateLineDateArr, rateLineNumArr, this.rateLine, setRateLine);

    }

    //优劣学科雷达图
    if (courseStatusNameArr.length && this.data.radarLength >= 3) {
      this.disSubjectRadar = this.selectComponent("#disSubjectRadar");
      function setDis(chart, nameData, numData) {
        var nameArr = [], numArr = [{
          value: numData, label: {
            normal: {
              show: true,
              formatter: function (params) {
                return params.value;
              }
            }
          }, areaStyle: {
            normal: {
              color: 'rgba(50,190,242,0.8)'
            }
          },
        }];
        nameData.map(item => {
          nameArr.push({ name: item, max: 100 });
        })
        var option = {
          radar: {
            shape: 'circle',
            name: {
              textStyle: {
                color: "#4C4C4C",
                fontSize: 12
              }
            },
            nameGap: 4, // 图中工艺等字距离图的距离
            indicator: nameArr,
            splitArea: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: '#A0C0D1' // 图表背景网格线的颜色
              }
            }
          },
          series: [{
            type: 'radar',
            data: numArr,
            itemStyle: {
              normal: {
                color: "#1D7AAA", // 图表中各个图区域的边框线拐点颜色
                lineStyle: {
                  color: "#118DE0" // 图表中各个图区域的边框线颜色
                },
              }
            },
          }]
        };
        chart.setOption(option);
      }
      this.init(courseStatusNameArr, courseStatusNumArr, this.disSubjectRadar, setDis);

    }

    //题目的双折线图
    if (questionDixData.length) {
      this.difficultTopicLine = this.selectComponent('#difficultTopicLine');
      function setRateLine(chart, nameData, numDataMy) {
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ["我的得分率", "学校得分率"],
            y: "bottom"
          },
          xAxis: {
            data: nameData,
            axisLine: {            // 坐标轴线
              lineStyle: {
                color: '#888',
              },
            },
            axisLabel: {
              fontSize: 9,
              color: '#888'
            }
          },
          yAxis: {
            triggerEvent: true,
            min: questionDiMin,
            name: "得分率",
            nameTextStyle: {
              fontSize: 9,
              color: "#99A2AA",
              verticalAlign: 'top',//文字垂直对齐方式，默认自动top,middle,bottom。
            },
            splitLine: { show: false },//去除网格线
            splitArea: {           // 分隔区域
              show: true,       // 默认不显示，属性show控制显示与否
              areaStyle: {       // 属性areaStyle（详见areaStyle）控制区域样式
                color: ['#F4FBFF', '#FFFFFF']
              }
            },
            axisLine: {
              show: false
            },

            axisTick: {
              show: false
            },
            type: 'value',
            axisLabel: {
              formatter: '{value}%',
              color: '#888',
              fontSize: 9
            }
          },
          grid: {
            left: "11%"
          },
          series: [{
            type: 'line',
            name: "我的得分率",
            data: numDataMy,
            symbolSize: 4,   //拐点圆的大小
            color: ['#3EBEEB'],  //折线条的颜色
            // smooth: true,    //是不是圆滑显示的
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1,
                  type: 'solid',  //'dotted'虚线 'solid'实线
                  color: "#3EBEEB"
                },
                label: {
                  show: true,
                  color: "#3a3a3a",
                  fontSize: 12,
                  formatter: "{c}%",
                }
              }
            }
          }, {
            type: 'line',
            name: "学校得分率",
            data: questionDischoolRates,
            symbolSize: 4,   //拐点圆的大小
            color: ['#9D61F1'],  //折线条的颜色
            // smooth: true,   //关键点，为true是不支持虚线的，实线就用true
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 1,
                  type: 'solid',  //'dotted'虚线 'solid'实线
                  color: "#9D61F1"
                },
                label: {
                  show: true, color: "#3a3a3a",
                  fontSize: 12,
                  formatter: "{c}%",
                }
              }
            }
          }]
        };
        chart.setOption(option);
      }
      this.init(questionDixData, questionDimyRates, this.difficultTopicLine, setRateLine);
    }

    //失分较多知识点环形图
    if (knowledge.length) {
      this.pointsAgainstrING = this.selectComponent("#pointsAgainstrING");
      function setDisSubjectRadar(chart, nameData, numData) {
        var arr = [];
        numData.map(item => {
          arr.push({ name: `${item.name}  ${item.data}%`, value: item.data })
        })
        var option = {
          backgroundColor: "#fafafa",
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              color: ["#F768A3", "#EBC44F", "#9BCB0A", "#06C4EC", "#673AB7", "#AFCDE0"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '15',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: arr
            }
          ]
        };
        chart.setOption(option);
      }
      this.init(this.data.pointsArr, knowledge, this.pointsAgainstrING, setDisSubjectRadar);
    }
    //待提高能力环形图
    if (skill.length) {
      this.improvedAgainstrING = this.selectComponent("#improvedAgainstrING");
      function setDisSubjectRadar(chart, nameData, numData) {
        var arr = [];
        numData.map((item, index) => {
          arr.push({ name: `${item.name}  ${item.data}%`, value: item.data })
        })
        var option = {
          backgroundColor: "#fafafa",
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              color: ["#F768A3", "#EBC44F", "#9BCB0A", "#06C4EC", "#673AB7", "#AFCDE0"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '15',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: arr
            }
          ]
        };
        chart.setOption(option);
      }
      this.init(this.data.improvedArr, skill, this.improvedAgainstrING, setDisSubjectRadar);
    }
    console.log("end");

  },

  //点击回到顶部事件
  goTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }


})