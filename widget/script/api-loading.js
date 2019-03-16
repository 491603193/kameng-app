(function(window){
    var u = {};

    u.isLoading = false

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
            u.page.pageNo = 1
            if(systemType === "android"){
                fun();
            }else{
                setTimeout(function () {
                    fun();
                },100);
            }
        });
        api.addEventListener({
            name:'scrolltobottom',
            extra:{
                threshold:0 //设置距离底部多少距离时触发，默认值为0，数字类型
            }
        },function(){
            if (u.page.hasNext) {
                ++u.page.pageNo
                if (!u.isLoading) {
                    u.isLoading = true
                    fun();
                }
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
        u.isLoading = false
        u.page = page;
        api.refreshHeaderLoadDone();
    }

    /*end*/
    window.$apiLoading= u;

})(window);
