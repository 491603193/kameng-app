(function () {
  var m = {}

  /**
   * 自动添加图片域名
   * @param images
   * @param index
   */
  m.openWidthUrl = function (images, index) {
    if(images) {
      var imgs = images.split(',')
      var showPics = []
      for (var i = 0; i<imgs.length; i++) {
        showPics.push($apiAjax.kameng_image + imgs[i])
      }
      m.open(showPics, index)
    }
  }

  /**
   * 图片真实路径
   * @param images
   * @param index
   */
  m.openWidthArray = function (images, index) {
    if(images){
      var showPics = []
      for (var i = 0; i < images.length; i++) {
        showPics.push($apiAjax.kameng_image + images[i])
      }
      m.open(showPics, index)
    }
  }


  m.open = function (images, index) {
    var photoBrowser = api.require('photoBrowser');
    photoBrowser.open({
      images: images,
      activeIndex: index,
      placeholderImg: 'widget://res/image/browserLoading.png',
      zoomEnabled: true,
      bgColor: '#000'
    }, function(ret, err) {
      if (ret.eventType === 'click') {
        photoBrowser.close()
      }
    });
  }
  window.photo = m
})()

