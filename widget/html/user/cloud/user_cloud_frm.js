apiready = function() {
  vm.isCore = $apiLocal.getUser().isCore
  vm.getData();
  vm.loading(true);
  $apiLoading.loadModel(function () {
    vm.loading(false);
  });
}
var dialog = new auiDialog({})
var vm = new Vue({
  el: '#app',
  data: {
    imgPath: $apiAjax.kameng_image,
    entity: {},
    isCore: true,
    showLower: true,
    entitiesA: [],
    entitiesB: [],
    noMoreData: false,
    showCommit: false,
    showRemind: false,
    showReturn: false,
    checkStateName: {
      '0': '待审核',
      '1': '已通过',
      '2': '已取消',
    },
    current: {},
    cloudName: '',
    commitNum: null,
  },
  watch: {
    commitNum: function (val) {
      if($val.valMoney(val)){
        this.commitNum = $val.valMoney(val)
      }
    }
  },
  computed: {
    commonMsg: function () {
      return "请填写数量（<= " + this.entity.adminisWarehouse + " ）"
    },
    noData: function () {
      if (this.showLower) {
        return this.entitiesA.length === 0;
      } else {
        return this.entitiesB.length === 0;
      }
    }
  },
  methods: {
    openPic (pics, index) {
      photo.openWidthUrl(pics, index)
    },
    commitCloud () {
      var stockApplyNum = parseInt(this.commitNum)
      if (!stockApplyNum) {
        $apiAjax.setErrorMessage("请输入整数")
      } else if (stockApplyNum <= 0) {
        $apiAjax.setErrorMessage("至少要买一个云币")
      } else if (stockApplyNum > this.entity.adminisWarehouse) {
        $apiAjax.setErrorMessage("管理仓云币数量不够")
      } else {
        var self = this;
        self.showCommit = false
        $apiAjax.postBody("/user/stock/giveSelf", {
          stockApplyNum: stockApplyNum
        },function (ret) {
          if (ret) {
            $api.toast("调拨成功~")
            self.getData()
          }
        }, true);
      }
    },
    openAppleCloud () {
      $api.openWin('/html/user/cloud/apple_core_cloud_win')
    },
    openChangeLog (type){
      $api.openWin('/html/user/cloud/apple_log_win',{
        stockType: type
      })
    },
    agreed (index) {
      var entityA = this.entitiesA[index]
      var title = '个人仓';
      if(this.isCore){
        if (entityA.userLevel === '1'){
          title = '管理仓'
          if (entityA.stockApplyNum > this.entity.adminisWarehouse) {
            this.cloudName = '管理仓'
            this.showRemind = true
            return
          }
        } else {
          if (entityA.stockApplyNum > this.entity.personalWarehouse) {
            this.cloudName = '个人仓'
            this.showRemind = true
            return
          }
        }
      } else {
        if (entityA.personalWarehouse > this.entity.adminisWarehouse) {
          this.cloudName = '个人仓'
          this.showRemind = true
          return
        }
      }
      var self = this;
      dialog.alert({
        title:"温馨提示",
        msg:'将从您的' + title + '调拨'+ entityA.stockApplyNum + '云币给' + entityA.userName + '。',
        buttons:['取消','确定']
      },function(ret){
        if(ret){
          if (ret.buttonIndex === 2) {
            $apiAjax.postBody("/stock/apply/checkPass", {
              stockApplyId: entityA.stockApplyId
            },function (ret) {
              if (ret) {
                $api.toast(entityA.userName+"的申请已完成~")
                self.getData()
                $apiLoading.page.pageNo = 1
                self.loadLower(false)
              }
            }, true);
          }
        }
      })
    },
    refused (index) {
      var entity = this.entitiesA[index]
      var self = this
      dialog.prompt({
        title:"取消原因",
        text:'请输入您的取消原因',
        type:'text',
        buttons:['取消','确定']
      },function(ret){
        if(ret.buttonIndex === 2){
          $apiAjax.postBody("/stock/apply/checkRefuse", {
            stockApplyId: entity.stockApplyId,
            checkReason: ret.text
          },function (ret) {
            if (ret) {
              $api.toast(entity.userName + "的申请已取消~")
              $apiLoading.page.pageNo = 1
              self.loadLower(false)
            }
          }, true);
        }
      })
    },
    getCheckStateName (state) {
      return this.checkStateName[state]
    },
    getHigherLevelName (higherLevel) {
      return $apiLocal.getUserLevelName(higherLevel)
    },
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
  }
})

new auiTab({
  element:document.getElementById("tab"),
},function(ret){
  vm.showLower = (ret.index === 1)
  $apiLoading.page.pageNo = 1
  if (vm.showLower) {
    vm.loadLower(true)
  } else {
    vm.loadMy(true)
  }
});
