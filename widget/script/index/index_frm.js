apiready = function(){
  var header = $api.byId('header');
  $api.fixStatusBar(header);
}
var slide3 = new auiSlide({
    container:document.getElementById("aui-slide3"),
    // "width":300,
    "height":161,
    "speed":500,
    "autoPlay": 3000, //自动播放
    "loop":true,
    "pageShow":true,
    "pageStyle":'dot',
    'dotPosition':'center'
})
var slide4 = new auiSlide({
    container:document.getElementById("aui-slide4"),
    // "width":300,
    "height": 'auto',
    "speed":500,
    "autoPlay": 3000, //自动播放
    "loop":true,
    "pageShow":true,
    "pageStyle":'dot',
    'dotPosition':'center'
})
function openDetail () {
  $api.openWin('/demo/classify/product_detail')
}
function openIncome () {
  $api.openWin('/demo/my/income_statistics_win')
}
function zheZhaoHidden () {
  $api.byId('indexZhe').style.display = "none"
}
function openClass () {
  var NVTabBar = api.require('NVTabBar');
  api.setFrameGroupIndex({
    name: 'indexFrameGroup',
    index: 1
  });
  api.execScript({
      script: 'changeFrameGroupByIndex(1)'
  });
}