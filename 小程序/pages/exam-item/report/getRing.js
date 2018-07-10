//圆环数据的获得以及组装
let getRing = (startArr, y_data, ringSwitch, colorArr) => {
  startArr = [];
  var arr2 = [], arr3 = [];
  for (var i in y_data) {
    startArr.push({ name: y_data[i].name, data: y_data[i].lost_score_prop, stroke: true, color: colorArr[i] })
    arr2.push({ name: y_data[i].name, score: y_data[i].lost_score_prop, num: y_data[i].lost_score, color: colorArr[i] })
  }
  if (ringSwitch) {
    arr3 = { name: "其他失分知识点", data: 0, stroke: true, color: "#AFCDE0" };
  } else {
    arr3 = { name: "其他待提高能力", data: 0, stroke: true, color: "#AFCDE0" };
  }
  if (startArr.length > 5) {
    var arr4 = [];
    for (var i = 5; i < startArr.length; i++) {
      arr3.data = arr3.data + (+startArr[i].data);
      arr4.push(arr2[i])
    }
    arr2 = arr2.slice(0, 5);
    if (ringSwitch) {
      arr2.push({ name: "其他失分知识点", num: "", score: "", color: "#AFCDE0" });
    } else {
      arr2.push({ name: "其他待提高能力", num: "", score: "", color: "#AFCDE0" });
    }
    for (var i in arr4) {
      arr2.push(arr4[i])
    }
    startArr = startArr.slice(0, 5);
    startArr.push(arr3);
  }
  var allArr = { oneArr: startArr, twoArr: arr2 };
  return allArr;
}
module.exports = {
  getRing: getRing
}