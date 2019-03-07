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
  if (ret.index === 1) {
    fyc.style.display = 'none';
    yc.style.display = 'block';
  } else {
    fyc.style.display = 'block';
    yc.style.display = 'none';
  }
});
function getState (id) {
  var bj = $api.byId('bj')
  var wc = $api.byId('wc')
  var shopClose = $api.byId('shopClose')
  var shopDelete = $api.byId('shopDelete')
  if (id === 1) {
    bj.style.display = "none"
    wc.style.display = "block"
    shopClose.style.display = "none"
    shopDelete.style.display = "flex"
  } else {
    bj.style.display = "block"
    wc.style.display = "none"
    shopClose.style.display = "flex"
    shopDelete.style.display = "none"
  }
}