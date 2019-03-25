(function () {
  var m = {}
  m.isInstalled  = function () {
    var SPay = api.require('SPay');
    SPay.isInstalled(function(ret, err) {
      if (ret.installed) {
        return true
      } else {
        $api.setErrorMessage("当前设备未安装微信客户端")
        return false
      }
    })
  }

  m.wxPay  = function (config, fun) {
    alert(config.service);
    alert(config.token);
    alert(config.amount);
    var SPay = api.require('SPay');
    SPay.wxPay({
      service: config.service,
      token: config.token,
      amount: config.amount
    }, function(ret) {
      alert(JSON.stringify(ret));
      fun(ret)
    });
  }

  window.spay = m
})()

