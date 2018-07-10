
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reportArr: ["语文", "数学", "英语", "物理", "化学", "思想品德", "历史", "地理", "生物"],//报告数目的列表
    reportIndex: 0,//报告科目的初始index
    reportLeftIcon: "./../../../icon/angle-left.svg",//头部左边的图标
    reportRightIcon: "./../../../icon/angle-right.svg", //头部右边的图标
    leftSwitch: false,//头部左侧小图标出现的开关
    rightSwitch: true,//头部右边小图标出现的开关
    scrollLeft: 0,//头部科目移动的距离
    dataSwitch:false,//是否上传原题
    fullMarksImg:"./../../../imgs/full-marks.svg",//满分的图片
    respondenceArr: [{
      "info": "<div><img src='http://47.97.186.156:9099/ParseWord/Files/34a5c39d-e8bf-4b64-b30c-a921e920fc18/题目_1_1_0.png'/></div>", "my": "C", "fit": "B", "myNum": 0, "allNum": 8, "allPerson": 6 
    }, { "info": "1+1=?", "my": "<div><img src='http://47.97.186.156:9099/ParseWord/Files/34a5c39d-e8bf-4b64-b30c-a921e920fc18/题目_1_1_0.png'/></div>", "super":"<div><img src='http://47.97.186.156:9099/ParseWord/Files/34a5c39d-e8bf-4b64-b30c-a921e920fc18/题目_8_8_0.png'/></div>", "myNum": 0, "allNum": 8, "average": 6, "infoIndex": "info1" }, { "info": "1+1=?", "my": "C", "fit": "B", "myNum": 0, "allNum": 8, "allPerson": 6, "infoIndex": "info2" }, {
      "info": "<div><img src='http://47.97.186.156:9099/ParseWord/Files/34a5c39d-e8bf-4b64-b30c-a921e920fc18/题目_1_1_0.png'/></div>", "my": "C", "fit": "B", "myNum": 0, "allNum": 8, "allPerson": 6
    }, { "info": "1+1=?", "my": "C", "fit": "B", "myNum": 0, "allNum": 8, "average": 6, "infoIndex": "info1" }, { "info": "1+1=?", "my": "C", "fit": "B", "myNum": 0, "allNum": 8, "allPerson": 6, "infoIndex": "info2" }]//错题的数组
    // respondenceArr: []//错题的数组
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**WxParse富文本插件的使用**/
    var replyArr = [];
    this.data.respondenceArr.map(item => {
      replyArr.push(item.info)
    });
    for (let i = 0; i < replyArr.length; i++) {
      WxParse.wxParse('reply' + i, 'html', replyArr[i], this);
      if (i === replyArr.length - 1) {
        WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, this)
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**头部科目的改变以及移动**/
  changeReport(e) {
    let scrollLeftS = this.data.scrollLeft;
    if (e.currentTarget.dataset.index >= 4) {
      scrollLeftS = scrollLeftS + e.currentTarget.dataset.index * 30
    } else {
      scrollLeftS = 0
    }
    this.setData({
      reportIndex: e.currentTarget.dataset.index,
      scrollLeft: scrollLeftS
    });
  },
  /*头部科目移动时候左右图标的开关设置*/
  centerScroll(e) {

    if (e.detail.scrollLeft <= 20) {
      this.setData({
        leftSwitch: false,
        rightSwitch: true
      })
    } else if (e.detail.scrollLeft >= e.detail.scrollWidth / ((this.data.reportArr.length) / 3)) {
      this.setData({
        leftSwitch: true,
        rightSwitch: false
      })
    } else {
      this.setData({
        leftSwitch: true,
        rightSwitch: true
      })
    }
  }


})