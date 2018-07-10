const app = getApp();
const baseUrl = app.globalData.baseUrl;
let codeNum = 0, enrollNum = 0;
function loginWarp() {
  function login() {
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
            if (res.statusCode !== 200) {
              app.globalData.wrongSwitch = true
            } else {
              app.globalData.wrongSwitch = false
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
            app.globalData.wrongSwitch = true;
          },
          complete: res => {
            app.globalData.employId = res.statusCode;
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
}
module.exports = {
  login: loginWarp
}