var tabBarJson
var bottomGroupArr
var NVTabBar; // 底部导航对象

apiready= function () {
  initFrameGroupData()
  loadIndexBottomMenu()
}
function initFrameGroupData () {
  tabBarJson = [
    {
      name: 'home',
      title: '首页',
      normal: 'widget://image/NVTabBar/banner1.png',
      highlight: 'widget://image/NVTabBar/banner1.png',
      selected: 'widget://image/NVTabBar/red1.png',
      headerHeight: 0
    },
    {
      name: 'classify',
      title: '分类',
      normal: 'widget://image/NVTabBar/banner2.png',
      highlight: 'widget://image/NVTabBar/banner2.png',
      selected: 'widget://image/NVTabBar/red2.png',
      headerHeight: 0
    },
    {
      name: 'customer',
      title: '购物车',
      normal: 'widget://image/NVTabBar/banner3.png',
      highlight: 'widget://image/NVTabBar/banner3.png',
      selected: 'widget://image/NVTabBar/red3.png',
      headerHeight: 0
    },
    {
      name: 'user',
      title: '我的',
      normal: 'widget://image/NVTabBar/banner4.png',
      highlight: 'widget://image/NVTabBar/banner4.png',
      selected: 'widget://image/NVTabBar/red4.png',
      headerHeight: 5
    }
  ];
  bottomGroupArr = [
    {
      name: '/demo/index_frm.html',
      url: api.wgtRootDir + '/demo/index_frm.html',
      pageParam: {
        showMode: 1
      },
      bounces: false
    },
    {
      name: '/demo/classify/index.html',
      url: api.wgtRootDir + '/demo/classify/index.html',
      pageParam: {
        showMode: 1
      },
      bounces: false
    },
    {
      name: '/demo/shopping/index.html',
      url: api.wgtRootDir + '/demo/shopping/index.html',
      pageParam: {
        showMode: 1
      },
      bounces: false
    },
    {
      name: '/demo/user/index.html',
      url: api.wgtRootDir + '/demo/user/index.html',
      bounces: true
    }
  ];
}

function loadIndexBottomMenu() {
  var NVTabBarConfig = getNVTabBarConfig(tabBarJson)
  NVTabBar = api.require('NVTabBar');
  NVTabBar.open(NVTabBarConfig, function (ret, err) {
    if (ret && ret.eventType === 'click') {
      changeFrameGroupByIndex(ret.index);
    }
  });
  // 首页底部菜单Frame
  api.openFrameGroup({
    name: 'indexFrameGroup',
    scrollEnabled: false,
    rect: {
      x: 0,
      y: 'auto',
      w: 'auto',
      h: 'auto'
    },
    index: 0,
    preload: 4, // 预加载Frame个数
    frames: bottomGroupArr
  }, function (ret, err) {});
  NVTabBar.bringToFront();
}
function getNVTabBarConfig (tabBarJson) {
  var NVTabBarItems = [];
  $.each(tabBarJson, function (index, val) {
    NVTabBarItems[index] = {
      w: api.winWidth / tabBarJson.length,
      bg: {
        marginB: -4.0,
        img: 'rgba(0,0,0,0)'
      },
      iconRect: {
        w: 22.0,
        h: 22.0
      },
      icon: {
        normal: val.normal,
        highlight: val.highlight,
        selected: val.selected
      },
      title: {
        text: val.title,
        size: 11.0,
        normal: '#7b7b7b',
        selected: '#fea8c5',
        marginB: 3.0
      }
    };
  });
  return {
    styles: {
      bg: '#fff',
      h: 49.1,
      dividingLine: {
        width: 0.1,
        color: '#d8d8d8'
      },
      badge: {
        bgColor: '#fea8c5',
        numColor: '#fea8c5',
        size: 3.0
      }
    },
    items: NVTabBarItems,
    selectedIndex: 0
  }
}
function changeFrameGroupByIndex(index) {
  NVTabBar.setSelect({
    index: index
  });
  // Header的高度不同，控制FrameGroup的Y轴及高度
  api.setFrameGroupAttr({
    name: 'indexFrameGroup',
    rect: {
      x: 0,
      y: 0,
      w: 'auto',
      h: api.winHeight - tabBarJson[index].headerHeight - 50
    }
  });
  // 底部菜单栏点击切换主屏幕Frame
  api.setFrameGroupIndex({
    name: 'indexFrameGroup',
    index: index,
    scroll: false
  });
  // 切换顶部Header
  $('*[data-menu-index]').hide();
  $('*[data-menu-index="' + index + '"]').show();
}
