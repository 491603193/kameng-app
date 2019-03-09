apiready = function () {
  api.parseTapmode();
  var header = $api.byId('aui-header');
  $api.fixStatusBar(header);
}