(function(window){
    var u = {};


    u.page = {
        hasNext: false,
        pageSize: 10,
        pageNo: 1
    };

    u.loadModel = function (fun){
        // 下拉刷新
        var systemType = api.systemType;  // 比如： ios
        api.setRefreshHeaderInfo({
            visible: true,
            loadingImg: '',//下拉刷新的图片
            bgColor: '#eee',
            textColor: '#000',
            textDown: '下拉刷新...',
            textUp: '松开刷新...',
            showTime: true
        }, function (ret, err) {
            if(systemType === "android"){
                fun(1);
            }else{
                setTimeout(function () {
                    fun(1);
                },100);
            }
        });
        api.addEventListener({
            name:'scrolltobottom',
            extra:{
                threshold:0 //设置距离底部多少距离时触发，默认值为0，数字类型
            }
        },function(ret,err){
            if (u.page.hasNext) {
                fun(u.page.pageNo + 1);
            } else {
                api.toast({
                    msg: '没有更多数据了！',
                    duration: 2000,
                    location: 'bottom'
                });
            }
        });
    };

    u.setPage = function (page){
        u.page = page;
        api.refreshHeaderLoadDone();
    }

    /*end*/
    window.$apiLoading= u;

})(window);
