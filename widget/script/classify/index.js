apiready = function(){
  api.parseTapmode();
  var header = $api.byId('header')
  $api.fixStatusBar(header)
}
var tab = new auiTab({
  element:document.getElementById("tab"),
},function(ret){
  var fyc = $api.byId('fyc')
  var yc = $api.byId('yc')
  var yxx = $api.byId('yxx')
  if (ret.index === 1) {
    fyc.style.display = 'block';
    yc.style.display = 'none';
    yxx.style.display = 'none';
  } else if (ret.index === 2) {
    fyc.style.display = 'none';
    yc.style.display = 'block';
    yxx.style.display = 'none';
  } else {
    fyc.style.display = 'none';
    yc.style.display = 'none';
    yxx.style.display = 'block';
  }
});
function openProductList () {
  $api.openWin('/html/classify/product_win')
}