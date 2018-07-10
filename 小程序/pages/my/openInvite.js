//跳转到绑定孩子或者注册的页面
let openInvite = (childName) => {
  if (wx.getStorageSync("userInfo").user_id) {
    if (childName.length >= 3) {
      wx.showModal({
        title: "尚无法使用",
        content: '您的绑定尚未通过审核，请在通过审核后再使用此功能。',
        showCancel: false,
        confirmText: "我知道了",
        confirmColor: "#1AAD19"
      })
    } else {
      wx.navigateTo({
        url: '/pages/bind/bind?result=2',
      })
    }
  } else {
    wx.navigateTo({
      url: '/pages/enroll/enroll?link=2',
    })
  }
}
module.exports = {
  openInvite: openInvite
}