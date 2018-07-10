// pages/my-item/server/server.js
const dataJson = require("./../../import/getData.js");
const app = getApp();
let sessionKey = "";//这就是棒棒的session_key
let studentId = "";//学生的id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wrongSwitch: false,
    serverHeadImg: "./../../../imgs/server-head.svg",//个性化服务头部的图片
    serverHaveHeadImg: "./../../../imgs/server-have-bg.svg",//个性化服务付费以后的头部图片
    imperialCrownImage: "./../../../imgs/imperial_crown.svg",//皇冠的图片
    childArr: [],//绑定孩子列表的数组
    childIndex: 0,//孩子列表头部的active效果
    vipTime: "",//会员有效期
    a: 0,
    platform: true,//ios的时候为true，安卓的时候为false
    schoolType: "",//孩子学校的类型（用来显示付费的开关）
    yesIcon: "./../../../imgs/yes-warning.svg",//对号的图片
    payInfoArr: [{ title: "普通用户：", content: "提供查成绩、查看孩子答题卡原图等基础服务。" }, { title: "付费用户：", content: "享有为孩子定制的成绩报告、大数据分析、带学霸答案的错题本和成绩穿越等服务。" }],//可以副得的信息
    wayOneArr: ["基本成绩", "战胜率变化",  "优劣学科", "失分较多知识点","待提高能力", "各小题得分", "提分建议", "我的答题卡", "成绩穿越", "成绩模拟"],//表格功能的第一个数组
    wayTwoArr: ["失分题面", "参考答案", "我的作答", "学霸答案(主观题）", "导出pdf错题本(用于打印)"],//表格功能的第二个数组
    wayThreeArr: ["筛选全部错题", "错题组卷小测验"],//表格功能的第三个数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      wrongSwitch: false,
    })
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        sessionKey = res.data.session_key,
          //获取孩子列表
          that.getChild(0);
      },
    })
    /**ios和安卓的表格的高度处理**/
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "ios") {
          that.setData({
            platform: true
          })
        } else if (res.platform == "android") {
          that.setData({
            platform: false
          })
        }
      }
    })

  },

  /**孩子的头部点击事件**/
  childChange(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    this.setData({
      childIndex: index,
      schoolType: this.data.childArr[index].payService.school_type
    });
    if (this.data.childArr[index].payService.endTime) {
      that.setData({
        vipTime: that.data.childArr[index].enddate
      })
    } else {
      that.setData({
        vipTime: ""
      })
    }
    studentId = e.currentTarget.dataset.id;
    //获取孩子列表
  },

  /**点击去进行支付**/
  goServer() {
    wx.navigateTo({
      url: `/pages/my-item/myServer/myServer?studentId=${studentId}`,
    })
  },
  /**获得孩子的状态的函数封装**/
  getChild(num) {
    let that = this;
    dataJson.childList(sessionKey).then(res => {
      that.setData({
        wrongSwitch: false,
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
          schoolType: arr[num].payService.school_type
        })
        if (arr[num].endtime) {
          that.setData({
            vipTime: arr[num].enddate
          })
        }
        studentId = arr[num].student_id;
      }
    }).catch(() =>{
      that.setData({
        wrongSwitch: false,
      })
    })
  }
})