
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleNum: 0,//本题目的序号
    allNum: 0,//总共的题目,
    wrongObj: {},//当前的json
    rubricSwitch: false,//打开全部题目的开关
    rubricIcon: "./../../../imgs/Arrow.svg",//关闭全部题目的图标
    mySubSwitch: true,//我的作答和学霸答案的切换开关
    dataSwitch: false,//是否上传原题
    respondenceArr: [{
      info: "<div><img src='http://47.97.186.156:9099/ParseWord/Files/34a5c39d-e8bf-4b64-b30c-a921e920fc18/题目_1_1_0.png'/></div>", "my": "C", "fit": "B", "myNum": 0, "allNum": 8, "allPerson": 6
    },
    { "info": "1+1=?", "my": "<div><img src='http://47.97.186.156:9099/ParseWord/Files/34a5c39d-e8bf-4b64-b30c-a921e920fc18/题目_1_1_0.png'/></div>", "super": [{ "mark": 8, "content": "<div><img src='http://47.97.186.156:9099/ParseWord/Files/34a5c39d-e8bf-4b64-b30c-a921e920fc18/题目_8_8_0.png'/></div>" }, { "mark": 7, "content": "<div><img src='http://47.97.186.156:9099/ParseWord/Files/34a5c39d-e8bf-4b64-b30c-a921e920fc18/题目_8_8_0.png'/></div>" }], "myNum": 0, "allNum": 8, "average": 6 },
    { "info": "1+1=?", "my": "C", "fit": "B", "myNum": 0, "allNum": 8, "allPerson": 6 },
    {
      "info": "<div><img src='http://47.97.186.156:9099/ParseWord/Files/34a5c39d-e8bf-4b64-b30c-a921e920fc18/题目_1_1_0.png'/></div>", "my": "C", "fit": "B", "myNum": 0, "allNum": 8, "allPerson": 6
    },
    { "info": "1+1=?", "my": "C", "fit": "B", "myNum": 0, "allNum": 8, "average": 6, },
    { "info": "1+1=?", "my": "C", "fit": "B", "myNum": 0, "allNum": 8, "allPerson": 6 }]//错题的数组

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wrongObj: this.data.respondenceArr[options.index],
      titleNum: +options.index + 1,
      allNum: this.data.respondenceArr.length
    });
    //题干的富文本
    console.log(this.data.wrongObj.info)
    WxParse.wxParse('reply', 'html', this.data.wrongObj.info, this);
    //当为主观题的时候
    if (!this.data.wrongObj.fit) {
      //我的作答的富文本
      WxParse.wxParse('myAnswer', 'html', this.data.wrongObj.my, this);

      //学霸答案的富文本
      var replyArr = [];
      this.data.wrongObj.super.map(item => {
        replyArr.push(item.content)
      });
      for (let i = 0; i < replyArr.length; i++) {
        WxParse.wxParse('reply' + i, 'html', replyArr[i], this);
        if (i === replyArr.length - 1) {
          WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, this)
        }
      }
    }

  },

  // 上一题的点击事件
  navPro() {
    if (this.data.titleNum <= 1 || this.data.rubricSwitch) {
      return;
    }
    this.setData({
      wrongObj: this.data.respondenceArr[this.data.titleNum - 2],
      titleNum: this.data.titleNum - 1
    });
    WxParse.wxParse('reply', 'html', this.data.wrongObj.info, this);
    //当为主观题的时候
    if (!this.data.wrongObj.fit) {
      //我的作答的富文本
      WxParse.wxParse('myAnswer', 'html', this.data.wrongObj.my, this);

      //学霸答案的富文本
      var replyArr = [];
      this.data.wrongObj.super.map(item => {
        replyArr.push(item.content)
      });
      for (let i = 0; i < replyArr.length; i++) {
        WxParse.wxParse('reply' + i, 'html', replyArr[i], this);
        if (i === replyArr.length - 1) {
          WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, this)
        }
      }
    }
  },
  // 下一题的点击事件
  navNext() {
    if (this.data.titleNum >= this.data.allNum || this.data.rubricSwitch) {
      return;
    }
    this.setData({
      wrongObj: this.data.respondenceArr[this.data.titleNum],
      titleNum: +this.data.titleNum + 1
    })
    WxParse.wxParse('reply', 'html', this.data.wrongObj.info, this);
    //当为主观题的时候
    if (!this.data.wrongObj.fit) {
      //我的作答的富文本
      WxParse.wxParse('myAnswer', 'html', this.data.wrongObj.my, this);

      //学霸答案的富文本
      var replyArr = [];
      this.data.wrongObj.super.map(item => {
        replyArr.push(item.content)
      });
      for (let i = 0; i < replyArr.length; i++) {
        WxParse.wxParse('reply' + i, 'html', replyArr[i], this);
        if (i === replyArr.length - 1) {
          WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, this)
        }
      }
    }
  },


  //展开或者关闭全部的题目
  openRubric() {
    this.setData({
      rubricSwitch: !this.data.rubricSwitch
    })
  },

 
 


  //点击小题蹦到相应的地方
  toNav(e) {
    this.setData({
      wrongObj: this.data.respondenceArr[+e.currentTarget.dataset.index],
      titleNum: +e.currentTarget.dataset.index + 1,
      rubricSwitch: false
    });
    WxParse.wxParse('reply', 'html', this.data.wrongObj.info, this);
    //当为主观题的时候
    if (!this.data.wrongObj.fit) {
      //我的作答的富文本
      WxParse.wxParse('myAnswer', 'html', this.data.wrongObj.my, this);

      //学霸答案的富文本
      var replyArr = [];
      this.data.wrongObj.super.map(item => {
        replyArr.push(item.content)
      });
      for (let i = 0; i < replyArr.length; i++) {
        WxParse.wxParse('reply' + i, 'html', replyArr[i], this);
        if (i === replyArr.length - 1) {
          WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, this)
        }
      }
    }
  },

  //我的作答和学霸答案的切换
  openMySub() {
    this.setData({
      mySubSwitch: true
    })
  },
  openSuperSub() {
    this.setData({
      mySubSwitch: false
    });
  }
})