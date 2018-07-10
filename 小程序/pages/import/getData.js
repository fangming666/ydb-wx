//获取数据的函数封装
const app = getApp();
const baseUrl = app.globalData.baseUrl;
const header = { 'content-type': 'application/x-www-form-urlencoded' };
const sessionKey = wx.getStorageSync("userInfo").session_key

/**************请求的封装函数***********/
let pottingFun = (url, data, loadSwitch, successBack, errBack) => {
  if (loadSwitch) {
    wx.showLoading({
      title: '加载中',
    })
  }
  wx.request({
    url: url,
    data: data,
    header: header,
    method: "POST",
    success: res => {
      if (res.statusCode !== 200) {
        app.globalData.wrongSwitch = true
      } else {
        app.globalData.wrongSwitch = false
      }
      if (successBack) {
        successBack(res)
      }
    },
    fail: err => {
      app.globalData.wrongSwitch = true;
      if (errBack) {
        errBack(err);
      }
    },
    complete: () => {
      if (loadSwitch) {
        wx.hideLoading();
      }
    }
  })

}


/********************************************绑定流程****************************************/
//获取手机验证码
let getPhoneCode = (phone, user_id) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/sms/send`, { phone: phone, user_id: user_id }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
};

//手机验证码的验证
let submitIdentifying = (phone, code) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/sms/check-code`, { phone: phone, code: code }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })

}

//手机号注册
let register = (phone, open_id, union_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/register`, { phone: phone, open_id: open_id, union_id: union_id, session_key: session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })

}

//获取孩子列表
let childList = (session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/child`, { "access-token": session_key }, false, (res) => { resolve(res.data) }, (err) => { reject(err) });
  })
}

