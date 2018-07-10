let dataJson = require("./../import/getData.js");
const app = getApp();
let result = "";//注册传过来的数据
let provincesArr = [];//省的数组
let cityArr = [];//市的数组
let allArr = [];//省市一起的数组
let session_key = "";//就是session_key
let areaCode = "";//区的code
let schoolId = 0;//学校的id
let schArr = [];//学校的数组
let gradeArr = [];//年级的数组
let grade = "";//年级的标记
let classArr = [];//班级的数组
let classId = "";//class的id用来调取最近一次考试的接口
let examId = "";//考试的id
let inputNumberInfo = "";//输入的考号
let inputNameInfo = "";//输入的孩子姓名
let studentId = "";//学生的id
let roleId = "";//角色的id
let leaderId = "";//班主任的id
let leaderSwitch = false;//班主任是否选择的开关
let studentValidate = [];//学生验证的数组
let errNum = 0;//当错误次数为2的时候绑定失败
let onLoadSwitch = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    casTestSwitch: true,
    cascadeSwitch: true,//1.省市区的开关
    textNumberSwitch: false,//2.考号姓名的开关
    examSwitch: true,//第一个和第二个考的下一步按钮
    testNumberDisabled: true,//第一步和第二步按钮的disabled
    provingSwitch: false,//3.学生班主任认证的开关
    roleSwitch: false,//4.选择角色的开关
    agreeSwitch: true,//同意协议并绑定的按钮disabled开关
    bindSuccessSwitch: false,//5.绑定成功的开关
    feedbackSwitch: false,//6.反馈的开关
    bindErrSwitch: false,//7.绑定错误的开关
    connectionSwitch: true,//级联的显示开关
    auditingproving: "",//验证等待审核的提示信息
    alreadyproving: "",//验证已经绑定的提示信息
    auditingprovingSwitch: false,//验证等待审核的提示信息开关
    alreadyprovingSwitch: false,//验证已经绑定的提示信息的开关
    provingBtnSwitch: true,//审核的按钮开关
    multiArray: [],//初始数组
    schoolArray: [[], [], []],//学校级联的数组
    omitInfo: "省 市 区",//省市区的select
    schoolInfo: "学校 年级 班级",//学校年级班级的select
    alertIcon: "./../../icon/alert.svg",//重要提示的小图标
    textTitle: "",//考试名称
    textTime: "",//考试时间
    omitInfoS: "",
    schoolInfoS: "",
    childName: "",//学生的姓名
    roleArr: [],//家庭角色的数组
    roleIndex: -1,//选择角色的index
    reportBtnSwitch: true,//举报按钮的开关
    protocol: false,//协议的开关
    norm: false,//绑定限额的开关
    internalError: false,//服务器内部错误
    newly: false,//验证错误
    protocalInfo: "1.1为使用本公众号服务，您应当阅读并遵守《用户使用协议》（以下简称“本协议”）。请您务必审慎阅读、充分理解各条款内容，并选择接受或不接受",//协议的内容
    closeImg: "./../../imgs/close.png",//关闭的图片
    bindSuccessImage: "./../../imgs/bind-success.svg",//绑定成功的图片
    bindWorngImg: "./../../imgs/worng.svg",//进行审核的图片
    bindErrImage: "./../../imgs/bindErr.svg",//绑定失败的图片
    provingTeacherArr: [], //班主任的数组
    provingStudentArr: [],//学生的数组
    provingTeacherIndex: -1,//点击选择班主任的时候
    firstSwitch: false,//第一次绑定孩子成为管理员的开关
    provingDisabled: true,//验证的时候按钮的disabled状态
    feedbackFamilyText: "",//反馈的孩子的内容
    wrongSwitch: false
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function (option) {
    wx.removeStorageSync("studentInfo");
    app.globalData.myLoadSwitch = true;
    app.globalData.examLoadSwitch = true;
    onLoadSwitch = true;
    result = option.result;
    let that = this;
    inputNumberInfo = "", inputNameInfo = "", areaCode = "";
    app.globalData.wrongSwitch = false;
    dataJson.getCity().then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status === 200) {
        let arr = [[], [], []];
        provincesArr = res.data.provinces;
        cityArr = res.data.citys;
        allArr = [provincesArr, cityArr];
        for (let i in res.data.provinces) {
          arr[0].push(res.data.provinces[i].name)
        }
        for (let i in res.data.citys) {
          if (res.data.citys[i].province_code == res.data.provinces[0].code) {
            arr[1].push(res.data.citys[i].name)
          }
        }
        session_key = wx.getStorageSync("userInfo").session_key
        return { code: res.data.citys[0].code, arr: arr }
      }

    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    }).then(cityRes => {
      dataJson.getArea(cityRes.code, session_key).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        res.data.data.map(item => {
          cityRes.arr[2].push(item.name)
        })
        console.log(res)
        areaCode = res.data.data[0].code;
        that.setData({
          multiArray: cityRes.arr
        })
      }).catch(() => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
      })
    })

  },
  onUnload: function () {
    //绑定孩子的页面返回只能是殿后夜或者个人中心，不能是注册手机号 
    if (result == 1) {
      wx.switchTab({
        url: '/pages/exam/exam'
      })
    } else if (result == 2) {
      wx.switchTab({
        url: '/pages/my/my'
      })
    }

  },
  onHide: function () {
    onLoadSwitch = false;
  },
  onShow: function () {
    let studentInfo = wx.getStorageSync("studentInfo");
    if (!onLoadSwitch && studentInfo) {
      if (res.data.switch) {
        this.bindAdd(res.data.studentId, res.data.roleId, session_key)
      } else {
        this.studentExam(res.data.classId, res.data.examId, res.data.inputNameInfo, res.data.inputNumberInfo, session_key);
      }
    }
  },
  //城市的级联
  //级联触发完毕
  bindMultiPickerChange: function (e) {
    let that = this;
    let infoArr = [];
    let arr = this.data.multiArray;
    infoArr[0] = arr[0][e.detail.value[0]];
    infoArr[1] = arr[1][e.detail.value[1]];
    console.log(e.detail.value);
    for (let i in cityArr) {
      if (cityArr[i].name == infoArr[1]) {
        dataJson.getArea(cityArr[i].code, session_key).then(res => {
          console.log(res);
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch
          })
          infoArr[2] = res.data.data[e.detail.value[2]].name;
          areaCode = res.data.data[e.detail.value[2]].code;
          this.setData({
            omitInfo: infoArr
          })
          dataJson.getSchool(areaCode, session_key).then(res => {
            that.setData({
              wrongSwitch: app.globalData.wrongSwitch
            })
            that.data.schoolArray = [[], [], []];
            for (let i in res.data.data) {
              that.data.schoolArray[0].push(res.data.data[i].name);
            }
            schoolId = res.data.data[0].id;
            schArr = res.data.data;
            dataJson.getclass(res.data.data[0].id, session_key).then(res => {
              that.setData({
                wrongSwitch: app.globalData.wrongSwitch
              })
              for (let i in res.data.grades) {
                that.data.schoolArray[1].push(res.data.grades[i].label);
              }
              for (let i in res.data.classList) {
                if (res.data.classList[i].grade == res.data.grades[0].grade) {
                  that.data.schoolArray[2].push(res.data.classList[i].name);
                }
              }
              gradeArr = res.data.grades;
              classArr = res.data.classList;
              that.setData({
                schoolArray: that.data.schoolArray,
                schoolInfo: "学校 年级 班级",
                cascadeSwitch: true,
                textNumberSwitch: false,
              })

            }).catch(() => {
              that.setData({
                wrongSwitch: app.globalData.wrongSwitch
              })
            })
          }).catch(() => {
            that.setData({
              wrongSwitch: app.globalData.wrongSwitch
            })
          })
        }).catch(() => {
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch
          })
        })
      }
    }

  },
  //级联开始触发
  bindMultiPickerColumnChange: function (e) {
    let that = this;
    let arr = this.data.multiArray;
    classId = "";
    // 拖动第一列的时候
    if (!e.detail.column) {
      arr[1] = [];
      let cityArr2 = [];
      for (let i in cityArr) {
        if (provincesArr[e.detail.value].code === cityArr[i].province_code) {
          arr[1].push(cityArr[i].name)
          this.setData({
            multiArray: arr
          })
          cityArr2.push(cityArr[i])
        }
      }
      dataJson.getArea(cityArr2[0].code, session_key).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        arr[2] = [];
        res.data.data.map(item => {
          arr[2].push(item.name)
        })
        that.setData({
          multiArray: arr
        })
      }).catch(() => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
      })
    } else if (e.detail.column == 1) {//拖动第二列的时候
      let arr2 = [];
      for (let j in arr[1]) {
        for (let i in cityArr) {
          if (cityArr[i].name == arr[1][j]) {
            arr2.push(cityArr[i])
          }
        }
      }
      console.log(arr2[e.detail.value].code)
      dataJson.getArea(arr2[e.detail.value].code, session_key).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        console.log(res);
        arr[2] = [];
        res.data.data.map(item => {
          arr[2].push(item.name)
        })
        that.setData({
          multiArray: arr
        })
      }).catch(() => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
      })
    }

  },

  //学校的级联
  //级联开始触发
  bindschoolColumnChange: function (e) {
    let that = this;
    let arr = this.data.schoolArray;
    if (!e.detail.column) {
      dataJson.getclass(schArr[e.detail.value].id, session_key).then(res => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
        arr[1] = [];
        arr[2] = [];
        classArr = res.data.classList;
        gradeArr = res.data.grades;
        for (let i in res.data.grades) {
          arr[1].push(res.data.grades[i].label)
        };
        for (let i in res.data.classList) {
          arr[2].push(res.data.classList[i].name)
        }
        that.setData({
          schoolArray: arr
        })
      }).catch(() => {
        that.setData({
          wrongSwitch: app.globalData.wrongSwitch
        })
      })
    } else if (e.detail.column == 1) {
      arr[2] = [];

      for (let i in classArr) {
        if (gradeArr[e.detail.value].grade === classArr[i].grade) {
          arr[2].push(classArr[i].name)
        }
      }
      that.setData({
        schoolArray: arr
      })
    }

  },
  //级联触发完毕
  bindschoolChange: function (e) {

    for (let i in e.detail.value) {
      if (e.detail.value[i] == null) {
        e.detail.value[i] = 0
      }
    }
    let arr = this.data.schoolArray;
    let grade = "";
    //获取年级的grade

    for (let i in gradeArr) {
      if (arr[1][e.detail.value[1]] == gradeArr[i].label) {
        grade = gradeArr[i].grade;
        break;
      }
    }
    //获取班级的id方便调取接口
    for (let i in classArr) {
      if (grade == classArr[i].grade && arr[2][e.detail.value[2]] == classArr[i].name) {
        classId = classArr[i].id;
        break;
      }
    }
    this.setData({
      schoolInfo: [arr[0][e.detail.value[0]], arr[1][e.detail.value[1]], arr[2][e.detail.value[2]]],
    })
    this.submitCascsde();


  },


  /**提交省市区级联的输入进行最近考试的查询**/
  submitCascsde() {
    let that = this;
    this.setData({
      auditingWarningSwitch: false,
      alreadyWarningSwitch: false,
      toExamSwitch: false,
      examSwitch: true
    })
    dataJson.getClassExam(classId, session_key).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        examId = res.data.data.exam_id;
        that.setData({
          cascadeSwitch: false,
          textNumberSwitch: true,
          textTitle: res.data.data.exam_name,
          textTime: res.data.data.exam_date
        })
      } else if (res.data.status == 404) {
        that.setData({
          cascadeSwitch: true,
          textNumberSwitch: false
        })
        wx.showModal({
          title: "本班无考试",
          content: res.data.msg,
          showCancel: false,
          confirmText: "我知道了",
          confirmColor: "#1AAD19"
        })
      } else {
        that.setData({
          cascadeSwitch: true,
          textNumberSwitch: false
        })
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
  },


  /**获取输入的考号**/
  inputNumber(e) {
    inputNumberInfo = (e.detail.value + "").replace(/\s+/g, "");
    if (inputNumberInfo && inputNameInfo) {
      this.setData({
        testNumberDisabled: false
      })
    } else {
      this.setData({
        testNumberDisabled: true
      })
    }
  },
  /**获取输入的学生姓名**/
  inputName(e) {
    inputNameInfo = (e.detail.value).replace(/\s+/g, "");
    if (inputNumberInfo && inputNameInfo) {
      this.setData({
        testNumberDisabled: false
      })
    } else {
      this.setData({
        testNumberDisabled: true
      })
    }
  },

  /***点击校验学生姓名和考号***/
  submitTest() {
    this.studentExam(classId, examId, inputNameInfo, inputNumberInfo, session_key);
  },

  /**校验考号手机号**/
  studentExam(classId, examId, inputNameInfo, inputNumberInfo, session_key) {
    let that = this;
    dataJson.getStudentExam(classId, examId, inputNameInfo, inputNumberInfo, session_key).then(res => {
      console.log(res);
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        studentId = res.data.data.student_id;
        that.setData({
          casTestSwitch: false,
          roleSwitch: true,
          childName: res.data.data.student_name
        })
        /***获取角色***/
        dataJson.getParentRoles(session_key).then(res => {
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch
          })
          that.setData({
            auditingWarningSwitch: false,
            alreadyWarningSwitch: false,
            roleArr: res.data.data
          })
        }).catch(() => {
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch
          })
        })
      } else if (res.data.status == 300) {
        studentId = res.data.data.student_id;
        that.setData({
          childName: res.data.data.student_name,
          auditingWarningSwitch: false,
          alreadyWarningSwitch: false,
        });
        wx.showModal({
          title: '考号姓名不匹配',
          content: res.data.msg,
          confirmText: "检查无误",
          confirmColor: "#1AAD19",
          cancelText: "重新输入",
          cancelColor: "#000000",
          success: function (res) {
            if (res.confirm) {
              that.setData({
                casTestSwitch: false,
                provingSwitch: true,
              });
              //获取验证的列表 
              dataJson.authInfo(studentId, session_key).then(res => {
                that.setData({
                  wrongSwitch: app.globalData.wrongSwitch
                })
                if (res.data.status == 200) {
                  let arr = res.data.mates;
                  for (let i in arr) {
                    arr[i].state = 0;
                  }
                  that.setData({
                    provingTeacherArr: res.data.class_leaders,
                    provingStudentArr: arr
                  })
                  if (!that.data.provingTeacherArr.length) {
                    leaderSwitch = true
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
      } else if (res.data.status == 301) {
        wx.showModal({
          content: res.data.msg,
          confirmText: "查看成绩",
          confirmColor: "#1AAD19",
          cancelText: "取消",
          cancelColor: "#000000",
          success: function (res) {
            if (res.confirm) {
              that.toExam();
            }
          }
        })
      } else if (res.data.status == 302) {
        wx.showModal({
          title: "等待审核",
          content: res.data.msg,
          showCancel: false,
          confirmText: "我知道了",
          confirmColor: "#1AAD19",
        })
        wx.setStorage({
          key: 'studentInfo',
          data: { "switch": false, "classId": classId, "examId": examId, "inputNameInfo": inputNameInfo, "inputNumberInfo": inputNumberInfo, "session_key": session_key },
        })
      } else {
        wx.showModal({
          content: res.data.msg,
          showCancel: false,
          confirmText: "我知道了",
          confirmColor: "#1AAD19",
        })
      }
    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
  },

  /**选择角色**/
  selectRole(e) {
    this.setData({
      roleIndex: e.currentTarget.dataset.index,
      agreeSwitch: false
    })
    roleId = this.data.roleArr[e.currentTarget.dataset.index].role;
    leaderSwitch = true;
  },
  /*打开协议的开关*/
  openPro() {
    let that = this;
    dataJson.protocol().then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        this.setData({
          protocol: true,
          protocalInfo: res.data.msg
        })
      }

    }).catch(() => {
      that.setData({
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
        roleSwitch: false
      })
      if (res.data.status == 220) {
        that.setData({
          bindSuccessSwitch: true,
          firstSwitch: true,
          feedbackSwitch: false,
        })
        wx.removeStorage({
          key: 'studentInfo',
        })
      } else if (res.data.status == 200) {
        that.setData({
          bindSuccessSwitch: true,
          firstSwitch: false,
          feedbackSwitch: false,
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
    result = 1;
    wx.switchTab({
      url: '/pages/exam/exam'
    })
  },
  /***回到绑定孩子的界面***/
  toBind() {
    wx.navigateTo({
      url: '/pages/bind/bind',
    })
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


  /**点击选择班主任(1个)**/
  selectTeacher(e) {
    this.setData({
      provingTeacherIndex: e.currentTarget.dataset.proindex
    })
    leaderId = this.data.provingTeacherArr[e.currentTarget.dataset.proindex].id;
    leaderSwitch = true;
  },
  /**点击选择孩子（2个）**/
  selectStudent(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.provingStudentArr[index].state == 1) {
      this.data.provingStudentArr[index].state = 0;
    } else if (this.data.provingStudentArr[index].state == 0) {
      this.data.provingStudentArr[index].state = 1;
    }
    let num = 0;
    for (let i in this.data.provingStudentArr) {
      if (this.data.provingStudentArr[i].state == 1) {
        num++;
        studentValidate.push(this.data.provingStudentArr[i].student_id);
      }
    }
    if (num == 2) {
      if (leaderSwitch) {
        this.setData({
          provingDisabled: false
        })
      }
    } else {
      studentValidate = [];
      this.setData({
        provingDisabled: true
      })
    }
    this.setData({
      provingStudentArr: this.data.provingStudentArr,
    });
  },


  /****点击验证***/
  submitProving() {
    let that = this;
    dataJson.auth(studentId, this.data.provingTeacherArr.length, leaderId, studentValidate, session_key).then(res => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
      if (res.data.status == 200) {
        that.setData({
          provingSwitch: false,
          roleSwitch: true
        });
        /***获取角色***/
        dataJson.getParentRoles(session_key).then(res => {
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch
          })
          that.setData({
            roleArr: res.data.data
          })
        }).catch(() => {
          that.setData({
            wrongSwitch: app.globalData.wrongSwitch
          })
        })
      } else if (res.data.status == 301) {
        that.setData({
          alreadyprovingSwitch: true,
          auditingprovingSwitch: false,
          alreadyproving: res.data.msg,
          toExamSwitch: true,
          provingBtnSwitch: false
        })
      } else if (res.data.status == 302) {
        that.setData({
          alreadyprovingSwitch: false,
          auditingprovingSwitch: true,
          auditingproving: res.data.msg,
          toExamSwitch: false,
          provingBtnSwitch: false
        })
      }
      else {
        errNum++;
        if (errNum < 2) {
          wx.showModal({
            title: res.data.msg,
            showCancel: false,
            confirmText: "重新验证",
            confirmColor: "#1AAD19",
          })
          leaderId = "";
          studentValidate = [];
          let arr = that.data.provingStudentArr;
          arr.map(item => {
            item.state = 0
          })
          that.setData({
            provingTeacherIndex: -1,
            provingStudentArr: arr
          })
        } else {
          errNum = 0;
          wx.showModal({
            title: "已验证错两次，绑定失败",
            showCancel: false,
            confirmText: "重新绑定",
            confirmColor: "#1AAD19",
            success: function (res) {

              wx.navigateTo({
                url: '/pages/bind/bind',
              })

            }
          })


        }

      }
    }).catch(() => {
      that.setData({
        wrongSwitch: app.globalData.wrongSwitch
      })
    })
  },
})