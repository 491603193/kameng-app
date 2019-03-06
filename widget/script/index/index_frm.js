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