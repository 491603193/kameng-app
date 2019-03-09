apiready = function () {
  api.parseTapmode();
  var header = $api.byId('aui-header');
  $api.fixStatusBar(header);
}
function openWddd () {
  // $api.openWin('/html/my/my_order_win')
  api.openWin({
            name: '/html/my/my_order_win',
            url: api.wgtRootDir + '/html/my/my_order_win.html',
            bounces: false,
            slidBackEnabled: true,
            vScrollBarEnabled: false
        });
}