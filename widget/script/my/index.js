apiready = function () {
  api.parseTapmode();
  var header = $api.byId('aui-header');
  $api.fixStatusBar(header);
}
function openDetail (win) {
  $api.openWin(win)
}
function openWddd () {
  // $api.openWin('/html/user/my_order_win')
  api.openWin({
    name: '/demo/user/my_order_win',
    url: api.wgtRootDir + '/demo/user/my_order_win.html',
    bounces: false,
    slidBackEnabled: true,
    vScrollBarEnabled: false
  });
}
