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
    remindMsg: '',
    showPaySuccessRemind: false,
    imgPath: $apiAjax.kameng_image,
  },
  computed: {
    payMoney: function () {
      return this.isCloud? this.mailMoney: this.mailMoney + this.totalMoney
    },
    mailMoney: function () {
      var money = 0;
      for (var i = 0; i < this.entity.length; i++) {
        money += this.entity[i].freightMoney
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
          totalMoney += this.entity[i].stockPrice * this.entity[i].productNum
        } else {
          totalMoney += this.entity[i].productPrice * this.entity[i].productNum
        }
      }
      return totalMoney
    },
    totalProductNum: function () {
      var totalProductNum = 0;
      for (var i = 0; i < this.entity.length; i++) {
        totalProductNum += this.entity[i].productNum
      }
      return totalProductNum
    },
    showFooterTotalMoney: function () {
      return this.isCloud? '支付云仓：' + this.totalMoney + '个' : '总金额：' + (this.totalMoney + this.mailMoney) + '元'
    }
  },
  methods: {
    changeAddress (userAddrId) {
      this.userAddrId = userAddrId
      this.getData()
    },
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
    openAddress () {
      $api.openWin('/html/user/address/address_list_win', {
        canSelect : true
      })
    },
    closeConfirm () {
      this.showPaySuccessRemind = false
      api.execScript({
        name: '/html/index.html',
        frameName: '/html/user/cart/index',
        script: 'vm.deleteSel()'
      })
      setTimeout(function () {
        api.closeWin()
      },300)
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
      this.postOrder()
    },
    postOrder () {
      var self = this;
      $apiAjax.postBody("/user/main/save",{
        userAddrId: self.userAddrId,
        payType: self.payType,
        productType: self.isCloud? '1' : '2',
        payMoney: self.payMoney,
        totalProductNum: self.totalProductNum,
        totalStockNum: self.isCloud? self.totalMoney : 0,
        orderRemark: self.remark,
        list: self.entity
      },function (ret) {
        if(ret){
          self.showPaySuccessRemind = true
        }
      }, true);
    }
  }
})
