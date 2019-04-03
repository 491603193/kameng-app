(function () {
  var m = {}
  m.imgarr = []
  m.tran_img = []
  m.i = 0
  m.returnFun = function () {
  }
  m.open = function (fuc, max) {
    var UIAlbumBrowser = api.require('UIAlbumBrowser')
    UIAlbumBrowser.open({
      max: max,
      type: 'all',
      isOpenPreview: true,
      styles: {
        bg: '#ffffff',
        mark: {
          position: 'top_right',
          size: 30
        },
        nav: {
          bg: '#ffffff',
          titleColor: '#666666',
          titleSize: 18,
          cancelColor: '#E695AF',
          cancelSize: 16,
          finishColor: '#E695AF',
          finishSize: 16
        }
      },
      rotation: false  //无效
    }, function (ret) {
      if (ret.eventType === 'confirm') {
        fuc(ret.list)
      }
      if (ret.eventType === 'cancel') {
        // fuc(ret)
      }
    })
  }
  m.imagePicker = function (fuc, max) {
    m.returnFun = function () {//把上传完毕的回调函数赋值给addHtml变量（实际是一个匿名函数）
      fuc(m.tran_img)
    }
    var UIAlbumBrowser = api.require('UIAlbumBrowser')
    UIAlbumBrowser.imagePicker({
      max: max,
      showCamera: true,
      styles: {
        bg: '#ffffff',
        //cameraImg: 'widget://res/cameraImg.png',
        mark: {
          position: 'top_right',
          size: 30
        },
        nav: {
          bg: '#ffffff',
          cancelColor: '#E695AF',
          cancelSize: 16,
          nextStepColor: '#E695AF',
          nextStepSize: 16,
          finishText: '完成'
        }
      },
      isSystemCamera: true,
      animation: true,
    }, function (ret) {
      UIAlbumBrowser.closePicker()
      m.tran_img = []
      if (ret.eventType === 'nextStep') {
        if (ret.list && ret.list.length > 0) {
          m.imgarr = ret.list
          m.UIAlbumBrowser_transPath()
        }
      }
      if (ret.eventType === '') {
        m.tran_img = [ret.originalPath]
        m.returnFun()
      }
    })
  }

  m.UIAlbumBrowser_transPath = function () {
    var UIAlbumBrowser = api.require('UIAlbumBrowser')
    if (m.i < m.imgarr.length) {
      UIAlbumBrowser.transPath({
        path: m.imgarr[m.i].path
      }, function (ret) {
        if (ret) {
          ++m.i
          m.tran_img.push(ret.path)
          m.UIAlbumBrowser_transPath()
        }
      })
    } else {
      m.i = 0
      m.returnFun()
    }
  }
  window.media = m
})()

