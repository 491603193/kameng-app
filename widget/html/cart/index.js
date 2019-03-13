apiready = function(){
  api.parseTapmode();
  var header = $api.byId('aui-header')
  $api.fixStatusBar(header)
  $api.fixStatusBar($api.byId('shop-zhanwei'))
  vm.initCart()
}
var dialog = new auiDialog({})
var vm = new Vue({
  el: '#app',
  data: {
    isYun: true,
    isEdit: false,
    imgPath: $apiAjax.kameng_image,
    entityA: [],
    entityB: [],
    isCheckedAll: false
  },
  created (){
  },
  watch: {
  },
  computed: {
    noData: function () {
      if (this.isYun) {
        return this.entityA.length === 0;
      } else {
        return this.entityB.length === 0;
      }
    },
    totalMoney: function (){
      var money = 0;
      var checkNum = 0;
      if (this.isYun) {
        for (var i = 0; i < this.entityA.length; i++) {
          if (this.entityA[i].checked) {
            money += this.entityA[i].stockPrice * this.entityA[i].productNum
            ++checkNum
          }
        }
        money = money + '云仓'
        if (checkNum === this.entityA.length) this.isCheckedAll = true
        else this.isCheckedAll = false
      } else {
        for (var i = 0; i< this.entityB.length; i++) {
          if (this.entityB[i].checked) {
            money += this.entityB[i].productPrice * this.entityB[i].productNum
            ++checkNum
          }
        }
        money = money.toFixed(2) + '元'
        if (checkNum === this.entityB.length) this.isCheckedAll = true
        else this.isCheckedAll = false
      }
      return money
    },
    selectNum: function () {
      var num = 0;
      if (this.isYun){
        for (var i = 0; i< this.entityA.length; i++) {
          if (this.entityA[i].checked) {
            ++num
          }
        }
      } else {
        for (var i = 0; i< this.entityB.length; i++) {
          if (this.entityB[i].checked) {
            ++num
          }
        }
      }
      return num
    }
  },
  methods: {
    submitCart: function () { // 结算
      if(this.selectNum > 0){
        $api.openWin('/html/cart/confirm/confirm_win')
      } else {
        $api.toast("请先选择要购买的商品呦~")
      }
    },
    selDeleteCheck () {
      this.isCheckedAll = !this.isCheckedAll
      if (this.isCheckedAll) {
        if (this.isYun) {
          for (var i = 0; i< this.entityA.length; i++) {
            this.entityA[i].checked = true
          }
        } else {
          for (var i = 0; i< this.entityB.length; i++) {
            this.entityB[i].checked = true
          }
        }
      } else {
        if (this.isYun) {
          for (var i = 0; i< this.entityA.length; i++) {
            this.entityA[i].checked = false
          }
        } else {
          for (var i = 0; i< this.entityB.length; i++) {
            this.entityB[i].checked = false
          }
        }
      }
    },
    deleteSorts (index) {
      var cartName = 'cart1'
      if (!this.isYun) {
        cartName = 'cart2'
      }
      this.deleteInCart(index, cartName)
    },
    deleteInCart (index, cartName) {
      var self = this;
      dialog.alert({
        title:"温馨提示",
        msg:'是否当前商品？',
        buttons:['取消','确定']
      },function(ret){
        if(ret){
          if (ret.buttonIndex === 2) {
            var cart = $api.getPrefs(cartName)
            cart.splice(index,1)
            $api.setPrefs(cartName, cart)
            if (this.isYun) {
              self.entityA.splice(index, 1)
            } else {
              self.entityA.splice(index, 1)
            }
            $api.toast('删除成功！')
            api.execScript({
              name: '/html/index.html',
              script: 'initBadgeNum()'
            })
          }
        }
      })
    },
    edit () {
      if (this.isEdit) this.isEdit = false
      else this.isEdit = true
    },
    deleteSel () {
      var self = this;
      dialog.alert({
        title:"温馨提示",
        msg:'是否删除所选的商品？',
        buttons:['取消','确定']
      },function(ret) {
        if(ret){
          if (ret.buttonIndex === 2) {
            var selnum = self.selectNum;
            for (var i = 0; i < selnum; i++) {
              if (self.isYun) {
                for (var j = 0; j < self.entityA.length; j++) {
                  if (self.entityA[j].checked) {
                    self.deleteIndex(j)
                    break
                  }
                }
              } else {
                for (var j = 0; j < self.entityB.length; j++) {
                  if (self.entityB[j].checked) {
                    self.deleteIndex(j)
                    break
                  }
                }
              }
            }
            $api.toast('删除成功！')
            api.execScript({
              name: '/html/index.html',
              script: 'initBadgeNum()'
            })
          }
        }
      })
    },
    deleteIndex (index) {
      var cart = $api.getPrefs('cart1')
      if (this.isYun) {
        cart.splice(index,1)
        $api.setPrefs('cart1', cart)
        this.entityA.splice(index, 1)
      } else {
        cart = $api.getPrefs('cart2')
        cart.splice(index,1)
        $api.setPrefs('cart2', cart)
        this.entityB.splice(index, 1)
      }
    },
    subNum (index) {
      var entity = this.entityA[index]
      var cart = $api.getPrefs('cart1')
      if (this.isYun) {
        if (entity.productNum > 1){
          --entity.productNum
          // 本地操作
          --cart[index].productNum
          $api.setPrefs('cart1', cart)
        } else {
          $api.toast('啧啧，该宝贝不能再减少了~')
        }
      } else {
        entity = this.entityB[index]
        if (entity.productNum > 1){
          --entity.productNum
          // 本地操作
          cart = $api.getPrefs('cart2')
          --cart[index].productNum
          $api.setPrefs('cart1', cart)
        } else {
          $api.toast('啧啧，该宝贝不能再减少了~')
        }
      }
    },
    addNum (index) {
      var entity = this.entityA[index]
      var cart = $api.getPrefs('cart1')
      if (this.isYun) {
        if(entity.productNum < entity.stockNum){
          ++entity.productNum
          // 本地操作
          ++cart[index].productNum
          $api.setPrefs('cart1', cart)
        } else {
          $api.toast('库存不足')
        }
      } else {
        entity = this.entityB[index]
        if(entity.productNum < entity.stockNum){
          ++entity.productNum
          // 本地操作
          cart = $api.getPrefs('cart2')
          ++cart[index].productNum
          $api.setPrefs('cart2', cart)
        } else {
          $api.toast('库存不足')
        }
      }
    },

    initCart () {
      var cart1 = $api.getPrefs('cart1')
      var cart2 = $api.getPrefs('cart2')
      this.getCartData(cart1,cart2);
    },
    getCartData (data1, data2) {
      var self = this;
      if (data1.length > 0) {
        $apiAjax.postBody("/product/stock/listCart",{
          list: data1
        },function (ret) {
          if(ret){
            self.entityA = ret;
          }
        }, true);
      }
      if (data2.length > 0) {
        $apiAjax.postBody("/product/stock/listCart",{
          list: data2
        },function (ret) {
          if(ret){
            self.entityB = ret;
          }
        }, false);
      }
    },
    goConfirm () {
      $api.openWin('/html/shopping/confirm_order_win')
    }
  }
})
var tab = new auiTab({
  element: document.getElementById("tab")
},function(ret){
  if (ret.index === 1) {
    vm.isYun = true
  } else {
    vm.isYun = false
  }
});