//获取省市的数据
let getCity = () => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/area/get-city`, {}, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//获取区的数据
let getArea = (city, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/area/get-area`, { "city": city, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//获取学校的数据
let getSchool = (area, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/area/get-school`, { "area": area, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//获取年级班级的数据
let getclass = (school_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/area/school-class`, { "school_id": school_id, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//获取班级的最近一次考试
let getClassExam = (class_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/area/class-exam`, { "class_id": class_id, "access-token": session_key }, true, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//孩子考号验证
let getStudentExam = (class_id, exam_id, name, exam_code, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/bind/student-exam`, { "class_id": class_id, "exam_id": exam_id, "name": name, "exam_code": exam_code, "access-token": session_key }, true, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//获取家庭的角色
let getParentRoles = session_key => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/bind/parent-roles`, { "access-token": session_key }, true, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//选择角色绑定学生
let getBindAdd = (student_id, role, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/bind/add`, { "student_id": student_id, "role": role, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })


}

//举报家庭管理员
let reportManager = (student_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/bind/report-manager`, { "student_id": student_id, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//获得认证信息
let authInfo = (student_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/bind/auth-info`, { "student_id": student_id, "access-token": session_key }, true, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//去验证班主任，同学
let auth = (student_id, leader_switch, leader_id, mates, session_key) => {
  return new Promise((resolve, reject) => {
    let data = {};
    if (leader_switch) {
      data = { "student_id": student_id, "leader_id": leader_id, "mates": mates, "access-token": session_key };
    } else {
      data = { "student_id": student_id, "mates": mates, "access-token": session_key };
    };
    pottingFun(`${baseUrl}/bind/auth`, data, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//获取协议
let protocol = () => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/register/protocol`, {}, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//获得分享的二维码
let qrCode = (session_key, student_id) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/family/qr-code`, { "access-token": session_key, "student_id": student_id }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}


//获得扫码进入的单个孩子的信息
let studentInfo = (student_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/family/student-info`, { "access-token": session_key, "student_id": student_id }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}
/**************************************************考试列表*******************************/
//查看所有考试
let getExam = (student_id, session_key) => {
  return new Promise((resolve, reject) => {
    app.globalData.currentExam = wx.request({
      url: `${baseUrl}/exam`,
      data: { "student_id": student_id, "access-token": session_key },
      header: header,
      method: "POST",
      success: res => {
        if (res.statusCode !== 200) {
          app.globalData.wrongSwitch = true
        } else {
          app.globalData.wrongSwitch = false
        }
        resolve(res)
      },
      fail: err => {
        if (!app.globalData.currentExam) {
          app.globalData.wrongSwitch = true;
        }
        reject(err)
      },
      complete: () => {
        app.globalData.currentExam = null;
      }
    })
  })
}


/***************************************个人中心*********************************/

/**修改密码**/
let setPwd = (student_id, password, confim_password, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/child/update`, { "student_id": student_id, "password": password, "confim_password": confim_password, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}


//解除绑定
let delteChild = (student_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/child/delete`, { "student_id": student_id, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//解除绑定的验证
let delteChildProving = (student_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/child/check-delete`, { "student_id": student_id, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}



/**家庭成员***/
//获取家庭成员
let getFamily = (student_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/family`, { "student_id": student_id, "access-token": session_key }, false, (res) => { resolve(res.data) }, (err) => { reject(err) });
  })

}
//同意审核
let agreeAudyting = (student_id, parent_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/family/agree`, { "student_id": student_id, "parent_id": parent_id, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}
//拒绝审核
let refuseAudyting = (student_id, parent_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/family/refuse`, { "student_id": student_id, "parent_id": parent_id, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//设置自动审核
let verify = (student_id, bindVerify, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/family/student-verify`, { "student_id": student_id, "bindVerify": bindVerify, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//转让管理员
let transfer = (student_id, parent_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/family/transfer`, { "student_id": student_id, "parent_id": parent_id, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}
//转让并删除
let transferDelete = (student_id, parent_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/family/delete`, { "student_id": student_id, "parent_id": parent_id, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//举报认领
let reportParent = (student_id, parent_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/family/report-parent`, { "student_id": student_id, "parent_id": parent_id, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//删除家庭成员
let deleteTwo = (student_id, parent_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/child/delete`, { "student_id": student_id, "parent_id": parent_id, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

/**修改手机号发送验证码**/
let reviseSend = (session_key, phone) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/account/send`, { "access-token": session_key, "phone": phone }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

/***修改手机号提交验证码**/
let reviseUpdatePhone = (session_key, phone, code) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/account/update-phone`, { "access-token": session_key, "phone": phone, "code": code }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

/******订单列表*******/
let order = (session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/order`, { "access-token": session_key }, true, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

/*****使用指南*****/
let help = () => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/help`, {}, true, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}
//帮助的内容
let helpContent = (help_id) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/help/content`, { help_id: help_id }, true, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

/******意见反馈*****/
let feedBack = (content, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/feed-back/add`, { "content": content, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}
/*****个性化服务****/
//考试时间付费列表
let timeServerList = (student_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/order/time`, { "student_id": student_id, "access-token": session_key }, true, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//考试列表付费列表
let examServerList = (student_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/order/exam`, { "student_id": student_id, "access-token": session_key }, true, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//进行付费
let goMoney = (student_id, exam_type, exam_id, scheme_id, session_key) => {
  return new Promise((resolve, reject) => {
    let data = {};
    if (exam_type == "exam") {
      data = { "student_id": student_id, "type": exam_type, "exam_id": exam_id, "access-token": session_key }
    } else {
      data = { "student_id": student_id, "type": exam_type, "scheme_id": scheme_id, "access-token": session_key }
    }
    pottingFun(`${baseUrl}/order/create`, data, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}


/**********************************分析报告****************************************/
//考试科目列表
let courses = (student_id, exam_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/exam/courses`, { "student_id": student_id, "exam_id": exam_id, "access-token": session_key }, true, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//学生考试成绩(以及所有表格的数据)
let report = (student_id, exam_id, course_id, session_key) => {
  app.globalData.reportFail = 0;
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中',
    })
    // app.globalData.prevAjax = app.globalData.currentAjax;
    app.globalData.currentAjax = wx.request({
      url: `${baseUrl}/report`,
      data: { "student_id": student_id, "exam_id": exam_id, "course_id": course_id, "access-token": session_key },
      header: header,
      method: "POST",
      success: (res) => {
        if (res.statusCode !== 200) {
          app.globalData.wrongSwitch = true
        } else {
          app.globalData.wrongSwitch = false
        }
        wx.hideLoading();
        resolve(res);
      },
      fail: (err) => {
        if (!app.globalData.currentAjax) {
          app.globalData.wrongSwitch = true;
          app.globalData.reportFail = 0;
          wx.hideLoading();
        } else {
          app.globalData.reportFail = 1
        }
        reject(err)
      },
      complete: () => {
        app.globalData.prevAjax = null;
        app.globalData.currentAjax = null;     
      }
    })

  })
}


/***单个考试的付费***/
let nowPay = (student_id, exam_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/exam/pay`, { "student_id": student_id, "exam_id": exam_id, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}





/****************************成绩穿越**************************/
//得到班级
let choolClass = (student_id, exam_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/exam/school-class`, { "student_id": student_id, "exam_id": exam_id, "access-token": session_key }, false, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

//开始穿越
let through = (student_id, exam_id, school_id, class_id, course_id, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/score-magic/through`, { "student_id": student_id, "exam_id": exam_id, "school_id": school_id, "class_id": class_id, "course_id": course_id, "access-token": session_key }, true, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

/***提高的成绩***/
let throughScore = (student_id, exam_id, score, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/score-magic/through-score`, { "student_id": student_id, "exam_id": exam_id, "score": score, "access-token": session_key }, true, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}

/***计算想要提高的分数***/
let throughRate = (student_id, exam_id, rate, session_key) => {
  return new Promise((resolve, reject) => {
    pottingFun(`${baseUrl}/score-magic/through-rate`, { "student_id": student_id, "exam_id": exam_id, "rate": rate, "access-token": session_key }, true, (res) => { resolve(res) }, (err) => { reject(err) });
  })
}
// 导出函数
module.exports = {
  getPhoneCode: getPhoneCode,
  submitIdentifying: submitIdentifying,
  register: register,
  childList: childList,
  getCity: getCity,
  getArea: getArea,
  getSchool: getSchool,
  getclass: getclass,
  getClassExam: getClassExam,
  getStudentExam: getStudentExam,
  getParentRoles: getParentRoles,
  getBindAdd: getBindAdd,
  reportManager: reportManager,
  authInfo: authInfo,
  auth: auth,
  getExam: getExam,
  getFamily: getFamily,
  setPwd: setPwd,
  protocol: protocol,
  delteChild: delteChild,
  agreeAudyting: agreeAudyting,
  refuseAudyting: refuseAudyting,
  verify: verify,
  transfer: transfer,
  reportParent: reportParent,
  deleteTwo: deleteTwo,
  order: order,
  help: help,
  helpContent: helpContent,
  feedBack: feedBack,
  reviseSend: reviseSend,
  reviseUpdatePhone: reviseUpdatePhone,
  delteChildProving: delteChildProving,
  timeServerList: timeServerList,
  examServerList: examServerList,
  goMoney: goMoney,
  courses: courses,
  report: report,
  nowPay: nowPay,
  choolClass: choolClass,
  throughScore: throughScore,
  throughRate: throughRate,
  through: through,
  qrCode: qrCode,
  studentInfo: studentInfo,
  transferDelete: transferDelete
}