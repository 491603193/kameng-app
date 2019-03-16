var panding = false
var pendingText
var code
function login () {
  $api.toast('登录成功')
  $api.openWin('/demo/index_win')
}
function getCode () {
  if (panding) return
  $api.toast('验证码发送成功，请查收短信')
  panding = true
  pendingText = '59秒后重试'
   code = $api.byId("code")
  $api.html(code, pendingText)
  countSecond ()
}
function countSecond () {
  var count = 59
  var timer = setInterval(function () {
    count--
    pendingText = count + `秒后重试`
    $api.html(code, pendingText)
    if (count === 0) {
      clearInterval(timer)
      pending = false
      pendingText = '获取验证码'
      $api.html(code, pendingText)
    }
  }, 1000)
}