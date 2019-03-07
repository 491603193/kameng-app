apiready = function(){
  api.parseTapmode();
  var header = $api.byId('aui-header');
  $api.fixStatusBar(header);
};
/* ios 锚链接 单机无反应解决方法 */
$(document).ready(function() {
   $('a').on('click touchend', function(e) {
      var el = $(this);
      var link = el.attr('href');
      window.location = link;
   });
});

var slide3 = new auiSlide({
    container:document.getElementById("aui-slide3"),
    // "width":300,
    "height": 311,
    "speed":500,
    "autoPlay": 3000, //自动播放
    "loop":true,
    "pageShow":true,
    "pageStyle":'dot',
    'dotPosition':'center'
})
