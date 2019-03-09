/*
 * 衣永康
 * 异步请求
 */
(function(window){

  var u = {};

  u.hbcs_api = 'http://192.168.0.199:8031';
  u.hbcs_image = 'http://res.qiangdaoapp.com/kameng';

  "use strict";
  var auiToast = function() {
    // this.create();
  };
  auiToast.prototype = {
    create: function(params,callback) {
      var self = this;
      var toastHtml = '';
      switch (params.type) {
        case "success":
          var iconHtml = '<i class="aui-iconfont aui-icon-correct"></i>';
          break;
        case "fail":
          var iconHtml = '<i class="aui-iconfont aui-icon-close"></i>';
          break;
        case "custom":
          var iconHtml = params.html;
          break;
        case "loading":
          var iconHtml = '<div class="aui-toast-loading"></div>';
          break;
      }
      var titleHtml = params.title ? '<div class="aui-toast-content">'+params.title+'</div>' : '';
      toastHtml = '<div class="aui-toast">'+iconHtml+titleHtml+'</div>';
      if(document.querySelector(".aui-toast"))return;
      document.body.insertAdjacentHTML('beforeend', toastHtml);
      var duration = params.duration ? params.duration : "2000";
      self.show();
      if(params.type == 'loading'){
        if(callback){
          callback({
            status: "success"
          });
        };
      }else{
        setTimeout(function(){
          self.hide();
        }, duration)
      }
    },
    show: function(){
      var self = this;
      document.querySelector(".aui-toast").style.display = "block";
      document.querySelector(".aui-toast").style.marginTop =  "-"+Math.round(document.querySelector(".aui-toast").offsetHeight/2)+"px";
      if(document.querySelector(".aui-toast"))return;
    },
    hide: function(){
      var self = this;
      if(document.querySelector(".aui-toast")){
        document.querySelector(".aui-toast").parentNode.removeChild(document.querySelector(".aui-toast"));
      }
    },
    remove: function(){
      if(document.querySelector(".aui-dialog"))document.querySelector(".aui-dialog").parentNode.removeChild(document.querySelector(".aui-dialog"));
      if(document.querySelector(".aui-mask")){
        document.querySelector(".aui-mask").classList.remove("aui-mask-out");
      }
      return true;
    },
    success: function(params,callback){
      var self = this;
      params.type = "success";
      return self.create(params,callback);
    },
    fail: function(params,callback){
      var self = this;
      params.type = "fail";
      return self.create(params,callback);
    },
    custom:function(params,callback){
      var self = this;
      params.type = "custom";
      return self.create(params,callback);
    },
    loading:function(params,callback){
      var self = this;
      params.type = "loading";
      return self.create(params,callback);
    }
  };

  u.successToast = function(text) {
    var toast = new auiToast();
    toast.success({
      title: text || "提交成功",
      duration:2000
    })
  }

  u.setErrorMessage = function(errorMessage){
    var errorObj = document.getElementById('error-msg');
    if(errorObj) errorObj.parentNode.removeChild(errorObj)
    //新建一个div元素节点
    var div = window.document.createElement("div");
    var divId = document.createAttribute("id"); //创建属性
    divId.value = 'error-msg';
    div.setAttributeNode(divId);
    div.innerHTML = '<div class="aui-tips aui-margin-b-15" id="error-msg">\n' +
      '    <i class="aui-iconfont aui-icon-info"></i>' +
      '    <div class="aui-tips-title">'+errorMessage+'</div>' +
      ' <i class="aui-iconfont"></i>'
      '</div>';
    window.document.body.appendChild(div);
    window.document.body.insertBefore(div, document.body.firstElementChild);
    setTimeout(function () {
      var errorObj = document.getElementById('error-msg');
      if(errorObj) errorObj.parentNode.removeChild(errorObj)
    },4000)
  };

  u.postBody = function(url, data, fnSuc, progressType){
    var postJson = {
      url: u.hbcs_api + url,
      method: 'post',
      dataType: 'json',
      headers: {
        'userId': $api.getStorage('userId'),
        'Content-Type': 'application/json;charset=utf-8'
      },
      data: {
        body: data
      }
    };
    apiAjax(postJson, fnSuc, progressType)
  };

  u.get = function(url, data, fnSuc, progressType){
    var postJson = {
      url: u.hbcs_api + url,
      dataType: 'json',
      method: 'get',
      data: {
        values: data
      }
    };
    apiAjax(postJson, fnSuc, progressType)
  };


  function apiAjax(postJson, callBack, progressType){
    var toast = new auiToast();
    if(progressType){
      var title = '加载中';
      if(progressType === 'submit'){
        title = '正在提交';
      }
      toast.loading({
        title: title,
        duration:2000
      })
    }
    api.ajax(postJson, function(ret, err) {
      toast.hide();
      if(ret){
        if (ret.code === 0) {
          callBack(ret.data || true)
        } else{
          u.setErrorMessage(ret.msg)
          callBack(false)
        }
      }
      if(err){
        u.setErrorMessage("网络出了点问题，请稍后重试。")
        callBack(false)
      }
    });
  }


  /*end*/
  window.$apiAjax = u;

})(window);


