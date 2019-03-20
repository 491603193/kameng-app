apiready = function() {
  vm.isCore = $apiLocal.getUser().isCore
  vm.getData();
  vm.loading(true);
  $apiLoading.loadModel(function () {
    vm.loading(false);
  });
}

var vm = new Vue({
  el: '#app',
  data: {
    entity: {},
    isCore: true,
    showLower: true,
    entitiesA: [],
    entitiesB: [],
    noData: true,
    noMoreData: false,
    imgs: ['../../../image/index/zhanwei.png', '../../../image/index/zhanwei.png'],
    juJue: false,
    tongYi: false,
    diaoRu: false
  },
  methods: {
    openBuyCloud () {
      $api.openWin('/html/user/cloud/apple_cloud_win')
    },
    getData () {
      var self = this;
      $apiAjax.postBody("/user/stock/get", {},function (ret) {
        if (ret) {
          self.isCore = ret.isCore
          self.entity = ret
        }
      }, true);
    },
    loading: function(isFlush){
      if (this.showLower) {
        this.loadLower(isFlush)
      } else {
        this.loadMy(isFlush)
      }
    },
    loadLower: function(isFlush) {
      var self = this;
      $apiAjax.postBody("/stock/apply/pageLowerLevel", {
        param: {},
        page: $apiLoading.page
      },function (data, page) {
        $apiLoading.setPage(page);
        self.noData = false;
        if (page.pageNo === 1) {
          if(data.length === 0) self.noData = true;
          else self.entitiesA = data
        } else {
          self.entitiesA = self.entitiesA.concat(data);
        }
        self.noMoreData = page.pageNo > 1 && !page.hasNext && !self.noData;
      }, isFlush);
    },
    loadMy: function(isFlush) {
      var self = this;
      $apiAjax.postBody("/stock/apply/page", {
        param: {},
        page: $apiLoading.page
      },function (data, page) {
        $apiLoading.setPage(page);
        self.noData = false;
        if (page.pageNo === 1) {
          if(data.length === 0) self.noData = true;
          else self.entitiesB = data
        } else {
          self.entitiesB = self.entitiesB.concat(data);
        }
        self.noMoreData = page.pageNo > 1 && !page.hasNext && !self.noData;
      }, isFlush);
    },

    zheZhao () {
      this.juJue = false
      this.tongYi = false
      this.diaoRu = false
    }
  }
})
var auiTab = new auiTab({
  element:document.getElementById("tab"),
},function(ret){



});
