apiready = function(){
  api.parseTapmode();
  vm.selProductStock = api.pageParam.list
  vm.isCloud = api.pageParam.isCloud
  vm.getData()
}
var dialog = new auiDialog({})
var vm = new Vue({
  el: '#app',
  data: {
    remindMsg: '',
    payType: '1',
    isCloud: true,
    selProductStock: [],
    userAccount: {
      advancePayment: 0,
      personalWarehouse: 0
    },
    hasAddress: false,
    userAddrId: '',
    userAddress: {},
    entity: [],
    remark: '',
    showRemind: false,
    imgPath: $apiAjax.kameng_image,
  },
  computed: {
    mailMoney: function () {
      var money = 0;
      for (var i = 0; i < this.entity.length; i++) {
        money += this.entity[i].productLogisticsPrice
      }
      return money
    },
    showTotalMoney: function () {
      var unit = this.isCloud? '云仓' : '元'
      return this.mailMoney > 0? '￥' + this.mailMoney + '+' + this.totalMoney + unit :  this.totalMoney + unit
    },
    showMoney: function () {
      return this.isCloud? this.totalMoney + '个云仓': this.totalMoney + '元'
    },
    totalMoney: function () {
      var totalMoney = 0;
      for (var i = 0; i < this.entity.length; i++) {
        if (this.isCloud) {
          totalMoney += this.entity[i].stockPrice
        } else {
          totalMoney += this.entity[i].productPrice
        }
      }
      return totalMoney
    }
  },
  methods: {
    getData () {
      var self = this;
      $apiAjax.postBody("/product/stock/listPlaceOrder",{
        userAddrId: self.userAddrId,
        list: self.selProductStock
      },function (ret) {
        if(ret){
          if (ret.userAddress) {
            self.hasAddress = true
            self.userAddress = ret.userAddress
            self.userAddrId = ret.userAddress.userAddrId
          }
          self.entity = ret.list
          self.userAccount = ret.userAccount
        }
      }, true);
    },
    goConfirm () {
      if(!this.userAddrId) {
        this.remindMsg = '您还没有添加收货地址，请先添加您的收货地址才可以下单哦~'
        this.showRemind = true
        return
      }
      if(this.isCloud) {
        if(this.totalMoney > this.userAccount.personalWarehouse){
          this.remindMsg = '您的个人云仓已不足，请先购入云仓后才可以继续购买哦~'
          this.showRemind = true
          return
        }
        if(this.payType === '4'){
          if(this.mailMoney > this.userAccount.advancePayment){
            this.remindMsg = '你的余额暂不足以支付运费~'
            this.showRemind = true
            return
          }
        }
      } else {
        if(this.userAccount.personalWarehouse){
          if(this.payType === '4'){
            if(this.totalMoney > this.userAccount.advancePayment){
              this.remindMsg = '亲，你的余额已不足，您可以选择在线支付哦~'
              this.showRemind = true
              return
            }
          }
        }
      }

      $apiAjax.successToast("支付成功")
      return
      $api.openWin('/html/shopping/confirm_order_win')
    }
  }
})
