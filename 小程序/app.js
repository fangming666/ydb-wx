//app.js
const baseImgUrl = "";//服务器上图片的base路径
// const baseUrl = "https://home.dev.mschool.cn/mini"; //请求后台接口的base路径
const baseUrl = "https://home.yuandingbang.cn/mini"; //请求后台接口的base路径

let scence = 0;
App({
  onLaunch: function () {
    let that = this;
    let codeNum = 0, enrollNum = 0;
    function login() {
      wx.login({
        success: res => {
          wx.showLoading({
            title: '加载中',
          });
          wx.request({
            url: `${baseUrl}/login`,
            data: {
              code: res.code
            },
            method: "POST",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: res => {
              if (res.statusCode !== 200) {
                that.globalData.wrongSwitch = true
              } else {
                that.globalData.wrongSwitch = false
              }
              if (res.data.status === 300) {
                if (codeNum) {
                  codeNum = 0
                  return;
                } else {
                  wx.redirectTo({
                    url: '/pages/code/code',
                  });
                  codeNum++;
                }
                return;
              }
              if (!res.data.data.user_id) {
                if (enrollNum) {
                  enrollNum = 0;
                } else {
                  wx.navigateTo({
                    url: '/pages/enroll/enroll?link=1'
                  });
                  enrollNum++;
                }
              } else {
                wx.switchTab({
                  url: '/pages/exam/exam',
                })
              }
              let userInfo = {
                "user_id": res.data.data.user_id, "nick_name": res.data.data.nick_name, "head_image_url": res.data.data.head_image_url, "open_id": res.data.data.open_id, "session_key": res.data.data.session_key, "union_id": res.data.data.union_id, "phone": res.data.data.phone
              }
              wx.setStorageSync('userInfo', userInfo)
              wx.setScreenBrightness("user_id", res.data.data.user_id)
            },
            fail: (err) => {
              that.globalData.wrongSwitch = true;
            },
            complete: res => {
              wx.hideLoading();
              that.globalData.employId = res.statusCode;
              if (that.employIdCallback) {
                that.employIdCallback(res.employId);
              }
            }
          })
        }
      })
    }
    wx.checkSession({
      success: function () {
        console.log("session_key未过期");
        login();
      },
      fail: function () {
        console.log("session_key已过期")
        // session_key 已经失效，需要重新执行登录流程
        login();
      }
    })
  },

  onHide: function () {
    this.globalData.scence = 1;
  },
  globalData: {
    employId: '',
    examStudentId: "",
    baseImgUrl: baseImgUrl,
    baseUrl: baseUrl,
    examLoadSwitch: true,
    myLoadSwitch: true,
    examVipSwitch:false,
    currentAjax: null,
    reportFail: 0,
    currentExam: null,
    codeSwitch: false,
    showLoading: 1,
    wrongSwitch: false//服务器内部错误的页面显示
  }
})