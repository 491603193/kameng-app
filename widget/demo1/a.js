function toastLoading () {
  toast.loading({
      title:"加载中",
      duration:2000
  },function(ret){
      console.log(JSON.stringify(ret));0
      setTimeout(function(){
          // toast.hide();
      }, 3000)
  })
}
function toastSuccess () {
  toast.success({
      title:"提交成功",
      duration:2000
  })
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {toastLoading, toastSuccess}
} else {
  if (typeof define === 'function' && defin.amd) {
    define([], function () {return {toastLoading, toastSuccess}})
  } else {
    window.toastLoading = toastLoading
    window.toastSuccess = toastSuccess
  }
}
