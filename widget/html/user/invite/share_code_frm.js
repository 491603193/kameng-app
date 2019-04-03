var entity = {}

apiready = function () {
  getPicCode()
}

function getPicCode () {
  $apiAjax.postBody("/user/invite/createQrCode", {
    userLevel: api.pageParam.selLevel
  }, function (data) {
    if (data) {
      $api.html($api.byId("url"), data.inviteUrl)
      document.getElementById("codeUrl").src = $apiAjax.kameng_image + data.inviteQrCodeUrl
      entity = data
    }
  }, true)
}

//复制连接地址
function saveUrl () {
  var clipBoard = api.require('clipBoard')
  clipBoard.set({
    value: entity.inviteUrl
  }, function (ret, err) {
    if (ret) {
      alert("复制成功！")
    }
  })
}

//保存图片
function savePhoto () {
  var imgUrl = $apiAjax.kameng_image + entity.inviteQrCodeUrl
  var r = /http:\/\/.*?\/(.*?\.(?:png|jpg|gif|jpeg))([?!]?.*)/i
  if (!r.exec(imgUrl)) return
  var stringDate = new Date().getTime()
  var houzhui = imgUrl.replace(/.+\./, "").toLowerCase()
  var imgloc = 'fs://邀请二维码/' + stringDate + "." + houzhui
  api.download({
    url: imgUrl,
    savePath: imgloc,
    report: true,
    cache: true,
    allowResume: true
  }, function (ret, err) {
    if (ret.state === 1) {
      api.saveMediaToAlbum({
        path: imgloc
      }, function (ret, err) {
        if (ret.status) {
          var msg = '保存成功! 文件目录：kameng/二维码/' + stringDate + "." + houzhui
          if (api.systemType === 'ios')
            msg = '保存成功! '
          api.toast({
            msg: msg,
            duration: 3000,
            location: 'bottom'
          })
        }
      })

    }
  })
}
