//图表函数的封装
import * as echarts from './../../../ec-canvas/echarts.js';//引进echarts的图表插件
let init = (nameData, numData, operateDemo, chartFun) => {
  operateDemo.init((canvas, width, height) => {
    // 获取组件的 canvas、width、height 后的回调函数
    // 在这里初始化图表
    var chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    chartFun(chart, nameData, numData);
    // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
    // this.chart = chart;
    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return chart;
  });
};
let getChartsData = (scorePortNameArr, scorePortNumArr, rateLineNumArr, rateLineDateArr, rateMin, courseStatusNameArr, courseStatusNumArr, questionDixData, questionDimyRates, questionDischoolRates, questionDiMin, knowledge, skill, winningRate, permissionParentScore, radarLength, pointsArr, improvedArr, rankHistogram, rateLine, disSubjectRadar, difficultTopicLine, pointsAgainstrING, improvedAgainstrING) => {
  var that = this;
  //层次排名柱状图
  if (winningRate && permissionParentScore) {
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
    init(scorePortNameArr, scorePortNumArr, rankHistogram, setRank);
  }

  //学校战胜率折线图
  if (winningRate && rateLineNumArr && rateLineNumArr.length > 1) {
    function setRateLine(chart, nameData, numData) {
      var option = {
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
        grid: {
          left: "11%"
        },
        series: [{
          type: 'line',
          data: numData,
          center: [50, 10],
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
  init(rateLineDateArr, rateLineNumArr, rateLine, setRateLine);
  }

  //优劣学科雷达图
  if (courseStatusNameArr.length && radarLength >= 3) {
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
    init(courseStatusNameArr, courseStatusNumArr, disSubjectRadar, setDis);

  }

  //题目的双折线图
  if (questionDixData.length) {
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
    init(questionDixData, questionDimyRates, difficultTopicLine, setRateLine);
  }

  //失分较多知识点环形图
  if (knowledge.length) {
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
    init(pointsArr, knowledge, pointsAgainstrING, setDisSubjectRadar);
  }
  //待提高能力环形图
  if (skill.length) {
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
    init(improvedArr, skill, improvedAgainstrING, setDisSubjectRadar);
  }
  console.log("end");

}

module.exports = {
  getChartsData: getChartsData
}